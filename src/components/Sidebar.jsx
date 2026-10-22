import { Link, NavLink } from 'react-router-dom'
import { useApp } from '../context/AppContext'

function Sidebar({ isOpen, inert, ref }) {
  const { consumidoHoje, metaHoje, nomeUsuario, usandoReal, statusDock, nivel, sairDaConta } = useApp()
  const pctWidget = Math.min(100, Math.round((consumidoHoje / metaHoje) * 100))

  return (
    <aside ref={ref} inert={inert} className={`sidebar ${isOpen ? 'open' : ''}`} id="sidebar">
      <div className="sidebar-logo">
        <img src="/images/logo-64.png" alt="WayCare" width="28" height="28" className="h-7 w-auto" />
        WayCare
      </div>
      <nav className="sidebar-nav" aria-label="Menu principal">
        <NavLink to="/dashboard" className="nav-item"><i className="fa-solid fa-house nav-icon"></i>Início</NavLink>
        <NavLink to="/trilhas" className="nav-item"><i className="fa-solid fa-route nav-icon"></i>Trilhas</NavLink>
        <NavLink to="/conquistas" className="nav-item"><i className="fa-solid fa-trophy nav-icon"></i>Conquistas</NavLink>
        <NavLink to="/descobertas" className="nav-item"><i className="fa-solid fa-lightbulb nav-icon"></i>Descobertas</NavLink>
        <NavLink to="/recompensas" className="nav-item"><i className="fa-solid fa-gifts nav-icon"></i>Recompensas</NavLink>
        <NavLink to="/perfil" className="nav-item"><i className="fa-solid fa-user nav-icon"></i>Perfil</NavLink>
        <NavLink to="/configuracoes" className="nav-item"><i className="fa-solid fa-gear nav-icon"></i>Configurações</NavLink>
      </nav>
      <Link to="/waycare-bottle" className="bottle-sidebar-widget">
        <div className="d-flex align-items-center gap-2 mb-2">
          <div className="bottle-widget-icon"><i className="fa-solid fa-droplet"></i></div>
          <div className="d-flex flex-column gap-0">
            <span className="bottle-widget-title">WayCare Bottle</span>
            <span className="bottle-widget-status">
              <span className="bottle-status-dot" style={{ backgroundColor: usandoReal && statusDock?.online ? '' : 'var(--color-text-muted)' }}></span>
              {usandoReal && statusDock?.online ? 'Conectada' : usandoReal ? 'Offline' : 'Demo'}
            </span>
          </div>
        </div>
        <div className="d-flex align-items-baseline gap-1 mb-1">
          <span className="bottle-widget-ml">{consumidoHoje}</span>
          <span className="bottle-widget-meta">/ {metaHoje} ml</span>
        </div>
        <div className="progress-bar bottle-widget-bar">
          <div className="progress-fill bottle-widget-fill" style={{ width: `${pctWidget}%` }}></div>
        </div>
        <span className="bottle-widget-pct">{pctWidget}% da meta</span>
      </Link>
      <div className="sidebar-user">
        <div className="avatar" aria-hidden="true">{nomeUsuario.charAt(0).toUpperCase()}</div>
        <div className="sidebar-user-info">
          <span className="sidebar-user-name">{nomeUsuario}</span>
          <span className="sidebar-user-level">Nível {nivel}</span>
        </div>
        <Link to="/" replace onClick={sairDaConta} className="sidebar-logout" aria-label="Sair">
          <i className="fa-solid fa-arrow-right-from-bracket"></i>
        </Link>
      </div>
    </aside>
  )
}

export default Sidebar