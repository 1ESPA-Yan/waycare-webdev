import { createContext, useContext, useState } from 'react'

// 1. Criamos o contexto — é como uma "caixa" que guarda os dados globais
const AppContext = createContext()

// 2. O Provider é o componente que vai ENVOLVER toda a aplicação
//    Tudo que estiver dentro dele pode acessar os dados globais
export function AppProvider({ children }) {

  // === GARRAFA ===
  const [mlGarrafa, setMlGarrafa] = useState(600)
  const [mlConsumido, setMlConsumido] = useState(450)
  const [metaDiaria, setMetaDiaria] = useState(2000)

  // === HEALTH COINS ===
  // Saldo total de HC do usuário
  const [totalHC, setTotalHC] = useState(1300)

  // Adiciona HC ao saldo total
  const adicionarHC = (quantidade) => {
    setTotalHC(prev => prev + quantidade)
  }

  // === HISTÓRICO DE LEITURAS DA GARRAFA ===
  const [leituras, setLeituras] = useState([
    { hora: '09:50', de: 600, para: 500, diff: 100, hc: 4 },
    { hora: '08:45', de: 400, para: 250, diff: 150, hc: 6 },
    { hora: '07:32', de: 600, para: 400, diff: 200, hc: 8 },
  ])

  // HC ganhos especificamente pela garrafa
  const [hcGarrafa, setHcGarrafa] = useState(18)

  // Constante da capacidade da garrafa
  const CAPACIDADE_GARRAFA = 750

  // === AÇÃO: SIMULAR GOLE ===
  // Essa função agora vive no contexto — qualquer página pode chamar
  const simularGole = (mlGole) => {
    if (mlGarrafa < mlGole) return

    const agora = new Date()
    const hora = agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    const mlAntes = mlGarrafa
    const mlDepois = mlGarrafa - mlGole
    const hcGanho = Math.floor(mlGole / 25)

    // Atualiza garrafa
    setMlGarrafa(mlDepois)

    // Atualiza consumo diário
    setMlConsumido(prev => Math.min(prev + mlGole, metaDiaria))

    // Adiciona HC na garrafa E no saldo global
    setHcGarrafa(prev => prev + hcGanho)
    adicionarHC(hcGanho)

    // Adiciona leitura no histórico
    setLeituras(prev => [
      { hora, de: mlAntes, para: mlDepois, diff: mlGole, hc: hcGanho },
      ...prev,
    ].slice(0, 5))
  }

  // === AÇÃO: ENCHER GARRAFA ===
  const encherGarrafa = () => {
    setMlGarrafa(CAPACIDADE_GARRAFA)
  }

  // === CÁLCULOS DERIVADOS ===
  // Ficam aqui para qualquer componente usar sem recalcular
  const pctGarrafa = Math.round((mlGarrafa / CAPACIDADE_GARRAFA) * 100)
  const pctMeta = Math.round((mlConsumido / metaDiaria) * 100)
  const mlFaltam = Math.max(metaDiaria - mlConsumido, 0)

  // 3. O value é tudo que vamos disponibilizar para a aplicação
  const value = {
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
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

// 4. Hook customizado — facilita o uso do contexto em qualquer componente
//    Em vez de escrever useContext(AppContext) toda hora, usamos useApp()
export function useApp() {
  return useContext(AppContext)
}