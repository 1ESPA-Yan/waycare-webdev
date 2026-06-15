import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { useApp } from '../context/AppContext'
import '../styles/confirmar-resgate.css'

function ConfirmarResgate() {
  const location = useLocation()
  const navigate = useNavigate()
  const { totalHC, adicionarHC } = useApp()
  const recompensa = location.state?.recompensa

  const [aceitouTermos, setAceitouTermos] = useState(false)

  if (!recompensa) {
    navigate('/recompensas')
    return null
  }

  const saldoApos = totalHC - recompensa.preco

  const handleConfirmar = () => {
    if (!aceitouTermos) return
    adicionarHC(-recompensa.preco)
    navigate('/resgate/sucesso', { state: { recompensa } })
  }

  return (
    <div className="confirmar-overlay">
      <motion.div
        className="confirmar-modal"
        initial={{ opacity: 0, scale: 0.9, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 25 }}
      >
        {/* Header */}
        <div className="confirmar-header">
          <h2 className="confirmar-header-titulo">Confirmar Resgate</h2>
          <button
            onClick={() => navigate(-1)}
            className="confirmar-close-btn"
            aria-label="Fechar"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Conteúdo */}
        <div className="confirmar-content">

          {/* Preview do item */}
          <div className="confirmar-preview">
            <div className="confirmar-preview-icon">
              <i className={`fa-solid ${recompensa.icone}`}></i>
            </div>
            <h3 className="confirmar-preview-nome">{recompensa.nome}</h3>
          </div>

          <div className="confirmar-divider"></div>

          {/* Detalhes financeiros */}
          <div className="confirmar-detalhes">
            <div className="confirmar-detalhe-row">
              <span className="confirmar-detalhe-label">Valor:</span>
              <div className="confirmar-detalhe-valor">
                <i className="fa-solid fa-coins"></i>
                <span>{recompensa.preco} HC</span>
              </div>
            </div>
            <div className="confirmar-detalhe-row">
              <span className="confirmar-detalhe-label">Saldo atual:</span>
              <div className="confirmar-detalhe-valor">
                <i className="fa-solid fa-coins"></i>
                <span>{totalHC} HC</span>
              </div>
            </div>
            <div className="confirmar-detalhe-row">
              <span className="confirmar-detalhe-label">Saldo após resgate:</span>
              <div className="confirmar-detalhe-valor confirmar-detalhe-valor--destaque">
                <i className="fa-solid fa-coins"></i>
                <span>{saldoApos} HC</span>
              </div>
            </div>
          </div>

          <div className="confirmar-divider"></div>

          {/* Termos */}
          <div className="confirmar-termos-wrap">
            <label className="confirmar-termos-label" onClick={() => setAceitouTermos(v => !v)}>
              <div className={`confirmar-checkbox ${aceitouTermos ? 'checked' : ''}`}>
                {aceitouTermos && (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>
              <div className="confirmar-termos-texto">
                <span>Li e aceito os termos de resgate</span>
                <a href="#" onClick={e => e.preventDefault()} className="confirmar-termos-link">
                  Ver termos completos <i className="fa-solid fa-arrow-up-right-from-square"></i>
                </a>
              </div>
            </label>
          </div>

          {/* Aviso */}
          <div className="confirmar-aviso">
            <i className="fa-solid fa-triangle-exclamation"></i>
            <span>Esta ação não pode ser desfeita</span>
          </div>

          {/* Ações */}
          <div className="confirmar-actions">
            <motion.button
              className={`btn confirmar-btn-confirmar ${!aceitouTermos ? 'disabled' : ''}`}
              onClick={handleConfirmar}
              disabled={!aceitouTermos}
              whileHover={aceitouTermos ? { scale: 1.01 } : {}}
              whileTap={aceitouTermos ? { scale: 0.98 } : {}}
            >
              Confirmar Resgate
            </motion.button>
            <button
              className="btn confirmar-btn-cancelar"
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

export default ConfirmarResgate
