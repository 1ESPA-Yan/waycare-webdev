import { useState } from 'react'
import { Link } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import { useApp } from '../context/AppContext'
import '../styles/conquistas.css'

function Conquistas() {
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
        <Sidebar isOpen={sidebarOpen} />

        <main className="main-content" id="main-content">

          {/* Topbar */}
          <header className="topbar">
            <div className="d-flex align-items-center gap-3">
              <div className="conquistas-titulo-icon">
                <i className="fa-solid fa-trophy"></i>
              </div>
              <h1 className="conquistas-titulo">Conquistas</h1>
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

            {/* Card de resumo geral */}
            <div className="card conquistas-resumo mb-5">
              <div className="d-flex align-items-center justify-content-between gap-4">
                <div className="d-flex flex-column gap-2 grow">
                  <h2 className="conquistas-resumo-titulo">3 de 6 Conquistados</h2>
                  <p className="conquistas-resumo-desc">Continue completando missões para desbloquear mais!</p>
                  <div className="progress-bar conquistas-progress-bar">
                    <div className="progress-fill conquistas-progress-fill" style={{ width: '50%' }}></div>
                  </div>
                </div>
                <div className="conquistas-resumo-icon">
                  <i className="fa-solid fa-trophy"></i>
                </div>
              </div>
            </div>

            {/* Grid de conquistas */}
            <div className="row g-4">

              {/* Conquista desbloqueada — Semana Ativa */}
              <div className="col-12 col-lg-6">
                <div className="card conquista-card">
                  <div className="d-flex align-items-start gap-4">
                    <div className="conquista-icon conquista-icon--orange">
                      <i className="fa-solid fa-fire"></i>
                    </div>
                    <div className="d-flex flex-column gap-2 grow">
                      <div>
                        <h3 className="conquista-nome">Semana Ativa</h3>
                        <p className="conquista-desc">Complete 7 dias consecutivos</p>
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="conquista-progresso-label">Progresso: 7/7</span>
                        <span className="conquista-pct conquista-pct--done">100%</span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-fill conquista-fill--hc" style={{ width: '100%' }}></div>
                      </div>
                      <div className="d-flex align-items-center justify-content-between">
                        <span className="mission-hc"><span className="fa-solid fa-coins"></span> 100 HC</span>
                        <span className="conquista-status conquista-status--done">
                          <i className="fa-regular fa-circle-check"></i>
                          Desbloqueado há 2 dias
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Conquista desbloqueada — Mestre do Sono */}
              <div className="col-12 col-lg-6">
                <div className="card conquista-card">
                  <div className="d-flex align-items-start gap-4">
                    <div className="conquista-icon conquista-icon--purple">
                      <i className="fa-solid fa-moon"></i>
                    </div>
                    <div className="d-flex flex-column gap-2 grow">
                      <div>
                        <h3 className="conquista-nome">Mestre do Sono</h3>
                        <p className="conquista-desc">Durma 7h+ por 10 dias</p>
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="conquista-progresso-label">Progresso: 10/10</span>
                        <span className="conquista-pct conquista-pct--done">100%</span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-fill conquista-fill--hc" style={{ width: '100%' }}></div>
                      </div>
                      <div className="d-flex align-items-center justify-content-between">
                        <span className="mission-hc"><span className="fa-solid fa-coins"></span> 150 HC</span>
                        <span className="conquista-status conquista-status--done">
                          <i className="fa-regular fa-circle-check"></i>
                          Desbloqueado há 5 dias
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Conquista desbloqueada — Hidratação em Dia */}
              <div className="col-12 col-lg-6">
                <div className="card conquista-card">
                  <div className="d-flex align-items-start gap-4">
                    <div className="conquista-icon conquista-icon--blue">
                      <i className="fa-solid fa-droplet"></i>
                    </div>
                    <div className="d-flex flex-column gap-2 grow">
                      <div>
                        <h3 className="conquista-nome">Hidratação em Dia</h3>
                        <p className="conquista-desc">Beba 2L de água por 30 dias</p>
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="conquista-progresso-label">Progresso: 30/30</span>
                        <span className="conquista-pct conquista-pct--done">100%</span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-fill conquista-fill--hc" style={{ width: '100%' }}></div>
                      </div>
                      <div className="d-flex align-items-center justify-content-between">
                        <span className="mission-hc"><span className="fa-solid fa-coins"></span> 200 HC</span>
                        <span className="conquista-status conquista-status--done">
                          <i className="fa-regular fa-circle-check"></i>
                          Desbloqueado há 1 semana
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Conquista bloqueada — Maratonista */}
              <div className="col-12 col-lg-6">
                <div className="card conquista-card conquista-card--bloqueada">
                  <div className="d-flex align-items-start gap-4">
                    <div className="conquista-icon conquista-icon--locked conquista-icon--stack">
                      <i className="fa-solid fa-shoe-prints conquista-icon-bg"></i>
                      <i className="fa-solid fa-lock conquista-icon-lock"></i>
                    </div>
                    <div className="d-flex flex-column gap-2 grow">
                      <div>
                        <h3 className="conquista-nome text-muted">Maratonista</h3>
                        <p className="conquista-desc">Caminhe 100km no total</p>
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="conquista-progresso-label">Progresso: 67/100</span>
                        <span className="conquista-pct conquista-pct--progress">67%</span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-fill conquista-fill--hc" style={{ width: '67%' }}></div>
                      </div>
                      <div className="d-flex align-items-center justify-content-between">
                        <span className="mission-hc"><span className="fa-solid fa-coins"></span> 500 HC</span>
                        <span className="conquista-status conquista-status--locked">
                          <i className="fa-solid fa-lock"></i>
                          Bloqueado
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Conquista bloqueada — Zen Master */}
              <div className="col-12 col-lg-6">
                <div className="card conquista-card conquista-card--bloqueada">
                  <div className="d-flex align-items-start gap-4">
                    <div className="conquista-icon conquista-icon--locked conquista-icon--stack">
                      <i className="fa-solid fa-brain conquista-icon-bg"></i>
                      <i className="fa-solid fa-lock conquista-icon-lock"></i>
                    </div>
                    <div className="d-flex flex-column gap-2 grow">
                      <div>
                        <h3 className="conquista-nome text-muted">Zen Master</h3>
                        <p className="conquista-desc">Medite por 30 dias seguidos</p>
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="conquista-progresso-label">Progresso: 12/30</span>
                        <span className="conquista-pct conquista-pct--progress">40%</span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-fill conquista-fill--hc" style={{ width: '40%' }}></div>
                      </div>
                      <div className="d-flex align-items-center justify-content-between">
                        <span className="mission-hc"><span className="fa-solid fa-coins"></span> 300 HC</span>
                        <span className="conquista-status conquista-status--locked">
                          <i className="fa-solid fa-lock"></i>
                          Bloqueado
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Conquista bloqueada — Preventivo */}
              <div className="col-12 col-lg-6">
                <div className="card conquista-card conquista-card--bloqueada">
                  <div className="d-flex align-items-start gap-4">
                    <div className="conquista-icon conquista-icon--locked-red conquista-icon--stack">
                      <i className="fa-solid fa-heart-pulse conquista-icon-bg"></i>
                      <i className="fa-solid fa-lock conquista-icon-lock"></i>
                    </div>
                    <div className="d-flex flex-column gap-2 grow">
                      <div>
                        <h3 className="conquista-nome text-muted">Preventivo</h3>
                        <p className="conquista-desc">Realize check-ups anuais por 3 anos</p>
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="conquista-progresso-label">Progresso: 1/3</span>
                        <span className="conquista-pct conquista-pct--progress">33%</span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-fill conquista-fill--hc" style={{ width: '33%' }}></div>
                      </div>
                      <div className="d-flex align-items-center justify-content-between">
                        <span className="mission-hc"><span className="fa-solid fa-coins"></span> 1000 HC</span>
                        <span className="conquista-status conquista-status--locked">
                          <i className="fa-solid fa-lock"></i>
                          Bloqueado
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Card informativo — como desbloquear */}
            <div className="conquistas-dica mt-5">
              <div className="conquistas-dica-icon">
                <i className="fa-solid fa-lightbulb"></i>
              </div>
              <div className="d-flex flex-column gap-2">
                <h4 className="conquistas-dica-titulo">Como Desbloquear Conquistas</h4>
                <ul className="conquistas-dica-lista">
                  <li><i className="fa-solid fa-circle-dot"></i> Complete missões diárias e mantenha sua sequência</li>
                  <li><i className="fa-solid fa-circle-dot"></i> Cada conquista desbloqueada dá Health Coins de bônus</li>
                  <li><i className="fa-solid fa-circle-dot"></i> Algumas conquistas são ocultas — descubra fazendo ações especiais!</li>
                </ul>
              </div>
            </div>

          </section>
        </main>
      </div>
    </>
  )
}

export default Conquistas