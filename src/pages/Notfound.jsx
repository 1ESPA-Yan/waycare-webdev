import { useNavigate } from 'react-router-dom'
import Icone from '../components/Icone'
import '../styles/notfound.css'

function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="nf-layout">

      {/* Círculos decorativos de fundo */}
      <div className="nf-circle nf-circle--1"></div>
      <div className="nf-circle nf-circle--2"></div>
      <div className="nf-circle nf-circle--3"></div>

      {/* Logo */}
      <div className="nf-logo">
        <img src="/images/logo-64.png" alt="WayCare" width="28" height="28" className="h-7 w-auto" />
        <span>WayCare</span>
      </div>

      <div className="nf-content">

        {/* Ícone animado */}
        <div className="nf-icon-wrap">
          <div className="nf-icon-ring"></div>
          <div className="nf-icon">
            <Icone nome="fa-map-location-dot" />
          </div>
        </div>

        {/* Número 404 */}
        <h1 className="nf-404">404</h1>

        {/* Textos */}
        <h2 className="nf-titulo">Trilha não encontrada</h2>
        <p className="nf-desc">
          Parece que você saiu da rota! Essa página não existe ou foi movida.<br />
          Vamos te ajudar a voltar para o caminho certo.
        </p>

        <button className="btn nf-btn-primary" onClick={() => navigate(-1)}>
          <Icone nome="fa-arrow-left" />
          Voltar à página anterior
        </button>

      </div>
    </div>
  )
}

export default NotFound