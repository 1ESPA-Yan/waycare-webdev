import { createClient } from '@supabase/supabase-js'

// Cliente do Supabase (o mesmo projeto da dock v7). As chaves vêm do .env.local
// (VITE_SUPABASE_URL e VITE_SUPABASE_KEY). Sem elas, o site fica no modo demonstração.
const url = import.meta.env.VITE_SUPABASE_URL
const chave = import.meta.env.VITE_SUPABASE_KEY

export const configurado = Boolean(url && chave)

export const supabase = configurado
  ? createClient(url, chave, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    })
  : null

// Traduz os erros mais comuns para uma mensagem que dá para mostrar ao usuário
function mensagemDeErro(erro) {
  const texto = erro?.message || String(erro)
  if (/failed to fetch|networkerror|load failed/i.test(texto)) {
    return 'Sem conexão com o servidor. Verifique sua internet e tente de novo.'
  }
  if (erro?.code === 'PGRST301' || /jwt expired|not authenticated|invalid jwt/i.test(texto)) {
    return 'Sua sessão expirou. Entre de novo.'
  }
  return texto
}

// Chama uma função (RPC) do banco e devolve os dados. Em caso de erro, lança um
// Error com mensagem legível. Algumas funções devolvem { ok: false, erro } (ex.:
// vincular_dock): esse erro, que já vem em português do banco, também é lançado.
export async function rpc(nome, args = {}) {
  if (!supabase) throw new Error('Supabase não configurado (faltam as variáveis no .env.local).')
  let resposta
  try {
    resposta = await supabase.rpc(nome, args)
  } catch (erro) {
    throw new Error(mensagemDeErro(erro), { cause: erro })
  }
  const { data, error } = resposta
  if (error) throw new Error(mensagemDeErro(error), { cause: error })
  if (data && typeof data === 'object' && data.ok === false) throw new Error(data.erro || 'Não foi possível concluir a operação.')
  return data
}
