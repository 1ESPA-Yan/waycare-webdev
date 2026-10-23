import { useApp } from '../context/AppContext'
import { useDock } from '../context/DockContext'

// Dados de hidratação do dia num formato só, para conta real ou modo demonstração.
//
// modo:
//   'demo'          sem conta: valores simulados do AppContext
//   'sem-perfil'    conta sem peso no perfil (meta ainda não personalizada)
//   'sem-dock'      perfil ok, nenhuma dock vinculada
//   'dock-online'   dock vinculada e com contato recente
//   'dock-offline'  dock vinculada sem contato há mais de 12 min
//   null            conta real enquanto o primeiro painel carrega (veja `carregando`)
export function useHidratacao() {
  const { contaReal, mlConsumido, metaDiaria, leituras } = useApp()
  const { painel, erro, carregando, recarregar } = useDock()

  if (!contaReal) {
    const pct = metaDiaria ? Math.round((mlConsumido / metaDiaria) * 1000) / 10 : 0
    return {
      consumo: mlConsumido,
      meta: metaDiaria,
      pct,
      fatias: Math.min(4, Math.floor(pct / 25)),
      goles: leituras.length,
      streak: 0,
      dock: null,
      eventos: leituras.map(l => ({ ts: null, hora: l.hora, tipo: 'gole', ml: l.diff })),
      perfil: null,
      modo: 'demo',
      erro: null,
      carregando: false,
      recarregar,
    }
  }

  const hoje = painel?.hoje
  const perfil = painel?.perfil ?? null
  const dock = painel?.dock ?? null

  let modo = null
  if (painel) {
    if (!perfil?.peso_kg) modo = 'sem-perfil'
    else if (!dock) modo = 'sem-dock'
    else modo = dock.online ? 'dock-online' : 'dock-offline'
  }

  return {
    consumo: Number(hoje?.consumo_ml ?? 0),
    meta: Number(hoje?.meta_ml ?? 0) || 2500,
    pct: Number(hoje?.pct ?? 0),
    fatias: Number(hoje?.fatias ?? 0),
    goles: Number(hoje?.goles ?? 0),
    streak: Number(painel?.streak ?? 0),
    dock,
    eventos: painel?.eventos ?? [],
    perfil,
    modo,
    erro,
    carregando,
    recarregar,
  }
}
