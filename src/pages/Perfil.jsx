import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'motion/react'
import PerfilMetaHidratacao from '../components/PerfilMetaHidratacao'
import { useApp } from '../context/AppContext'
import { useDados } from '../hooks/useDados'
import Topbar from '../components/Topbar'
import Button from '../components/Button'
import Card from '../components/Card'
import Icone from '../components/Icone'
import '../styles/perfil.css'

// "2026-10-21" → "Out 2026"
function formatarMesAno(dataISO) {
  const [ano, mes] = dataISO.split('-').map(Number)
  const nomeMes = new Date(ano, mes - 1, 1)
    .toLocaleDateString('pt-BR', { month: 'short' })
    .replace('.', '')
  return `${nomeMes.charAt(0).toUpperCase()}${nomeMes.slice(1)} ${ano}`
}

const cardVariants = {
  hidden:  { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
}

function Perfil() {
  const [editando, setEditando] = useState(false)
  const [salvo, setSalvo] = useState(false)
  const [rascunhoNome, setRascunhoNome] = useState('')
  const [rascunhoBio, setRascunhoBio] = useState('')
  const [erroSalvar, setErroSalvar] = useState('')

  const { totalHC, nomeUsuario, emailUsuario, bioUsuario, setBioUsuario, salvarNome, membroDesde, nivel, xp, xpParaProximo, pctNivel } = useApp()

  const { dados: conquistas } = useDados('conquistas')
  const totalConquistas = conquistas?.filter(c => c.desbloqueada).length ?? 0

  const iniciarEdicao = () => {
    setRascunhoNome(nomeUsuario)
    setRascunhoBio(bioUsuario || '')
    setErroSalvar('')
    setEditando(true)
  }

  const cancelar = () => setEditando(false)

  // O e-mail é a identidade da conta (login por código) e não é editável aqui
  const salvar = async () => {
    if (!rascunhoNome.trim()) return
    try {
      await salvarNome(rascunhoNome)
    } catch (falha) {
      setErroSalvar(falha.message)
      return
    }
    setBioUsuario(rascunhoBio.trim())
    setEditando(false)
    setSalvo(true)
    setTimeout(() => setSalvo(false), 2500)
  }

  // Vindo do primeiro uso (/perfil#meta-hidratacao): rola até o formulário de meta
  const { hash } = useLocation()
  useEffect(() => {
    if (hash !== '#meta-hidratacao') return
    const id = setTimeout(() => document.getElementById('meta-hidratacao')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 300)
    return () => clearTimeout(id)
  }, [hash])

  const letraAvatar = nomeUsuario?.[0]?.toUpperCase() || 'U'

  return (
    <>
          <Topbar icone="fa-user" cor="dourado" titulo="Meu Perfil" subtitulo="Gerencie suas informações pessoais" />

          <section id="page-content" className="page-transition">

            <motion.div
              className="perfil-layout"
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
            >

              {/* Coluna esquerda */}
              <motion.div
                className="flex flex-col gap-6"
                variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.09 } } }}
              >

                {/* Card principal do perfil */}
                <motion.div variants={cardVariants} className="card perfil-card-principal">

                  <div className="flex items-start gap-6">
                    <div className="avatar avatar-lg perfil-avatar">{letraAvatar}</div>

                    <div className="flex flex-col gap-2 grow">
                      {editando ? (
                        <div className="perfil-edit-form">
                          <div className="perfil-edit-field">
                            <label className="perfil-edit-label">Nome</label>
                            <input
                              className="perfil-edit-input"
                              type="text"
                              value={rascunhoNome}
                              onChange={e => setRascunhoNome(e.target.value)}
                              onKeyDown={e => { if (e.key === 'Enter') salvar(); if (e.key === 'Escape') cancelar() }}
                              autoFocus
                              maxLength={40}
                            />
                          </div>
                          {erroSalvar && <p className="input-erro-msg" role="alert">{erroSalvar}</p>}
                          <div className="perfil-edit-field">
                            <label className="perfil-edit-label">
                              Bio
                              <span className="perfil-edit-hint"> {rascunhoBio.length}/80</span>
                            </label>
                            <textarea
                              className="perfil-edit-input perfil-edit-textarea"
                              value={rascunhoBio}
                              onChange={e => setRascunhoBio(e.target.value.slice(0, 80))}
                              onKeyDown={e => { if (e.key === 'Escape') cancelar() }}
                              placeholder="Uma frase sobre você..."
                              rows={2}
                            />
                          </div>
                          <div className="perfil-edit-actions">
                            <button
                              className="perfil-edit-btn-salvar"
                              onClick={salvar}
                              disabled={!rascunhoNome.trim()}
                            >
                              <Icone nome="fa-check" /> Salvar
                            </button>
                            <button className="perfil-edit-btn-cancelar" onClick={cancelar}>
                              <Icone nome="fa-xmark" /> Cancelar
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-2">
                            <h2 className="perfil-nome">{nomeUsuario}</h2>
                            {salvo && <span className="perfil-salvo-badge">Salvo!</span>}
                            <button
                              className="perfil-edit-btn ml-auto"
                              aria-label="Editar perfil"
                              onClick={iniciarEdicao}
                            >
                              <Icone nome="fa-pen-to-square" />
                            </button>
                          </div>
                          {bioUsuario && <p className="perfil-bio">{bioUsuario}</p>}
                          <div className="flex items-center gap-4 flex-wrap">
                            <span className="perfil-meta">
                              <Icone nome="fa-envelope" />
                              {emailUsuario || 'Sem email'}
                            </span>
                            {membroDesde && (
                              <span className="perfil-meta">
                                <Icone nome="fa-calendar" />
                                Membro desde {formatarMesAno(membroDesde)}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="perfil-stat-chip perfil-stat-chip--green">
                              Nível<strong>{nivel}</strong>
                            </span>
                            <span className="perfil-stat-chip perfil-stat-chip--gray">
                              XP<strong>{xp.toLocaleString('pt-BR')}</strong>
                            </span>
                            <span className="perfil-stat-chip perfil-stat-chip--hc">
                              Próximo nível<strong>{xpParaProximo.toLocaleString('pt-BR')} XP</strong>
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {!editando && (
                    <div className="mt-6">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-secondary">Progresso para Nível {nivel + 1}</span>
                        <span className="text-sm font-bold trilha-pct">{pctNivel}%</span>
                      </div>
                      <div className="progress-bar perfil-progress-bar">
                        <div className="progress-fill" style={{ width: `${pctNivel}%` }}></div>
                      </div>
                    </div>
                  )}
                </motion.div>

                {/* Grid de estatísticas */}
                <motion.div variants={cardVariants} className="perfil-stats-grid">
                  <div>
                    <Card className="perfil-stat-card">
                      <div className="perfil-stat-icon perfil-stat-icon--blue">
                        <Icone nome="fa-bullseye" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="perfil-stat-label">Missões Completadas</span>
                        <span className="perfil-stat-valor">48</span>
                      </div>
                    </Card>
                  </div>
                  <div>
                    <Card className="perfil-stat-card">
                      <div className="perfil-stat-icon perfil-stat-icon--orange">
                        <Icone nome="fa-fire" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="perfil-stat-label">Streak Atual</span>
                        <span className="perfil-stat-valor">5 dias</span>
                      </div>
                    </Card>
                  </div>
                  <div>
                    <Card className="perfil-stat-card">
                      <div className="perfil-stat-icon perfil-stat-icon--hc">
                        <Icone nome="fa-coins" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="perfil-stat-label">Total de Coins Ganhos</span>
                        <span className="perfil-stat-valor">{totalHC.toLocaleString('pt-BR')}</span>
                      </div>
                    </Card>
                  </div>
                  <div>
                    <Card className="perfil-stat-card">
                      <div className="perfil-stat-icon perfil-stat-icon--trophy">
                        <Icone nome="fa-trophy" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="perfil-stat-label">Conquistas</span>
                        <span className="perfil-stat-valor">{totalConquistas}</span>
                      </div>
                    </Card>
                  </div>
                </motion.div>

                {/* Meta de hidratação personalizada (conectada ao backend) */}
                <motion.div variants={cardVariants} id="meta-hidratacao" className="scroll-mt-6">
                  <PerfilMetaHidratacao />
                </motion.div>

                {/* Conquistas recentes */}
                <motion.div variants={cardVariants} className="card">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="perfil-stat-icon perfil-stat-icon--trophy">
                      <Icone nome="fa-trophy" />
                    </div>
                    <h3 className="perfil-secao-titulo">Conquistas Recentes</h3>
                  </div>

                  <div className="perfil-conquistas-grid">
                    <div>
                      <div className="perfil-conquista-item perfil-conquista-item--done">
                        <div className="perfil-conquista-icon perfil-conquista-icon--orange">
                          <Icone nome="fa-fire" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="perfil-conquista-nome">Semana Ativa</span>
                          <span className="perfil-conquista-desc">Completou 7 dias consecutivos</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="perfil-conquista-item perfil-conquista-item--done">
                        <div className="perfil-conquista-icon perfil-conquista-icon--purple">
                          <Icone nome="fa-moon" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="perfil-conquista-nome">Mestre do Sono</span>
                          <span className="perfil-conquista-desc">Dormiu 7h+ por 10 dias</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="perfil-conquista-item perfil-conquista-item--done">
                        <div className="perfil-conquista-icon perfil-conquista-icon--blue">
                          <Icone nome="fa-droplet" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="perfil-conquista-nome">Hidratação em Dia</span>
                          <span className="perfil-conquista-desc">30 dias bebendo 2L de água</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="perfil-conquista-item">
                        <div className="perfil-conquista-icon perfil-conquista-icon--locked">
                          <Icone nome="fa-person-running" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="perfil-conquista-nome text-muted">Maratonista</span>
                          <span className="perfil-conquista-desc">Caminhou 100km no total</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button to="/conquistas" variante="secundario" tamanho="sm" bloco>
                    Ver Todas as Conquistas
                  </Button>
                </motion.div>
              </motion.div>

              {/* Coluna direita — atalhos */}
              <motion.div
                className="flex flex-col gap-6"
                variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } } }}
              >
                <motion.div variants={cardVariants}>
                <Link to="/configuracoes" className="card perfil-atalho">
                  <div className="perfil-atalho-icon perfil-atalho-icon--gray">
                    <Icone nome="fa-gear" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="perfil-atalho-titulo">Configurações</span>
                    <span className="perfil-atalho-desc">Ajuste suas preferências</span>
                  </div>
                </Link>
                </motion.div>

                <motion.div variants={cardVariants}>
                <Link to="/recompensas" className="card perfil-atalho">
                  <div className="perfil-atalho-icon perfil-atalho-icon--green">
                    <Icone nome="fa-gift" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="perfil-atalho-titulo">Minhas Recompensas</span>
                    <span className="perfil-atalho-desc">Vouchers resgatados</span>
                  </div>
                </Link>
                </motion.div>

                <motion.div variants={cardVariants}>
                <Link to="/descobertas" className="card perfil-atalho">
                  <div className="perfil-atalho-icon perfil-atalho-icon--yellow">
                    <Icone nome="fa-lightbulb" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="perfil-atalho-titulo">Descobertas</span>
                    <span className="perfil-atalho-desc">Insights sobre sua saúde</span>
                  </div>
                </Link>
                </motion.div>
              </motion.div>

            </motion.div>
          </section>
    </>
  )
}

export default Perfil
