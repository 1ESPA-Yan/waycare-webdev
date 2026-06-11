import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import { useApp } from '../context/AppContext'
import '../styles/configuracoes.css'

function CampoEditavel({ label, valor, tipo = 'text', unidade, onSalvar }) {
  const [editando, setEditando] = useState(false)
  const [rascunho, setRascunho] = useState(String(valor))
  const [salvo, setSalvo] = useState(false)

  const handleSalvar = () => {
    const v = tipo === 'number' ? Number(rascunho) : rascunho.trim()
    if (!v) return
    onSalvar(v)
    setEditando(false)
    setSalvo(true)
    setTimeout(() => setSalvo(false), 2000)
  }

  const handleCancelar = () => {
    setRascunho(String(valor))
    setEditando(false)
  }

  if (editando) {
    return (
      <div className="config-row config-row--editing">
        <div className="config-row-info grow">
          <span className="config-row-label">{label}</span>
          <div className="config-edit-wrap">
            <input
              className="config-edit-input"
              type={tipo}
              value={rascunho}
              onChange={e => setRascunho(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleSalvar(); if (e.key === 'Escape') handleCancelar() }}
              autoFocus
              min={tipo === 'number' ? 500 : undefined}
              max={tipo === 'number' ? 5000 : undefined}
            />
            {unidade && <span className="config-edit-unidade">{unidade}</span>}
          </div>
        </div>
        <div className="d-flex gap-2">
          <button className="config-row-action config-row-action--save" onClick={handleSalvar}>Salvar</button>
          <button className="config-row-action config-row-action--cancel" onClick={handleCancelar}>Cancelar</button>
        </div>
      </div>
    )
  }

  return (
    <div className="config-row">
      <div className="config-row-info">
        <span className="config-row-label">{label}</span>
        <span className="config-row-valor">
          {valor}{unidade ? ` ${unidade}` : ''}
          {salvo && <span className="config-salvo-badge"><i className="fa-solid fa-check"></i> Salvo</span>}
        </span>
      </div>
      <button className="config-row-action" onClick={() => { setRascunho(String(valor)); setEditando(true) }}>
        Editar
      </button>
    </div>
  )
}

function Configuracoes() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()
  const { totalHC, nomeUsuario, emailUsuario, salvarUsuario, metaDiaria, setMetaDiaria } = useApp()

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
              <div className="config-titulo-icon">
                <i className="fa-solid fa-gear"></i>
              </div>
              <div>
                <h1 className="config-titulo">Configurações</h1>
                <p className="config-subtitulo">Personalize sua experiência WayCare</p>
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
              <Link to="/notificacoes" className="notif-btn" aria-label="Notificações">
                <i className="fa-solid fa-bell"></i>
                <span className="notif-dot"></span>
              </Link>
            </div>
          </header>

          <section id="page-content" className="page-transition">

            {/* Informações da Conta */}
            <div className="card config-section mb-4">
              <h2 className="config-section-titulo mb-4">Informações da Conta</h2>

              <CampoEditavel
                label="Nome"
                valor={nomeUsuario}
                onSalvar={nome => salvarUsuario(nome, emailUsuario)}
              />

              <div className="config-divider"></div>

              <CampoEditavel
                label="E-mail"
                valor={emailUsuario}
                tipo="email"
                onSalvar={email => salvarUsuario(nomeUsuario, email)}
              />

              <div className="config-divider"></div>

              <div className="config-row">
                <div className="config-row-info">
                  <span className="config-row-label">Senha</span>
                  <span className="config-row-valor config-senha">••••••••</span>
                </div>
                <button className="config-row-action">Alterar</button>
              </div>
            </div>

            {/* Saúde & Metas */}
            <div className="card config-section mb-4">
              <h2 className="config-section-titulo mb-4">Saúde & Metas</h2>

              <CampoEditavel
                label="Meta diária de hidratação"
                valor={metaDiaria}
                tipo="number"
                unidade="ml"
                onSalvar={v => setMetaDiaria(Number(v))}
              />

              <div className="config-divider"></div>

              <div className="config-row">
                <div className="config-row-info">
                  <span className="config-row-label">Humor atual</span>
                  <span className="config-row-valor">Atualizado diariamente</span>
                </div>
                <Link to="/humor" className="config-row-action">Mudar →</Link>
              </div>
            </div>

            {/* Notificações */}
            <div className="card config-item-card mb-4">
              <div className="d-flex align-items-center gap-4">
                <div className="config-item-icon config-item-icon--green">
                  <i className="fa-solid fa-bell"></i>
                </div>
                <div className="d-flex flex-column gap-1 grow">
                  <span className="config-item-titulo">Notificações</span>
                  <span className="config-item-desc">Gerencie suas preferências de notificação</span>
                </div>
                <Link to="/notificacoes" className="config-row-action config-row-action--arrow">Configurar →</Link>
              </div>
            </div>

            {/* Privacidade e Dados */}
            <div className="card config-item-card mb-4">
              <div className="d-flex align-items-center gap-4">
                <div className="config-item-icon config-item-icon--blue">
                  <i className="fa-solid fa-shield-halved"></i>
                </div>
                <div className="d-flex flex-column gap-1 grow">
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
                <div className="d-flex flex-column gap-1 grow">
                  <span className="config-item-titulo">Aparência</span>
                  <span className="config-item-desc">Personalize cores e tema</span>
                </div>
                <a href="#" className="config-row-action config-row-action--arrow">Personalizar →</a>
              </div>
            </div>

            {/* Zona de Perigo */}
            <div className="card config-section mb-4">
              <h2 className="config-section-titulo mb-4">Zona de Perigo</h2>

              <div className="config-perigo-item config-perigo-item--warning">
                <div className="d-flex align-items-center gap-3 grow">
                  <i className="fa-solid fa-arrow-right-from-bracket config-perigo-icon config-perigo-icon--warning"></i>
                  <div className="d-flex flex-column gap-1">
                    <span className="config-perigo-titulo">Sair da Conta</span>
                    <span className="config-perigo-desc">Você pode voltar a qualquer momento</span>
                  </div>
                </div>
                <Link to="/" className="config-perigo-action config-perigo-action--warning">
                  Sair →
                </Link>
              </div>

              <div className="config-perigo-item config-perigo-item--error mt-3">
                <div className="d-flex align-items-center gap-3 grow">
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
