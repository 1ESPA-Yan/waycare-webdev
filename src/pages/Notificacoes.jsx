import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import { useApp } from '../context/AppContext'
import '../styles/notificacoes.css'


const FILTROS = [
    { key: 'todas', label: 'Todas' },
    { key: 'missao', label: 'Missões' },
    { key: 'conquista', label: 'Conquistas' },
    { key: 'recompensa', label: 'Recompensas' },
    { key: 'descoberta', label: 'Descobertas' },
    { key: 'hc', label: 'Health Coins' },
]

function Notificacoes() {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [notificacoes, setNotificacoes] = useState([])
    const [filtroAtivo, setFiltroAtivo] = useState('todas')
    const { totalHC } = useApp()

    useEffect(() => {
        fetch('/data/notificacoes.json')
            .then(res => res.json())
            .then(data => setNotificacoes(data))
            .catch(() => {
                import('../data/notificacoes.json').then(mod => setNotificacoes(mod.default))
            })
    }, [])

    const naoLidas = notificacoes.filter(n => !n.lida).length

    const marcarTodasLidas = () => {
        setNotificacoes(prev => prev.map(n => ({ ...n, lida: true })))
    }

    const marcarLida = (id) => {
        setNotificacoes(prev => prev.map(n => n.id === id ? { ...n, lida: true } : n))
    }

    const remover = (id) => {
        setNotificacoes(prev => prev.filter(n => n.id !== id))
    }

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

                    {/* Topbar */}
                    <header className="topbar">
                        <div className="d-flex align-items-center gap-3">
                            <div className="notif-page-titulo-icon">
                                <i className="fa-solid fa-bell"></i>
                                {naoLidas > 0 && <span className="notif-page-badge">{naoLidas}</span>}
                            </div>
                            <div>
                                <h1 className="notif-page-titulo">Notificações</h1>
                                <p className="notif-page-subtitulo">
                                    {naoLidas > 0
                                        ? `${naoLidas} não lida${naoLidas > 1 ? 's' : ''}`
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

                    <section id="page-content">
                        {/* Filtros */}
                        <div className="d-flex align-items-center justify-content-between w-full mt-5 mb-4">
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

                            {naoLidas > 0 && (
                                <button
                                    className="notif-page-marcar-todas d-flex align-items-center gap-2"
                                    onClick={marcarTodasLidas}
                                >
                                    <i className="fa-solid fa-check-double"></i>
                                    Marcar todas como lidas
                                </button>
                            )}
                        </div>

                        {/* Lista */}
                        {filtradas.length > 0 ? (
                            <div className="notif-lista">
                                {filtradas.map(n => (
                                    <div
                                        key={n.id}
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
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="notif-empty">
                                <i className="fa-solid fa-bell-slash notif-empty-icon"></i>
                                <p className="notif-empty-text">Nenhuma notificação nesta categoria.</p>
                                <button
                                    className="notif-btn-detalhes"
                                    onClick={() => setFiltroAtivo('todas')}
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

export default Notificacoes