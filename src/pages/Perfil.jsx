import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import PerfilMetaHidratacao from '../components/PerfilMetaHidratacao'
import { useApp } from '../context/AppContext'
import Topbar from '../components/Topbar'
import Button from '../components/Button'
import Card from '../components/Card'
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
  const [totalConquistas, setTotalConquistas] = useState(0)
  const [editando, setEditando] = useState(false)
  const [salvo, setSalvo] = useState(false)
  const [rascunhoNome, setRascunhoNome] = useState('')
  const [rascunhoEmail, setRascunhoEmail] = useState('')
  const [rascunhoBio, setRascunhoBio] = useState('')

  const { totalHC, nomeUsuario, emailUsuario, bioUsuario, setBioUsuario, salvarUsuario, membroDesde, nivel, xp, xpParaProximo, pctNivel } = useApp()

  useEffect(() => {
    fetch('/data/conquistas.json')
      .then(res => res.json())
      .then(data => setTotalConquistas(data.filter(c => c.desbloqueada).length))
      .catch(() => {
        import('../data/conquistas.json').then(mod =>
          setTotalConquistas(mod.default.filter(c => c.desbloqueada).length)
        )
      })
  }, [])

  const iniciarEdicao = () => {
    setRascunhoNome(nomeUsuario)
    setRascunhoEmail(emailUsuario)
    setRascunhoBio(bioUsuario || '')
    setEditando(true)
  }

  const cancelar = () => setEditando(false)

  const salvar = () => {
    if (!rascunhoNome.trim()) return
    salvarUsuario(rascunhoNome.trim(), rascunhoEmail.trim())
    setBioUsuario(rascunhoBio.trim())
    setEditando(false)
    setSalvo(true)
    setTimeout(() => setSalvo(false), 2500)
  }

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
                          <div className="perfil-edit-field">
                            <label className="perfil-edit-label">E-mail</label>
                            <input
                              className="perfil-edit-input"
                              type="email"
                              value={rascunhoEmail}
                              onChange={e => setRascunhoEmail(e.target.value)}
                              onKeyDown={e => { if (e.key === 'Enter') salvar(); if (e.key === 'Escape') cancelar() }}
                              placeholder="seu@email.com"
                            />
                          </div>
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
                              <i className="fa-solid fa-check"></i> Salvar
                            </button>
                            <button className="perfil-edit-btn-cancelar" onClick={cancelar}>
                              <i className="fa-solid fa-xmark"></i> Cancelar
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
                              <i className="fa-regular fa-pen-to-square"></i>
                            </button>
                          </div>
                          {bioUsuario && <p className="perfil-bio">{bioUsuario}</p>}
                          <div className="flex items-center gap-4 flex-wrap">
                            <span className="perfil-meta">
                              <i className="fa-regular fa-envelope"></i>
                              {emailUsuario || 'Sem email'}
                            </span>
                            {membroDesde && (
                              <span className="perfil-meta">
                                <i className="fa-regular fa-calendar"></i>
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
                        <i className="fa-solid fa-bullseye"></i>
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
                        <i className="fa-solid fa-fire"></i>
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
                        <i className="fa-solid fa-coins"></i>
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
                        <i className="fa-solid fa-trophy"></i>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="perfil-stat-label">Conquistas</span>
                        <span className="perfil-stat-valor">{totalConquistas}</span>
                      </div>
                    </Card>
                  </div>
                </motion.div>

                {/* Meta de hidratação personalizada (conectada ao backend) */}
                <motion.div variants={cardVariants}>
                  <PerfilMetaHidratacao />
                </motion.div>

                {/* Conquistas recentes */}
                <motion.div variants={cardVariants} className="card">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="perfil-stat-icon perfil-stat-icon--trophy">
                      <i className="fa-solid fa-trophy"></i>
                    </div>
                    <h3 className="perfil-secao-titulo">Conquistas Recentes</h3>
                  </div>

                  <div className="perfil-conquistas-grid">
                    <div>
                      <div className="perfil-conquista-item perfil-conquista-item--done">
                        <div className="perfil-conquista-icon perfil-conquista-icon--orange">
                          <i className="fa-solid fa-fire"></i>
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
                          <i className="fa-solid fa-moon"></i>
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
                          <i className="fa-solid fa-droplet"></i>
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
                          <i className="fa-solid fa-person-running"></i>
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
                    <i className="fa-solid fa-gear"></i>
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
                    <i className="fa-solid fa-gift"></i>
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
                    <i className="fa-solid fa-lightbulb"></i>
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
