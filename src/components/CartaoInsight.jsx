// Uma frase de insight (lib/insights.js). tom: 'bom' | 'neutro' | 'atencao'
function CartaoInsight({ insight, as: Tag = 'li' }) {
  return (
    <Tag className={`insight-cartao insight-cartao--${insight.tom}`}>
      <span className="insight-ponto" aria-hidden="true"></span>
      <div>
        <h3 className="insight-titulo">{insight.titulo}</h3>
        <p className="insight-texto">{insight.texto}</p>
      </div>
    </Tag>
  )
}

export default CartaoInsight
