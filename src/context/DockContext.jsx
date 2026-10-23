import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'
import { useApp } from './AppContext'
import { rpc } from '../lib/supabase'

const DockContext = createContext()

const INTERVALO_MS = 10000

// Painel da conta real: chama rpc('painel') a cada 10 s enquanto a aba está
// visível e recarrega quando ela volta. Em caso de erro, mantém o último painel.
export function DockProvider({ children }) {
  const { contaReal, emailUsuario } = useApp()
  const [painel, setPainel] = useState(null)
  const [erro, setErro] = useState(null)

  const recarregar = useCallback(async () => {
    try {
      const dados = await rpc('painel')
      setPainel(dados)
      setErro(null)
    } catch (falha) {
      setErro(falha.message)
    }
  }, [])

  useEffect(() => {
    if (!contaReal) return
    let id = null
    const parar = () => { clearInterval(id); id = null }
    const iniciar = () => {
      parar()
      recarregar()
      id = setInterval(recarregar, INTERVALO_MS)
    }
    const aoMudarVisibilidade = () => (document.hidden ? parar() : iniciar())

    if (!document.hidden) iniciar()
    document.addEventListener('visibilitychange', aoMudarVisibilidade)
    return () => {
      parar()
      document.removeEventListener('visibilitychange', aoMudarVisibilidade)
      // Ao sair ou trocar de conta, não mostra o painel da conta anterior
      setPainel(null)
      setErro(null)
    }
  }, [contaReal, emailUsuario, recarregar])

  const carregando = contaReal && !painel && !erro

  const value = useMemo(
    () => ({ painel, erro, carregando, recarregar }),
    [painel, erro, carregando, recarregar]
  )

  return <DockContext.Provider value={value}>{children}</DockContext.Provider>
}

// O hook fica junto do Provider de propósito; o aviso de Fast Refresh não se aplica
// eslint-disable-next-line react-refresh/only-export-components
export function useDock() {
  return useContext(DockContext)
}
