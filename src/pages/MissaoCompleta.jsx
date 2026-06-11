import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { useApp } from '../context/AppContext'
import '../styles/missao-completa.css'

const CORES_CONFETE = ['#1C9770', '#FFC107', '#42A5F5', '#FF9800', '#7AD1C3', '#7986CB', '#4CAF50', '#F44336']

function MissaoCompleta() {
  const location = useLocation()
  const navigate = useNavigate()
  const { totalHC } = useApp()
  const missao = location.state?.missao

  if (!missao) {
    navigate('/dashboard')
    return null
  }

  return (
    <div className="completa-overlay">
      {/* Confete */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="completa-confete"
          style={{ backgroundColor: CORES_CONFETE[i % CORES_CONFETE.length] }}
          initial={{ x: '50vw', y: '40vh', opacity: 1, scale: 0 }}
          animate={{
            x: `calc(50vw + ${(Math.random() - 0.5) * 800}px)`,
            y: `calc(40vh + ${Math.random() * 600}px)`,
            opacity: 0,
            scale: 1,
            rotate: Math.random() * 360,
          }}
          transition={{ duration: 1.5 + Math.random(), ease: 'easeOut' }}
        />
      ))}

      <motion.div
        className="completa-modal"
        initial={{ opacity: 0, scale: 0.5, y: 100 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      >
        {/* Ícone de check animado */}
        <motion.div
          className="completa-check-wrap"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
        >
          <motion.svg
            className="completa-check-svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <polyline points="20 6 9 17 4 12" />
          </motion.svg>
        </motion.div>

        <motion.h1
          className="completa-titulo"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          Missão Completa!
        </motion.h1>

        <motion.p
          className="completa-subtitulo"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {missao.titulo}
        </motion.p>

        {/* Badge de recompensa */}
        <motion.div
          className="completa-hc-badge"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, type: 'spring' }}
        >
          <i className="fa-solid fa-coins completa-hc-icon"></i>
          <span className="completa-hc-valor">+{missao.hc} HC</span>
        </motion.div>

        {/* Streak */}
        <motion.div
          className="completa-streak"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
        >
          <i className="fa-solid fa-fire"></i>
          <span>7 dias seguidos! Continue assim!</span>
        </motion.div>

        {/* Saldo total */}
        <motion.p
          className="completa-saldo"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          Saldo atual:{' '}
          <strong className="completa-saldo-valor">
            {totalHC} HC <i className="fa-solid fa-check-circle"></i>
          </strong>
        </motion.p>

        {/* Botão continuar */}
        <motion.button
          className="btn btn-primary completa-btn"
          onClick={() => navigate('/dashboard')}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Continuar
        </motion.button>
      </motion.div>
    </div>
  )
}

export default MissaoCompleta
