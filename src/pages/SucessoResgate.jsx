import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import Button from '../components/Button'
import '../styles/sucesso-resgate.css'

function SucessoResgate() {
  const location = useLocation()
  const navigate = useNavigate()
  const recompensa = location.state?.recompensa
  const codigo = location.state?.codigo
  const [copiado, setCopiado] = useState(false)

  if (!recompensa || !codigo) return <Navigate to="/recompensas" replace />

  const copiarCodigo = () => {
    navigator.clipboard.writeText(codigo).catch(() => {})
    setCopiado(true)
    setTimeout(() => setCopiado(false), 2000)
  }

  return (
    <div className="sucesso-page">
      <motion.div
        className="sucesso-container"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        {/* Ícone de sucesso */}
        <motion.div
          className="sucesso-check-wrap"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
        >
          <i className="fa-solid fa-check sucesso-check-icon"></i>
        </motion.div>

        <motion.h1
          className="sucesso-titulo"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Resgate Confirmado!
        </motion.h1>

        <motion.p
          className="sucesso-nome"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {recompensa.nome}
        </motion.p>

        {/* Próximos passos */}
        <motion.div
          className="sucesso-passos"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="sucesso-passos-titulo">Próximos Passos:</h2>
          <div className="sucesso-passos-lista">
            {[
              'Você receberá um e-mail em até 24h',
              'O voucher estará disponível em "Meu Perfil"',
              'Validade: 90 dias',
            ].map((passo, i) => (
              <motion.div
                key={i}
                className="sucesso-passo-item"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}
              >
                <div className="sucesso-passo-check">
                  <i className="fa-solid fa-check"></i>
                </div>
                <span>{passo}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Código do voucher */}
        <motion.div
          className="sucesso-voucher"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <h3 className="sucesso-voucher-titulo">Código do Voucher</h3>
          <div className="sucesso-voucher-codigo-wrap">
            <span className="sucesso-voucher-codigo">{codigo}</span>
          </div>
          <button
            onClick={copiarCodigo}
            className={`btn sucesso-btn-copiar ${copiado ? 'copiado' : ''}`}
          >
            {copiado ? (
              <><i className="fa-solid fa-check-double"></i> Copiado!</>
            ) : (
              <><i className="fa-regular fa-copy"></i> Copiar código</>
            )}
          </button>
        </motion.div>

        {/* Ações */}
        <motion.div
          className="sucesso-actions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <Button className="sucesso-btn" onClick={() => navigate('/recompensas')}>
            Ver Catálogo de Recompensas
          </Button>
          <Button variante="fantasma" className="sucesso-btn" onClick={() => navigate('/dashboard')}>
            Voltar ao Início
          </Button>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default SucessoResgate
