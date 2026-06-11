import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import Sidebar from '../components/Sidebar'
import { useApp } from '../context/AppContext'
import '../styles/notificacoes.css'

const FILTROS = [
  { key: 'todas',      label: 'Todas' },
  { key: 'missao',     label: 'Missões' },
  { key: 'conquista',  label: 'Conquistas' },
  { key: 'recompensa', label: 'Recompensas' },
  { key: 'descoberta', label: 'Descobertas' },
  { key: 'hc',         label: 'Health Coins' },
]

function Notificacoes() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notificacoes, setNotificacoes] = useState([])
  const [filtroAtivo, setFiltroAtivo] = useState('todas')
  const { totalHC, setNaoLidas } = useApp()

  useEffect(() => {
    fetch('/data/notificacoes.json')
      .then(res => res.json())
      .then(data => setNotificacoes(data))
      .catch(() => {
        import('../data/notificacoes.json').then(mod => setNotificacoes(mod.default))
      })
  }, [])

  // Sincroniza contador global sempre que a lista muda
  useEffect(() => {
    setNaoLidas(notificacoes.filter(n => !n.lida).length)
  }, [notificacoes])

  const naoLidasCount = notificacoes.filter(n => !n.lida).length

  const marcarTodasLidas = () =>
    setNotificacoes(prev => prev.map(n => ({ ...n, lida: true })))

  const marcarLida = (id) =>
    setNotificacoes(prev => prev.map(n => n.id === id ? { ...n, lida: true } : n))

  const remover = (id) =>
    setNotificacoes(prev => prev.filter(n => n.id !== id))

  const limparTodas = () => setNotificacoes([])

  const filtradas = notificacoes.filter(n =>
    filtroAtivo === 'todas' || n.tipo === filtroAtivo
  )

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
              <div className="notif-page-titulo-icon">
                <i className="fa-solid fa-bell"></i>
                {naoLidasCount > 0 && (
                  <span className="notif-page-badge">{naoLidasCount}</span>
                )}
              </div>
              <div>
                <h1 className="notif-page-titulo">Notificações</h1>
                <p className="notif-page-subtitulo">
                  {naoLidasCount > 0
                    ? `${naoLidasCount} não lida${naoLidasCount > 1 ? 's' : ''}`
                    : 'Tudo em dia!'}
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
            </div>
          </header>

          <section id="page-content" className="page-transition">

            {/* Barra de ações */}
            <div className="d-flex align-items-center justify-content-between w-full mb-4 flex-wrap gap-3">
              <div className="d-flex gap-2 flex-wrap">
                {FILTROS.map(f => (
                  <button
                    key={f.key}
                    className={`notif-tag${filtroAtivo === f.key ? ' active' : ''}`}
                    onClick={() => setFiltroAtivo(f.key)}
                    aria-pressed={filtroAtivo === f.key}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <div className="d-flex gap-3 align-items-center">
                {naoLidasCount > 0 && (
                  <button
                    className="notif-page-marcar-todas d-flex align-items-center gap-2"
                    onClick={marcarTodasLidas}
                  >
                    <i className="fa-solid fa-check-double"></i>
                    Marcar todas como lidas
                  </button>
                )}
                {notificacoes.length > 0 && (
                  <button
                    className="notif-page-limpar d-flex align-items-center gap-2"
                    onClick={limparTodas}
                  >
                    <i className="fa-solid fa-trash-can"></i>
                    Limpar tudo
                  </button>
                )}
              </div>
            </div>

            {/* Lista */}
            {filtradas.length > 0 ? (
              <div className="notif-lista">
                <AnimatePresence initial={false}>
                  {filtradas.map(n => (
                    <motion.div
                      key={n.id}
                      layout
                      initial={{ opacity: 0, y: -12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 40, transition: { duration: 0.18 } }}
                      transition={{ duration: 0.22, ease: 'easeOut' }}
                      className={`notif-item${n.lida ? '' : ' notif-item--nao-lida'}`}
                    >
                      {!n.lida && <span className="notif-item-dot"></span>}
                      <div className={`notif-item-icone notif-item-icone--${n.cor}`}>
                        <i className={`fa-solid ${n.icone}`}></i>
                      </div>
                      <div className="notif-item-corpo">
                        <div className="notif-item-cabecalho">
                          <span className="notif-item-titulo">{n.titulo}</span>
                          <span className="notif-item-tempo">{n.tempo}</span>
                        </div>
                        <p className="notif-item-desc">{n.descricao}</p>
                        <div className="notif-item-acoes">
                          <button className="notif-btn-detalhes">Ver detalhes</button>
                          {!n.lida && (
                            <button
                              className="notif-btn-icone"
                              aria-label="Marcar como lida"
                              onClick={() => marcarLida(n.id)}
                            >
                              <i className="fa-solid fa-check"></i>
                            </button>
                          )}
                          <button
                            className="notif-btn-icone notif-btn-icone--remover"
                            aria-label="Remover"
                            onClick={() => remover(n.id)}
                          >
                            <i className="fa-solid fa-xmark"></i>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="notif-empty">
                <i className="fa-solid fa-bell-slash notif-empty-icon"></i>
                <p className="notif-empty-text">
                  {notificacoes.length === 0
                    ? 'Nenhuma notificação por aqui.'
                    : 'Nenhuma notificação nesta categoria.'}
                </p>
                {filtroAtivo !== 'todas' && (
                  <button className="notif-btn-detalhes" onClick={() => setFiltroAtivo('todas')}>
                    Ver todas
                  </button>
                )}
              </div>
            )}

          </section>
        </main>
      </div>
    </>
  )
}

export default Notificacoes
