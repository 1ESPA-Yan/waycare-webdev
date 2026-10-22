import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { useApp } from '../context/AppContext'
import { useDados } from '../hooks/useDados'
import Button from '../components/Button'
import Chip from '../components/Chip'
import Icone from '../components/Icone'
import '../styles/detalhes-missao.css'

const DICAS_DEFAULT = [
  { icone: 'fa-star',   titulo: 'Mantenha o foco',   descricao: 'Você consegue!',      cor: '#1C9770' },
  { icone: 'fa-clock',  titulo: 'Reserve um tempo',  descricao: 'Na sua rotina',       cor: '#2196F3' },
  { icone: 'fa-trophy', titulo: 'Comemore',           descricao: 'Cada passo importa', cor: '#FFC107' },
]

function DetalhesMissao() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { concluirMissao, missaoConcluida, consumidoHoje: mlConsumido } = useApp()
  const { dados, carregando } = useDados('missoes-dashboard')
  const missao = dados?.find(m => m.id === Number(id)) ?? null

  const handleConcluir = () => {
    if (!missao || !concluirMissao(missao)) return
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
        <Icone nome="fa-circle-xmark" className="detalhes-not-found-icon" />
        <h2>Missão não encontrada</h2>
        <Button to="/dashboard" tamanho="sm">Voltar ao início</Button>
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
            <Icone nome="fa-chevron-left" />
            Voltar
          </button>
          <span className="detalhes-header-label">MISSÃO</span>
          <button onClick={() => navigate(-1)} className="detalhes-close-btn" aria-label="Fechar">
            <Icone nome="fa-xmark" />
          </button>
        </div>

        {/* Conteúdo com scroll */}
        <div className="detalhes-content">

          {/* Ícone da missão */}
          <div className="detalhes-icon-wrap">
            <div className={`detalhes-icon mission-emoji--${missao.emojiCor}`}>
              <Icone nome={missao.icone} />
            </div>
          </div>

          {/* Título e categoria */}
          <h1 className="detalhes-titulo">{missao.titulo}</h1>
          <div className="detalhes-categoria-wrap">
            <Chip cor={missao.categoriaBadge} className="detalhes-categoria-badge">
              <Icone nome="fa-tag" />
              {missao.categoria}
            </Chip>
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
                <Icone nome="fa-rotate" />
                Sincronizado com WayCare Bottle • Automático
              </p>
            </div>
          )}

          {/* Infos: recompensa, duração, categoria */}
          <div className="detalhes-info-grid">
            <div className="detalhes-info-item">
              <div className="detalhes-info-icon detalhes-info-icon--green">
                <Icone nome="fa-coins" />
              </div>
              <div>
                <span className="detalhes-info-label">Recompensa</span>
                <span className="detalhes-info-valor" style={{ color: 'var(--color-primary-dark)' }}>+{missao.hc} HC</span>
              </div>
            </div>
            <div className="detalhes-info-item">
              <div className="detalhes-info-icon detalhes-info-icon--blue">
                <Icone nome="fa-clock" />
              </div>
              <div>
                <span className="detalhes-info-label">Duração</span>
                <span className="detalhes-info-valor">{missao.tempo}</span>
              </div>
            </div>
            <div className="detalhes-info-item">
              <div className="detalhes-info-icon detalhes-info-icon--purple">
                <Icone nome="fa-tag" />
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
              <Icone nome="fa-lightbulb" style={{ color: '#FFC107' }} />
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
                    <Icone nome={dica.icone} style={{ color: dica.cor }} />
                  </div>
                  <span className="detalhes-dica-name">{dica.titulo}</span>
                  <span className="detalhes-dica-desc">{dica.descricao}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Ações */}
          <div className="detalhes-actions">
            {missao.status === 'concluida' || missaoConcluida(missao.id) ? (
              <button className="btn detalhes-btn-done" disabled>
                <Icone nome="fa-circle-check" />
                Missão já concluída
              </button>
            ) : missao.tipo === 'bottle' ? (
              <button className="btn detalhes-btn-auto" disabled>
                <Icone nome="fa-droplet" />
                Monitorado automaticamente
              </button>
            ) : (
              <motion.button
                className="btn btn-primary btn-block detalhes-btn-concluir"
                onClick={handleConcluir}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                <Icone nome="fa-check" />
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
