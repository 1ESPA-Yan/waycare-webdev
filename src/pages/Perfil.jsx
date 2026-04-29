import { useState } from 'react'
import { Link } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import '../styles/perfil.css'

function Perfil() {
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
            <Link to="/" className="perfil-voltar">
              <i className="fa-solid fa-arrow-left"></i>
              Voltar
            </Link>
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

            {/* Título da página */}
            <div className="d-flex align-items-center gap-3 mb-5">
              <div className="perfil-titulo-icon">
                <i className="fa-solid fa-trophy"></i>
              </div>
              <h1 className="perfil-titulo">Meu Perfil</h1>
            </div>

            <div className="row g-4">

              {/* Coluna esquerda */}
              <div className="col-12 col-lg-8 d-flex flex-column gap-4">

                {/* Card principal do perfil */}
                <div className="card perfil-card-principal">
                  <div className="d-flex align-items-start gap-4 mb-4">
                    <div className="avatar avatar-lg perfil-avatar">J</div>
                    <div className="d-flex flex-column gap-2 flex-grow-1">
                      <div className="d-flex align-items-center gap-2">
                        <h2 className="perfil-nome">João Victor</h2>
                        <button className="perfil-edit-btn" aria-label="Editar perfil">
                          <i className="fa-regular fa-pen-to-square"></i>
                        </button>
                      </div>
                      <div className="d-flex align-items-center gap-3 flex-wrap">
                        <span className="perfil-meta">
                          <i className="fa-regular fa-envelope"></i>
                          joao.victor@email.com
                        </span>
                        <span className="perfil-meta">
                          <i className="fa-regular fa-calendar"></i>
                          Membro desde Mai 2024
                        </span>
                      </div>
                      <div className="d-flex align-items-center gap-2 flex-wrap">
                        <span className="perfil-stat-chip perfil-stat-chip--green">
                          Nível<strong>5</strong>
                        </span>
                        <span className="perfil-stat-chip perfil-stat-chip--gray">
                          XP<strong>2.450</strong>
                        </span>
                        <span className="perfil-stat-chip perfil-stat-chip--hc">
                          Próximo nível<strong>550 XP</strong>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="text-sm text-secondary">Progresso para Nível 6</span>
                    <span className="text-sm font-bold trilha-pct">82%</span>
                  </div>
                  <div className="progress-bar perfil-progress-bar">
                    <div className="progress-fill" style={{ width: '82%' }}></div>
                  </div>
                </div>

                {/* Grid de estatísticas */}
                <div className="row g-3">
                  <div className="col-6">
                    <div className="card perfil-stat-card">
                      <div className="perfil-stat-icon perfil-stat-icon--blue">
                        <i className="fa-solid fa-bullseye"></i>
                      </div>
                      <div className="d-flex flex-column gap-1">
                        <span className="perfil-stat-label">Missões Completadas</span>
                        <span className="perfil-stat-valor">48</span>
                      </div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="card perfil-stat-card">
                      <div className="perfil-stat-icon perfil-stat-icon--orange">
                        <i className="fa-solid fa-fire"></i>
                      </div>
                      <div className="d-flex flex-column gap-1">
                        <span className="perfil-stat-label">Streak Atual</span>
                        <span className="perfil-stat-valor">5 dias</span>
                      </div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="card perfil-stat-card">
                      <div className="perfil-stat-icon perfil-stat-icon--hc">
                        <i className="fa-solid fa-coins"></i>
                      </div>
                      <div className="d-flex flex-column gap-1">
                        <span className="perfil-stat-label">Total de Coins Ganhos</span>
                        <span className="perfil-stat-valor">3.450</span>
                      </div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="card perfil-stat-card">
                      <div className="perfil-stat-icon perfil-stat-icon--trophy">
                        <i className="fa-solid fa-trophy"></i>
                      </div>
                      <div className="d-flex flex-column gap-1">
                        <span className="perfil-stat-label">Conquistas</span>
                        <span className="perfil-stat-valor">12</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Conquistas recentes */}
                <div className="card">
                  <div className="d-flex align-items-center gap-2 mb-4">
                    <div className="perfil-stat-icon perfil-stat-icon--trophy">
                      <i className="fa-solid fa-trophy"></i>
                    </div>
                    <h3 className="perfil-secao-titulo">Conquistas Recentes</h3>
                  </div>

                  <div className="row g-3 mb-4">
                    {/* Semana Ativa — desbloqueada */}
                    <div className="col-6">
                      <div className="perfil-conquista-item perfil-conquista-item--done">
                        <div className="perfil-conquista-icon perfil-conquista-icon--orange">
                          <i className="fa-solid fa-fire"></i>
                        </div>
                        <div className="d-flex flex-column gap-1">
                          <span className="perfil-conquista-nome">Semana Ativa</span>
                          <span className="perfil-conquista-desc">Completou 7 dias consecutivos</span>
                        </div>
                      </div>
                    </div>

                    {/* Mestre do Sono — desbloqueada */}
                    <div className="col-6">
                      <div className="perfil-conquista-item perfil-conquista-item--done">
                        <div className="perfil-conquista-icon perfil-conquista-icon--purple">
                          <i className="fa-solid fa-moon"></i>
                        </div>
                        <div className="d-flex flex-column gap-1">
                          <span className="perfil-conquista-nome">Mestre do Sono</span>
                          <span className="perfil-conquista-desc">Dormiu 7h+ por 10 dias</span>
                        </div>
                      </div>
                    </div>

                    {/* Hidratação em Dia — desbloqueada */}
                    <div className="col-6">
                      <div className="perfil-conquista-item perfil-conquista-item--done">
                        <div className="perfil-conquista-icon perfil-conquista-icon--blue">
                          <i className="fa-solid fa-droplet"></i>
                        </div>
                        <div className="d-flex flex-column gap-1">
                          <span className="perfil-conquista-nome">Hidratação em Dia</span>
                          <span className="perfil-conquista-desc">30 dias bebendo 2L de água</span>
                        </div>
                      </div>
                    </div>

                    {/* Maratonista — bloqueada */}
                    <div className="col-6">
                      <div className="perfil-conquista-item">
                        <div className="perfil-conquista-icon perfil-conquista-icon--locked">
                          <i className="fa-solid fa-person-running"></i>
                        </div>
                        <div className="d-flex flex-column gap-1">
                          <span className="perfil-conquista-nome text-muted">Maratonista</span>
                          <span className="perfil-conquista-desc">Caminhou 100km no total</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Link to="/conquistas" className="btn perfil-btn-conquistas">
                    Ver Todas as Conquistas
                  </Link>
                </div>
              </div>

              {/* Coluna direita — atalhos */}
              <div className="col-12 col-lg-4 d-flex flex-column gap-4">
                <Link to="/configuracoes" className="card perfil-atalho">
                  <div className="perfil-atalho-icon perfil-atalho-icon--gray">
                    <i className="fa-solid fa-gear"></i>
                  </div>
                  <div className="d-flex flex-column gap-1">
                    <span className="perfil-atalho-titulo">Configurações</span>
                    <span className="perfil-atalho-desc">Ajuste suas preferências</span>
                  </div>
                </Link>

                <Link to="/recompensas" className="card perfil-atalho">
                  <div className="perfil-atalho-icon perfil-atalho-icon--green">
                    <i className="fa-solid fa-gift"></i>
                  </div>
                  <div className="d-flex flex-column gap-1">
                    <span className="perfil-atalho-titulo">Minhas Recompensas</span>
                    <span className="perfil-atalho-desc">Vouchers resgatados</span>
                  </div>
                </Link>

                <Link to="/descobertas" className="card perfil-atalho">
                  <div className="perfil-atalho-icon perfil-atalho-icon--yellow">
                    <i className="fa-solid fa-lightbulb"></i>
                  </div>
                  <div className="d-flex flex-column gap-1">
                    <span className="perfil-atalho-titulo">Descobertas</span>
                    <span className="perfil-atalho-desc">Insights sobre sua saúde</span>
                  </div>
                </Link>
              </div>

            </div>
          </section>
        </main>
      </div>
    </>
  )
}

export default Perfil