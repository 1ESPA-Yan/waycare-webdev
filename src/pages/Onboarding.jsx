import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../styles/onboarding.css'

function Onboarding() {
  const navigate = useNavigate()

  // Controla em qual tela o usuário está (1, 2 ou 3)
  const [step, setStep] = useState(1)

  // Controla os 3 checkboxes da tela de LGPD
  const [aceitouTermos, setAceitouTermos] = useState(false)
  const [aceitouPrivacidade, setAceitouPrivacidade] = useState(false)
  const [aceitouDados, setAceitouDados] = useState(false)

  // Botão "Aceitar e Continuar" só ativa quando todos os 3 estão marcados
  const todosAceitos = aceitouTermos && aceitouPrivacidade && aceitouDados

  return (
    <div className="onboarding-layout">

      {/* Cabeçalho */}
      <header className="onboarding-header">
        <div className="onboarding-logo">
          <img src="/images/LogoWayCare.png" alt="WayCare" height="36" />
          <span className="onboarding-logo-name">WayCare</span>
        </div>

        {/* Bolinhas de progresso — ativa até o step atual */}
        <div className="onboarding-dots">
          <span className={`onboarding-dot ${step >= 1 ? 'active' : ''}`}></span>
          <span className={`onboarding-dot ${step >= 2 ? 'active' : ''}`}></span>
          <span className={`onboarding-dot ${step >= 3 ? 'active' : ''}`}></span>
        </div>
      </header>

      {/* Área principal */}
      <div className="onboarding-steps-area">

        {/* TELA 1 — Boas-vindas */}
        {step === 1 && (
          <section className="onboarding-step active">
            <div className="onboarding-card-wrapper">

              <div className="onboarding-icons-row">
                <div className="onboarding-icon-bubble onboarding-icon-bubble--red">
                  <i className="fa-solid fa-heart-pulse"></i>
                </div>
                <div className="onboarding-icon-bubble onboarding-icon-bubble--green onboarding-icon-bubble--lg">
                  <i className="fa-solid fa-leaf"></i>
                </div>
                <div className="onboarding-icon-bubble onboarding-icon-bubble--yellow">
                  <i className="fa-solid fa-face-smile"></i>
                </div>
              </div>

              <h1 className="onboarding-titulo">Bem-vindo ao WayCare</h1>
              <p className="onboarding-subtitulo">
                Transforme sua saúde em uma jornada personalizada e recompensadora
              </p>

              <ul className="onboarding-features">
                <li>
                  <div className="onboarding-feature-icon">
                    <i className="fa-solid fa-route"></i>
                  </div>
                  <span>Trilhas personalizadas pela sua <strong>WayCare Band</strong></span>
                </li>
                <li>
                  <div className="onboarding-feature-icon">
                    <i className="fa-solid fa-bullseye"></i>
                  </div>
                  <span>Micro-hábitos simples e realizáveis</span>
                </li>
                <li>
                  <div className="onboarding-feature-icon">
                    <i className="fa-solid fa-coins"></i>
                  </div>
                  <span>Recompensas por cada conquista</span>
                </li>
              </ul>

              <button className="btn onboarding-btn-primary" onClick={() => setStep(2)}>
                Começar
                <i className="fa-solid fa-arrow-right"></i>
              </button>

              <div className="onboarding-login-link">
                <span>Já tem conta?</span>
                <Link to="/login" className="auth-link auth-link-bold">
                  Entrar <i className="fa-solid fa-arrow-right"></i>
                </Link>
              </div>

            </div>
          </section>
        )}

        {/* TELA 2 — Como Funciona */}
        {step === 2 && (
          <section className="onboarding-step active">
            <div className="onboarding-card-wrapper">

              <h1 className="onboarding-titulo">Como Funciona</h1>
              <p className="onboarding-subtitulo">
                Todos os dias, sua WayCare Band monitora seus dados e criamos uma trilha
                personalizada com micro-hábitos. Complete missões, ganhe Health Coins
                e troque por recompensas reais!
              </p>

              <div className="onboarding-how-cards">
                <div className="onboarding-how-card">
                  <div className="onboarding-how-num">1</div>
                  <div className="onboarding-how-icon onboarding-how-icon--purple">
                    <i className="fa-solid fa-heart-circle-check"></i>
                  </div>
                  <h3 className="onboarding-how-titulo">Sua WayCare Band</h3>
                  <p className="onboarding-how-desc">Monitora seus dados de saúde em tempo real</p>
                </div>

                <div className="onboarding-how-card">
                  <div className="onboarding-how-num">2</div>
                  <div className="onboarding-how-icon onboarding-how-icon--green">
                    <i className="fa-solid fa-route"></i>
                  </div>
                  <h3 className="onboarding-how-titulo">Trilha Diária</h3>
                  <p className="onboarding-how-desc">Receba missões personalizadas para o seu dia</p>
                </div>

                <div className="onboarding-how-card">
                  <div className="onboarding-how-num">3</div>
                  <div className="onboarding-how-icon onboarding-how-icon--yellow">
                    <i className="fa-solid fa-coins"></i>
                  </div>
                  <h3 className="onboarding-how-titulo">Health Coins</h3>
                  <p className="onboarding-how-desc">Ganhe pontos e troque por prêmios exclusivos</p>
                </div>
              </div>

              <div className="onboarding-btn-row">
                <button className="btn onboarding-btn-ghost" onClick={() => setStep(1)}>
                  <i className="fa-solid fa-arrow-left"></i>
                  Voltar
                </button>
                <button className="btn onboarding-btn-primary" onClick={() => setStep(3)}>
                  Continuar
                  <i className="fa-solid fa-arrow-right"></i>
                </button>
              </div>

            </div>
          </section>
        )}

        {/* TELA 3 — LGPD */}
        {step === 3 && (
          <section className="onboarding-step active">
            <div className="onboarding-card-wrapper">

              <div className="onboarding-lgpd-icon">
                <i className="fa-solid fa-shield-halved"></i>
              </div>

              <h1 className="onboarding-titulo">Privacidade e Dados</h1>
              <p className="onboarding-subtitulo">Como Usamos Seus Dados</p>

              <ul className="onboarding-lgpd-lista">
                <li>
                  <i className="fa-solid fa-circle-check"></i>
                  Coletamos apenas dados necessários para personalizar sua experiência
                </li>
                <li>
                  <i className="fa-solid fa-circle-check"></i>
                  Você tem controle total sobre suas informações
                </li>
                <li>
                  <i className="fa-solid fa-circle-check"></i>
                  Seus dados de saúde são criptografados e seguros (LGPD)
                </li>
              </ul>

              <div className="onboarding-lgpd-box">
                <p className="onboarding-lgpd-box-titulo">Para personalizar sua experiência, coletamos:</p>
                <ul className="onboarding-lgpd-coleta">
                  <li><i className="fa-solid fa-check"></i> Dados da WayCare Band (com sua autorização)</li>
                  <li><i className="fa-solid fa-check"></i> Progresso em missões</li>
                  <li><i className="fa-solid fa-check"></i> Dados de saúde (com sua autorização)</li>
                </ul>
                <p className="onboarding-lgpd-nota">
                  Você pode revisar, exportar ou excluir seus dados a qualquer momento em "Meus Dados".
                </p>
              </div>

              <div className="onboarding-checkboxes">
                <label className="checkbox-group">
                  <input
                    type="checkbox"
                    checked={aceitouTermos}
                    onChange={(e) => setAceitouTermos(e.target.checked)}
                  />
                  <span className="text-sm">
                    Aceito os <a href="#" className="auth-link">Termos de Uso</a>
                  </span>
                </label>
                <label className="checkbox-group">
                  <input
                    type="checkbox"
                    checked={aceitouPrivacidade}
                    onChange={(e) => setAceitouPrivacidade(e.target.checked)}
                  />
                  <span className="text-sm">
                    Concordo com a <a href="#" className="auth-link">Política de Privacidade</a>
                  </span>
                </label>
                <label className="checkbox-group">
                  <input
                    type="checkbox"
                    checked={aceitouDados}
                    onChange={(e) => setAceitouDados(e.target.checked)}
                  />
                  <span className="text-sm">Autorizo o uso de dados para personalização</span>
                </label>
              </div>

              <a href="#" className="auth-link text-sm onboarding-politica-link">
                <i className="fa-solid fa-arrow-up-right-from-square"></i>
                Ler política completa
              </a>

              <div className="onboarding-btn-row">
                <button className="btn onboarding-btn-ghost" onClick={() => setStep(2)}>
                  <i className="fa-solid fa-arrow-left"></i>
                  Voltar
                </button>
                <button
                  className="btn onboarding-btn-primary"
                  disabled={!todosAceitos}
                  onClick={() => navigate('/dashboard')}
                >
                  Aceitar e Continuar
                  <i className="fa-solid fa-arrow-right"></i>
                </button>
                <button className="btn onboarding-btn-recusar" onClick={() => setStep(1)}>
                  Recusar
                </button>
              </div>

            </div>
          </section>
        )}

      </div>
    </div>
  )
}

export default Onboarding