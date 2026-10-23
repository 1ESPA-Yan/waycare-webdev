import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import Button from '../components/Button'
import Icone from '../components/Icone'
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
  const [erros, setErros] = useState({})

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

  // Avança para o passo seguinte com validação (erros aparecem embaixo de cada campo)
  const avancar = () => {
    const novosErros = {}
    if (passo === 1) {
      if (!nome.trim()) novosErros.nome = 'Preencha seu nome.'
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) novosErros.email = 'Informe um e-mail válido.'
    }
    if (passo === 2) {
      if (senha.length < 8) novosErros.senha = 'A senha deve ter no mínimo 8 caracteres.'
      if (!confirmaSenha) novosErros.confirmaSenha = 'Repita a senha.'
      else if (senha !== confirmaSenha) novosErros.confirmaSenha = 'As senhas não coincidem.'
    }
    setErros(novosErros)
    if (Object.keys(novosErros).length) return
    setPasso(passo + 1)
  }

  // Atualiza um campo e apaga o erro dele
  const alterar = (setValor, campo) => (e) => {
    setValor(e.target.value)
    if (erros[campo]) setErros(prev => ({ ...prev, [campo]: undefined }))
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
          <img src="/images/logo-64.png" alt="WayCare" width="28" height="28" className="h-7 w-auto" />
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
                <Icone nome="fa-id-card" />
              </div>
              <div className="auth-step-text">
                <small>PASSO 01</small>
                <span>Preencha seus dados pessoais</span>
              </div>
            </li>
            <li className={`auth-step-item ${passo >= 2 ? 'active' : ''}`}>
              <div className="auth-feature-icon">
                <Icone nome="fa-lock" />
              </div>
              <div className="auth-step-text">
                <small>PASSO 02</small>
                <span>Configure seu acesso seguro</span>
              </div>
            </li>
            <li className={`auth-step-item ${passo >= 3 ? 'active' : ''}`}>
              <div className="auth-feature-icon">
                <Icone nome="fa-file-signature" />
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
                  <Icone nome="fa-user" className="input-icon" />
                  <input
                    type="text"
                    id="cadastro-nome"
                    className={`input-field input-with-icon ${erros.nome ? 'input-invalido' : ''}`}
                    aria-invalid={!!erros.nome}
                    aria-describedby={erros.nome ? 'cadastro-nome-erro' : undefined}
                    placeholder="Seu nome completo"
                    autoComplete="name"
                    value={nome}
                    onChange={alterar(setNome, 'nome')}
                  />
                </div>
                {erros.nome && <p id="cadastro-nome-erro" className="input-erro-msg">{erros.nome}</p>}
              </div>

              <div className="input-group">
                <label className="input-label" htmlFor="cadastro-email">E-mail</label>
                <div className="input-icon-wrapper">
                  <Icone nome="fa-envelope" className="input-icon" />
                  <input
                    type="email"
                    id="cadastro-email"
                    className={`input-field input-with-icon ${erros.email ? 'input-invalido' : ''}`}
                    aria-invalid={!!erros.email}
                    aria-describedby={erros.email ? 'cadastro-email-erro' : undefined}
                    placeholder="seu@email.com.br"
                    autoComplete="email"
                    value={email}
                    onChange={alterar(setEmail, 'email')}
                  />
                </div>
                {erros.email && <p id="cadastro-email-erro" className="input-erro-msg">{erros.email}</p>}
              </div>

              <Button bloco tamanho="lg" className="auth-submit-btn" onClick={avancar}>
                Continuar
                <Icone nome="fa-arrow-right" />
              </Button>

              <div className="auth-footer-text">
                <p>Já tem conta?</p>
                <Link to="/" className="auth-link auth-link-bold">
                  Entrar <Icone nome="fa-arrow-right" />
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
                  <Icone nome="fa-lock" className="input-icon" />
                  <input
                    type={senhaVisivel ? 'text' : 'password'}
                    id="cadastro-senha"
                    className={`input-field input-with-icon input-with-icon-right ${erros.senha ? 'input-invalido' : ''}`}
                    aria-invalid={!!erros.senha}
                    aria-describedby={erros.senha ? 'cadastro-senha-erro' : undefined}
                    placeholder="Mínimo 8 caracteres"
                    autoComplete="new-password"
                    value={senha}
                    onChange={alterar(setSenha, 'senha')}
                  />
                  <button
                    type="button"
                    className="input-toggle-password"
                    onClick={() => setSenhaVisivel(!senhaVisivel)}
                  >
                    <Icone nome={senhaVisivel ? 'fa-eye-slash' : 'fa-eye'} />
                  </button>
                </div>
                {erros.senha && <p id="cadastro-senha-erro" className="input-erro-msg">{erros.senha}</p>}

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
                    <Icone nome={temTamanho ? 'fa-circle-check' : 'fa-circle-check'} />
                    {' '}Mínimo 8 caracteres
                  </span>
                  <span className={`criteria-item ${temMaiuscula ? 'valid' : ''}`}>
                    <Icone nome={temMaiuscula ? 'fa-circle-check' : 'fa-circle-check'} />
                    {' '}Letra maiúscula
                  </span>
                  <span className={`criteria-item ${temNumero ? 'valid' : ''}`}>
                    <Icone nome={temNumero ? 'fa-circle-check' : 'fa-circle-check'} />
                    {' '}Número
                  </span>
                </div>
              </div>

              {/* Confirmar senha */}
              <div className="input-group">
                <label className="input-label" htmlFor="cadastro-confirma-senha">Confirmar senha</label>
                <div className="input-icon-wrapper">
                  <Icone nome="fa-lock" className="input-icon" />
                  <input
                    type={confirmaSenhaVisivel ? 'text' : 'password'}
                    id="cadastro-confirma-senha"
                    className={`input-field input-with-icon input-with-icon-right ${erros.confirmaSenha ? 'input-invalido' : ''}`}
                    aria-invalid={!!erros.confirmaSenha}
                    aria-describedby={confirmaSenha ? 'cadastro-confirma-senha-match' : erros.confirmaSenha ? 'cadastro-confirma-senha-erro' : undefined}
                    placeholder="Repita a senha"
                    autoComplete="new-password"
                    value={confirmaSenha}
                    onChange={alterar(setConfirmaSenha, 'confirmaSenha')}
                  />
                  <button
                    type="button"
                    className="input-toggle-password"
                    onClick={() => setConfirmaSenhaVisivel(!confirmaSenhaVisivel)}
                  >
                    <Icone nome={confirmaSenhaVisivel ? 'fa-eye-slash' : 'fa-eye'} />
                  </button>
                </div>
                {/* Campo vazio: erro do "Continuar". Preenchido: a mensagem ao vivo abaixo já diz se coincidem */}
                {erros.confirmaSenha && !confirmaSenha && <p id="cadastro-confirma-senha-erro" className="input-erro-msg">{erros.confirmaSenha}</p>}
                {confirmaSenha && (
                  <span id="cadastro-confirma-senha-match" className={`password-match-msg ${senhasCoincidem ? 'match-ok' : 'match-error'}`}>
                    {senhasCoincidem ? '✓ Senhas coincidem' : '✗ Senhas não coincidem'}
                  </span>
                )}
              </div>

              <div className="auth-btn-row">
                <Button variante="fantasma" className="auth-back-btn" aria-label="Voltar" onClick={() => setPasso(1)}>
                  <Icone nome="fa-arrow-left" />
                </Button>
                <Button tamanho="lg" className="auth-submit-btn auth-submit-flex" onClick={avancar}>
                  Continuar
                  <Icone nome="fa-arrow-right" />
                </Button>
              </div>

              <div className="auth-footer-text">
                <p>Já tem conta?</p>
                <Link to="/" className="auth-link auth-link-bold">
                  Entrar <Icone nome="fa-arrow-right" />
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
                  <Icone nome="fa-shield-halved" />
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
                  Concordo com a <Link to="/privacidade" target="_blank" rel="noopener" className="auth-link">Política de Privacidade</Link>
                  {' '}e os <Link to="/termos" target="_blank" rel="noopener" className="auth-link">Termos de Uso</Link>
                  {' '}do WayCare e autorizo o tratamento dos meus dados pessoais conforme descrito.
                </span>
              </label>

              <div className="auth-btn-row">
                <Button variante="fantasma" className="auth-back-btn" aria-label="Voltar" onClick={() => setPasso(2)}>
                  <Icone nome="fa-arrow-left" />
                </Button>
                <Button
                  tamanho="lg"
                  className="auth-submit-btn auth-submit-flex"
                  disabled={!aceitouTermos}
                  onClick={criarConta}
                >
                  Criar conta
                  <Icone nome="fa-arrow-right" />
                </Button>
              </div>

              <div className="auth-footer-text">
                <p>Já tem conta?</p>
                <Link to="/" className="auth-link auth-link-bold">
                  Entrar <Icone nome="fa-arrow-right" />
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