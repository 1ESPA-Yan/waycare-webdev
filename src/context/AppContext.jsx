import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { supabase, configurado } from '../lib/supabase'

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

// PROGRESSO POR CONTA — HC, XP, resgates e missões concluídas ficam em chaves
// separadas por conta: wc_<nome>_<id do usuário> na conta real e wc_<nome>_demo
// no modo demonstração. As HC ficam no navegador (limitação no README).
const HC_INICIAL_CONTA = 200
const HC_INICIAL_DEMO = 1300
const PROGRESSO = ['hc', 'xp', 'resgates', 'missoes_concluidas']

// Uma vez: o progresso das chaves antigas (sem conta, de antes da separação) vai
// para o modo demonstração; o controle antigo da água (wc_hc_agua_<dia>) é apagado
let progressoMigrado = false
function migrarProgressoAntigo() {
  if (progressoMigrado) return
  progressoMigrado = true
  try {
    PROGRESSO.forEach(nome => {
      const antigo = localStorage.getItem(`wc_${nome}`)
      if (antigo === null) return
      if (localStorage.getItem(`wc_${nome}_demo`) === null) localStorage.setItem(`wc_${nome}_demo`, antigo)
      localStorage.removeItem(`wc_${nome}`)
    })
    Object.keys(localStorage)
      .filter(k => /^wc_hc_agua_\d{4}-\d{2}-\d{2}$/.test(k))
      .forEach(k => localStorage.removeItem(k))
  } catch { /* sem localStorage: segue com os valores padrão */ }
}

// Lê o progresso de uma conta. ?? e não ||: saldo 0 continua 0 ao recarregar
function lerProgresso(conta, hcInicial) {
  migrarProgressoAntigo()
  const ler = (nome, padrao) => {
    try {
      const valor = localStorage.getItem(`wc_${nome}_${conta}`)
      return valor === null ? padrao : (JSON.parse(valor) ?? padrao)
    } catch { return padrao }
  }
  return {
    hc: Number(ler('hc', hcInicial)),
    xp: Number(ler('xp', 0)),
    resgates: ler('resgates', []),
    missoes: ler('missoes_concluidas', { dia: '', ids: [] }),
  }
}

