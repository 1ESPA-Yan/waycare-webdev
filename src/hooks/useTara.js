import { useState } from 'react'
import { useHidratacao } from './useHidratacao'
import { rpc } from '../lib/supabase'

const MSG_PENDENTE = 'Pedido enviado. A dock zera no próximo contato; tirar e pôr a garrafa acorda a dock.'

// Pedido de tara pelo site: rpc('pedir_tara') e recarrega o painel.
// A tara fica pendente (dock.tara_pendente) até a dock executar no próximo contato.
// `disponivel` é falso no modo demonstração e sem dock vinculada.
export function useTara() {
  const { dock, recarregar } = useHidratacao()
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState('')
  const [pediu, setPediu] = useState(false)
  const [viuPendente, setViuPendente] = useState(false)

  const pendente = Boolean(dock?.tara_pendente)
  // Só diz "Balança zerada" depois de ver o pedido pendente e ele sumir
  if (pediu && pendente && !viuPendente) setViuPendente(true)
  const concluida = viuPendente && !pendente

  const pedir = async () => {
    setEnviando(true)
    setErro('')
    setViuPendente(false)
    try {
      await rpc('pedir_tara')
      setPediu(true)
      await recarregar()
    } catch (falha) {
      setErro(falha.message)
    } finally {
      setEnviando(false)
    }
  }

  const mensagem = enviando ? '' : pendente ? MSG_PENDENTE : concluida ? 'Balança zerada ✓' : ''

  return { disponivel: Boolean(dock), pedir, enviando, pendente, erro, mensagem }
}
