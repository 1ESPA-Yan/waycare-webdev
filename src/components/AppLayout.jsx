import { useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import Sidebar from './Sidebar'
import '../styles/topbar.css'

// Layout das páginas do app: barra do celular, Sidebar e o conteúdo da rota
function AppLayout() {
  const { pathname } = useLocation()
  const { totalHC, naoLidas } = useApp()

  // Guarda a rota em que o menu foi aberto: ao trocar de página ele fecha sozinho
  const [abertoEm, setAbertoEm] = useState(null)
  const sidebarOpen = abertoEm === pathname

  return (
    <>
      {/* Barra fixa do celular (abaixo de 768px): logo à esquerda; HC, sino e menu à direita */}
      <header className="barra-mobile">
        <Link to="/dashboard" className="barra-mobile-logo">
          <img src="/images/logo-64.png" alt="" width="28" height="28" />
          WayCare
        </Link>
        <div className="barra-mobile-acoes">
          <Link to="/carteira" className="hc-chip" aria-label={`Carteira: ${totalHC.toLocaleString('pt-BR')} HC`}>
            <i className="fa-solid fa-coins"></i>
            {totalHC.toLocaleString('pt-BR')}
          </Link>
          <NavLink
            to="/notificacoes"
            className="notif-btn"
            aria-label={naoLidas > 0 ? `Notificações, ${naoLidas} não lidas` : 'Notificações'}
          >
            <i className="fa-solid fa-bell"></i>
            {naoLidas > 0 && <span className="notif-dot" aria-hidden="true">{naoLidas > 9 ? '9+' : naoLidas}</span>}
          </NavLink>
          <button
            type="button"
            className="barra-mobile-menu"
            aria-label="Abrir menu"
            aria-controls="sidebar"
            aria-expanded={sidebarOpen}
            onClick={() => setAbertoEm(sidebarOpen ? null : pathname)}
          >
            <i className="fa-solid fa-bars"></i>
          </button>
        </div>
      </header>

      <div className="app-layout">
        <Sidebar isOpen={sidebarOpen} />

        <main className="main-content" id="main-content">
          <Outlet />
        </main>
      </div>
    </>
  )
}

export default AppLayout