export function AppProvider({ children }) {

  // SESSÃO — conta real (Supabase, login por código) ou modo demonstração
  const [sessao, setSessao] = useState(null)
  // Com o Supabase configurado, espera a sessão salva ser lida antes de decidir as rotas
  const [carregandoSessao, setCarregandoSessao] = useState(configurado)
  const [modoDemo, setModoDemo] = useState(() => localStorage.getItem('wc_demo') === '1')

  useEffect(() => {
    if (!supabase) return
    supabase.auth.getSession().then(({ data }) => {
      setSessao(data.session)
      setCarregandoSessao(false)
    })
    const { data } = supabase.auth.onAuthStateChange((_evento, novaSessao) => setSessao(novaSessao))
    return () => data.subscription.unsubscribe()
  }, [])

  const contaReal = Boolean(sessao)
  const logado = contaReal || modoDemo
  const userId = sessao?.user.id

  // Conta dona do progresso guardado no navegador (veja PROGRESSO lá em cima)
  const contaId = userId ?? 'demo'
  const hcInicial = userId ? HC_INICIAL_CONTA : HC_INICIAL_DEMO
  const chaveConta = (nome) => `wc_${nome}_${contaId}`

  // Nome da conta real, da tabela perfis: null enquanto carrega, '' se ainda não tem
  const [perfilNome, setPerfilNome] = useState(null)
  useEffect(() => {
    if (!userId) return
    let ativo = true
    supabase.from('perfis').select('nome').eq('user_id', userId).maybeSingle()
      .then(({ data }) => { if (ativo) setPerfilNome(data?.nome ?? '') })
    return () => { ativo = false }
  }, [userId])

  // Nome do modo demonstração (fica só no navegador)
  const [nomeDemo, setNomeDemo] = useState(() => localStorage.getItem('wc_nome') || 'Visitante')

  // Nome exibido: primeiro nome do perfil; senão o começo do e-mail com inicial maiúscula
  const nomeDoEmail = (email = '') => {
    const base = email.split('@')[0].split(/[._-]/)[0]
    return base ? base.charAt(0).toUpperCase() + base.slice(1) : 'Usuário'
  }
  const nomeUsuario = contaReal
    ? (perfilNome?.trim().split(' ')[0] || nomeDoEmail(sessao.user.email))
    : nomeDemo
  const emailUsuario = sessao?.user.email ?? ''
  const membroDesde = sessao?.user.created_at?.slice(0, 10) ?? ''

  const [bioUsuario, setBioUsuarioState] = useState(
    localStorage.getItem('wc_bio') || ''
  )

  const setBioUsuario = (bio) => {
    setBioUsuarioState(bio)
    localStorage.setItem('wc_bio', bio)
  }

  // Salva o nome: na conta real vai para perfis (Supabase); no demo, para o navegador
  const salvarNome = async (nome) => {
    const limpo = nome.trim()
    if (!limpo) return
    if (contaReal) {
      const { error } = await supabase.from('perfis').upsert({ user_id: userId, nome: limpo })
      if (error) throw new Error('Não foi possível salvar o nome. Tente de novo.', { cause: error })
      setPerfilNome(limpo)
    } else {
      setNomeDemo(limpo)
      localStorage.setItem('wc_nome', limpo)
    }
  }

  const entrarDemo = () => {
    localStorage.setItem('wc_demo', '1')
    setModoDemo(true)
  }

  // Sair: encerra a sessão do Supabase e o modo demonstração. O progresso
  // (HC, XP, missões...) continua salvo neste navegador.
  const sairDaConta = async () => {
    ;['wc_demo', 'wc_nome', 'wc_bio', 'wc_logado', 'wc_email', 'wc_membro_desde'].forEach(chave => localStorage.removeItem(chave))
    setModoDemo(false)
    setNomeDemo('Visitante')
    setBioUsuarioState('')
    setPerfilNome(null)
    setSessao(null)
    if (supabase) await supabase.auth.signOut()
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
    // ?? e não ||: a garrafa vazia (0 ml) continua vazia ao recarregar
    () => Number(localStorage.getItem('wc_ml_garrafa') ?? 600)
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

  // HEALTH COINS (conta real nova: 200; modo demonstração: 1300)
  const [totalHC, setTotalHC] = useState(() => lerProgresso(contaId, hcInicial).hc)

  // XP — 1 XP por HC ganho; gastar HC não tira XP
  const [xp, setXp] = useState(() => lerProgresso(contaId, hcInicial).xp)

  const adicionarHC = (quantidade) => {
    setTotalHC(prev => {
      const novo = prev + quantidade
      localStorage.setItem(chaveConta('hc'), novo)
      return novo
    })
    if (quantidade > 0) {
      setXp(prev => {
        const novo = prev + quantidade
        localStorage.setItem(chaveConta('xp'), novo)
        return novo
      })
    }
  }

  const { nivel, xpNoNivel, xpParaProximo, pctNivel } = calcularNivel(xp)

  // RESGATES — histórico com o código de voucher de cada resgate
  const [resgates, setResgates] = useState(() => lerProgresso(contaId, hcInicial).resgates)

  useEffect(() => {
    localStorage.setItem(`wc_resgates_${contaId}`, JSON.stringify(resgates))
  }, [resgates, contaId])

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
  const [missoesDoDia, setMissoesDoDia] = useState(() => lerProgresso(contaId, hcInicial).missoes)

  useEffect(() => {
    localStorage.setItem(`wc_missoes_concluidas_${contaId}`, JSON.stringify(missoesDoDia))
  }, [missoesDoDia, contaId])

  // Trocou de conta (entrou, saiu, ou a sessão salva terminou de carregar):
  // relê o progresso das chaves da conta nova antes de mostrar qualquer valor
  const [contaDoProgresso, setContaDoProgresso] = useState(contaId)
  if (contaDoProgresso !== contaId) {
    const progresso = lerProgresso(contaId, hcInicial)
    setContaDoProgresso(contaId)
    setTotalHC(progresso.hc)
    setXp(progresso.xp)
    setResgates(progresso.resgates)
    setMissoesDoDia(progresso.missoes)
  }

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
      // O demo começa coerente com 0 ml consumidos: sem leituras e sem HC da garrafa
      return JSON.parse(localStorage.getItem('wc_leituras')) || []
    } catch { return [] }
  })

  const [hcGarrafa, setHcGarrafa] = useState(
    () => Number(localStorage.getItem('wc_hc_garrafa') ?? 0)
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
    salvarNome,
    membroDesde,

    // Sessão
    contaReal,
    contaId,
    modoDemo,
    logado,
    carregandoSessao,
    perfilNome,
    entrarDemo,
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