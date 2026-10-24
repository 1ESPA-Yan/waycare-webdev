import { useState } from 'react'
import { useHidratacao } from './useHidratacao'
import { rpc } from '../lib/supabase'

// Pedido para a dock abrir o portal de Wi-Fi: rpc('pedir_portal') e recarrega o painel.
// O pedido fica pendente (dock.portal_pendente) até a dock pegar no próximo contato;
// aí a luz fica azul e o celular conecta na rede da dock (`nomeRede`).
export function usePortal() {
  const { dock, recarregar } = useHidratacao()
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState('')
  const [pediu, setPediu] = useState(false)
  const [viuPendente, setViuPendente] = useState(false)

  const pendente = Boolean(dock?.portal_pendente)
  const nomeRede = dock ? `WayDock-${dock.id.slice(5).toUpperCase()}` : ''
  // Só diz "portal aberto" depois de ver o pedido pendente e ele sumir
  if (pediu && pendente && !viuPendente) setViuPendente(true)
  const aberto = viuPendente && !pendente

  const pedir = async () => {
    setEnviando(true)
    setErro('')
    setViuPendente(false)
    try {
      await rpc('pedir_portal')
      setPediu(true)
      await recarregar()
    } catch (falha) {
      setErro(falha.message)
    } finally {
      setEnviando(false)
    }
  }

  return { disponivel: Boolean(dock), pedir, enviando, pendente, aberto, erro, nomeRede }
}
