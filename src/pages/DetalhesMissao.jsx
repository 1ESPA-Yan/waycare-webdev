import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { useApp } from '../context/AppContext'
import '../styles/detalhes-missao.css'

const DICAS_DEFAULT = [
  { icone: 'fa-star',   titulo: 'Mantenha o foco',   descricao: 'Você consegue!',      cor: '#1C9770' },
  { icone: 'fa-clock',  titulo: 'Reserve um tempo',  descricao: 'Na sua rotina',       cor: '#2196F3' },
  { icone: 'fa-trophy', titulo: 'Comemore',           descricao: 'Cada passo importa', cor: '#FFC107' },
]

function DetalhesMissao() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { adicionarHC, mlConsumido } = useApp()
  const [missao, setMissao] = useState(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    fetch('/data/missoes-dashboard.json')
      .then(res => res.json())
      .then(data => {
        const encontrada = data.find(m => m.id === Number(id))
        setMissao(encontrada || null)
        setCarregando(false)
      })
      .catch(() => {
        import('../data/missoes-dashboard.json').then(mod => {
          const encontrada = mod.default.find(m => m.id === Number(id))
          setMissao(encontrada || null)
          setCarregando(false)
        })
      })
  }, [id])

  const handleConcluir = () => {
    if (!missao) return
    adicionarHC(missao.hc)
    navigate('/missao/completa', { state: { missao } })
  }

  if (carregando) {
    return (
      <div className="detalhes-loading">
        <div className="detalhes-spinner"></div>
      </div>
    )
  }

  if (!missao) {
    return (
      <div className="detalhes-not-found">
        <i className="fa-solid fa-circle-xmark detalhes-not-found-icon"></i>
        <h2>Missão não encontrada</h2>
        <Link to="/dashboard" className="btn btn-primary btn-sm">Voltar ao início</Link>
      </div>
    )
  }

  const dicas = missao.dicas?.length ? missao.dicas : DICAS_DEFAULT
  const progresso = missao.tipo === 'bottle' ? Math.round((mlConsumido / missao.metaMl) * 100) : null

  return (
    <div className="detalhes-overlay">
      <motion.div
        className="detalhes-modal"
        initial={{ opacity: 0, scale: 0.93, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      >
        {/* Header */}
        <div className="detalhes-header">
          <button onClick={() => navigate(-1)} className="detalhes-back-btn" aria-label="Voltar">
            <i className="fa-solid fa-chevron-left"></i>
            Voltar
          </button>
          <span className="detalhes-header-label">MISSÃO</span>
          <button onClick={() => navigate(-1)} className="detalhes-close-btn" aria-label="Fechar">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Conteúdo com scroll */}
        <div className="detalhes-content">

          {/* Ícone da missão */}
          <div className="detalhes-icon-wrap">
            <div className={`detalhes-icon mission-emoji--${missao.emojiCor}`}>
              <i className={`fa-solid ${missao.icone}`}></i>
            </div>
          </div>

          {/* Título e categoria */}
          <h1 className="detalhes-titulo">{missao.titulo}</h1>
          <div className="detalhes-categoria-wrap">
            <span className={`badge ${missao.categoriaBadge} detalhes-categoria-badge`}>
              <i className="fa-solid fa-tag"></i>
              {missao.categoria}
            </span>
          </div>

          <p className="detalhes-descricao">{missao.descricaoLonga || missao.descricao}</p>

          {/* Progresso (só para bottle ou missions em andamento) */}
          {missao.tipo === 'bottle' && (
            <div className="detalhes-progresso-card">
              <h3 className="detalhes-progresso-titulo">Progresso em Tempo Real</h3>
              <div className="detalhes-progresso-valores">
                <span className="detalhes-progresso-atual">{mlConsumido}</span>
                <span className="detalhes-progresso-meta">/ {missao.metaMl} ml</span>
              </div>
              <div className="progress-bar detalhes-progress-bar">
                <motion.div
                  className="progress-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${progresso}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
              </div>
              <div className="detalhes-progresso-pct">{progresso}%</div>
              <p className="detalhes-progresso-sync">
                <i className="fa-solid fa-rotate"></i>
                Sincronizado com WayCare Bottle • Automático
              </p>
            </div>
          )}

          {/* Infos: recompensa, duração, categoria */}
          <div className="detalhes-info-grid">
            <div className="detalhes-info-item">
              <div className="detalhes-info-icon detalhes-info-icon--green">
                <i className="fa-solid fa-coins"></i>
              </div>
              <div>
                <span className="detalhes-info-label">Recompensa</span>
                <span className="detalhes-info-valor" style={{ color: '#1C9770' }}>+{missao.hc} HC</span>
              </div>
            </div>
            <div className="detalhes-info-item">
              <div className="detalhes-info-icon detalhes-info-icon--blue">
                <i className="fa-regular fa-clock"></i>
              </div>
              <div>
                <span className="detalhes-info-label">Duração</span>
                <span className="detalhes-info-valor">{missao.tempo}</span>
              </div>
            </div>
            <div className="detalhes-info-item">
              <div className="detalhes-info-icon detalhes-info-icon--purple">
                <i className="fa-solid fa-tag"></i>
              </div>
              <div>
                <span className="detalhes-info-label">Categoria</span>
                <span className="detalhes-info-valor">{missao.categoria}</span>
              </div>
            </div>
          </div>

          {/* Dicas */}
          <div className="detalhes-dicas-section">
            <h3 className="detalhes-dicas-titulo">
              <i className="fa-solid fa-lightbulb" style={{ color: '#FFC107' }}></i>
              Dicas para completar
            </h3>
            <div className="detalhes-dicas-grid">
              {dicas.map((dica, i) => (
                <motion.div
                  key={i}
                  className="detalhes-dica-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i }}
                  whileHover={{ y: -4, boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}
                >
                  <div className="detalhes-dica-icon" style={{ backgroundColor: `${dica.cor}18` }}>
                    <i className={`fa-solid ${dica.icone}`} style={{ color: dica.cor }}></i>
                  </div>
                  <span className="detalhes-dica-name">{dica.titulo}</span>
                  <span className="detalhes-dica-desc">{dica.descricao}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Ações */}
          <div className="detalhes-actions">
            {missao.status === 'concluida' ? (
              <button className="btn detalhes-btn-done" disabled>
                <i className="fa-regular fa-circle-check"></i>
                Missão já concluída
              </button>
            ) : missao.tipo === 'bottle' ? (
              <button className="btn detalhes-btn-auto" disabled>
                <i className="fa-solid fa-droplet"></i>
                Monitorado automaticamente
              </button>
            ) : (
              <motion.button
                className="btn btn-primary btn-block detalhes-btn-concluir"
                onClick={handleConcluir}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                <i className="fa-solid fa-check"></i>
                Marcar como Concluída
              </motion.button>
            )}
            <button
              className="detalhes-btn-abandonar"
              onClick={() => navigate(-1)}
            >
              Cancelar
            </button>
          </div>

        </div>
      </motion.div>
    </div>
  )
}

export default DetalhesMissao
