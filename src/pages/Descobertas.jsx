import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import { useApp } from '../context/AppContext'
import '../styles/descobertas.css'

function CardDescoberta({ d }) {
  return (
    <div className="card descoberta-card">
      <div className="d-flex align-items-start gap-4 mb-3">
        <div className={`descoberta-icon descoberta-icon--${d.cor}`}>
          <i className={`fa-solid ${d.icone}`}></i>
        </div>
        <div className="d-flex flex-column gap-2">
          <h3 className="descoberta-nome">{d.nome}</h3>
          <div className="d-flex align-items-center gap-2 flex-wrap">
            <span className={`badge ${d.categoriaBadge}`}>{d.categoria}</span>
            <span className={`badge ${d.impactoBadge}`}>Impacto: {d.impacto}</span>
            <span className="descoberta-data">{d.data}</span>
          </div>
        </div>
      </div>
      <div className="descoberta-insight">
        <i className="fa-solid fa-lightbulb descoberta-insight-icon"></i>
        <span>{d.insight}</span>
      </div>
      <p className="descoberta-dado">
        <i className="fa-solid fa-arrow-trend-up"></i>
        {d.dado}
      </p>
      <div className="d-flex align-items-center gap-3 flex-wrap">
        <button className="btn descoberta-btn-criar">Criar missão baseada nisto</button>
        <button className="btn descoberta-btn-historico">Ver histórico completo</button>
      </div>
    </div>
  )
}

function Descobertas() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [descobertas, setDescoberta] = useState([])
  const [carregando, setCarregando] = useState(true)
  const { totalHC } = useApp()

  useEffect(() => {
    fetch('/data/descobertas.json')
      .then(res => res.json())
      .then(data => { setDescoberta(data); setCarregando(false) })
      .catch(() => {
        import('../data/descobertas.json').then(mod => {
          setDescoberta(mod.default); setCarregando(false)
        })
      })
  }, [])

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
        <Sidebar isOpen={sidebarOpen} />

        <main className="main-content" id="main-content">

          <header className="topbar">
            <div className="d-flex align-items-center gap-3">
              <div className="descobertas-titulo-icon">
                <i className="fa-solid fa-lightbulb"></i>
              </div>
              <div>
                <h1 className="descobertas-titulo">Descobertas</h1>
                <p className="descobertas-subtitulo">
                  Insights personalizados sobre seus hábitos de saúde
                </p>
              </div>
            </div>
            <div className="topbar-actions">
              <div className="hc-chip">
                <i className="fa-solid fa-coins"></i>
                {totalHC} HC
              </div>
              <Link to="/carteira" className="notif-btn" aria-label="Carteira">
                <i className="fa-solid fa-wallet"></i>
              </Link>
              <Link to="/notificacoes" className="notif-btn" aria-label="Notificações">
                <i className="fa-solid fa-bell"></i>
                <span className="notif-dot"></span>
              </Link>
            </div>
          </header>

          <section id="page-content" className="page-transition">

            {carregando ? (
              <div className="d-flex flex-column gap-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="card" style={{ minHeight: '140px', opacity: 0.35 }}></div>
                ))}
              </div>
            ) : (
              <div className="d-flex flex-column gap-4">
                {descobertas.map(d => <CardDescoberta key={d.id} d={d} />)}
              </div>
            )}

            <div className="descobertas-info mt-5">
              <div className="descobertas-info-icon">
                <i className="fa-solid fa-circle-info"></i>
              </div>
              <div className="d-flex flex-column gap-2">
                <h4 className="descobertas-info-titulo">Como funcionam as descobertas?</h4>
                <p className="descobertas-info-desc">
                  A WayCare Band — nossa pulseira inteligente — coleta seus dados de saúde em tempo real:
                  sono, passos, hidratação e humor. Com esses dados, identificamos padrões e correlações
                  personalizadas para você. Quanto mais você usa a WayCare Band, mais precisas ficam as descobertas!
                </p>
                <ul className="descobertas-info-lista">
                  <li><i className="fa-solid fa-circle-dot"></i> Novas descobertas são geradas semanalmente</li>
                  <li><i className="fa-solid fa-circle-dot"></i> Baseadas em pelo menos 7 dias de dados da pulseira</li>
                  <li><i className="fa-solid fa-circle-dot"></i> Priorizamos insights com maior impacto na sua saúde</li>
                </ul>
              </div>
            </div>

          </section>
        </main>
      </div>
    </>
  )
}

export default Descobertas
