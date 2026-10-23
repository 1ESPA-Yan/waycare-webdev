import { Navigate, Outlet } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import CarregandoPagina from './CarregandoPagina'

// Envolve as rotas do app: aceita conta real (Supabase) ou modo demonstração.
// Enquanto a sessão salva é lida, mostra o carregamento em vez de mandar para o login.
function RotaPrivada() {
  const { logado, carregandoSessao } = useApp()
  if (carregandoSessao) return <CarregandoPagina telaCheia />
  return logado ? <Outlet /> : <Navigate to="/" replace />
}

export default RotaPrivada
