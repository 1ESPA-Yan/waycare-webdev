import Icone from './Icone'

// Linha de filtros em pílulas, igual em todas as páginas.
// opcoes: [{ key, label, icon?, contagem? }]
function FiltroPills({ opcoes, ativo, aoMudar, rotulo = 'Filtros', className = '' }) {
  return (
    <div className={`filtro-pills ${className}`.trim()} role="group" aria-label={rotulo}>
      {opcoes.map(op => (
        <button
          key={op.key}
          type="button"
          className={`filtro-pill${ativo === op.key ? ' active' : ''}`}
          onClick={() => aoMudar(op.key)}
          aria-pressed={ativo === op.key}
        >
          {op.icon && <Icone nome={op.icon} />}
          {op.label}
          {op.contagem != null && <span className="filtro-pill-contagem">{op.contagem}</span>}
        </button>
      ))}
    </div>
  )
}

export default FiltroPills
