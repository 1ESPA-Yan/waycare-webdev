import { Link, useNavigate } from 'react-router-dom'
import Icone from './Icone'
import '../styles/legal.css'

// Layout das páginas de Termos de Uso e Política de Privacidade
function DocumentoLegal({ titulo, atualizadoEm, children }) {
  const navigate = useNavigate()

  // Aberta em nova aba (sem histórico), o "Voltar" leva ao login
  const voltar = () => (window.history.length > 1 ? navigate(-1) : navigate('/'))

  return (
    <div className="legal-page">
      <header className="legal-header">
        <Link to="/" className="legal-logo">
          <img src="/images/logo-64.png" alt="" width="28" height="28" />
          WayCare
        </Link>
        <button type="button" className="legal-voltar" onClick={voltar}>
          <Icone nome="fa-chevron-left" /> Voltar
        </button>
      </header>

      <main className="legal-conteudo">
        <h1 className="legal-titulo">{titulo}</h1>
        <p className="legal-atualizado">Atualizado em {atualizadoEm}</p>
        <p className="legal-aviso">
          <Icone nome="fa-circle-info" />
          <span>
            O WayCare está em fase de protótipo. Este é um texto resumido, que será revisado antes
            do lançamento.
          </span>
        </p>
        {children}
      </main>
    </div>
  )
}

export default DocumentoLegal
