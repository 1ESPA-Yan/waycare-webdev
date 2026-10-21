import { Navigate, Outlet } from 'react-router-dom'
import { useApp } from '../context/AppContext'

// Envolve as rotas do app: sem sessão, volta para o login
function RotaPrivada() {
  const { logado } = useApp()
  return logado ? <Outlet /> : <Navigate to="/" replace />
}

export default RotaPrivada
