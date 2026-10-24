import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import { useDock } from '../context/DockContext'
import { rpc } from '../lib/supabase'
import { gerarInsights } from '../lib/insights'

// Insights da conta real: rpc('insights_dados') dos últimos 35 dias e as frases
// geradas em lib/insights.js. Recalcula quando o consumo ou a meta de hoje mudam.
// No modo demonstração não há dados: `res` fica null e `disponivel` false.
export function useInsights() {
  const { contaReal, emailUsuario } = useApp()
  const { painel } = useDock()
  // Guarda de qual conta é o resultado: ao trocar de conta, não mostra o da anterior
  const [estado, setEstado] = useState({ conta: null, res: null, erro: '' })

  const carregado = Boolean(painel)
  const consumo = painel?.hoje?.consumo_ml
  const meta = painel?.hoje?.meta_ml
  const genero = painel?.perfil?.genero

  useEffect(() => {
    if (!contaReal || !carregado) return
    let ativo = true
    rpc('insights_dados', { p_dias: 35 })
      .then(dados => {
        if (ativo && dados) setEstado({ conta: emailUsuario, res: gerarInsights(dados, { genero }), erro: '' })
      })
      .catch(falha => {
        if (!ativo) return
        // Mantém o último resultado desta conta; de outra conta, descarta
        setEstado(atual => ({ conta: emailUsuario, res: atual.conta === emailUsuario ? atual.res : null, erro: falha.message }))
      })
    return () => { ativo = false }
  }, [contaReal, emailUsuario, carregado, consumo, meta, genero])

  const daConta = contaReal && estado.conta === emailUsuario
  const res = daConta ? estado.res : null
  const erro = daConta ? estado.erro : ''
  return { res, erro, disponivel: contaReal, carregando: contaReal && !res && !erro }
}
