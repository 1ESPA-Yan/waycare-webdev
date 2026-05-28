import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import '../styles/selecionarHumor.css'

const HUMORES = [
  {
    id: 'energetico',
    label: 'Energético',
    desc: 'Cheio de disposição',
    icon: 'fa-bolt',
    cor: 'yellow',
  },
  {
    id: 'cansado',
    label: 'Cansado',
    desc: 'Preciso de descanso',
    icon: 'fa-moon',
    cor: 'purple',
  },
  {
    id: 'tranquilo',
    label: 'Tranquilo',
    desc: 'Calmo e equilibrado',
    icon: 'fa-wind',
    cor: 'teal',
  },
  {
    id: 'estressado',
    label: 'Estressado',
    desc: 'Sobrecarregado',
    icon: 'fa-cloud-showers-heavy',
    cor: 'orange',
  },
  {
    id: 'neutro',
    label: 'Neutro',
    desc: 'Normal, como sempre',
    icon: 'fa-minus',
    cor: 'gray',
  },
]

function SelecionarHumor() {
  const [humorSelecionado, setHumorSelecionado] = useState(null)
  const navigate = useNavigate()
  const { totalHC, setHumor } = useApp()

  const handleContinuar = () => {
    if (!humorSelecionado) return
    setHumor(humorSelecionado)
    navigate('/dashboard')
  }

  return (
    <div className="humor-page">

      {/* Topbar minimalista */}
      <header className="humor-topbar">
        <div className="humor-logo">
          <img src="/images/LogoWayCare.png" alt="WayCare" className="h-7 w-auto" />
          <span className="humor-logo-nome">WayCare</span>
        </div>
        <div className="hc-chip">
          <i className="fa-solid fa-coins"></i>
          {totalHC} HC
        </div>
      </header>

      {/* Conteúdo central */}
      <main className="humor-main">

        <div className="humor-header">
          <h1 className="humor-titulo">Como você está se sentindo hoje?</h1>
          <p className="humor-subtitulo">Vamos personalizar sua trilha baseada no seu humor</p>
        </div>

        {/* Cards de humor */}
        <div className="humor-grid">
          {HUMORES.map(humor => (
            <button
              key={humor.id}
              className={`humor-card ${humorSelecionado === humor.id ? 'humor-card--selecionado' : ''}`}
              onClick={() => setHumorSelecionado(humor.id)}
              aria-pressed={humorSelecionado === humor.id}
            >
              <div className={`humor-icone humor-icone--${humor.cor}`}>
                <i className={`fa-solid ${humor.icon}`}></i>
              </div>
              <span className="humor-label">{humor.label}</span>
              <span className="humor-desc">{humor.desc}</span>
            </button>
          ))}
        </div>

        {/* Botão continuar */}
        <button
          className={`btn humor-btn-continuar ${humorSelecionado ? 'humor-btn-continuar--ativo' : ''}`}
          onClick={handleContinuar}
          disabled={!humorSelecionado}
        >
          Continuar
        </button>

      </main>
    </div>
  )
}

export default SelecionarHumor