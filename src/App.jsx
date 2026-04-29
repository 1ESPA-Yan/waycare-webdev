import { BrowserRouter, Routes, Route } from 'react-router-dom'

// Páginas
import Login from './pages/Login'
import Cadastro from './pages/Cadastro'
import Onboarding from './pages/Onboarding'
import Dashboard from './pages/Dashboard'
import Trilhas from './pages/Trilhas'
import Conquistas from './pages/Conquistas'
import Descobertas from './pages/Descobertas'
import Recompensas from './pages/Recompensas'
import Perfil from './pages/Perfil'
import Configuracoes from './pages/Configuracoes'
import WaycareBotlle from './pages/WaycareBottle'

// Estilos globais
import './styles/global.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/onboarding" element={<Onboarding />} />

        {/* App */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/trilhas" element={<Trilhas />} />
        <Route path="/conquistas" element={<Conquistas />} />
        <Route path="/descobertas" element={<Descobertas />} />
        <Route path="/recompensas" element={<Recompensas />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/configuracoes" element={<Configuracoes />} />
        <Route path="/waycare-bottle" element={<WaycareBotlle />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App