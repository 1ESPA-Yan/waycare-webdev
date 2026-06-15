import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { HeartPulse } from 'lucide-react'

function Splash() {
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => navigate('/dashboard'), 2800)
    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div className="w-full h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #1C9770, #7AD1C3)' }}
    >
      {/* Blobs decorativos */}
      <div className="absolute top-[-100px] right-[-100px] w-[300px] h-[300px] rounded-full bg-white opacity-5" />
      <div className="absolute bottom-[-150px] left-[-150px] w-[400px] h-[400px] rounded-full bg-white opacity-5" />

      <motion.div
        className="flex flex-col items-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        {/* Ícone */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="mb-6"
        >
          <div className="w-24 h-24 rounded-[24px] flex items-center justify-center"
            style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
          >
            <HeartPulse className="w-14 h-14 text-white" />
          </div>
        </motion.div>

        {/* Nome */}
        <motion.h1
          className="text-white tracking-tight mb-4"
          style={{ fontSize: '64px', fontWeight: 600 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          WayCare
        </motion.h1>

        {/* Linha divisória */}
        <motion.div
          className="h-[2px] w-[200px] mb-6"
          style={{ backgroundColor: 'rgba(255,255,255,0.6)' }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.6, duration: 0.4 }}
        />

        {/* Subtítulo */}
        <motion.p
          className="text-center"
          style={{ color: 'rgba(255,255,255,0.9)', fontSize: '20px', lineHeight: 1.5 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          Sua jornada de bem-estar<br />personalizada
        </motion.p>

        {/* Loader dots */}
        <motion.div
          className="flex gap-2 mt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: 'rgba(255,255,255,0.7)' }}
              animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Splash
