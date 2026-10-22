import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'

// Layout das páginas do app: botão do menu, Sidebar e o conteúdo da rota
function AppLayout() {
  const { pathname } = useLocation()

  // Guarda a rota em que o menu foi aberto: ao trocar de página ele fecha sozinho
  const [abertoEm, setAbertoEm] = useState(null)
  const sidebarOpen = abertoEm === pathname

  return (
    <>
      <button
        className="sidebar-toggle"
        aria-label="Abrir menu"
        onClick={() => setAbertoEm(sidebarOpen ? null : pathname)}
      >
        <i className="fa-solid fa-bars"></i>
      </button>

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
