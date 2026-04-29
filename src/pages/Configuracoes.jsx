import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import '../styles/configuracoes.css'

function Configuracoes() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <>
      {/* Botão hamburguer — só aparece no mobile */}
      <button
        className="sidebar-toggle"
        aria-label="Abrir menu"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <i className="fa-solid fa-bars"></i>
      </button>

      <div className="app-layout">
        <div className={sidebarOpen ? 'open' : ''}>
          <Sidebar />
        </div>

        <main className="main-content" id="main-content">

          {/* Topbar */}
          <header className="topbar">
            <Link to="/perfil" className="config-voltar">
              <i className="fa-solid fa-arrow-left"></i>
              Voltar
            </Link>
            <div className="topbar-actions">
              <div className="hc-chip">
                <i className="fa-solid fa-coins"></i>
                1300 HC
              </div>
              <button className="notif-btn" aria-label="Notificações">
                <i className="fa-solid fa-bell"></i>
                <span className="notif-dot"></span>
              </button>
            </div>
          </header>

          <section id="page-content" className="page-transition">

            {/* Título da página */}
            <div className="d-flex align-items-center gap-3 mb-5">
              <div className="config-titulo-icon">
                <i className="fa-solid fa-gear"></i>
              </div>
              <h1 className="config-titulo">Configurações</h1>
            </div>

            {/* Informações da Conta */}
            <div className="card config-section mb-4">
              <h2 className="config-section-titulo mb-4">Informações da Conta</h2>

              <div className="config-row">
                <div className="config-row-info">
                  <span className="config-row-label">Nome</span>
                  <span className="config-row-valor">João Victor</span>
                </div>
                <a href="#" className="config-row-action">Editar</a>
              </div>

              <div className="config-divider"></div>

              <div className="config-row">
                <div className="config-row-info">
                  <span className="config-row-label">E-mail</span>
                  <span className="config-row-valor">joao.victor@email.com</span>
                </div>
                <a href="#" className="config-row-action">Editar</a>
              </div>

              <div className="config-divider"></div>

              <div className="config-row">
                <div className="config-row-info">
                  <span className="config-row-label">Senha</span>
                  <span className="config-row-valor config-senha">••••••••</span>
                </div>
                <a href="#" className="config-row-action">Alterar</a>
              </div>
            </div>

            {/* Notificações */}
            <div className="card config-item-card mb-4">
              <div className="d-flex align-items-center gap-4">
                <div className="config-item-icon config-item-icon--green">
                  <i className="fa-solid fa-bell"></i>
                </div>
                <div className="d-flex flex-column gap-1 flex-grow-1">
                  <span className="config-item-titulo">Notificações</span>
                  <span className="config-item-desc">Gerencie suas preferências de notificação</span>
                </div>
                <a href="#" className="config-row-action config-row-action--arrow">Configurar →</a>
              </div>
            </div>

            {/* Privacidade e Dados */}
            <div className="card config-item-card mb-4">
              <div className="d-flex align-items-center gap-4">
                <div className="config-item-icon config-item-icon--blue">
                  <i className="fa-solid fa-shield-halved"></i>
                </div>
                <div className="d-flex flex-column gap-1 flex-grow-1">
                  <span className="config-item-titulo">Privacidade e Dados</span>
                  <span className="config-item-desc">Controle seus dados e privacidade</span>
                </div>
                <a href="#" className="config-row-action config-row-action--arrow">Gerenciar →</a>
              </div>
            </div>

            {/* Aparência */}
            <div className="card config-item-card mb-4">
              <div className="d-flex align-items-center gap-4">
                <div className="config-item-icon config-item-icon--orange">
                  <i className="fa-solid fa-palette"></i>
                </div>
                <div className="d-flex flex-column gap-1 flex-grow-1">
                  <span className="config-item-titulo">Aparência</span>
                  <span className="config-item-desc">Personalize cores e tema</span>
                </div>
                <a href="#" className="config-row-action config-row-action--arrow">Personalizar →</a>
              </div>
            </div>

            {/* Zona de Perigo */}
            <div className="card config-section mb-4">
              <h2 className="config-section-titulo mb-4">Zona de Perigo</h2>

              {/* Sair da Conta */}
              <div className="config-perigo-item config-perigo-item--warning">
                <div className="d-flex align-items-center gap-3 flex-grow-1">
                  <i className="fa-solid fa-arrow-right-from-bracket config-perigo-icon config-perigo-icon--warning"></i>
                  <div className="d-flex flex-column gap-1">
                    <span className="config-perigo-titulo">Sair da Conta</span>
                    <span className="config-perigo-desc">Você pode voltar a qualquer momento</span>
                  </div>
                </div>
                <Link to="/login" className="config-perigo-action config-perigo-action--warning">
                  Sair →
                </Link>
              </div>

              {/* Excluir Conta */}
              <div className="config-perigo-item config-perigo-item--error mt-3">
                <div className="d-flex align-items-center gap-3 flex-grow-1">
                  <i className="fa-solid fa-shield-halved config-perigo-icon config-perigo-icon--error"></i>
                  <div className="d-flex flex-column gap-1">
                    <span className="config-perigo-titulo">Excluir Conta</span>
                    <span className="config-perigo-desc">Esta ação não pode ser desfeita</span>
                  </div>
                </div>
                <a href="#" className="config-perigo-action config-perigo-action--error">Excluir →</a>
              </div>
            </div>

            {/* Sobre */}
            <div className="card config-section">
              <h2 className="config-section-titulo mb-4">Sobre</h2>

              <div className="config-row">
                <span className="config-row-label">Versão</span>
                <span className="config-row-valor">1.0.0</span>
              </div>

              <div className="config-divider"></div>

              <div className="config-row">
                <span className="config-row-label">Termos de Uso</span>
                <a href="#" className="config-row-action">Ver →</a>
              </div>

              <div className="config-divider"></div>

              <div className="config-row">
                <span className="config-row-label">Política de Privacidade</span>
                <a href="#" className="config-row-action">Ver →</a>
              </div>

              <div className="config-divider"></div>

              <div className="config-row">
                <span className="config-row-label">Suporte</span>
                <a href="#" className="config-row-action">Contato →</a>
              </div>
            </div>

          </section>
        </main>
      </div>
    </>
  )
}

export default Configuracoes