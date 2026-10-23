import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// CSS global primeiro: tokens, reset e componentes base; o CSS das páginas vem
// depois (no App) e vence as regras globais de mesma especificidade
import './styles/global.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)