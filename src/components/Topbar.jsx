import { NavLink } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import Icone from './Icone'
import '../styles/topbar.css'

// Cabeçalho das páginas do app: ícone, título, subtítulo e atalhos (HC, carteira e notificações)
function Topbar({ icone, cor = 'verde', iconeBadge = 0, titulo, aoLadoDoTitulo, subtitulo, className = '' }) {
  const { totalHC, naoLidas } = useApp()

  return (
    <header className={`topbar ${className}`}>
      <div className="topbar-identidade">
        {icone && (
          <div className={`topbar-icone topbar-icone--${cor}`} aria-hidden="true">
            <Icone nome={icone} />
            {iconeBadge > 0 && <span className="topbar-icone-badge">{iconeBadge}</span>}
          </div>
        )}
        <div className="topbar-textos">
          <div className="topbar-titulo-linha">
            <h1 className="topbar-titulo">{titulo}</h1>
            {aoLadoDoTitulo}
          </div>
          {subtitulo && <div className="topbar-subtitulo">{subtitulo}</div>}
        </div>
      </div>

      <div className="topbar-actions">
        <div className="hc-chip">
          <Icone nome="fa-coins" />
          {totalHC.toLocaleString('pt-BR')} HC
        </div>
        <NavLink to="/carteira" className="notif-btn" aria-label="Carteira">
          <Icone nome="fa-wallet" />
        </NavLink>
        <NavLink
          to="/notificacoes"
          className="notif-btn"
          aria-label={naoLidas > 0 ? `Notificações, ${naoLidas} não lidas` : 'Notificações'}
        >
          <Icone nome="fa-bell" />
          {naoLidas > 0 && <span className="notif-dot" aria-hidden="true">{naoLidas > 9 ? '9+' : naoLidas}</span>}
        </NavLink>
      </div>
    </header>
  )
}

export default Topbar
