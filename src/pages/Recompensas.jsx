import { useState, useMemo, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import { useApp } from '../context/AppContext'
import '../styles/recompensas.css'

const FILTROS = [
  { key: 'todos', label: 'Todos' },
  { key: 'saude', label: 'Saúde & Bem-estar' },
  { key: 'experiencias', label: 'Experiências' },
  { key: 'produtos', label: 'Produtos' },
  { key: 'descontos', label: 'Descontos Care Plus' },
]

function Recompensas() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [filtroAtivo, setFiltroAtivo] = useState('todos')
  const [recompensas, setRecompensas] = useState([])
  const [carregando, setCarregando] = useState(true)
  const { totalHC } = useApp()
  const navigate = useNavigate()

  const handleResgatar = (r) => {
    navigate('/resgate/confirmar', {
      state: { recompensa: { nome: r.nome, preco: r.hc, icone: r.icone } },
    })
  }

  // Consumo do JSON local — para simular a chamada de API
  useEffect(() => {
    fetch('/data/recompensas.json')
      .then(res => res.json())
      .then(data => {
        setRecompensas(data)
        setCarregando(false)
      })
      .catch(() => {
        // faz a importação direto se o fetch falhar
        import('../data/recompensas.json').then(mod => {
          setRecompensas(mod.default)
          setCarregando(false)
        })
      })
  }, [])

  const recompensasFiltradas = useMemo(() => {
    if (filtroAtivo === 'todos') return recompensas
    return recompensas.filter(r => r.categoria === filtroAtivo)
  }, [filtroAtivo, recompensas])

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
          <header className="topbar">
            <div className="d-flex align-items-center gap-3">
              <div className="recompensas-titulo-icon">
                <i className="fa-solid fa-gift"></i>
              </div>
              <h1 className="recompensas-titulo">Catálogo de Recompensas</h1>
            </div>
            <div className="topbar-actions">
              <div className="hc-chip hc-chip--destaque">
                <span className="fa-solid fa-coins"></span>
                Seu saldo: <strong>{totalHC} HC</strong>
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

            {/* Filtros de categoria */}
            <div className="d-flex gap-2 flex-wrap mb-5">
              {FILTROS.map(f => (
                <button
                  key={f.key}
                  className={`recompensa-tag${filtroAtivo === f.key ? ' active' : ''}`}
                  onClick={() => setFiltroAtivo(f.key)}
                  aria-pressed={filtroAtivo === f.key}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Estado de carregamento */}
            {carregando && (
              <div className="d-flex justify-content-center align-items-center py-5">
                <div className="d-flex flex-column align-items-center gap-3">
                  <i className="fa-solid fa-spinner fa-spin text-primary" style={{ fontSize: '32px' }}></i>
                  <span className="text-muted">Carregando recompensas...</span>
                </div>
              </div>
            )}

            {/* Grid de recompensas */}
            {!carregando && recompensasFiltradas.length > 0 && (
              <div className="recompensas-grid">
                {recompensasFiltradas.map(r => (
                  <div key={r.id} className="recompensa-filter-item">
                    <div className="card recompensa-card">
                      <div className={`recompensa-thumb ${r.thumb}`}>
                        <i className={`fa-solid ${r.icone}`}></i>
                        {r.popular && <span className="recompensa-popular-badge">POPULAR</span>}
                      </div>
                      <div className="recompensa-info">
                        <h3 className="recompensa-nome">{r.nome}</h3>
                        <p className="recompensa-desc">{r.desc}</p>
                        <div className="recompensa-hc">
                          <span className="fa-solid fa-coins"></span>
                          {r.hc} HC
                        </div>
                        <button
                          className="btn recompensa-btn"
                          disabled={totalHC < r.hc}
                          title={totalHC < r.hc ? 'HC insuficiente' : 'Resgatar'}
                          onClick={() => handleResgatar(r)}
                        >
                          {totalHC >= r.hc ? 'Resgatar Agora' : 'HC insuficiente'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Estado vazio */}
            {!carregando && recompensasFiltradas.length === 0 && (
              <div className="recompensa-empty">
                <i className="fa-solid fa-filter-circle-xmark recompensa-empty-icon"></i>
                <p className="recompensa-empty-text">
                  Nenhuma recompensa disponível nesta categoria.
                </p>
                <button
                  className="btn recompensa-btn"
                  style={{ width: 'auto', padding: '8px 24px' }}
                  onClick={() => setFiltroAtivo('todos')}
                >
                  Ver todas
                </button>
              </div>
            )}

          </section>
        </main>
      </div>
    </>
  )
}

export default Recompensas