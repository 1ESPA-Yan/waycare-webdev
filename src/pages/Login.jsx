import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { supabase, configurado } from '../lib/supabase'
import Button from '../components/Button'
import Icone from '../components/Icone'
import '../styles/auth.css'

const EMAIL_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Mensagem em português para os erros do envio do código
function erroDoEnvio(erro) {
  const texto = erro?.message || ''
  if (erro?.status === 429 || /rate|too many/i.test(texto)) return 'Muitos e-mails em pouco tempo. Espere um minuto e tente de novo.'
  if (/failed to fetch|network/i.test(texto)) return 'Sem conexão com o servidor. Verifique sua internet e tente de novo.'
  if (/invalid.*email|email.*invalid/i.test(texto)) return 'Informe um e-mail válido.'
  return 'Não foi possível enviar o código. Tente de novo em instantes.'
}

// Entrada única: e-mail -> código de 6 dígitos -> (conta nova) nome.
// Com código por e-mail não há senha, e entrar ou criar conta é o mesmo fluxo.
function Login() {
  const navigate = useNavigate()
  const { contaReal, perfilNome, modoDemo, salvarNome, entrarDemo } = useApp()

  const [etapa, setEtapa] = useState('email')
  const [email, setEmail] = useState('')
  const [codigo, setCodigo] = useState('')
  const [nome, setNome] = useState('')
  const [erro, setErro] = useState('')
  const [aviso, setAviso] = useState('')
  const [ocupado, setOcupado] = useState(false)

  // Já logado (inclusive pelo link do e-mail): com nome, vai para o app; sem nome, pede o nome
  if (modoDemo) return <Navigate to="/dashboard" replace />
  const precisaDeNome = contaReal && perfilNome === ''
  if (contaReal && perfilNome && etapa !== 'nome') return <Navigate to="/dashboard" replace />
  const etapaAtual = precisaDeNome ? 'nome' : etapa

  const enviarCodigo = async (e) => {
    e?.preventDefault()
    setErro(''); setAviso('')
    if (!EMAIL_VALIDO.test(email.trim())) return setErro('Informe um e-mail válido.')
    setOcupado(true)
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: window.location.origin },
    })
    setOcupado(false)
    if (error) return setErro(erroDoEnvio(error))
    setCodigo('')
    setEtapa('codigo')
    setAviso(`Mandamos um código para ${email.trim()}.`)
  }

  const verificarCodigo = async (e) => {
    e.preventDefault()
    setErro('')
    setOcupado(true)
    const { error } = await supabase.auth.verifyOtp({ email: email.trim(), token: codigo.trim(), type: 'email' })
    setOcupado(false)
    if (error) return setErro('Código inválido ou vencido. Confira o e-mail mais recente ou peça outro.')
    // A sessão chega pelo contexto; se a conta já tem nome, o redirecionamento acima leva ao app
    setAviso('')
  }

  const confirmarNome = async (e) => {
    e.preventDefault()
    setErro('')
    if (!nome.trim()) return setErro('Diga como podemos te chamar.')
    // Fixa a etapa: com o nome salvo, o redirecionamento automático não deve ir para o Dashboard
    setEtapa('nome')
    setOcupado(true)
    try {
      await salvarNome(nome)
      navigate('/onboarding', { replace: true })
    } catch (falha) {
      setErro(falha.message)
    } finally {
      setOcupado(false)
    }
  }

  const explorarDemo = () => {
    entrarDemo()
    navigate('/dashboard')
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
            Sua jornada de bem-estar começa aqui.
          </h1>
          <p className="auth-hero-subtitle">
            Hábitos saudáveis, trilhas personalizadas e recompensas que fazem a diferença no seu dia a dia.
          </p>

          <ul className="auth-hero-features">
            <li>
              <div className="auth-feature-icon">
                <Icone nome="fa-route" />
              </div>
              <span>Trilhas personalizadas pelo seu humor</span>
            </li>
            <li>
              <div className="auth-feature-icon">
                <Icone nome="fa-coins" />
              </div>
              <span>Ganhe Health Coins por cada hábito</span>
            </li>
            <li>
              <div className="auth-feature-icon">
                <Icone nome="fa-trophy" />
              </div>
              <span>Conquistas e recompensas exclusivas</span>
            </li>
            <li>
              <div className="auth-feature-icon">
                <Icone nome="fa-chart-line" />
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

          {etapaAtual === 'email' && (
            <>
              <div className="auth-form-header">
                <h2 className="auth-form-title">Entrar ou criar conta</h2>
                <p className="auth-form-subtitle">Sem senha: mandamos um código para o seu e-mail.</p>
              </div>

              {configurado ? (
                <form className="auth-form" noValidate onSubmit={enviarCodigo}>
                  <div className="input-group">
                    <label className="input-label" htmlFor="login-email">E-mail</label>
                    <div className="input-icon-wrapper">
                      <Icone nome="fa-envelope" className="input-icon" />
                      <input
                        type="email"
                        id="login-email"
                        className={`input-field input-with-icon ${erro ? 'input-invalido' : ''}`}
                        placeholder="seu@email.com.br"
                        autoComplete="email"
                        required
                        aria-invalid={!!erro}
                        aria-describedby={erro ? 'login-erro' : undefined}
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); setErro('') }}
                      />
                    </div>
                    {erro && <p id="login-erro" className="input-erro-msg" role="alert">{erro}</p>}
                  </div>

                  <Button type="submit" bloco tamanho="lg" className="auth-submit-btn" disabled={ocupado}>
                    {ocupado ? 'Enviando…' : 'Receber código de acesso'}
                    {!ocupado && <Icone nome="fa-arrow-right" />}
                  </Button>
                  <p className="auth-dica">Primeira vez? É só informar o e-mail: a conta é criada no primeiro acesso.</p>
                </form>
              ) : (
                <p className="auth-aviso" role="status">
                  O login com conta não está disponível neste ambiente (faltam as chaves do Supabase).
                  Use o modo demonstração.
                </p>
              )}
            </>
          )}

          {etapaAtual === 'codigo' && (
            <>
              <div className="auth-form-header">
                <h2 className="auth-form-title">Digite o código</h2>
                <p className="auth-form-subtitle" role="status">{aviso}</p>
              </div>

              <form className="auth-form" noValidate onSubmit={verificarCodigo}>
                <div className="input-group">
                  <label className="input-label" htmlFor="login-codigo">Código de acesso</label>
                  <input
                    id="login-codigo"
                    className={`input-field auth-codigo-input ${erro ? 'input-invalido' : ''}`}
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    required
                    aria-invalid={!!erro}
                    aria-describedby={erro ? 'login-erro' : undefined}
                    value={codigo}
                    onChange={(e) => { setCodigo(e.target.value.replace(/\D/g, '').slice(0, 10)); setErro('') }}
                  />
                  {erro && <p id="login-erro" className="input-erro-msg" role="alert">{erro}</p>}
                </div>

                <Button type="submit" bloco tamanho="lg" className="auth-submit-btn" disabled={ocupado || codigo.length < 6}>
                  {ocupado ? 'Entrando…' : 'Entrar'}
                  {!ocupado && <Icone nome="fa-arrow-right" />}
                </Button>
                <p className="auth-dica">No computador, também dá para clicar no link do e-mail.</p>

                <div className="auth-acoes-secundarias">
                  <button type="button" className="auth-link" onClick={enviarCodigo} disabled={ocupado}>Reenviar código</button>
                  <button type="button" className="auth-link" onClick={() => { setEtapa('email'); setErro(''); setAviso('') }}>Usar outro e-mail</button>
                </div>
              </form>
            </>
          )}

          {etapaAtual === 'nome' && (
            <>
              <div className="auth-form-header">
                <h2 className="auth-form-title">Boas-vindas ao WayCare!</h2>
                <p className="auth-form-subtitle">Como podemos te chamar?</p>
              </div>

              <form className="auth-form" noValidate onSubmit={confirmarNome}>
                <div className="input-group">
                  <label className="input-label" htmlFor="login-nome">Nome</label>
                  <div className="input-icon-wrapper">
                    <Icone nome="fa-user" className="input-icon" />
                    <input
                      id="login-nome"
                      className={`input-field input-with-icon ${erro ? 'input-invalido' : ''}`}
                      placeholder="Seu nome"
                      autoComplete="name"
                      required
                      aria-invalid={!!erro}
                      aria-describedby={erro ? 'login-erro' : undefined}
                      value={nome}
                      onChange={(e) => { setNome(e.target.value); setErro('') }}
                    />
                  </div>
                  {erro && <p id="login-erro" className="input-erro-msg" role="alert">{erro}</p>}
                </div>

                <Button type="submit" bloco tamanho="lg" className="auth-submit-btn" disabled={ocupado}>
                  {ocupado ? 'Salvando…' : 'Continuar'}
                  {!ocupado && <Icone nome="fa-arrow-right" />}
                </Button>
              </form>
            </>
          )}

          {etapaAtual !== 'nome' && (
            <>
              <div className="auth-divider">
                <span>ou</span>
              </div>
              <Button variante="fantasma" bloco onClick={explorarDemo}>
                <Icone nome="fa-compass" />
                Explorar em modo demonstração
              </Button>
              <p className="auth-dica">Entra sem conta, com dados simulados. Bom para conhecer o app sem a dock.</p>
            </>
          )}

          {/* Termos */}
          <p className="auth-terms">
            Ao entrar, você concorda com a{' '}
            <Link to="/privacidade" target="_blank" rel="noopener" className="auth-link">Política de Privacidade</Link>
            {' '}e os{' '}
            <Link to="/termos" target="_blank" rel="noopener" className="auth-link">Termos de Uso</Link>
            {' '}do WayCare.
          </p>

        </div>
      </main>
    </div>
  )
}

export default Login
