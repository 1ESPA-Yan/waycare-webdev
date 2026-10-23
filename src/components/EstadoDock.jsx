import { Link } from 'react-router-dom'
import { useHidratacao } from '../hooks/useHidratacao'
import { tempoDesde } from '../lib/tempo'
import Icone from './Icone'

// Indicador do estado da dock no Topbar. Leva para a Bottle ou para o passo pendente.
// Some enquanto o primeiro painel da conta real carrega.
function EstadoDock() {
  const { modo, dock } = useHidratacao()
  if (!modo) return null

  const estado = {
    demo: { texto: 'Demonstração', icone: 'fa-compass', tom: 'neutro', para: '/waycare-bottle' },
    'sem-perfil': { texto: 'Complete seu perfil', icone: 'fa-user', tom: 'aviso', para: '/perfil#meta-hidratacao' },
    'sem-dock': { texto: 'Vincular dock', icone: 'fa-wifi', tom: 'aviso', para: '/dock/vincular' },
    'dock-online': { texto: 'Dock conectada', icone: 'fa-wifi', tom: 'ok', para: '/waycare-bottle' },
    'dock-offline': {
      texto: `Dock offline${dock?.ultimo_contato ? ` · ${tempoDesde(dock.ultimo_contato)}` : ''}`,
      icone: 'fa-plug-circle-xmark',
      tom: 'erro',
      para: '/waycare-bottle',
    },
  }[modo]

  return (
    <Link to={estado.para} className={`estado-dock estado-dock--${estado.tom}`} title={estado.texto}>
      <Icone nome={estado.icone} />
      {/* Em telas médias só o ícone aparece; o texto continua para leitores de tela */}
      <span className="estado-dock-texto">{estado.texto}</span>
    </Link>
  )
}

export default EstadoDock
