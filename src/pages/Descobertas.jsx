import { useState } from 'react'
import { Link } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import { useApp } from '../context/AppContext'
import '../styles/descobertas.css'

function Descobertas() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { totalHC } = useApp()

  return (
    <>
      {/* Botão hamburguer — só aparece no mobile */}
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

          {/* Topbar */}
          <header className="topbar">
            <div className="d-flex align-items-center gap-3">
              <div className="descobertas-titulo-icon">
                <i className="fa-solid fa-lightbulb"></i>
              </div>
              <div>
                <h1 className="descobertas-titulo">Descobertas</h1>
                <p className="descobertas-subtitulo">
                  Insights personalizados sobre seus hábitos de saúde baseados nos seus dados
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
              <button className="notif-btn" aria-label="Notificações">
                <i className="fa-solid fa-bell"></i>
                <span className="notif-dot"></span>
              </button>
            </div>
          </header>

          <section id="page-content" className="page-transition">

            {/* Cards de descoberta */}
            <div className="d-flex flex-column gap-4">

              {/* Descoberta — Padrão de Sono */}
              <div className="card descoberta-card">
                <div className="d-flex align-items-start gap-4 mb-3">
                  <div className="descoberta-icon descoberta-icon--purple">
                    <i className="fa-solid fa-moon"></i>
                  </div>
                  <div className="d-flex flex-column gap-2">
                    <h3 className="descoberta-nome">Padrão de Sono</h3>
                    <div className="d-flex align-items-center gap-2 flex-wrap">
                      <span className="badge badge-purple">Sono</span>
                      <span className="badge descoberta-badge--alto">Impacto: Alto</span>
                      <span className="descoberta-data">Hoje</span>
                    </div>
                  </div>
                </div>
                <div className="descoberta-insight">
                  <i className="fa-solid fa-lightbulb descoberta-insight-icon"></i>
                  <span>Você dorme melhor nos dias que caminha à tarde</span>
                </div>
                <p className="descoberta-dado">
                  <i className="fa-solid fa-arrow-trend-up"></i>
                  Completou 5 caminhadas → Dormiu 7h+ em 4 noites
                </p>
                <div className="d-flex align-items-center gap-3 flex-wrap">
                  <button className="btn descoberta-btn-criar">Criar missão baseada nisto</button>
                  <button className="btn descoberta-btn-historico">Ver histórico completo</button>
                </div>
              </div>

              {/* Descoberta — Hidratação e Energia */}
              <div className="card descoberta-card">
                <div className="d-flex align-items-start gap-4 mb-3">
                  <div className="descoberta-icon descoberta-icon--blue">
                    <i className="fa-solid fa-droplet"></i>
                  </div>
                  <div className="d-flex flex-column gap-2">
                    <h3 className="descoberta-nome">Hidratação e Energia</h3>
                    <div className="d-flex align-items-center gap-2 flex-wrap">
                      <span className="badge badge-warning">Nutrição</span>
                      <span className="badge descoberta-badge--medio">Impacto: Médio</span>
                      <span className="descoberta-data">Ontem</span>
                    </div>
                  </div>
                </div>
                <div className="descoberta-insight">
                  <i className="fa-solid fa-lightbulb descoberta-insight-icon"></i>
                  <span>Seu humor melhora quando você bebe água pela manhã</span>
                </div>
                <p className="descoberta-dado">
                  <i className="fa-solid fa-arrow-trend-up"></i>
                  8 dias com água matinal → Humor "energético" em 7 dias
                </p>
                <div className="d-flex align-items-center gap-3 flex-wrap">
                  <button className="btn descoberta-btn-criar">Criar missão baseada nisto</button>
                  <button className="btn descoberta-btn-historico">Ver histórico completo</button>
                </div>
              </div>

              {/* Descoberta — Estresse e Meditação */}
              <div className="card descoberta-card">
                <div className="d-flex align-items-start gap-4 mb-3">
                  <div className="descoberta-icon descoberta-icon--teal">
                    <i className="fa-solid fa-brain"></i>
                  </div>
                  <div className="d-flex flex-column gap-2">
                    <h3 className="descoberta-nome">Estresse e Meditação</h3>
                    <div className="d-flex align-items-center gap-2 flex-wrap">
                      <span className="badge badge-teal">Mindfulness</span>
                      <span className="badge descoberta-badge--alto">Impacto: Alto</span>
                      <span className="descoberta-data">Há 2 dias</span>
                    </div>
                  </div>
                </div>
                <div className="descoberta-insight">
                  <i className="fa-solid fa-lightbulb descoberta-insight-icon"></i>
                  <span>Meditação reduz seu estresse em 40%</span>
                </div>
                <p className="descoberta-dado">
                  <i className="fa-solid fa-arrow-trend-up"></i>
                  10 sessões de meditação → Humor estressado caiu de 50% para 30%
                </p>
                <div className="d-flex align-items-center gap-3 flex-wrap">
                  <button className="btn descoberta-btn-criar">Criar missão baseada nisto</button>
                  <button className="btn descoberta-btn-historico">Ver histórico completo</button>
                </div>
              </div>

              {/* Descoberta — Movimento e Produtividade */}
              <div className="card descoberta-card">
                <div className="d-flex align-items-start gap-4 mb-3">
                  <div className="descoberta-icon descoberta-icon--green">
                    <i className="fa-solid fa-person-running"></i>
                  </div>
                  <div className="d-flex flex-column gap-2">
                    <h3 className="descoberta-nome">Movimento e Produtividade</h3>
                    <div className="d-flex align-items-center gap-2 flex-wrap">
                      <span className="badge badge-info">Movimento</span>
                      <span className="badge descoberta-badge--medio">Impacto: Médio</span>
                      <span className="descoberta-data">Há 3 dias</span>
                    </div>
                  </div>
                </div>
                <div className="descoberta-insight">
                  <i className="fa-solid fa-lightbulb descoberta-insight-icon"></i>
                  <span>Você completa mais missões nos dias que caminha</span>
                </div>
                <p className="descoberta-dado">
                  <i className="fa-solid fa-arrow-trend-up"></i>
                  Dias com 5k passos → 85% de missões completadas
                </p>
                <div className="d-flex align-items-center gap-3 flex-wrap">
                  <button className="btn descoberta-btn-criar">Criar missão baseada nisto</button>
                  <button className="btn descoberta-btn-historico">Ver histórico completo</button>
                </div>
              </div>

              {/* Descoberta — Alimentação Balanceada */}
              <div className="card descoberta-card">
                <div className="d-flex align-items-start gap-4 mb-3">
                  <div className="descoberta-icon descoberta-icon--orange">
                    <i className="fa-solid fa-apple-whole"></i>
                  </div>
                  <div className="d-flex flex-column gap-2">
                    <h3 className="descoberta-nome">Alimentação Balanceada</h3>
                    <div className="d-flex align-items-center gap-2 flex-wrap">
                      <span className="badge badge-warning">Nutrição</span>
                      <span className="badge descoberta-badge--baixo">Impacto: Baixo</span>
                      <span className="descoberta-data">Há 5 dias</span>
                    </div>
                  </div>
                </div>
                <div className="descoberta-insight">
                  <i className="fa-solid fa-lightbulb descoberta-insight-icon"></i>
                  <span>Refeições regulares melhoram sua consistência</span>
                </div>
                <p className="descoberta-dado">
                  <i className="fa-solid fa-arrow-trend-up"></i>
                  7 dias com 3 refeições → Streak de 7 dias mantido
                </p>
                <div className="d-flex align-items-center gap-3 flex-wrap">
                  <button className="btn descoberta-btn-criar">Criar missão baseada nisto</button>
                  <button className="btn descoberta-btn-historico">Ver histórico completo</button>
                </div>
              </div>

            </div>

            {/* Card informativo — WayCare Band */}
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