import { useEffect, useState } from 'react'

// Cada JSON de src/data vira um arquivo próprio no build, carregado sob demanda
const arquivos = import.meta.glob('../data/*.json', { import: 'default' })

// Carrega src/data/<nome>.json. Devolve { dados, carregando, erro }.
// Com erro, carregando fica false e dados null (a página mostra o estado vazio).
export function useDados(nome) {
  const carregar = arquivos[`../data/${nome}.json`]
  const [estado, setEstado] = useState({ nome: null, dados: null, erro: null })

  useEffect(() => {
    if (!carregar) return
    let ativo = true
    carregar()
      .then(dados => { if (ativo) setEstado({ nome, dados, erro: null }) })
      .catch(erro => { if (ativo) setEstado({ nome, dados: null, erro }) })
    return () => { ativo = false }
  }, [nome, carregar])

  if (!carregar) {
    return { dados: null, carregando: false, erro: new Error(`Dados "${nome}" não encontrados em src/data`) }
  }
  const pronto = estado.nome === nome
  return { dados: pronto ? estado.dados : null, carregando: !pronto, erro: pronto ? estado.erro : null }
}
