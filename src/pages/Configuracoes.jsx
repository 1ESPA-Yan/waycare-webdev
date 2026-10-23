import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { useHidratacao } from '../hooks/useHidratacao'
import Topbar from '../components/Topbar'
import Card from '../components/Card'
import Icone from '../components/Icone'
import '../styles/configuracoes.css'

function CampoEditavel({ label, valor, tipo = 'text', unidade, onSalvar }) {
  const [editando, setEditando] = useState(false)
  const [rascunho, setRascunho] = useState(String(valor))
  const [salvo, setSalvo] = useState(false)
  const [erro, setErro] = useState('')

  // onSalvar pode ser assíncrono (ex.: nome salvo no Supabase) e falhar
  const handleSalvar = async () => {
    const v = tipo === 'number' ? Number(rascunho) : rascunho.trim()
    if (!v) return
    try {
      await onSalvar(v)
    } catch (falha) {
      setErro(falha.message)
      return
    }
    setErro('')
    setEditando(false)
    setSalvo(true)
    setTimeout(() => setSalvo(false), 2000)
  }

  const handleCancelar = () => {
    setRascunho(String(valor))
    setErro('')
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
          {erro && <p className="input-erro-msg" role="alert">{erro}</p>}
        </div>
        <div className="flex gap-2">
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
          {salvo && <span className="config-salvo-badge"><Icone nome="fa-check" /> Salvo</span>}
        </span>
      </div>
      <button className="config-row-action" onClick={() => { setRascunho(String(valor)); setEditando(true) }}>
        Editar
      </button>
    </div>
  )
}

