import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'

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
import WaycareBottle from './pages/WaycareBottle'
import Carteira from './pages/Carteira'
import NotFound from './pages/Notfound'

import './styles/global.css'
import './styles/notfound.css'

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Auth */}
          <Route path="/" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/onboarding" element={<Onboarding />} />

          {/* App */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/trilhas" element={<Trilhas />} />
          <Route path="/conquistas" element={<Conquistas />} />
          <Route path="/descobertas" element={<Descobertas />} />
          <Route path="/recompensas" element={<Recompensas />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/configuracoes" element={<Configuracoes />} />
          <Route path="/waycare-bottle" element={<WaycareBottle />} />
          <Route path="/carteira" element={<Carteira />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}

export default App