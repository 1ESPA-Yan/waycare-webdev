import { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { useApp } from './AppContext'
import { rpc } from '../lib/supabase'
import { calcularMeta, temperaturaAtual } from '../lib/meta'

const DockContext = createContext()

const INTERVALO_MS = 10000

// Recalcula a meta com a temperatura do dia (mesma regra do PWA da dock)
async function atualizarMetaDoDia(perfil) {
  const temp = perfil.lat != null ? await temperaturaAtual(perfil.lat, perfil.lon) : null
  const det = calcularMeta(Number(perfil.peso_kg), perfil.genero, temp, perfil.atividade)
  await rpc('salvar_meta', { p_meta: det.meta, p_temp: temp, p_detalhe: { ...det, temp } })
}

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

  // Meta do dia: na primeira carga do dia, se perfil.meta_dia não for hoje, recalcula
  // uma vez (por conta e por dia) e recarrega o painel
  const metaTentada = useRef('')
  useEffect(() => {
    const perfil = painel?.perfil
    const dia = painel?.hoje?.dia
    const chave = `${emailUsuario}|${dia}`
    if (!perfil?.peso_kg || !dia || perfil.meta_dia === dia || metaTentada.current === chave) return
    metaTentada.current = chave
    atualizarMetaDoDia(perfil).then(recarregar).catch(() => { /* tenta de novo amanhã ou ao recarregar o site */ })
  }, [painel, emailUsuario, recarregar])

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
