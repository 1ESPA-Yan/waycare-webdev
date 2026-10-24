import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import { useDock } from '../context/DockContext'
import { supabase, rpc } from '../lib/supabase'

// Dados dos gráficos da Bottle na conta real:
//   curva  [{ ts, consumo }]  consumo acumulado do dia: goles e lançamentos manuais
//          somam, ajustes ("tirar do total", ml negativo) subtraem
//   semana [{ dia, consumo_ml, meta_ml, bateu }]  últimos `dias` dias (rpc historico: 7, 14 ou 30)
// A tabela `eventos` é lida direto porque o painel() traz só os últimos 30 eventos.
// Recarrega quando o painel muda de dia ou o consumo de hoje muda.
export function useHistoricoHidratacao(dias = 7) {
  const { contaReal } = useApp()
  const { painel } = useDock()
  const dia = painel?.hoje?.dia
  const consumo = painel?.hoje?.consumo_ml
  const [curva, setCurva] = useState([])
  const [semana, setSemana] = useState([])

  useEffect(() => {
    if (!contaReal || !dia) return
    let ativo = true
    // Início do dia em São Paulo (sem horário de verão desde 2019: UTC-3)
    const inicio = `${dia}T00:00:00-03:00`

    supabase
      .from('eventos')
      .select('ts, ml')
      .in('tipo', ['gole', 'manual', 'ajuste'])
      .gte('ts', inicio)
      .order('ts')
      .then(({ data, error }) => {
        if (!ativo || error) return
        let total = 0
        const pontos = (Array.isArray(data) ? data : []).map(ev => ({ ts: ev.ts, consumo: (total += Number(ev.ml) || 0) }))
        setCurva(pontos.length ? [{ ts: inicio, consumo: 0 }, ...pontos] : [])
      })

    return () => { ativo = false }
  }, [contaReal, dia, consumo])

  // Histórico separado da curva: trocar o período não relê os eventos do dia
  useEffect(() => {
    if (!contaReal || !dia) return
    let ativo = true
    rpc('historico', { p_dias: dias })
      .then(dados => { if (ativo) setSemana(Array.isArray(dados) ? dados : []) })
      .catch(() => { /* mantém o último histórico */ })
    return () => { ativo = false }
  }, [contaReal, dia, consumo, dias])

  return { curva, semana }
}
