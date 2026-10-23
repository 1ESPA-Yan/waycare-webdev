import { Link } from 'react-router-dom'
import { useHidratacao } from '../hooks/useHidratacao'
import Icone from './Icone'

// Aviso curto quando falta um passo do primeiro uso (perfil, vínculo ou tara).
// Leva para /dock/vincular. Não aparece no modo demonstração nem enquanto carrega.
function AvisoPrimeiroUso({ className = '' }) {
  const { modo, perfil, dock } = useHidratacao()
  if (!modo || modo === 'demo') return null

  let texto = null
  if (!perfil?.peso_kg) texto = 'Complete seu perfil para calcular a sua meta de água.'
  else if (!dock) texto = 'Conecte a sua dock para medir a água automaticamente.'
  else if (!dock.tarada) texto = 'Falta zerar a balança da dock com a garrafa vazia.'
  if (!texto) return null

  return (
    <div className={`aviso-primeiro-uso ${className}`.trim()} role="status">
      <Icone nome="fa-circle-info" />
      <span>{texto}</span>
      <Link to="/dock/vincular" className="aviso-primeiro-uso-link">
        Continuar <Icone nome="fa-arrow-right" />
      </Link>
    </div>
  )
}

export default AvisoPrimeiroUso
