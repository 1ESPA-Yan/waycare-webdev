import { useState, useEffect, useRef, useSyncExternalStore, Suspense } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import Sidebar from './Sidebar'
import CarregandoPagina from './CarregandoPagina'
import '../styles/topbar.css'

// Mesmo ponto de quebra do CSS: abaixo dele a Sidebar vira menu deslizante
const consultaCelular = window.matchMedia('(max-width: 768px)')
const assinarCelular = (aviso) => {
  consultaCelular.addEventListener('change', aviso)
  return () => consultaCelular.removeEventListener('change', aviso)
}

// Layout das páginas do app: barra do celular, Sidebar e o conteúdo da rota
function AppLayout() {
  const celular = useSyncExternalStore(assinarCelular, () => consultaCelular.matches)
  const { pathname } = useLocation()
  const { totalHC, naoLidas } = useApp()

  // Guarda a rota em que o menu foi aberto: ao trocar de página ele fecha sozinho
  const [abertoEm, setAbertoEm] = useState(null)
  const sidebarOpen = abertoEm === pathname
  const sidebarRef = useRef(null)
  const botaoMenuRef = useRef(null)

  // Fecha o menu e devolve o foco ao botão que o abriu
  const fecharMenu = () => {
    setAbertoEm(null)
    botaoMenuRef.current?.focus()
  }

  // Menu aberto: foco no primeiro link e Esc fecha
  useEffect(() => {
    if (!sidebarOpen) return
    sidebarRef.current?.querySelector('a')?.focus()
    const aoTeclar = (e) => {
      if (e.key !== 'Escape') return
      setAbertoEm(null)
      botaoMenuRef.current?.focus()
    }
    document.addEventListener('keydown', aoTeclar)
    return () => document.removeEventListener('keydown', aoTeclar)
  }, [sidebarOpen])

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
            ref={botaoMenuRef}
            type="button"
            className="barra-mobile-menu"
            aria-label={sidebarOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-controls="sidebar"
            aria-expanded={sidebarOpen}
            onClick={() => (sidebarOpen ? fecharMenu() : setAbertoEm(pathname))}
          >
            <i className={`fa-solid ${sidebarOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
          </button>
        </div>
      </header>

      {/* Fundo escurecido atrás do menu aberto; tocar nele fecha o menu */}
      {sidebarOpen && <div className="sidebar-fundo" onClick={fecharMenu} aria-hidden="true"></div>}

      <div className="app-layout">
        {/* No celular, o menu fechado fica inerte: fora da tela, sem Tab e sem leitor de tela */}
        <Sidebar ref={sidebarRef} isOpen={sidebarOpen} inert={celular && !sidebarOpen} />

        <main className="main-content" id="main-content">
          {/* Enquanto o código da página carrega, a Sidebar continua na tela */}
          <Suspense fallback={<CarregandoPagina />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </>
  )
}

export default AppLayout
