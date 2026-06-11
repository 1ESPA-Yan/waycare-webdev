import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import { useApp } from '../context/AppContext'
import '../styles/conquistas.css'

const FILTROS = [
  { key: 'todas',         label: 'Todas' },
  { key: 'desbloqueadas', label: 'Desbloqueadas' },
  { key: 'bloqueadas',    label: 'Bloqueadas' },
]

function CardConquista({ c }) {
  const pct = Math.round((c.progresso / c.total) * 100)

  return (
    <div className={`card conquista-card${!c.desbloqueada ? ' conquista-card--bloqueada' : ''}`}>
      <div className="d-flex align-items-start gap-4">
        {c.desbloqueada ? (
          <div className={`conquista-icon conquista-icon--${c.cor}`}>
            <i className={`fa-solid ${c.icone}`}></i>
          </div>
        ) : (
          <div className={`conquista-icon conquista-icon--${c.cor} conquista-icon--stack`}>
            <i className={`fa-solid ${c.icone} conquista-icon-bg`}></i>
            <i className="fa-solid fa-lock conquista-icon-lock"></i>
          </div>
        )}
        <div className="d-flex flex-column gap-2 grow">
          <div>
            <h3 className={`conquista-nome${!c.desbloqueada ? ' text-muted' : ''}`}>{c.nome}</h3>
            <p className="conquista-desc">{c.desc}</p>
          </div>
          <div className="d-flex justify-content-between align-items-center">
            <span className="conquista-progresso-label">Progresso: {c.progresso}/{c.total}</span>
            <span className={`conquista-pct ${c.desbloqueada ? 'conquista-pct--done' : 'conquista-pct--progress'}`}>
              {pct}%
            </span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill conquista-fill--hc" style={{ width: `${pct}%` }}></div>
          </div>
          <div className="d-flex align-items-center justify-content-between">
            <span className="mission-hc"><span className="fa-solid fa-coins"></span> {c.hc} HC</span>
            {c.desbloqueada ? (
              <span className="conquista-status conquista-status--done">
                <i className="fa-regular fa-circle-check"></i>
                {c.dataDesbloqueio}
              </span>
            ) : (
              <span className="conquista-status conquista-status--locked">
                <i className="fa-solid fa-lock"></i>
                Bloqueado
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function Conquistas() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [conquistas, setConquistas] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [filtroAtivo, setFiltroAtivo] = useState('todas')
  const { totalHC } = useApp()

  useEffect(() => {
    fetch('/data/conquistas.json')
      .then(res => res.json())
      .then(data => { setConquistas(data); setCarregando(false) })
      .catch(() => {
        import('../data/conquistas.json').then(mod => {
          setConquistas(mod.default); setCarregando(false)
        })
      })
  }, [])

  const desbloqueadas = useMemo(() => conquistas.filter(c => c.desbloqueada).length, [conquistas])

  const filtradas = useMemo(() => {
    if (filtroAtivo === 'desbloqueadas') return conquistas.filter(c => c.desbloqueada)
    if (filtroAtivo === 'bloqueadas')    return conquistas.filter(c => !c.desbloqueada)
    return conquistas
  }, [conquistas, filtroAtivo])

  return (
    <>
      <button className="sidebar-toggle" aria-label="Abrir menu" onClick={() => setSidebarOpen(!sidebarOpen)}>
        <i className="fa-solid fa-bars"></i>
      </button>

      <div className="app-layout">
        <Sidebar isOpen={sidebarOpen} />

        <main className="main-content" id="main-content">

          <header className="topbar">
            <div className="d-flex align-items-center gap-3">
              <div className="conquistas-titulo-icon"><i className="fa-solid fa-trophy"></i></div>
              <div>
                <h1 className="conquistas-titulo">Conquistas</h1>
                <p className="conquistas-subtitulo">Desbloqueie medalhas completando missões</p>
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

            {/* Resumo */}
            <div className="card conquistas-resumo mb-5">
              <div className="d-flex align-items-center justify-content-between gap-4">
                <div className="d-flex flex-column gap-2 grow">
                  <h2 className="conquistas-resumo-titulo">
                    {desbloqueadas} de {conquistas.length} Conquistados
                  </h2>
                  <p className="conquistas-resumo-desc">Continue completando missões para desbloquear mais!</p>
                  <div className="progress-bar conquistas-progress-bar">
                    <div
                      className="progress-fill conquistas-progress-fill"
                      style={{ width: conquistas.length ? `${(desbloqueadas / conquistas.length) * 100}%` : '0%' }}
                    ></div>
                  </div>
                </div>
                <div className="conquistas-resumo-icon">
                  <i className="fa-solid fa-trophy"></i>
                </div>
              </div>
            </div>

            {/* Filtros */}
            <div className="d-flex gap-2 flex-wrap mb-4">
              {FILTROS.map(f => (
                <button
                  key={f.key}
                  className={`conquista-filter-tag${filtroAtivo === f.key ? ' active' : ''}`}
                  onClick={() => setFiltroAtivo(f.key)}
                  aria-pressed={filtroAtivo === f.key}
                >
                  {f.label}
                  {f.key === 'desbloqueadas' && !carregando && (
                    <span className="conquista-filter-count">{desbloqueadas}</span>
                  )}
                  {f.key === 'bloqueadas' && !carregando && (
                    <span className="conquista-filter-count">{conquistas.length - desbloqueadas}</span>
                  )}
                </button>
              ))}
            </div>

            {/* Grid de conquistas */}
            {carregando ? (
              <div className="conquistas-grid">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="card" style={{ minHeight: '120px', opacity: 0.35 }}></div>
                ))}
              </div>
            ) : filtradas.length === 0 ? (
              <p className="text-muted text-center py-5">Nenhuma conquista para este filtro.</p>
            ) : (
              <div className="conquistas-grid">
                {filtradas.map(c => <CardConquista key={c.id} c={c} />)}
              </div>
            )}

            {/* Dica */}
            <div className="conquistas-dica mt-5">
              <div className="conquistas-dica-icon"><i className="fa-solid fa-lightbulb"></i></div>
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
