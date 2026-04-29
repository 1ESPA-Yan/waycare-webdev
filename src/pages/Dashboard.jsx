import { useState } from 'react'
import { Link } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import '../styles/dashboard.css'

function Dashboard() {
  // Controla se a sidebar está aberta no mobile
  const [sidebarOpen, setSidebarOpen] = useState(false)

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

        {/* Sidebar — recebe a classe 'open' quando sidebarOpen for true */}
        <div className={sidebarOpen ? 'open' : ''}>
          <Sidebar />
        </div>

        <main className="main-content" id="main-content">

          {/* Topbar */}
          <header className="topbar dashboard-topbar">
            <div className="topbar-greeting">
              <h1 className="greeting-title">Olá, João! 👋</h1>
              <div className="d-flex align-items-center gap-3">
                <span className="humor-badge">
                  <i className="fa-solid fa-bolt"></i>
                  Energético
                </span>
                <button className="humor-change-btn">mudar humor</button>
              </div>
            </div>
            <div className="topbar-actions">
              <div className="hc-chip">
                <span className="fa-solid fa-coins"></span>
                1300 HC
              </div>
              <button className="notif-btn" aria-label="Notificações">
                <i className="fa-solid fa-bell"></i>
                <span className="notif-dot"></span>
              </button>
            </div>
          </header>

          <section id="page-content" className="page-transition">

            {/* Trilha de hoje */}
            <div className="trilha-card dashboard-section">
              <div className="d-flex align-items-start justify-content-between gap-3 mb-3">
                <div className="d-flex align-items-center gap-2">
                  <div className="trilha-hoje-icon"><i className="fa-solid fa-moon"></i></div>
                  <h2 className="trilha-card-title">Sua Trilha de Hoje: Sono Profundo</h2>
                </div>
                <Link to="/trilhas" className="trilha-link">Ver trilha completa →</Link>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-1">
                <span className="text-sm text-secondary">3/5 missões completadas</span>
                <span className="text-sm font-bold trilha-pct">60%</span>
              </div>
              <div className="progress-bar trilha-progress-bar mb-3">
                <div className="progress-fill" style={{ width: '60%' }}></div>
              </div>
              <div className="trilha-slots">
                <div className="trilha-slot completed" aria-label="Missão concluída">
                  <i className="fa-solid fa-check"></i>
                </div>
                <div className="trilha-slot completed" aria-label="Missão concluída">
                  <i className="fa-solid fa-check"></i>
                </div>
                <div className="trilha-slot completed" aria-label="Missão concluída">
                  <i className="fa-solid fa-check"></i>
                </div>
                <div className="trilha-slot pending" aria-label="Missão pendente">
                  <i className="fa-solid fa-spa"></i>
                </div>
                <div className="trilha-slot pending" aria-label="Missão pendente">
                  <i className="fa-solid fa-clipboard-list"></i>
                </div>
              </div>
            </div>

            {/* Missões disponíveis */}
            <div className="dashboard-section">
              <div className="d-flex align-items-center justify-content-between mb-4">
                <h2 className="section-title">Missões Disponíveis</h2>
                <button className="filter-btn">
                  Filtrar <i className="fa-solid fa-chevron-down"></i>
                </button>
              </div>

              <div className="row g-4">

                {/* Missão — Movimento */}
                <div className="col-12 col-md-6">
                  <div className="card-mission h-100 d-flex flex-column gap-3">
                    <div className="d-flex align-items-start gap-3">
                      <div className="mission-emoji mission-emoji--blue"><i className="fa-solid fa-shoe-prints"></i></div>
                      <div className="d-flex flex-column gap-1">
                        <h3 className="mission-title">Caminhar 5.000 passos</h3>
                        <p className="mission-desc">Movimente-se ao longo do dia</p>
                      </div>
                    </div>
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center gap-2">
                        <span className="mission-time"><i className="fa-regular fa-clock"></i> 30-40 min</span>
                        <span className="badge badge-info">Movimento</span>
                      </div>
                      <span className="mission-hc"><span className="fa-solid fa-coins"></span> +50 HC</span>
                    </div>
                    <button className="btn btn-primary btn-block btn-mission">Iniciar Missão</button>
                  </div>
                </div>

                {/* Missão — WayCare Bottle */}
                <div className="col-12 col-md-6">
                  <div className="card-mission bottle-mission h-100 d-flex flex-column gap-3">
                    <span className="bottle-mission-badge">
                      <i className="fa-solid fa-droplet"></i>
                      WayCare Bottle • Auto Sync
                    </span>
                    <div className="d-flex align-items-start gap-3">
                      <div className="mission-emoji mission-emoji--blue"><i className="fa-solid fa-droplet"></i></div>
                      <div className="d-flex flex-column gap-1">
                        <h3 className="mission-title">Beber 2L de água</h3>
                        <p className="mission-desc">Hidratação monitorada pelo WayCare Bottle</p>
                      </div>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="bottle-mission-progress-label">450 ml / 2000 ml</span>
                      <span className="bottle-mission-progress-pct">23%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill bottle-progress-fill" style={{ width: '23%' }}></div>
                    </div>
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center gap-2">
                        <span className="mission-time"><i className="fa-regular fa-clock"></i> Durante o dia</span>
                        <span className="badge badge-info">Hidratação</span>
                      </div>
                      <span className="mission-hc"><span className="fa-solid fa-coins"></span> +30 HC</span>
                    </div>
                    <button className="btn-bottle-auto" disabled>
                      <i className="fa-solid fa-droplet"></i>
                      Monitorado automaticamente
                    </button>
                  </div>
                </div>

                {/* Missão — Sono */}
                <div className="col-12 col-md-6">
                  <div className="card-mission h-100 d-flex flex-column gap-3">
                    <div className="d-flex align-items-start gap-3">
                      <div className="mission-emoji mission-emoji--purple"><i className="fa-solid fa-moon"></i></div>
                      <div className="d-flex flex-column gap-1">
                        <h3 className="mission-title">Dormir 7h esta noite</h3>
                        <p className="mission-desc">Prepare-se para uma boa noite</p>
                      </div>
                    </div>
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center gap-2">
                        <span className="mission-time"><i className="fa-regular fa-clock"></i> Noite</span>
                        <span className="badge badge-purple">Sono</span>
                      </div>
                      <span className="mission-hc"><span className="fa-solid fa-coins"></span> +40 HC</span>
                    </div>
                    <button className="btn btn-primary btn-block btn-mission">Ver detalhes</button>
                  </div>
                </div>

                {/* Missão — Mindfulness */}
                <div className="col-12 col-md-6">
                  <div className="card-mission h-100 d-flex flex-column gap-3">
                    <div className="d-flex align-items-start gap-3">
                      <div className="mission-emoji mission-emoji--teal"><i className="fa-solid fa-brain"></i></div>
                      <div className="d-flex flex-column gap-1">
                        <h3 className="mission-title">5 minutos de meditação</h3>
                        <p className="mission-desc">Acalme sua mente</p>
                      </div>
                    </div>
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center gap-2">
                        <span className="mission-time"><i className="fa-regular fa-clock"></i> 5 min</span>
                        <span className="badge badge-teal">Mindfulness</span>
                      </div>
                      <span className="mission-hc"><span className="fa-solid fa-coins"></span> +30 HC</span>
                    </div>
                    <button className="btn btn-primary btn-block btn-mission">Iniciar Missão</button>
                  </div>
                </div>

                {/* Missão — Check-up */}
                <div className="col-12 col-md-6">
                  <div className="card-mission h-100 d-flex flex-column gap-3">
                    <div className="d-flex align-items-start gap-3">
                      <div className="mission-emoji mission-emoji--red"><i className="fa-solid fa-heart-pulse"></i></div>
                      <div className="d-flex flex-column gap-1">
                        <h3 className="mission-title">Check-up anual</h3>
                        <p className="mission-desc">Agende sua consulta preventiva</p>
                      </div>
                    </div>
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center gap-2">
                        <span className="mission-time"><i className="fa-regular fa-clock"></i> 1 hora</span>
                        <span className="badge badge-error">Check-up</span>
                      </div>
                      <span className="mission-hc"><span className="fa-solid fa-coins"></span> +500 HC</span>
                    </div>
                    <button className="btn btn-primary btn-block btn-mission">Iniciar Missão</button>
                  </div>
                </div>

                {/* Missão concluída — Alongamento */}
                <div className="col-12 col-md-6">
                  <div className="card-mission completed h-100 d-flex flex-column gap-3">
                    <div className="d-flex align-items-start gap-3">
                      <div className="mission-emoji mission-emoji--blue"><i className="fa-solid fa-person-running"></i></div>
                      <div className="d-flex flex-column gap-1">
                        <h3 className="mission-title">Alongamento matinal</h3>
                        <p className="mission-desc">Desperte o corpo com alongamentos</p>
                      </div>
                      <i className="fa-solid fa-check mission-check-icon ms-auto"></i>
                    </div>
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center gap-2">
                        <span className="mission-time"><i className="fa-regular fa-clock"></i> 10 min</span>
                        <span className="badge badge-info">Movimento</span>
                      </div>
                      <span className="mission-hc"><span className="fa-solid fa-coins"></span> +20 HC</span>
                    </div>
                    <button className="btn mission-btn-done" disabled>
                      <i className="fa-regular fa-circle-check"></i> Concluída
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* Descoberta do dia */}
            <div className="descoberta-card dashboard-section">
              <div className="descoberta-icon"><i className="fa-solid fa-lightbulb"></i></div>
              <div className="d-flex flex-column gap-2">
                <h3 className="font-bold">Descoberta do Dia</h3>
                <p className="mission-title">Você dorme melhor nos dias que caminha à tarde!</p>
                <span className="text-sm text-muted">Completou 5 caminhadas → Dormiu 7h+ em 4 noites</span>
                <Link to="/descobertas" className="descoberta-link">Ver todas as descobertas →</Link>
              </div>
            </div>

            {/* Banner catálogo de recompensas */}
            <Link
              to="/recompensas"
              className="recompensas-banner dashboard-section d-flex align-items-center justify-content-between"
            >
              <div className="d-flex align-items-center gap-4">
                <i className="fa-solid fa-gem recompensas-banner-gem"></i>
                <div className="d-flex flex-column gap-1">
                  <h3 className="recompensas-banner-title">Catálogo de Recompensas</h3>
                  <p className="recompensas-banner-desc">Troque seus 1300 Health Coins por prêmios incríveis!</p>
                </div>
              </div>
              <i className="fa-solid fa-gift recompensas-banner-gift"></i>
            </Link>

          </section>
        </main>
      </div>
    </>
  )
}

export default Dashboard