import { Link, NavLink } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import Icone from '../components/Icone'

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
        <NavLink to="/dashboard" className="nav-item"><Icone nome="fa-house" className="nav-icon" />Início</NavLink>
        <NavLink to="/trilhas" className="nav-item"><Icone nome="fa-route" className="nav-icon" />Trilhas</NavLink>
        <NavLink to="/conquistas" className="nav-item"><Icone nome="fa-trophy" className="nav-icon" />Conquistas</NavLink>
        <NavLink to="/descobertas" className="nav-item"><Icone nome="fa-lightbulb" className="nav-icon" />Descobertas</NavLink>
        <NavLink to="/recompensas" className="nav-item"><Icone nome="fa-gifts" className="nav-icon" />Recompensas</NavLink>
        <NavLink to="/perfil" className="nav-item"><Icone nome="fa-user" className="nav-icon" />Perfil</NavLink>
        <NavLink to="/configuracoes" className="nav-item"><Icone nome="fa-gear" className="nav-icon" />Configurações</NavLink>
      </nav>
      <Link to="/waycare-bottle" className="bottle-sidebar-widget">
        <div className="flex items-center gap-2 mb-2">
          <div className="bottle-widget-icon"><Icone nome="fa-droplet" /></div>
          <div className="flex flex-col gap-0">
            <span className="bottle-widget-title">WayCare Bottle</span>
            <span className="bottle-widget-status">
              <span className="bottle-status-dot" style={{ backgroundColor: usandoReal && statusDock?.online ? '' : 'var(--color-text-muted)' }}></span>
              {usandoReal && statusDock?.online ? 'Conectada' : usandoReal ? 'Offline' : 'Demo'}
            </span>
          </div>
        </div>
        <div className="flex items-baseline gap-1 mb-1">
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
          <Icone nome="fa-arrow-right-from-bracket" />
        </Link>
      </div>
    </aside>
  )
}

export default Sidebar