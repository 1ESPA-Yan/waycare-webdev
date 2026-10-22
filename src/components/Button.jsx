import { Link } from 'react-router-dom'

const VARIANTES = {
  primario: 'btn-primary',
  secundario: 'btn-secondary',
  fantasma: 'btn-ghost',
}

const TAMANHOS = { sm: 'btn-sm', md: '', lg: 'btn-lg' }

// Botão padrão do app. Com `to`, vira um link do React Router com o mesmo visual.
function Button({ variante = 'primario', tamanho = 'md', bloco = false, to, className = '', type = 'button', children, ...props }) {
  const classes = ['btn', VARIANTES[variante], TAMANHOS[tamanho], bloco && 'btn-block', className]
    .filter(Boolean)
    .join(' ')

  if (to) {
    return <Link to={to} className={classes} {...props}>{children}</Link>
  }
  return <button type={type} className={classes} {...props}>{children}</button>
}

export default Button
