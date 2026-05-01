import { createContext, useContext, useState } from 'react'

const AppContext = createContext()

export function AppProvider({ children }) {

  // USUÁRIO — lê do localStorage ao iniciar
  const [nomeUsuario, setNomeUsuario] = useState(
    localStorage.getItem('wc_nome') || 'Usuário'
  )
  const [emailUsuario, setEmailUsuario] = useState(
    localStorage.getItem('wc_email') || ''
  )

  // Salva nome e email no estado e no localStorage
  const salvarUsuario = (nome, email = '') => {
    const primeiroNome = nome.trim().split(' ')[0]
    setNomeUsuario(primeiroNome)
    setEmailUsuario(email)
    localStorage.setItem('wc_nome', primeiroNome)
    if (email) localStorage.setItem('wc_email', email)
  }

  // HUMOR
  const [humor, setHumor] = useState('energetico')

  // Mapeamento humor → badge + recomendação para trilhas
  const HUMOR_CONFIG = {
    energetico: { label: 'Energético', icon: 'fa-bolt',                trilha: 'Movimento & Cardio',       badgeBg: '#fff8e1', badgeColor: '#f5a623', badgeBorder: '#ffe0a0' },
    cansado:    { label: 'Cansado',    icon: 'fa-moon',                trilha: 'Sono & Relaxamento',       badgeBg: '#ede7f6', badgeColor: '#7c6bbf', badgeBorder: '#d1c4e9' },
    tranquilo:  { label: 'Tranquilo',  icon: 'fa-wind',                trilha: 'Mindfulness & Equilíbrio', badgeBg: '#e0f7f4', badgeColor: '#5ab8b0', badgeBorder: '#b2dfdb' },
    estressado: { label: 'Estressado', icon: 'fa-cloud-showers-heavy', trilha: 'Mindfulness & Respiração', badgeBg: '#fff3e0', badgeColor: '#f5a623', badgeBorder: '#ffcc80' },
    neutro:     { label: 'Neutro',     icon: 'fa-minus',               trilha: 'Bem-estar Geral',          badgeBg: '#f0f0f0', badgeColor: '#9e9e9e', badgeBorder: '#e0e0e0' },
  }

  // GARRAFA
  const [mlGarrafa, setMlGarrafa] = useState(600)
  const [mlConsumido, setMlConsumido] = useState(450)
  const [metaDiaria, setMetaDiaria] = useState(2000)

  //HEALTH COINS
  const [totalHC, setTotalHC] = useState(1300)

  const adicionarHC = (quantidade) => {
    setTotalHC(prev => prev + quantidade)
  }

  // HISTÓRICO DE LEITURAS DA GARRAFA
  const [leituras, setLeituras] = useState([
    { hora: '09:50', de: 600, para: 500, diff: 100, hc: 4 },
    { hora: '08:45', de: 400, para: 250, diff: 150, hc: 6 },
    { hora: '07:32', de: 600, para: 400, diff: 200, hc: 8 },
  ])

  const [hcGarrafa, setHcGarrafa] = useState(18)

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
    salvarUsuario,

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

    // Humor
    humor,
    setHumor,
    HUMOR_CONFIG,
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  return useContext(AppContext)
}