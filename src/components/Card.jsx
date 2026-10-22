// Cartão padrão do app (fundo branco, borda, sombra e cantos arredondados do .card)
function Card({ as: Tag = 'div', className = '', children, ...props }) {
  return (
    <Tag className={`card ${className}`.trim()} {...props}>
      {children}
    </Tag>
  )
}

export default Card
