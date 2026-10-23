import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { MotionConfig } from 'motion/react'
import { AppProvider } from './context/AppContext'

// Login, layout e guarda de rota vêm no bundle principal (primeira tela)
import Login from './pages/Login'
import RotaPrivada from './components/RotaPrivada'
import AppLayout from './components/AppLayout'
import CarregandoPagina from './components/CarregandoPagina'

// CSS de todas as páginas no arquivo principal, nesta ordem: depois do global.css
// (importado no main.jsx) e antes dos utilitários. Separado por página, a ordem
// mudaria conforme a navegação e uma regra poderia passar a vencer outra.
import './styles/auth.css'
import './styles/topbar.css'
import './styles/dashboard.css'
import './styles/trilhas.css'
import './styles/conquistas.css'
import './styles/descobertas.css'
import './styles/recompensas.css'
import './styles/perfil.css'
import './styles/configuracoes.css'
import './styles/waycare-bottle.css'
import './styles/carteira.css'
import './styles/notificacoes.css'
import './styles/selecionarHumor.css'
import './styles/detalhes-missao.css'
import './styles/missao-completa.css'
import './styles/confirmar-resgate.css'
import './styles/sucesso-resgate.css'
import './styles/notfound.css'
import './styles/legal.css'
import './styles/utilitarios.css'

// Demais páginas: o JS de cada uma é carregado só quando a rota abre
const Onboarding = lazy(() => import('./pages/Onboarding'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Trilhas = lazy(() => import('./pages/Trilhas'))
const Conquistas = lazy(() => import('./pages/Conquistas'))
const Descobertas = lazy(() => import('./pages/Descobertas'))
const Recompensas = lazy(() => import('./pages/Recompensas'))
const Perfil = lazy(() => import('./pages/Perfil'))
const Configuracoes = lazy(() => import('./pages/Configuracoes'))
const WaycareBottle = lazy(() => import('./pages/WayCareBottle'))
const Carteira = lazy(() => import('./pages/Carteira'))
const Notificacoes = lazy(() => import('./pages/Notificacoes'))
const SelecionarHumor = lazy(() => import('./pages/SelecionarHumor'))
const DetalhesMissao = lazy(() => import('./pages/DetalhesMissao'))
const MissaoCompleta = lazy(() => import('./pages/MissaoCompleta'))
const ConfirmarResgate = lazy(() => import('./pages/ConfirmarResgate'))
const SucessoResgate = lazy(() => import('./pages/SucessoResgate'))
const NotFound = lazy(() => import('./pages/Notfound'))
const Termos = lazy(() => import('./pages/Termos'))
const Privacidade = lazy(() => import('./pages/Privacidade'))

function App() {
  return (
    <MotionConfig reducedMotion="user">
      <AppProvider>
        <BrowserRouter>
          <Suspense fallback={<CarregandoPagina telaCheia />}>
            <Routes>
              {/* Auth */}
              <Route path="/" element={<Login />} />
              {/* Entrar e criar conta agora são a mesma tela (login por código) */}
              <Route path="/cadastro" element={<Navigate to="/" replace />} />
              <Route path="/termos" element={<Termos />} />
              <Route path="/privacidade" element={<Privacidade />} />

              {/* App — exige sessão */}
              <Route element={<RotaPrivada />}>
                {/* Páginas com Sidebar */}
                <Route element={<AppLayout />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/trilhas" element={<Trilhas />} />
                  <Route path="/conquistas" element={<Conquistas />} />
                  <Route path="/descobertas" element={<Descobertas />} />
                  <Route path="/recompensas" element={<Recompensas />} />
                  <Route path="/perfil" element={<Perfil />} />
                  <Route path="/configuracoes" element={<Configuracoes />} />
                  <Route path="/waycare-bottle" element={<WaycareBottle />} />
                  <Route path="/carteira" element={<Carteira />} />
                  <Route path="/notificacoes" element={<Notificacoes />} />
                </Route>

                {/* Telas cheias, sem Sidebar */}
                <Route path="/onboarding" element={<Onboarding />} />
                <Route path="/humor" element={<SelecionarHumor />} />
                <Route path="/missao/completa" element={<MissaoCompleta />} />
                <Route path="/missao/:id" element={<DetalhesMissao />} />
                <Route path="/resgate/confirmar" element={<ConfirmarResgate />} />
                <Route path="/resgate/sucesso" element={<SucessoResgate />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AppProvider>
    </MotionConfig>
  )
}

export default App