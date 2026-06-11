import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import { useApp } from '../context/AppContext'
import '../styles/dashboard.css'

function CardMissao({ missao, mlConsumido }) {
  if (missao.tipo === 'bottle') {
    const pct = Math.round((mlConsumido / missao.metaMl) * 100)
    return (
      <div className="card-mission bottle-mission d-flex flex-column gap-3">
        <span className="bottle-mission-badge">
          <i className="fa-solid fa-droplet"></i>
          WayCare Bottle • Auto Sync
        </span>
        <div className="d-flex align-items-start gap-3">
          <div className={`mission-emoji mission-emoji--${missao.emojiCor}`}>
            <i className={`fa-solid ${missao.icone}`}></i>
          </div>
          <div className="d-flex flex-column gap-1">
            <h3 className="mission-title">{missao.titulo}</h3>
            <p className="mission-desc">{missao.descricao}</p>
          </div>
        </div>
        <div className="d-flex justify-content-between align-items-center">
          <span className="bottle-mission-progress-label">{mlConsumido} ml / {missao.metaMl} ml</span>
          <span className="bottle-mission-progress-pct">{pct}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill bottle-progress-fill" style={{ width: `${pct}%` }}></div>
        </div>
        <div className="d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-2">
            <span className="mission-time"><i className="fa-regular fa-clock"></i> {missao.tempo}</span>
            <span className={`badge ${missao.categoriaBadge}`}>{missao.categoria}</span>
          </div>
          <span className="mission-hc"><span className="fa-solid fa-coins"></span> +{missao.hc} HC</span>
        </div>
        <button className="btn-bottle-auto" disabled>
          <i className="fa-solid fa-droplet"></i>
          Monitorado automaticamente
        </button>
      </div>
    )
  }

  if (missao.status === 'concluida') {
    return (
      <div className="card-mission completed d-flex flex-column gap-3">
        <div className="d-flex align-items-start gap-3">
          <div className={`mission-emoji mission-emoji--${missao.emojiCor}`}>
            <i className={`fa-solid ${missao.icone}`}></i>
          </div>
          <div className="d-flex flex-column gap-1">
            <h3 className="mission-title">{missao.titulo}</h3>
            <p className="mission-desc">{missao.descricao}</p>
          </div>
          <i className="fa-solid fa-check mission-check-icon ms-auto"></i>
        </div>
        <div className="d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-2">
            <span className="mission-time"><i className="fa-regular fa-clock"></i> {missao.tempo}</span>
            <span className={`badge ${missao.categoriaBadge}`}>{missao.categoria}</span>
          </div>
          <span className="mission-hc"><span className="fa-solid fa-coins"></span> +{missao.hc} HC</span>
        </div>
        <button className="btn mission-btn-done" disabled>
          <i className="fa-regular fa-circle-check"></i> Concluída
        </button>
      </div>
    )
  }

  return (
    <div className="card-mission d-flex flex-column gap-3">
      <div className="d-flex align-items-start gap-3">
        <div className={`mission-emoji mission-emoji--${missao.emojiCor}`}>
          <i className={`fa-solid ${missao.icone}`}></i>
        </div>
        <div className="d-flex flex-column gap-1">
          <h3 className="mission-title">{missao.titulo}</h3>
          <p className="mission-desc">{missao.descricao}</p>
        </div>
      </div>
      <div className="d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center gap-2">
          <span className="mission-time"><i className="fa-regular fa-clock"></i> {missao.tempo}</span>
          <span className={`badge ${missao.categoriaBadge}`}>{missao.categoria}</span>
        </div>
        <span className="mission-hc"><span className="fa-solid fa-coins"></span> +{missao.hc} HC</span>
      </div>
      <Link to={`/missao/${missao.id}`} className="btn btn-primary btn-block btn-mission">
        Iniciar Missão
      </Link>
    </div>
  )
}

