import { useEffect, useRef } from 'react'
import { useApp } from '../context/AppContext'
import { useDados } from './useDados'

// 1 HC a cada 25 ml de água medida pela dock
export const ML_POR_HC = 25

// Credita as HC da água real. Só a água medida pela dock (goles, `mlDock`) conta:
// o que é lançado à mão (tipo 'manual') não gera HC, e tirar do total (tipo
// 'ajuste') não mexe nas HC já creditadas. `mlDock` null = soma ainda carregando. Guarda no localStorage quanto
// já foi creditado no dia (wc_hc_agua_<id da conta>_AAAA-MM-DD) e credita só a diferença, então
// a água bebida com o site fechado conta quando ele é aberto. Quando o consumo
// alcança a meta só com a água da dock, conclui a missão de água (+HC dela, uma vez por dia).
// As HC ficam neste navegador (limitação no README, em "Limitações conhecidas").
export function useCreditoAgua(painel, mlDock) {
  const { contaReal, contaId, adicionarHC, missaoConcluida, concluirMissao } = useApp()
  const { dados: missoes } = useDados('missoes-dashboard')
  const missaoAgua = missoes?.find(m => m.tipo === 'bottle')
  const missaoTentada = useRef('')

  const dia = painel?.hoje?.dia
  const meta = Number(painel?.hoje?.meta_ml ?? 0)

  useEffect(() => {
    if (!contaReal || !dia || mlDock == null) return

    // Por conta: duas contas no mesmo navegador não dividem o controle
    const prefixo = `wc_hc_agua_${contaId}_`
    const chave = prefixo + dia
    const creditado = Number(localStorage.getItem(chave)) || 0
    const devido = Math.floor(mlDock / ML_POR_HC)
    if (devido > creditado) {
      // Grava antes de creditar: uma segunda execução do efeito não credita de novo
      localStorage.setItem(chave, String(devido))
      adicionarHC(devido - creditado)
    }
    // Limpa os controles de dias anteriores desta conta
    Object.keys(localStorage)
      .filter(k => k.startsWith(prefixo) && k !== chave)
      .forEach(k => localStorage.removeItem(k))

    // Trava por conta e por dia (duas contas no mesmo navegador, no mesmo dia)
    const tentativa = contaId + '|' + dia
    if (missaoAgua && meta > 0 && mlDock >= meta && missaoTentada.current !== tentativa && !missaoConcluida(missaoAgua.id)) {
      missaoTentada.current = tentativa
      concluirMissao(missaoAgua)
    }
  }, [contaReal, contaId, dia, mlDock, meta, missaoAgua, adicionarHC, missaoConcluida, concluirMissao])
}
