import { useEffect, useRef } from 'react'
import { useApp } from '../context/AppContext'
import { useDados } from './useDados'

// 1 HC a cada 25 ml de água registrada pela dock
export const ML_POR_HC = 25

const PREFIXO = 'wc_hc_agua_'

// Credita as HC da água real a partir do painel. Guarda no localStorage quanto
// já foi creditado no dia (wc_hc_agua_AAAA-MM-DD) e credita só a diferença, então
// a água bebida com o site fechado conta quando ele é aberto. Quando o consumo
// alcança a meta, conclui a missão de água (+HC dela, uma vez por dia).
// As HC ficam neste navegador (limitação anotada em "Achados" no PLANO.md).
export function useCreditoAgua(painel) {
  const { contaReal, adicionarHC, missaoConcluida, concluirMissao } = useApp()
  const { dados: missoes } = useDados('missoes-dashboard')
  const missaoAgua = missoes?.find(m => m.tipo === 'bottle')
  const missaoTentada = useRef('')

  const dia = painel?.hoje?.dia
  const consumo = Number(painel?.hoje?.consumo_ml ?? 0)
  const meta = Number(painel?.hoje?.meta_ml ?? 0)

  useEffect(() => {
    if (!contaReal || !dia) return

    const chave = PREFIXO + dia
    const creditado = Number(localStorage.getItem(chave)) || 0
    const devido = Math.floor(consumo / ML_POR_HC)
    if (devido > creditado) {
      // Grava antes de creditar: uma segunda execução do efeito não credita de novo
      localStorage.setItem(chave, String(devido))
      adicionarHC(devido - creditado)
    }
    // Limpa os controles de dias anteriores
    Object.keys(localStorage)
      .filter(k => k.startsWith(PREFIXO) && k !== chave)
      .forEach(k => localStorage.removeItem(k))

    if (missaoAgua && meta > 0 && consumo >= meta && missaoTentada.current !== dia && !missaoConcluida(missaoAgua.id)) {
      missaoTentada.current = dia
      concluirMissao(missaoAgua)
    }
  }, [contaReal, dia, consumo, meta, missaoAgua, adicionarHC, missaoConcluida, concluirMissao])
}