function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [missoes, setMissoes] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [filtroAtivo, setFiltroAtivo] = useState('todos')
  const [filtrosVisiveis, setFiltrosVisiveis] = useState(false)
  const { totalHC, nomeUsuario, humor, HUMOR_CONFIG, mlConsumido } = useApp()
  const humorAtual = HUMOR_CONFIG[humor]

  const categorias = useMemo(() => {
    const unicas = [...new Set(missoes.map(m => m.categoria))]
    return [{ key: 'todos', label: 'Todas' }, ...unicas.map(c => ({ key: c, label: c }))]
  }, [missoes])

  const missoesFiltradas = useMemo(() =>
    filtroAtivo === 'todos' ? missoes : missoes.filter(m => m.categoria === filtroAtivo),
    [missoes, filtroAtivo]
  )

  useEffect(() => {
    fetch('/data/missoes-dashboard.json')
      .then(res => res.json())
      .then(data => {
        setMissoes(data)
        setCarregando(false)
      })
      .catch(() => {
        import('../data/missoes-dashboard.json').then(mod => {
          setMissoes(mod.default)
          setCarregando(false)
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

          {/* Topbar */}
          <header className="topbar dashboard-topbar">
            <div className="topbar-greeting">
              <h1 className="greeting-title">Olá, {nomeUsuario}! 👋</h1>
              <div className="d-flex align-items-center gap-3">
                <span className="humor-badge" style={{ backgroundColor: humorAtual.badgeBg, color: humorAtual.badgeColor, borderColor: humorAtual.badgeBorder }}>
                  <i className={`fa-solid ${humorAtual.icon}`}></i>
                  {humorAtual.label}
                </span>
                <Link to="/humor" className="humor-change-btn">mudar humor</Link>
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

            {/* Trilha de hoje — baseada no humor selecionado */}
            <div className="trilha-card dashboard-section">
              <div className="d-flex align-items-start justify-content-between gap-3 mb-3">
                <div className="d-flex align-items-center gap-2">
                  <div className="trilha-hoje-icon" style={{ color: humorAtual.badgeColor, backgroundColor: humorAtual.badgeBg }}>
                    <i className={`fa-solid ${humorAtual.icon}`}></i>
                  </div>
                  <h2 className="trilha-card-title">Sua Trilha de Hoje: {humorAtual.trilha}</h2>
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
                <div className="trilha-slot completed" aria-label="Missão concluída"><i className="fa-solid fa-check"></i></div>
                <div className="trilha-slot completed" aria-label="Missão concluída"><i className="fa-solid fa-check"></i></div>
                <div className="trilha-slot completed" aria-label="Missão concluída"><i className="fa-solid fa-check"></i></div>
                <div className="trilha-slot pending" aria-label="Missão pendente"><i className="fa-solid fa-spa"></i></div>
                <div className="trilha-slot pending" aria-label="Missão pendente"><i className="fa-solid fa-clipboard-list"></i></div>
              </div>
            </div>

            {/* Missões disponíveis */}
            <div className="dashboard-section">
              <div className="d-flex align-items-center justify-content-between mb-4">
                <h2 className="section-title">Missões Disponíveis</h2>
                <button
                  className={`filter-btn${filtrosVisiveis ? ' active' : ''}`}
                  onClick={() => setFiltrosVisiveis(v => !v)}
                  aria-expanded={filtrosVisiveis}
                >
                  Filtrar <i className={`fa-solid fa-chevron-down filter-btn-chevron${filtrosVisiveis ? ' rotated' : ''}`}></i>
                </button>
              </div>

              {filtrosVisiveis && (
                <div className="d-flex gap-2 flex-wrap mb-4">
                  {categorias.map(f => (
                    <button
                      key={f.key}
                      className={`mission-filter-tag${filtroAtivo === f.key ? ' active' : ''}`}
                      onClick={() => setFiltroAtivo(f.key)}
                      aria-pressed={filtroAtivo === f.key}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              )}

              {carregando ? (
                <div className="missions-grid">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="card-mission" style={{ minHeight: '160px', opacity: 0.4 }}></div>
                  ))}
                </div>
              ) : (
                <div className="missions-grid">
                  {missoesFiltradas.map(missao => (
                    <CardMissao key={missao.id} missao={missao} mlConsumido={mlConsumido} />
                  ))}
                </div>
              )}
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
                  <p className="recompensas-banner-desc">Troque seus {totalHC} Health Coins por prêmios incríveis!</p>
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
