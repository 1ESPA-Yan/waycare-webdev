import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import { useApp } from '../context/AppContext'
import '../styles/perfil.css'

function Perfil() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [totalConquistas, setTotalConquistas] = useState(0)
  const [editando, setEditando] = useState(false)
  const [salvo, setSalvo] = useState(false)
  const [rascunhoNome, setRascunhoNome] = useState('')
  const [rascunhoEmail, setRascunhoEmail] = useState('')
  const [rascunhoBio, setRascunhoBio] = useState('')

  const { totalHC, nomeUsuario, emailUsuario, bioUsuario, setBioUsuario, salvarUsuario, naoLidas } = useApp()

  useEffect(() => {
    fetch('/data/conquistas.json')
      .then(res => res.json())
      .then(data => setTotalConquistas(data.filter(c => c.desbloqueada).length))
      .catch(() => {
        import('../data/conquistas.json').then(mod =>
          setTotalConquistas(mod.default.filter(c => c.desbloqueada).length)
        )
      })
  }, [])

  const iniciarEdicao = () => {
    setRascunhoNome(nomeUsuario)
    setRascunhoEmail(emailUsuario)
    setRascunhoBio(bioUsuario || '')
    setEditando(true)
  }

  const cancelar = () => setEditando(false)

  const salvar = () => {
    if (!rascunhoNome.trim()) return
    salvarUsuario(rascunhoNome.trim(), rascunhoEmail.trim())
    setBioUsuario(rascunhoBio.trim())
    setEditando(false)
    setSalvo(true)
    setTimeout(() => setSalvo(false), 2500)
  }

  const letraAvatar = nomeUsuario?.[0]?.toUpperCase() || 'U'

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
              <div className="perfil-titulo-icon">
                <i className="fa-solid fa-user"></i>
              </div>
              <div>
                <h1 className="perfil-titulo">Meu Perfil</h1>
                <p className="perfil-subtitulo">Gerencie suas informações pessoais</p>
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
                {naoLidas > 0 && <span className="notif-dot">{naoLidas > 9 ? '9+' : naoLidas}</span>}
              </Link>
            </div>
          </header>

          <section id="page-content" className="page-transition">

            <div className="perfil-layout">

              {/* Coluna esquerda */}
              <div className="d-flex flex-column gap-4">

                {/* Card principal do perfil */}
                <div className="card perfil-card-principal">

                  <div className="d-flex align-items-start gap-4">
                    <div className="avatar avatar-lg perfil-avatar">{letraAvatar}</div>

                    <div className="d-flex flex-column gap-2 grow">
                      {editando ? (
                        <div className="perfil-edit-form">
                          <div className="perfil-edit-field">
                            <label className="perfil-edit-label">Nome</label>
                            <input
                              className="perfil-edit-input"
                              type="text"
                              value={rascunhoNome}
                              onChange={e => setRascunhoNome(e.target.value)}
                              onKeyDown={e => { if (e.key === 'Enter') salvar(); if (e.key === 'Escape') cancelar() }}
                              autoFocus
                              maxLength={40}
                            />
                          </div>
                          <div className="perfil-edit-field">
                            <label className="perfil-edit-label">E-mail</label>
                            <input
                              className="perfil-edit-input"
                              type="email"
                              value={rascunhoEmail}
                              onChange={e => setRascunhoEmail(e.target.value)}
                              onKeyDown={e => { if (e.key === 'Enter') salvar(); if (e.key === 'Escape') cancelar() }}
                              placeholder="seu@email.com"
                            />
                          </div>
                          <div className="perfil-edit-field">
                            <label className="perfil-edit-label">
                              Bio
                              <span className="perfil-edit-hint"> {rascunhoBio.length}/80</span>
                            </label>
                            <textarea
                              className="perfil-edit-input perfil-edit-textarea"
                              value={rascunhoBio}
                              onChange={e => setRascunhoBio(e.target.value.slice(0, 80))}
                              onKeyDown={e => { if (e.key === 'Escape') cancelar() }}
                              placeholder="Uma frase sobre você..."
                              rows={2}
                            />
                          </div>
                          <div className="perfil-edit-actions">
                            <button
                              className="perfil-edit-btn-salvar"
                              onClick={salvar}
                              disabled={!rascunhoNome.trim()}
                            >
                              <i className="fa-solid fa-check"></i> Salvar
                            </button>
                            <button className="perfil-edit-btn-cancelar" onClick={cancelar}>
                              <i className="fa-solid fa-xmark"></i> Cancelar
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="d-flex align-items-center gap-2">
                            <h2 className="perfil-nome">{nomeUsuario}</h2>
                            {salvo && <span className="perfil-salvo-badge">Salvo!</span>}
                            <button
                              className="perfil-edit-btn ms-auto"
                              aria-label="Editar perfil"
                              onClick={iniciarEdicao}
                            >
                              <i className="fa-regular fa-pen-to-square"></i>
                            </button>
                          </div>
                          {bioUsuario && <p className="perfil-bio">{bioUsuario}</p>}
                          <div className="d-flex align-items-center gap-3 flex-wrap">
                            <span className="perfil-meta">
                              <i className="fa-regular fa-envelope"></i>
                              {emailUsuario || 'Sem email'}
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
                        </>
                      )}
                    </div>
                  </div>

                  {!editando && (
                    <div className="mt-4">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="text-sm text-secondary">Progresso para Nível 6</span>
                        <span className="text-sm font-bold trilha-pct">82%</span>
                      </div>
                      <div className="progress-bar perfil-progress-bar">
                        <div className="progress-fill" style={{ width: '82%' }}></div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Grid de estatísticas */}
                <div className="perfil-stats-grid">
                  <div>
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
                  <div>
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
                  <div>
                    <div className="card perfil-stat-card">
                      <div className="perfil-stat-icon perfil-stat-icon--hc">
                        <i className="fa-solid fa-coins"></i>
                      </div>
                      <div className="d-flex flex-column gap-1">
                        <span className="perfil-stat-label">Total de Coins Ganhos</span>
                        <span className="perfil-stat-valor">{totalHC.toLocaleString('pt-BR')}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="card perfil-stat-card">
                      <div className="perfil-stat-icon perfil-stat-icon--trophy">
                        <i className="fa-solid fa-trophy"></i>
                      </div>
                      <div className="d-flex flex-column gap-1">
                        <span className="perfil-stat-label">Conquistas</span>
                        <span className="perfil-stat-valor">{totalConquistas}</span>
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

                  <div className="perfil-conquistas-grid">
                    <div>
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

                    <div>
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

                    <div>
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

                    <div>
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
              <div className="d-flex flex-column gap-4">
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
