import { useState } from 'react'
import { Link } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import { useApp } from '../context/AppContext'
import '../styles/carteira.css'

const historicoGanhos = [
  { id: 1, icone: 'fa-person-walking', cor: 'blue',   titulo: 'Caminhar 5.000 passos', tempo: 'Hoje, 14:30',        hc: '+50 HC' },
  { id: 2, icone: 'fa-brain',          cor: 'teal',   titulo: 'Meditação 5 minutos',   tempo: 'Hoje, 08:15',        hc: '+30 HC' },
  { id: 3, icone: 'fa-child-reaching', cor: 'purple', titulo: 'Alongamento matinal',   tempo: 'Ontem, 07:00',       hc: '+20 HC' },
  { id: 4, icone: 'fa-fire',           cor: 'orange', titulo: 'Streak de 7 dias',       tempo: 'Ontem',              hc: '+100 HC' },
  { id: 5, icone: 'fa-moon',           cor: 'indigo', titulo: 'Dormir 7h',              tempo: 'Há 2 dias, 23:00',   hc: '+40 HC' },
  { id: 6, icone: 'fa-person-walking', cor: 'blue',   titulo: 'Caminhar 5.000 passos', tempo: 'Há 2 dias, 16:20',   hc: '+50 HC' },
  { id: 7, icone: 'fa-droplet',        cor: 'cyan',   titulo: 'Beber 2L de água',       tempo: 'Há 3 dias, 20:00',   hc: '+30 HC' },
  { id: 8, icone: 'fa-heart-pulse',    cor: 'red',    titulo: 'Check-up anual realizado', tempo: 'Há 5 dias',        hc: '+500 HC' },
]

const conquistasDestaque = [
  { id: 1, icone: 'fa-fire',   cor: 'orange', titulo: 'Semana Ativa',      tempo: 'Conquistado há 2 dias' },
  { id: 2, icone: 'fa-moon',   cor: 'indigo', titulo: 'Mestre do Sono',    tempo: 'Conquistado há 5 dias' },
  { id: 3, icone: 'fa-droplet', cor: 'cyan',  titulo: 'Hidratação em Dia', tempo: 'Conquistado há 1 semana' },
]

const dadosGrafico = [
  { dia: 'Seg', valor: 80 },
  { dia: 'Ter', valor: 130 },
  { dia: 'Qua', valor: 60 },
  { dia: 'Qui', valor: 200 },
  { dia: 'Sex', valor: 150 },
  { dia: 'Sáb', valor: 250 },
  { dia: 'Dom', valor: 180 },
]

function GraficoLinha({ dados }) {
  const maxValor = Math.max(...dados.map(d => d.valor))
  const altura = 160
  const largura = 100
  const pts = dados.map((d, i) => {
    const x = (i / (dados.length - 1)) * largura
    const y = altura - (d.valor / maxValor) * altura
    return `${x},${y}`
  })
  const pontos = pts.join(' ')
  const area = `0,${altura} ${pontos} ${largura},${altura}`

  return (
    <div className="grafico-wrapper">
      <svg viewBox={`0 0 100 ${altura}`} preserveAspectRatio="none" className="grafico-svg">
        <defs>
          <linearGradient id="gradArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1c9770" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#1c9770" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <polygon points={area} fill="url(#gradArea)" />
        <polyline points={pontos} fill="none" stroke="#1c9770" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        {dados.map((d, i) => {
          const x = (i / (dados.length - 1)) * largura
          const y = altura - (d.valor / maxValor) * altura
          return <circle key={i} cx={x} cy={y} r="2" fill="#1c9770" />
        })}
      </svg>
      <div className="grafico-labels">
        {dados.map(d => (
          <span key={d.dia} className="grafico-label">{d.dia}</span>
        ))}
      </div>
    </div>
  )
}

function Carteira() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { totalHC } = useApp()

  return (
    <>
      <button
        className="sidebar-toggle"
        aria-label="Abrir menu"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <i className="fa-solid fa-bars"></i>
      </button>

      <div className="app-layout">
        <div className={sidebarOpen ? 'open' : ''}>
          <Sidebar />
        </div>

        <main className="main-content" id="main-content">

          {/* Cabeçalho */}
          <header className="carteira-header">
            <div className="carteira-header-titulo">
              <i className="fa-solid fa-wallet carteira-header-icon"></i>
              <h1 className="carteira-titulo">Minha Carteira</h1>
            </div>
          </header>

          {/* Card de saldo */}
          <div className="carteira-saldo-card">
            <p className="carteira-saldo-label">Seu saldo disponível</p>
            <div className="carteira-saldo-valor">
              <i className="fa-solid fa-coins carteira-saldo-icon"></i>
              <span className="carteira-saldo-numero">{totalHC.toLocaleString('pt-BR')}</span>
            </div>
            <p className="carteira-saldo-subtexto">Health Coins</p>
          </div>

          {/* Layout de duas colunas */}
          <div className="carteira-grid">

            {/* Coluna esquerda */}
            <div className="carteira-col-esquerda">

              {/* Gráfico */}
              <div className="card carteira-card-grafico">
                <div className="carteira-card-header">
                  <i className="fa-solid fa-chart-line carteira-card-header-icon"></i>
                  <h2 className="carteira-card-titulo">Evolução dos últimos 7 dias</h2>
                </div>
                <GraficoLinha dados={dadosGrafico} />
              </div>

              {/* Histórico */}
              <div className="card carteira-card-historico">
                <div className="carteira-card-header">
                  <i className="fa-solid fa-rectangle-list carteira-card-header-icon"></i>
                  <h2 className="carteira-card-titulo">Histórico de Ganhos</h2>
                </div>
                <ul className="historico-lista">
                  {historicoGanhos.map(item => (
                    <li key={item.id} className="historico-item">
                      <div className={`historico-icone historico-icone--${item.cor}`}>
                        <i className={`fa-solid ${item.icone}`}></i>
                      </div>
                      <div className="historico-info">
                        <span className="historico-nome">{item.titulo}</span>
                        <span className="historico-tempo">{item.tempo}</span>
                      </div>
                      <span className="historico-hc">
                        <i className="fa-solid fa-coins"></i> {item.hc}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            {/* Coluna direita */}
            <div className="carteira-col-direita">

              {/* Conquistas em destaque */}
              <div className="card carteira-card-conquistas">
                <div className="carteira-card-header">
                  <i className="fa-solid fa-trophy carteira-card-header-icon carteira-card-header-icon--warning"></i>
                  <h2 className="carteira-card-titulo">Conquistas em Destaque</h2>
                </div>
                <div className="conquistas-lista">
                  {conquistasDestaque.map(c => (
                    <div key={c.id} className="conquista-card">
                      <div className={`conquista-icone conquista-icone--${c.cor}`}>
                        <i className={`fa-solid ${c.icone}`}></i>
                      </div>
                      <p className="conquista-nome">{c.titulo}</p>
                      <p className="conquista-tempo">{c.tempo}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Promo recompensas */}
              <div className="carteira-card-promo">
                <div className="promo-icone">
                  <i className="fa-solid fa-gem"></i>
                </div>
                <p className="promo-texto">Troque seus coins por recompensas incríveis!</p>
                <Link to="/recompensas" className="btn btn-primary promo-btn">
                  Ver catálogo de recompensas
                </Link>
              </div>

            </div>
          </div>

        </main>
      </div>
    </>
  )
}

export default Carteira