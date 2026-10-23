import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { useApp } from '../context/AppContext'
import { useHidratacao } from '../hooks/useHidratacao'
import Icone from '../components/Icone'
import '../styles/missao-completa.css'

const CORES_CONFETE = ['#1C9770', '#FFC107', '#42A5F5', '#FF9800', '#7AD1C3', '#7986CB', '#4CAF50', '#F44336']

// Valores aleatórios gerados uma vez, fora da renderização
const CONFETES = Array.from({ length: 20 }, (_, i) => ({
  cor: CORES_CONFETE[i % CORES_CONFETE.length],
  x: (Math.random() - 0.5) * 800,
  y: Math.random() * 600,
  rotate: Math.random() * 360,
  duration: 1.5 + Math.random(),
}))

function MissaoCompleta() {
  const location = useLocation()
  const navigate = useNavigate()
  const { totalHC } = useApp()
  const { streak } = useHidratacao()
  const missao = location.state?.missao

  if (!missao) return <Navigate to="/dashboard" replace />

  return (
    <div className="completa-overlay">
      {/* Confete */}
      {CONFETES.map((c, i) => (
        <motion.div
          key={i}
          className="completa-confete"
          style={{ backgroundColor: c.cor }}
          initial={{ x: '50vw', y: '40vh', opacity: 1, scale: 0 }}
          animate={{
            x: `calc(50vw + ${c.x}px)`,
            y: `calc(40vh + ${c.y}px)`,
            opacity: 0,
            scale: 1,
            rotate: c.rotate,
          }}
          transition={{ duration: c.duration, ease: 'easeOut' }}
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
          <Icone nome="fa-coins" className="completa-hc-icon" />
          <span className="completa-hc-valor">+{missao.hc} HC</span>
        </motion.div>

        {/* Streak — só com o dado real da dock */}
        {streak > 0 && (
          <motion.div
            className="completa-streak"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Icone nome="fa-fire" />
            <span>{streak === 1 ? '1 dia seguido!' : `${streak} dias seguidos!`} Continue assim!</span>
          </motion.div>
        )}

        {/* Saldo total */}
        <motion.p
          className="completa-saldo"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          Saldo atual:{' '}
          <strong className="completa-saldo-valor">
            {totalHC.toLocaleString('pt-BR')} HC <Icone nome="fa-check-circle" />
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
