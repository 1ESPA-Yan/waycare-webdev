// Etiqueta pequena (categoria, dificuldade, tag). `cor` aceita 'info' ou 'badge-info',
// o formato que vem nos JSON (categoriaBadge, impactoBadge).
function Chip({ cor = 'muted', className = '', children }) {
  const classeCor = cor.startsWith('badge-') ? cor : `badge-${cor}`
  return <span className={`badge ${classeCor} ${className}`.trim()}>{children}</span>
}

export default Chip
