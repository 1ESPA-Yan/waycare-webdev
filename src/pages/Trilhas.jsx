import { useState } from 'react'
import { Link } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import '../styles/trilhas.css'

function Trilhas() {
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
        <div className={sidebarOpen ? 'open' : ''}>
          <Sidebar />
        </div>

        <main className="main-content" id="main-content">

          {/* Topbar */}
          <header className="topbar">
            <div>
              <h1 className="trilhas-page-title">Trilhas de Bem-estar</h1>
              <p className="trilhas-page-subtitle">
                Recomendado para você: <i className="fa-solid fa-bolt trilhas-subtitle-icon"></i>
                <span className="trilhas-subtitle-texto">Movimento & Nutrição</span>
              </p>
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

          <section id="page-content">

            {/* Cards de resumo */}
            <div className="row g-3 mb-4">
              <div className="col-6 col-lg-3">
                <div className="card resumo-card">
                  <div className="resumo-icon resumo-icon--primary">
                    <i className="fa-solid fa-bullseye"></i>
                  </div>
                  <div className="resumo-card-body">
                    <span className="resumo-valor">2</span>
                    <span className="resumo-label">Trilhas Ativas</span>
                  </div>
                </div>
              </div>
              <div className="col-6 col-lg-3">
                <div className="card resumo-card">
                  <div className="resumo-icon resumo-icon--success">
                    <i className="fa-solid fa-circle-check"></i>
                  </div>
                  <div className="resumo-card-body">
                    <span className="resumo-valor">3</span>
                    <span className="resumo-label">Missões Concluídas</span>
                  </div>
                </div>
              </div>
              <div className="col-6 col-lg-3">
                <div className="card resumo-card">
                  <div className="resumo-icon resumo-icon--warning">
                    <i className="fa-solid fa-fire"></i>
                  </div>
                  <div className="resumo-card-body">
                    <span className="resumo-valor text-warning">5 dias</span>
                    <span className="resumo-label">Sequência</span>
                  </div>
                </div>
              </div>
              <div className="col-6 col-lg-3">
                <div className="card resumo-card">
                  <div className="resumo-icon resumo-icon--hc">
                    <i className="fa-solid fa-coins"></i>
                  </div>
                  <div className="resumo-card-body">
                    <span className="resumo-valor resumo-valor--hc">1300</span>
                    <span className="resumo-label">Health Coins</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Busca e filtros */}
            <div className="d-flex align-items-center gap-3 mb-5 flex-wrap">
              <div className="trilhas-search flex-grow-1">
                <i className="fa-solid fa-magnifying-glass trilhas-search-icon"></i>
                <input type="search" className="input-field trilhas-search-input" placeholder="Buscar trilhas..." />
              </div>
              <div className="d-flex gap-2 flex-wrap">
                <button className="trilha-tag active">
                  <i className="fa-solid fa-circle-dot"></i> Todos
                </button>
                <button className="trilha-tag">
                  <i className="fa-solid fa-person-running"></i> Movimento
                </button>
                <button className="trilha-tag">
                  <i className="fa-solid fa-moon"></i> Sono
                </button>
                <button className="trilha-tag">
                  <i className="fa-solid fa-apple-whole"></i> Nutrição
                </button>
                <button className="trilha-tag">
                  <i className="fa-solid fa-brain"></i> Mindfulness
                </button>
                <button className="trilha-tag">
                  <i className="fa-solid fa-heart-pulse"></i> Saúde
                </button>
              </div>
            </div>

            {/* Trilhas em andamento */}
            <div className="trilhas-secao">
              <div className="d-flex align-items-center gap-3 mb-4">
                <span className="trilhas-secao-barra trilhas-secao-barra--primary"></span>
                <h2 className="trilhas-secao-titulo">Trilhas em Andamento</h2>
                <span className="badge badge-primary">2 ativas</span>
              </div>

              <div className="row g-4">

                {/* Trilha — Sono Profundo */}
                <div className="col-12 col-lg-6">
                  <div className="card trilha-card d-flex flex-column gap-3">
                    <div className="d-flex align-items-start gap-3">
                      <div className="trilha-thumb trilha-thumb--purple"><i className="fa-solid fa-moon"></i></div>
                      <div className="d-flex flex-column gap-1">
                        <div className="d-flex align-items-center gap-2">
                          <h3 className="trilha-nome">Sono Profundo</h3>
                          <span className="trilha-status-badge trilha-status-badge--purple">● Em andamento</span>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                          <span className="badge badge-facil">Fácil</span>
                          <span className="text-xs text-muted">Nível 1 · 1.240 participantes</span>
                        </div>
                      </div>
                    </div>
                    <p className="trilha-desc">Melhore a qualidade do seu sono com hábitos noturnos saudáveis e rotinas de relaxamento comprovadas.</p>
                    <div className="d-flex gap-2 flex-wrap">
                      <span className="badge badge-purple">Relaxamento</span>
                      <span className="badge badge-purple">Rotina</span>
                      <span className="badge badge-purple">Descanso</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="text-sm text-secondary">Progresso da trilha</span>
                      <span className="text-sm font-bold trilha-pct--purple">60%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill trilha-fill--purple" style={{ width: '60%' }}></div>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center gap-3">
                        <span className="trilha-meta-item"><i className="fa-regular fa-calendar"></i> 7 dias</span>
                        <span className="trilha-meta-item"><i className="fa-regular fa-circle-check"></i> 5 missões</span>
                      </div>
                      <span className="mission-hc"><span className="fa-solid fa-coins"></span> +350 HC</span>
                    </div>
                    <button className="btn trilha-btn-continuar">
                      <i className="fa-solid fa-play"></i> Continuar Trilha
                    </button>
                  </div>
                </div>

                {/* Trilha — Movimento Diário */}
                <div className="col-12 col-lg-6">
                  <div className="card trilha-card trilha-card--blue d-flex flex-column gap-3">
                    <div className="d-flex align-items-start gap-3">
                      <div className="trilha-thumb trilha-thumb--blue"><i className="fa-solid fa-person-running"></i></div>
                      <div className="d-flex flex-column gap-1">
                        <div className="d-flex align-items-center gap-2">
                          <h3 className="trilha-nome">Movimento Diário</h3>
                          <span className="trilha-status-badge trilha-status-badge--blue">● Em andamento</span>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                          <span className="badge badge-medio">Médio</span>
                          <span className="text-xs text-muted">Nível 2 · 890 participantes</span>
                        </div>
                      </div>
                    </div>
                    <p className="trilha-desc">Incorpore atividade física leve à sua rotina diária sem precisar ir à academia.</p>
                    <div className="d-flex gap-2 flex-wrap">
                      <span className="badge badge-info">Passos</span>
                      <span className="badge badge-info">Cardio</span>
                      <span className="badge badge-info">Energia</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="text-sm text-secondary">Progresso da trilha</span>
                      <span className="text-sm font-bold trilha-pct--blue">25%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill trilha-fill--blue" style={{ width: '25%' }}></div>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center gap-3">
                        <span className="trilha-meta-item"><i className="fa-regular fa-calendar"></i> 14 dias</span>
                        <span className="trilha-meta-item"><i className="fa-regular fa-circle-check"></i> 8 missões</span>
                      </div>
                      <span className="mission-hc"><span className="fa-solid fa-coins"></span> +620 HC</span>
                    </div>
                    <button className="btn trilha-btn-continuar trilha-btn-continuar--blue">
                      <i className="fa-solid fa-play"></i> Continuar Trilha
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Trilhas disponíveis */}
            <div className="trilhas-secao">
              <div className="d-flex align-items-center gap-3 mb-4">
                <span className="trilhas-secao-barra trilhas-secao-barra--warning"></span>
                <h2 className="trilhas-secao-titulo">Trilhas Disponíveis</h2>
                <span className="badge badge-warning">3 disponíveis</span>
              </div>

              <div className="row g-4">

                {/* Trilha — Mente Tranquila */}
                <div className="col-12 col-lg-6">
                  <div className="card trilha-card trilha-card-recomendada d-flex flex-column gap-3">
                    <span className="trilha-recomendada-label">
                      <i className="fa-solid fa-star"></i> Recomendada para seu humor
                    </span>
                    <div className="d-flex align-items-start gap-3">
                      <div className="trilha-thumb trilha-thumb--green"><i className="fa-solid fa-brain"></i></div>
                      <div className="d-flex flex-column gap-1">
                        <h3 className="trilha-nome">Mente Tranquila</h3>
                        <div className="d-flex align-items-center gap-2">
                          <span className="badge badge-facil">Fácil</span>
                          <span className="text-xs text-muted">Nível 1 · 2.100 participantes</span>
                        </div>
                      </div>
                    </div>
                    <p className="trilha-desc">Reduza o estresse e a ansiedade com técnicas de mindfulness e respiração consciente.</p>
                    <div className="d-flex gap-2 flex-wrap">
                      <span className="badge badge-teal">Respiração</span>
                      <span className="badge badge-teal">Foco</span>
                      <span className="badge badge-teal">Ansiedade</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center gap-3">
                        <span className="trilha-meta-item"><i className="fa-regular fa-calendar"></i> 10 dias</span>
                        <span className="trilha-meta-item"><i className="fa-regular fa-circle-check"></i> 6 missões</span>
                      </div>
                      <span className="mission-hc"><span className="fa-solid fa-coins"></span> +420 HC</span>
                    </div>
                    <button className="btn trilha-btn-iniciar trilha-btn-iniciar--teal">+ Iniciar Trilha</button>
                  </div>
                </div>

                {/* Trilha — Alimentação Consciente */}
                <div className="col-12 col-lg-6">
                  <div className="card trilha-card trilha-card-recomendada d-flex flex-column gap-3">
                    <span className="trilha-recomendada-label">
                      <i className="fa-solid fa-star"></i> Recomendada para seu humor
                    </span>
                    <div className="d-flex align-items-start gap-3">
                      <div className="trilha-thumb trilha-thumb--orange"><i className="fa-solid fa-bowl-food"></i></div>
                      <div className="d-flex flex-column gap-1">
                        <h3 className="trilha-nome">Alimentação Consciente</h3>
                        <div className="d-flex align-items-center gap-2">
                          <span className="badge badge-dificil">Difícil</span>
                          <span className="text-xs text-muted">Nível 3 · 660 participantes</span>
                        </div>
                      </div>
                    </div>
                    <p className="trilha-desc">Desenvolva uma relação saudável com a comida e melhore seus hábitos alimentares.</p>
                    <div className="d-flex gap-2 flex-wrap">
                      <span className="badge badge-warning">Hidratação</span>
                      <span className="badge badge-warning">Proteína</span>
                      <span className="badge badge-warning">Vitaminas</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center gap-3">
                        <span className="trilha-meta-item"><i className="fa-regular fa-calendar"></i> 21 dias</span>
                        <span className="trilha-meta-item"><i className="fa-regular fa-circle-check"></i> 10 missões</span>
                      </div>
                      <span className="mission-hc"><span className="fa-solid fa-coins"></span> +900 HC</span>
                    </div>
                    <button className="btn trilha-btn-iniciar trilha-btn-iniciar--orange">+ Iniciar Trilha</button>
                  </div>
                </div>

                {/* Trilha — Check-up Preventivo */}
                <div className="col-12 col-lg-6">
                  <div className="card trilha-card trilha-card-checkup d-flex flex-column gap-3">
                    <div className="d-flex align-items-start gap-3">
                      <div className="trilha-thumb trilha-thumb--red"><i className="fa-solid fa-clipboard-list"></i></div>
                      <div className="d-flex flex-column gap-1">
                        <h3 className="trilha-nome">Check-up Preventivo</h3>
                        <div className="d-flex align-items-center gap-2">
                          <span className="badge badge-medio">Médio</span>
                          <span className="text-xs text-muted">Nível 2 · 440 participantes</span>
                        </div>
                      </div>
                    </div>
                    <p className="trilha-desc">Cuide da sua saúde com consultas regulares e exames preventivos essenciais.</p>
                    <div className="d-flex gap-2 flex-wrap">
                      <span className="badge badge-error">Consulta</span>
                      <span className="badge badge-error">Exames</span>
                      <span className="badge badge-error">Prevenção</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center gap-3">
                        <span className="trilha-meta-item"><i className="fa-regular fa-calendar"></i> 30 dias</span>
                        <span className="trilha-meta-item"><i className="fa-regular fa-circle-check"></i> 4 missões</span>
                      </div>
                      <span className="mission-hc"><span className="fa-solid fa-coins"></span> +1200 HC</span>
                    </div>
                    <button className="btn trilha-btn-iniciar trilha-btn-iniciar--checkup">+ Iniciar Trilha</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Trilhas bloqueadas */}
            <div className="trilhas-secao">
              <div className="d-flex align-items-center gap-3 mb-4">
                <span className="trilhas-secao-barra trilhas-secao-barra--muted"></span>
                <h2 className="trilhas-secao-titulo">Trilhas Bloqueadas</h2>
                <span className="text-sm text-muted">Complete outras trilhas para desbloquear</span>
              </div>

              <div className="row g-4">
                <div className="col-12 col-lg-6">
                  <div className="card trilha-card trilha-card-bloqueada d-flex flex-column gap-3">
                    <div className="d-flex align-items-start gap-3">
                      <div className="trilha-thumb trilha-thumb--locked"><i className="fa-solid fa-person-biking"></i></div>
                      <div className="d-flex flex-column gap-1">
                        <div className="d-flex align-items-center gap-2">
                          <h3 className="trilha-nome text-muted">Cardio Intenso</h3>
                          <i className="fa-solid fa-lock text-muted text-sm"></i>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                          <span className="badge badge-dificil">Difícil</span>
                          <span className="text-xs text-muted">Nível 4 · 280 participantes</span>
                        </div>
                      </div>
                    </div>
                    <p className="trilha-desc text-muted">Eleve seu condicionamento físico com atividades cardiovasculares progressivas.</p>
                    <div className="d-flex gap-2 flex-wrap">
                      <span className="badge badge-muted">Resistência</span>
                      <span className="badge badge-muted">Força</span>
                      <span className="badge badge-muted">Velocidade</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center gap-3">
                        <span className="trilha-meta-item text-muted"><i className="fa-regular fa-calendar"></i> 21 dias</span>
                        <span className="trilha-meta-item text-muted"><i className="fa-regular fa-circle-check"></i> 12 missões</span>
                      </div>
                      <span className="mission-hc"><span className="fa-solid fa-coins"></span> +1100 HC</span>
                    </div>
                    <button className="btn trilha-btn-bloqueada" disabled>
                      <i className="fa-solid fa-lock"></i> Bloqueada
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </section>
        </main>
      </div>
    </>
  )
}

export default Trilhas