import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import '../styles/auth.css'

function Cadastro() {
  const navigate = useNavigate()
  const { salvarUsuario } = useApp()

  // Controla em qual passo o usuário está (1, 2 ou 3)
  const [passo, setPasso] = useState(1)

  // Dados do formulário
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmaSenha, setConfirmaSenha] = useState('')
  const [aceitouTermos, setAceitouTermos] = useState(false)

  // Controla visibilidade das senhas
  const [senhaVisivel, setSenhaVisivel] = useState(false)
  const [confirmaSenhaVisivel, setConfirmaSenhaVisivel] = useState(false)

  // Subtítulos de cada passo
  const subtitulos = [
    'Passo 1 de 3 — Dados pessoais',
    'Passo 2 de 3 — Acesso',
    'Passo 3 de 3 — Confirmação',
  ]

  // Força da senha
  const temTamanho = senha.length >= 8
  const temMaiuscula = /[A-Z]/.test(senha)
  const temNumero = /[0-9]/.test(senha)
  const pontos = [temTamanho, temMaiuscula, temNumero].filter(Boolean).length
  const forcaLabels = ['', 'Fraca', 'Média', 'Forte']
  const forcaClasses = ['', 'weak', 'medium', 'strong']

  // Verifica se as senhas coincidem
  const senhasCoincidem = confirmaSenha && senha === confirmaSenha

  // Avança para o passo seguinte com validação
  const avancar = () => {
    if (passo === 1) {
      if (!nome.trim()) {
        alert('Por favor, preencha seu nome.')
        return
      }
      if (!email.trim()) {
        alert('Por favor, preencha seu e-mail.')
        return
      }
    }
    if (passo === 2) {
      if (senha.length < 8) {
        alert('A senha deve ter no mínimo 8 caracteres.')
        return
      }
      if (senha !== confirmaSenha) {
        alert('As senhas não coincidem.')
        return
      }
    }
    setPasso(passo + 1)
  }

  // Salva usuário no contexto e localStorage e redireciona
  const criarConta = () => {
    salvarUsuario(nome, email)
    navigate('/onboarding')
  }

  return (
    <div className="auth-layout">

      {/* PAINEL ESQUERDO */}
      <aside className="auth-hero">

        {/* Logo */}
        <div className="auth-hero-logo">
          <img src="/images/LogoWayCare.png" alt="WayCare" className="h-7 w-auto" />
          <span className="auth-logo-name">WayCare</span>
        </div>

        {/* Conteúdo área verde */}
        <div className="auth-hero-content">
          <h1 className="auth-hero-title">
            Crie sua conta e comece a cuidar de você
          </h1>
          <p className="auth-hero-subtitle">
            Em menos de 2 minutos você configura sua conta e já começa a ganhar recompensas.
          </p>

          {/* Passos no painel esquerdo */}
          <ul className="auth-hero-features auth-steps">
            <li className={`auth-step-item ${passo >= 1 ? 'active' : ''}`}>
              <div className="auth-feature-icon">
                <i className="fa-solid fa-id-card"></i>
              </div>
              <div className="auth-step-text">
                <small>PASSO 01</small>
                <span>Preencha seus dados pessoais</span>
              </div>
            </li>
            <li className={`auth-step-item ${passo >= 2 ? 'active' : ''}`}>
              <div className="auth-feature-icon">
                <i className="fa-solid fa-lock"></i>
              </div>
              <div className="auth-step-text">
                <small>PASSO 02</small>
                <span>Configure seu acesso seguro</span>
              </div>
            </li>
            <li className={`auth-step-item ${passo >= 3 ? 'active' : ''}`}>
              <div className="auth-feature-icon">
                <i className="fa-solid fa-file-signature"></i>
              </div>
              <div className="auth-step-text">
                <small>PASSO 03</small>
                <span>Aceite os termos e comece</span>
              </div>
            </li>
          </ul>
        </div>

        {/* Círculos decorativos */}
        <div className="auth-hero-circle auth-hero-circle--1"></div>
        <div className="auth-hero-circle auth-hero-circle--2"></div>
      </aside>

      {/* FORMULÁRIO */}
      <main className="auth-form-panel">
        <div className="auth-form-wrapper">

          {/* Cabeçalho dinâmico */}
          <div className="auth-form-header">
            <h2 className="auth-form-title">Criar conta</h2>
            <p className="auth-form-subtitle">{subtitulos[passo - 1]}</p>
          </div>

          {/* Barra de progresso */}
          <div className="auth-progress">
            <div className={`auth-progress-bar ${passo >= 1 ? 'active' : ''}`}></div>
            <div className={`auth-progress-bar ${passo >= 2 ? 'active' : ''}`}></div>
            <div className={`auth-progress-bar ${passo >= 3 ? 'active' : ''}`}></div>
          </div>

          {/* PASSO 1 — Dados pessoais */}
          {passo === 1 && (
            <div className="cadastro-step active">
              <div className="input-group">
                <label className="input-label" htmlFor="cadastro-nome">Nome completo</label>
                <div className="input-icon-wrapper">
                  <i className="fa-solid fa-user input-icon"></i>
                  <input
                    type="text"
                    id="cadastro-nome"
                    className="input-field input-with-icon"
                    placeholder="Seu nome completo"
                    autoComplete="name"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                  />
                </div>
              </div>

              <div className="input-group">
                <label className="input-label" htmlFor="cadastro-email">E-mail</label>
                <div className="input-icon-wrapper">
                  <i className="fa-regular fa-envelope input-icon"></i>
                  <input
                    type="email"
                    id="cadastro-email"
                    className="input-field input-with-icon"
                    placeholder="seu@email.com.br"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="button"
                className="btn btn-primary btn-block btn-lg auth-submit-btn"
                onClick={avancar}
              >
                Continuar
                <i className="fa-solid fa-arrow-right"></i>
              </button>

              <div className="auth-footer-text">
                <p>Já tem conta?</p>
                <Link to="/" className="auth-link auth-link-bold">
                  Entrar <i className="fa-solid fa-arrow-right"></i>
                </Link>
              </div>
            </div>
          )}

          {/* PASSO 2 — Acesso seguro */}
          {passo === 2 && (
            <div className="cadastro-step active">
              <div className="input-group">
                <label className="input-label" htmlFor="cadastro-senha">Senha</label>
                <div className="input-icon-wrapper">
                  <i className="fa-solid fa-lock input-icon"></i>
                  <input
                    type={senhaVisivel ? 'text' : 'password'}
                    id="cadastro-senha"
                    className="input-field input-with-icon input-with-icon-right"
                    placeholder="Mínimo 8 caracteres"
                    autoComplete="new-password"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                  />
                  <button
                    type="button"
                    className="input-toggle-password"
                    onClick={() => setSenhaVisivel(!senhaVisivel)}
                  >
                    <i className={senhaVisivel ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye'}></i>
                  </button>
                </div>

                {/* Indicador de força da senha */}
                <div className="password-strength">
                  <div className="password-strength-bars">
                    <div className={`strength-bar ${pontos >= 1 ? forcaClasses[pontos] : ''}`}></div>
                    <div className={`strength-bar ${pontos >= 2 ? forcaClasses[pontos] : ''}`}></div>
                    <div className={`strength-bar ${pontos >= 3 ? forcaClasses[pontos] : ''}`}></div>
                  </div>
                  <span className="password-strength-label">
                    {pontos > 0 ? forcaLabels[pontos] : ''}
                  </span>
                </div>

                {/* Critérios */}
                <div className="password-criteria">
                  <span className={`criteria-item ${temTamanho ? 'valid' : ''}`}>
                    <i className={temTamanho ? 'fa-solid fa-circle-check' : 'fa-regular fa-circle-check'}></i>
                    {' '}Mínimo 8 caracteres
                  </span>
                  <span className={`criteria-item ${temMaiuscula ? 'valid' : ''}`}>
                    <i className={temMaiuscula ? 'fa-solid fa-circle-check' : 'fa-regular fa-circle-check'}></i>
                    {' '}Letra maiúscula
                  </span>
                  <span className={`criteria-item ${temNumero ? 'valid' : ''}`}>
                    <i className={temNumero ? 'fa-solid fa-circle-check' : 'fa-regular fa-circle-check'}></i>
                    {' '}Número
                  </span>
                </div>
              </div>

              {/* Confirmar senha */}
              <div className="input-group">
                <label className="input-label" htmlFor="cadastro-confirma-senha">Confirmar senha</label>
                <div className="input-icon-wrapper">
                  <i className="fa-solid fa-lock input-icon"></i>
                  <input
                    type={confirmaSenhaVisivel ? 'text' : 'password'}
                    id="cadastro-confirma-senha"
                    className="input-field input-with-icon input-with-icon-right"
                    placeholder="Repita a senha"
                    autoComplete="new-password"
                    value={confirmaSenha}
                    onChange={(e) => setConfirmaSenha(e.target.value)}
                  />
                  <button
                    type="button"
                    className="input-toggle-password"
                    onClick={() => setConfirmaSenhaVisivel(!confirmaSenhaVisivel)}
                  >
                    <i className={confirmaSenhaVisivel ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye'}></i>
                  </button>
                </div>
                {confirmaSenha && (
                  <span className={`password-match-msg ${senhasCoincidem ? 'match-ok' : 'match-error'}`}>
                    {senhasCoincidem ? '✓ Senhas coincidem' : '✗ Senhas não coincidem'}
                  </span>
                )}
              </div>

              <div className="auth-btn-row">
                <button type="button" className="btn btn-ghost auth-back-btn" onClick={() => setPasso(1)}>
                  <i className="fa-solid fa-arrow-left"></i>
                </button>
                <button type="button" className="btn btn-primary btn-lg auth-submit-btn auth-submit-flex" onClick={avancar}>
                  Continuar
                  <i className="fa-solid fa-arrow-right"></i>
                </button>
              </div>

              <div className="auth-footer-text">
                <p>Já tem conta?</p>
                <Link to="/login" className="auth-link auth-link-bold">
                  Entrar <i className="fa-solid fa-arrow-right"></i>
                </Link>
              </div>
            </div>
          )}

          {/* PASSO 3 — Confirmação e LGPD */}
          {passo === 3 && (
            <div className="cadastro-step active">

              {/* Resumo */}
              <div className="cadastro-resumo">
                <h4 className="cadastro-resumo-title">Resumo do cadastro</h4>
                <div className="resumo-row">
                  <span className="resumo-label">Nome</span>
                  <span className="resumo-value">{nome || '—'}</span>
                </div>
                <div className="resumo-row">
                  <span className="resumo-label">E-mail</span>
                  <span className="resumo-value">{email || '—'}</span>
                </div>
              </div>

              {/* LGPD */}
              <div className="cadastro-lgpd">
                <div className="lgpd-icon">
                  <i className="fa-solid fa-shield-halved"></i>
                </div>
                <div className="lgpd-text">
                  <strong>Proteção de Dados (LGPD)</strong>
                  <p>
                    Seus dados serão usados exclusivamente para personalizar sua experiência no WayCare.
                    Não compartilhamos informações pessoais com terceiros sem sua autorização.
                  </p>
                </div>
              </div>

              {/* Checkbox */}
              <label className="checkbox-group">
                <input
                  type="checkbox"
                  checked={aceitouTermos}
                  onChange={(e) => setAceitouTermos(e.target.checked)}
                />
                <span className="text-sm">
                  Concordo com a <a href="#" className="auth-link">Política de Privacidade</a>
                  {' '}e os <a href="#" className="auth-link">Termos de Uso</a>
                  {' '}do WayCare e autorizo o tratamento dos meus dados pessoais conforme descrito.
                </span>
              </label>

              <div className="auth-btn-row">
                <button type="button" className="btn btn-ghost auth-back-btn" onClick={() => setPasso(2)}>
                  <i className="fa-solid fa-arrow-left"></i>
                </button>
                <button
                  type="button"
                  className="btn btn-primary btn-lg auth-submit-btn auth-submit-flex"
                  disabled={!aceitouTermos}
                  onClick={criarConta}
                >
                  Criar conta
                  <i className="fa-solid fa-arrow-right"></i>
                </button>
              </div>

              <div className="auth-footer-text">
                <p>Já tem conta?</p>
                <Link to="/login" className="auth-link auth-link-bold">
                  Entrar <i className="fa-solid fa-arrow-right"></i>
                </Link>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  )
}

export default Cadastro