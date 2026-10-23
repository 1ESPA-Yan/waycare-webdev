import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useWayCareDock } from '../hooks/useWayCareDock'

const AppContext = createContext()

// Data local no formato AAAA-MM-DD
const hojeISO = () => new Date().toLocaleDateString('sv-SE')

// Prefixo do código de voucher por recompensa (ids de recompensas.json)
const PREFIXOS_VOUCHER = {
  'consulta-nutricional': 'NUTRI',
  'kit-hidratacao': 'HIDRA',
  'desconto-academia': 'ACAD',
  'massagem-relaxante': 'MASSA',
  'checkup-gratuito': 'CHECK',
  'aula-yoga': 'YOGA',
}

// Nível progressivo: do nível 1 para o 2 são 500 XP, e cada nível seguinte pede +100
function calcularNivel(xp) {
  let nivel = 1
  let inicioNivel = 0
  let custo = 500
  while (xp >= inicioNivel + custo) {
    inicioNivel += custo
    nivel += 1
    custo += 100
  }
  const xpNoNivel = xp - inicioNivel
  return {
    nivel,
    xpNoNivel,
    xpParaProximo: custo - xpNoNivel,
    pctNivel: Math.floor((xpNoNivel / custo) * 100),
  }
}

export function AppProvider({ children }) {

  // USUÁRIO — lê do localStorage ao iniciar
  const [nomeUsuario, setNomeUsuario] = useState(
    localStorage.getItem('wc_nome') || 'Usuário'
  )
  const [emailUsuario, setEmailUsuario] = useState(
    localStorage.getItem('wc_email') || ''
  )

  const [bioUsuario, setBioUsuarioState] = useState(
    localStorage.getItem('wc_bio') || ''
  )

  const setBioUsuario = (bio) => {
    setBioUsuarioState(bio)
    localStorage.setItem('wc_bio', bio)
  }

  // Salva nome e email no estado e no localStorage
  const salvarUsuario = (nome, email = '') => {
    const primeiroNome = nome.trim().split(' ')[0]
    setNomeUsuario(primeiroNome)
    setEmailUsuario(email)
    localStorage.setItem('wc_nome', primeiroNome)
    if (email) localStorage.setItem('wc_email', email)
    localStorage.setItem('wc_logado', '1')
    setLogado(true)
    // Guarda a data do primeiro cadastro/login; não sobrescreve depois
    if (!localStorage.getItem('wc_membro_desde')) {
      const hoje = hojeISO()
      localStorage.setItem('wc_membro_desde', hoje)
      setMembroDesde(hoje)
    }
  }

  const [membroDesde, setMembroDesde] = useState(
    () => localStorage.getItem('wc_membro_desde') || ''
  )

  // SESSÃO — marcada no login/cadastro; as rotas do app exigem sessão
  const [logado, setLogado] = useState(
    () => localStorage.getItem('wc_logado') === '1'
  )

  // Logout: apaga só os dados do usuário; progresso (HC, XP, missões...) continua salvo
  const sairDaConta = () => {
    ['wc_logado', 'wc_nome', 'wc_email', 'wc_bio'].forEach(chave => localStorage.removeItem(chave))
    setLogado(false)
    setNomeUsuario('Usuário')
    setEmailUsuario('')
    setBioUsuarioState('')
  }

  // HUMOR
  const [humor, setHumor] = useState(
    localStorage.getItem('wc_humor') || 'energetico'
  )

  useEffect(() => {
    localStorage.setItem('wc_humor', humor)
  }, [humor])

  // Mapeamento humor → badge + recomendação para trilhas
  const HUMOR_CONFIG = {
    energetico: { label: 'Energético', icon: 'fa-bolt',                trilha: 'Movimento & Cardio',       badgeBg: '#fff8e1', badgeColor: '#9a5b00', badgeBorder: '#ffe0a0' },
    cansado:    { label: 'Cansado',    icon: 'fa-moon',                trilha: 'Sono & Relaxamento',       badgeBg: '#ede7f6', badgeColor: '#5e4b9e', badgeBorder: '#d1c4e9' },
    tranquilo:  { label: 'Tranquilo',  icon: 'fa-wind',                trilha: 'Mindfulness & Equilíbrio', badgeBg: '#e0f7f4', badgeColor: '#1f7a72', badgeBorder: '#b2dfdb' },
    estressado: { label: 'Estressado', icon: 'fa-cloud-showers-heavy', trilha: 'Mindfulness & Respiração', badgeBg: '#fce4ec', badgeColor: '#c2185b', badgeBorder: '#f8bbd0' },
    neutro:     { label: 'Neutro',     icon: 'fa-minus',               trilha: 'Bem-estar Geral',          badgeBg: '#f0f0f0', badgeColor: '#6b6b6b', badgeBorder: '#e0e0e0' },
  }

  // GARRAFA
  const [mlGarrafa, setMlGarrafa] = useState(
    () => Number(localStorage.getItem('wc_ml_garrafa')) || 600
  )
  const [mlConsumido, setMlConsumido] = useState(
    () => Number(localStorage.getItem('wc_ml_consumido')) || 0
  )
  const [metaDiaria, setMetaDiaria] = useState(
    () => Number(localStorage.getItem('wc_meta_diaria')) || 2000
  )

  useEffect(() => { localStorage.setItem('wc_ml_garrafa',  mlGarrafa)  }, [mlGarrafa])
  useEffect(() => { localStorage.setItem('wc_ml_consumido', mlConsumido) }, [mlConsumido])
  useEffect(() => { localStorage.setItem('wc_meta_diaria', metaDiaria)  }, [metaDiaria])

  // NOTIFICAÇÕES — contador de não lidas
  const [naoLidas, setNaoLidasState] = useState(
    () => Number(localStorage.getItem('wc_nao_lidas') ?? 2)
  )

  const setNaoLidas = useCallback((count) => {
    const v = Math.max(0, count)
    setNaoLidasState(v)
    localStorage.setItem('wc_nao_lidas', v)
  }, [])

  // HEALTH COINS
  const [totalHC, setTotalHC] = useState(
    () => Number(localStorage.getItem('wc_hc')) || 1300
  )

  // XP — 1 XP por HC ganho; gastar HC não tira XP
  const [xp, setXp] = useState(
    () => Number(localStorage.getItem('wc_xp')) || 0
  )

  const adicionarHC = (quantidade) => {
    setTotalHC(prev => {
      const novo = prev + quantidade
      localStorage.setItem('wc_hc', novo)
      return novo
    })
    if (quantidade > 0) {
      setXp(prev => {
        const novo = prev + quantidade
        localStorage.setItem('wc_xp', novo)
        return novo
      })
    }
  }

  const { nivel, xpNoNivel, xpParaProximo, pctNivel } = calcularNivel(xp)

  // RESGATES — histórico com o código de voucher de cada resgate
  const [resgates, setResgates] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('wc_resgates')) || []
    } catch { return [] }
  })

  useEffect(() => {
    localStorage.setItem('wc_resgates', JSON.stringify(resgates))
  }, [resgates])

  // Debita o HC, gera o código (prefixo + ano + 4 dígitos) e salva; devolve o código.
  // Sem saldo suficiente, não faz nada e devolve null.
  const resgatarRecompensa = (recompensa) => {
    if (totalHC < recompensa.preco) return null
    const prefixo = PREFIXOS_VOUCHER[recompensa.id] || 'RESG'
    const digitos = String(Math.floor(Math.random() * 10000)).padStart(4, '0')
    const codigo = `WC-${prefixo}-${new Date().getFullYear()}-${digitos}`
    adicionarHC(-recompensa.preco)
    setResgates(prev => [
      { codigo, nome: recompensa.nome, preco: recompensa.preco, data: new Date().toISOString() },
      ...prev,
    ])
    return codigo
  }

  // MISSÕES CONCLUÍDAS — ids concluídos no dia; vale só para a data salva
  const [missoesDoDia, setMissoesDoDia] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('wc_missoes_concluidas')) || { dia: '', ids: [] }
    } catch { return { dia: '', ids: [] } }
  })

  useEffect(() => {
    localStorage.setItem('wc_missoes_concluidas', JSON.stringify(missoesDoDia))
  }, [missoesDoDia])

  const missaoConcluida = (id) =>
    missoesDoDia.dia === hojeISO() && missoesDoDia.ids.includes(id)

  // Credita o HC uma vez por dia; devolve false se a missão já foi concluída hoje
  const concluirMissao = (missao) => {
    if (missaoConcluida(missao.id)) return false
    const hoje = hojeISO()
    setMissoesDoDia(prev => ({
      dia: hoje,
      ids: prev.dia === hoje ? [...prev.ids, missao.id] : [missao.id],
    }))
    adicionarHC(missao.hc)
    return true
  }

  // HISTÓRICO DE LEITURAS DA GARRAFA
  const [leituras, setLeituras] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('wc_leituras')) || [
        { hora: '09:50', de: 600, para: 500, diff: 100, hc: 4 },
        { hora: '08:45', de: 400, para: 250, diff: 150, hc: 6 },
        { hora: '07:32', de: 600, para: 400, diff: 200, hc: 8 },
      ]
    } catch { return [] }
  })

  const [hcGarrafa, setHcGarrafa] = useState(
    () => Number(localStorage.getItem('wc_hc_garrafa')) || 18
  )

  useEffect(() => { localStorage.setItem('wc_leituras',    JSON.stringify(leituras)) }, [leituras])
  useEffect(() => { localStorage.setItem('wc_hc_garrafa', hcGarrafa) }, [hcGarrafa])

  const CAPACIDADE_GARRAFA = 750

  // SIMULAR GOLE
  const simularGole = (mlGole) => {
    if (mlGarrafa < mlGole) return

    const agora = new Date()
    const hora = agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    const mlAntes = mlGarrafa
    const mlDepois = mlGarrafa - mlGole
    const hcGanho = Math.floor(mlGole / 25)

    setMlGarrafa(mlDepois)
    setMlConsumido(prev => Math.min(prev + mlGole, metaDiaria))
    setHcGarrafa(prev => prev + hcGanho)
    adicionarHC(hcGanho)
    setLeituras(prev => [
      { hora, de: mlAntes, para: mlDepois, diff: mlGole, hc: hcGanho },
      ...prev,
    ].slice(0, 5))
  }

  // ENCHER GARRAFA
  const encherGarrafa = () => {
    setMlGarrafa(CAPACIDADE_GARRAFA)
  }

  // STATUS REAL DO DISPOSITIVO — polling centralizado (compartilhado por todo o app)
  const { status: statusDock, erro: statusErro, carregando: statusCarregando } = useWayCareDock(3000)
  const usandoReal = !statusCarregando && !statusErro && !!statusDock

  // Valores que vêm da API quando disponível, ou do estado demo como fallback
  const consumidoHoje = usandoReal ? Math.round(statusDock.consumo_dia ?? 0) : mlConsumido
  const metaHoje = usandoReal ? (Math.round(statusDock.meta ?? 0) || 2000) : metaDiaria

  // CÁLCULOS DERIVADOS
  const pctGarrafa = Math.round((mlGarrafa / CAPACIDADE_GARRAFA) * 100)
  const pctMeta = Math.round((mlConsumido / metaDiaria) * 100)
  const mlFaltam = Math.max(metaDiaria - mlConsumido, 0)

  const value = {
    // Usuário
    nomeUsuario,
    emailUsuario,
    bioUsuario,
    setBioUsuario,
    salvarUsuario,
    membroDesde,
    logado,
    sairDaConta,

    // Garrafa
    mlGarrafa,
    mlConsumido,
    metaDiaria,
    setMetaDiaria,
    leituras,
    hcGarrafa,
    CAPACIDADE_GARRAFA,
    pctGarrafa,
    pctMeta,
    mlFaltam,
    simularGole,
    encherGarrafa,

    // Health Coins
    totalHC,
    adicionarHC,

    // Resgates
    resgates,
    resgatarRecompensa,

    // XP e nível
    xp,
    nivel,
    xpNoNivel,
    xpParaProximo,
    pctNivel,

    // Missões
    missaoConcluida,
    concluirMissao,

    // Humor
    humor,
    setHumor,
    HUMOR_CONFIG,

    // Notificações
    naoLidas,
    setNaoLidas,

    // Status real do dispositivo (compartilhado por todo o app)
    statusDock,
    statusErro,
    statusCarregando,
    usandoReal,
    consumidoHoje,
    metaHoje,
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

// O hook fica junto do Provider de propósito; o aviso de Fast Refresh não se aplica
// eslint-disable-next-line react-refresh/only-export-components
export function useApp() {
  return useContext(AppContext)
}