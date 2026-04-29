import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../styles/auth.css'

function Login() {
  // Controla se a senha está visível ou não
  const [senhaVisivel, setSenhaVisivel] = useState(false)

  // useNavigate permite redirecionar para outra página via código
  const navigate = useNavigate()

  // Submit do formulário — redireciona para o dashboard
  const handleSubmit = (e) => {
    e.preventDefault()
    navigate('/dashboard')
  }

  return (
    <div className="auth-layout">

      {/* PAINEL ESQUERDO */}
      <aside className="auth-hero">

        {/* Logo */}
        <div className="auth-hero-logo">
          <img src="/images/LogoWayCare.png" alt="WayCare" height="36" />
          <span className="auth-logo-name">WayCare</span>
        </div>

        {/* Conteúdo área verde */}
        <div className="auth-hero-content">
          <h1 className="auth-hero-title">
            Sua jornada de bem-estar começa aqui.
          </h1>
          <p className="auth-hero-subtitle">
            Hábitos saudáveis, trilhas personalizadas e recompensas que fazem a diferença no seu dia a dia.
          </p>

          <ul className="auth-hero-features">
            <li>
              <div className="auth-feature-icon">
                <i className="fa-solid fa-route"></i>
              </div>
              <span>Trilhas personalizadas pelo seu humor</span>
            </li>
            <li>
              <div className="auth-feature-icon">
                <i className="fa-solid fa-coins"></i>
              </div>
              <span>Ganhe Health Coins por cada hábito</span>
            </li>
            <li>
              <div className="auth-feature-icon">
                <i className="fa-solid fa-trophy"></i>
              </div>
              <span>Conquistas e recompensas exclusivas</span>
            </li>
            <li>
              <div className="auth-feature-icon">
                <i className="fa-solid fa-chart-line"></i>
              </div>
              <span>Acompanhe sua evolução em tempo real</span>
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

          <div className="auth-form-header">
            <h2 className="auth-form-title">Entrar na conta</h2>
            <p className="auth-form-subtitle">Acesse com seu e-mail cadastrado</p>
          </div>

          <form className="auth-form" noValidate onSubmit={handleSubmit}>

            {/* E-mail */}
            <div className="input-group">
              <label className="input-label" htmlFor="login-email">E-mail</label>
              <div className="input-icon-wrapper">
                <i className="fa-regular fa-envelope input-icon"></i>
                <input
                  type="email"
                  id="login-email"
                  className="input-field input-with-icon"
                  placeholder="seu@email.com.br"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            {/* Senha */}
            <div className="input-group">
              <div className="input-label-row">
                <label className="input-label" htmlFor="login-senha">Senha</label>
                <a href="#" className="auth-link text-sm">Esqueci a senha</a>
              </div>
              <div className="input-icon-wrapper">
                <i className="fa-solid fa-lock input-icon"></i>
                <input
                  type={senhaVisivel ? 'text' : 'password'}
                  id="login-senha"
                  className="input-field input-with-icon input-with-icon-right"
                  placeholder="Mínimo 6 caracteres"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="input-toggle-password"
                  aria-label="Mostrar senha"
                  onClick={() => setSenhaVisivel(!senhaVisivel)}
                >
                  <i className={senhaVisivel ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye'}></i>
                </button>
              </div>
            </div>

            {/* Botão entrar */}
            <button type="submit" className="btn btn-primary btn-block btn-lg auth-submit-btn">
              Entrar
              <i className="fa-solid fa-arrow-right"></i>
            </button>

            {/* Divisor */}
            <div className="auth-divider">
              <span>ou</span>
            </div>

            {/* Link cadastro */}
            <div className="auth-footer-text">
              <p>Ainda não tem conta?</p>
              <Link to="/cadastro" className="auth-link auth-link-bold">
                Criar conta gratuitamente
                <i className="fa-solid fa-arrow-right"></i>
              </Link>
            </div>

          </form>

          {/* Termos */}
          <p className="auth-terms">
            Ao entrar, você concorda com a{' '}
            <a href="#" className="auth-link">Política de Privacidade</a>
            {' '}e os{' '}
            <a href="#" className="auth-link">Termos de Uso</a>
            {' '}do WayCare.
          </p>

        </div>
      </main>
    </div>
  )
}

export default Login