function Configuracoes() {
  const { nomeUsuario, emailUsuario, contaReal, salvarNome, metaDiaria, setMetaDiaria, sairDaConta } = useApp()
  const { meta } = useHidratacao()

  return (
    <>
          <Topbar icone="fa-gear" cor="cinza" titulo="Configurações" subtitulo="Personalize sua experiência WayCare" />

          <section id="page-content" className="page-transition">

            {/* Informações da Conta */}
            <Card className="config-section mb-6">
              <h2 className="config-section-titulo mb-6">Informações da Conta</h2>

              <CampoEditavel
                label="Nome"
                valor={nomeUsuario}
                onSalvar={salvarNome}
              />

              {/* E-mail é a identidade da conta (login por código): só leitura. Sem senha. */}
              <div className="config-divider"></div>

              <div className="config-row">
                <div className="config-row-info">
                  <span className="config-row-label">E-mail</span>
                  <span className="config-row-valor">{contaReal ? emailUsuario : 'Modo demonstração (sem conta)'}</span>
                </div>
              </div>
            </Card>

            {/* Saúde & Metas */}
            <Card className="config-section mb-6">
              <h2 className="config-section-titulo mb-6">Saúde & Metas</h2>

              {/* Conta real: a meta é calculada pelo perfil e recalculada todo dia (só leitura aqui) */}
              {contaReal ? (
                <div className="config-row">
                  <div className="config-row-info">
                    <span className="config-row-label">Meta diária de hidratação</span>
                    <span className="config-row-valor">{meta} ml (calculada pelo seu perfil)</span>
                  </div>
                  <Link to="/perfil#meta-hidratacao" className="config-row-action">Alterar no Perfil</Link>
                </div>
              ) : (
                <CampoEditavel
                  label="Meta diária de hidratação"
                  valor={metaDiaria}
                  tipo="number"
                  unidade="ml"
                  onSalvar={v => setMetaDiaria(Number(v))}
                />
              )}

              <div className="config-divider"></div>

              <div className="config-row">
                <div className="config-row-info">
                  <span className="config-row-label">Humor atual</span>
                  <span className="config-row-valor">Atualizado diariamente</span>
                </div>
                <Link to="/humor" className="config-row-action">Mudar →</Link>
              </div>
            </Card>

            {/* Notificações */}
            <Card className="config-item-card mb-6">
              <div className="flex items-center gap-6">
                <div className="config-item-icon config-item-icon--green">
                  <Icone nome="fa-bell" />
                </div>
                <div className="flex flex-col gap-1 grow">
                  <span className="config-item-titulo">Notificações</span>
                  <span className="config-item-desc">Gerencie suas preferências de notificação</span>
                </div>
                <Link to="/notificacoes" className="config-row-action config-row-action--arrow">Configurar →</Link>
              </div>
            </Card>

            {/* Privacidade e Dados */}
            <Card className="config-item-card mb-6">
              <div className="flex items-center gap-6">
                <div className="config-item-icon config-item-icon--blue">
                  <Icone nome="fa-shield-halved" />
                </div>
                <div className="flex flex-col gap-1 grow">
                  <span className="config-item-titulo">Privacidade e Dados</span>
                  <span className="config-item-desc">Controle seus dados e privacidade</span>
                </div>
                <button type="button" className="config-row-action em-breve" disabled>Gerenciar <span className="badge-em-breve">Em breve</span></button>
              </div>
            </Card>

            {/* Aparência */}
            <Card className="config-item-card mb-6">
              <div className="flex items-center gap-6">
                <div className="config-item-icon config-item-icon--orange">
                  <Icone nome="fa-palette" />
                </div>
                <div className="flex flex-col gap-1 grow">
                  <span className="config-item-titulo">Aparência</span>
                  <span className="config-item-desc">Personalize cores e tema</span>
                </div>
                <button type="button" className="config-row-action em-breve" disabled>Personalizar <span className="badge-em-breve">Em breve</span></button>
              </div>
            </Card>

            {/* Zona de Perigo */}
            <Card className="config-section mb-6">
              <h2 className="config-section-titulo mb-6">Zona de Perigo</h2>

              <div className="config-perigo-item config-perigo-item--warning">
                <div className="flex items-center gap-4 grow">
                  <Icone nome="fa-arrow-right-from-bracket" className="config-perigo-icon config-perigo-icon--warning" />
                  <div className="flex flex-col gap-1">
                    <span className="config-perigo-titulo">Sair da Conta</span>
                    <span className="config-perigo-desc">Você pode voltar a qualquer momento</span>
                  </div>
                </div>
                <Link to="/" replace onClick={sairDaConta} className="config-perigo-action config-perigo-action--warning">
                  Sair →
                </Link>
              </div>

              <div className="config-perigo-item config-perigo-item--error mt-4">
                <div className="flex items-center gap-4 grow">
                  <Icone nome="fa-shield-halved" className="config-perigo-icon config-perigo-icon--error" />
                  <div className="flex flex-col gap-1">
                    <span className="config-perigo-titulo">Excluir Conta</span>
                    <span className="config-perigo-desc">Esta ação não pode ser desfeita</span>
                  </div>
                </div>
                <button type="button" className="config-perigo-action em-breve" disabled>Excluir <span className="badge-em-breve">Em breve</span></button>
              </div>
            </Card>

            {/* Sobre */}
            <Card className="config-section">
              <h2 className="config-section-titulo mb-6">Sobre</h2>

              <div className="config-row">
                <span className="config-row-label">Versão</span>
                <span className="config-row-valor">1.0.0</span>
              </div>

              <div className="config-divider"></div>

              <div className="config-row">
                <span className="config-row-label">Termos de Uso</span>
                <Link to="/termos" className="config-row-action">Ver →</Link>
              </div>

              <div className="config-divider"></div>

              <div className="config-row">
                <span className="config-row-label">Política de Privacidade</span>
                <Link to="/privacidade" className="config-row-action">Ver →</Link>
              </div>

              <div className="config-divider"></div>

              <div className="config-row">
                <span className="config-row-label">Suporte</span>
                <button type="button" className="config-row-action em-breve" disabled>Contato <span className="badge-em-breve">Em breve</span></button>
              </div>
            </Card>

          </section>
    </>
  )
}

export default Configuracoes
