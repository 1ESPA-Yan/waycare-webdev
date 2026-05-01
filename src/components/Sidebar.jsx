import { Link, useLocation } from 'react-router-dom'
import { useApp } from '../context/AppContext'

function Sidebar({ isOpen }) {
  const location = useLocation()
  const { mlConsumido, metaDiaria, nomeUsuario } = useApp()
  const pctWidget = Math.round((mlConsumido / metaDiaria) * 100)
  const navClass = (path) =>
    location.pathname === path ? 'nav-item active' : 'nav-item'

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`} id="sidebar" role="navigation" aria-label="Menu principal">
      <div className="sidebar-logo">
        <img src="/images/LogoWayCare.png" alt="WayCare" height="28" />
        WayCare
      </div>
      <nav className="sidebar-nav">
        <Link to="/dashboard" className={navClass('/dashboard')}><i className="fa-solid fa-house nav-icon"></i>Início</Link>
        <Link to="/trilhas" className={navClass('/trilhas')}><i className="fa-solid fa-route nav-icon"></i>Trilhas</Link>
        <Link to="/conquistas" className={navClass('/conquistas')}><i className="fa-solid fa-trophy nav-icon"></i>Conquistas</Link>
        <Link to="/descobertas" className={navClass('/descobertas')}><i className="fa-solid fa-lightbulb nav-icon"></i>Descobertas</Link>
        <Link to="/recompensas" className={navClass('/recompensas')}><i className="fa-solid fa-gifts nav-icon"></i>Recompensas</Link>
        <Link to="/perfil" className={navClass('/perfil')}><i className="fa-solid fa-user nav-icon"></i>Perfil</Link>
        <Link to="/configuracoes" className={navClass('/configuracoes')}><i className="fa-solid fa-gear nav-icon"></i>Configurações</Link>
      </nav>
      <Link to="/waycare-bottle" className="bottle-sidebar-widget">
        <div className="d-flex align-items-center gap-2 mb-2">
          <div className="bottle-widget-icon"><i className="fa-solid fa-droplet"></i></div>
          <div className="d-flex flex-column gap-0">
            <span className="bottle-widget-title">WayCare Bottle</span>
            <span className="bottle-widget-status"><span className="bottle-status-dot"></span>Conectada</span>
          </div>
        </div>
        <div className="d-flex align-items-baseline gap-1 mb-1">
          <span className="bottle-widget-ml">{mlConsumido}</span>
          <span className="bottle-widget-meta">/ {metaDiaria} ml</span>
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
          <span className="sidebar-user-level">Nível 5</span>
        </div>
        <Link to="/" className="sidebar-logout" aria-label="Sair">
          <i className="fa-solid fa-arrow-right-from-bracket"></i>
        </Link>
      </div>
    </aside>
  )
}

export default Sidebar