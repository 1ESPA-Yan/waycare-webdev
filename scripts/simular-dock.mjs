// ============================================================================
//  Simulador da WayCare Dock v7
// ============================================================================
//  Faz o papel da dock: chama a função dock_sync do Supabase com a chave anon,
//  no mesmo formato do firmware (veja supabase/schema.sql do pacote da dock).
//
//  Uso:  npm run dock -- <comando>
//        (ou: node --env-file=.env.local scripts/simular-dock.mjs <comando>)
//
//  O estado da dock simulada (id, segredo, geração, último seq, peso) fica num
//  arquivo na pasta temporária do sistema, fora do repositório.
// ============================================================================

import { createClient } from '@supabase/supabase-js'
import { randomBytes, randomInt } from 'node:crypto'
import { existsSync, readFileSync, writeFileSync, unlinkSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const ARQUIVO = join(tmpdir(), 'waycare-dock-simulada.json')
const PESO_FORA = -300 // sem a garrafa a balança fica negativa (tara feita com a garrafa vazia)

const AJUDA = `
Simulador da WayCare Dock (Supabase)

Comandos:
  registrar          cria uma dock falsa e mostra o código para vincular no site
  tara               zera a balança com a garrafa vazia (leitura 0 g pós-tara)
  encher <ml>        põe água na garrafa (reabastecimento)
  gole <ml>          bebe da garrafa
  tirar              tira a garrafa da dock
  devolver [ml]      devolve a garrafa (opcional: ml bebidos enquanto estava fora)
  status             manda um sinal sem leitura e mostra a resposta (LED, tara pendente, vínculo)
  esquecer           apaga o estado local da dock simulada (para registrar outra)

Ordem de teste:
  1. npm run dock -- registrar
  2. no site, vincule a dock com o código mostrado
  3. npm run dock -- tara
  4. npm run dock -- encher 600
  5. npm run dock -- gole 150

Atenção:
  - Goles enviados antes do vínculo não contam para ninguém.
  - Cada conta só pode ter 1 dock. Antes de vincular a dock real,
    desvincule a simulada no site (WayCare Bottle > Informações do
    dispositivo > Desvincular dock).
`

function falhar(msg) {
  console.error(`\n✗ ${msg}\n`)
  process.exit(1)
}

function lerEstado() {
  if (!existsSync(ARQUIVO)) return null
  return JSON.parse(readFileSync(ARQUIVO, 'utf8'))
}

function salvarEstado(estado) {
  writeFileSync(ARQUIVO, JSON.stringify(estado, null, 2))
}

function exigirEstado() {
  const estado = lerEstado()
  if (!estado) falhar('Nenhuma dock simulada. Rode primeiro: npm run dock -- registrar')
  return estado
}

function cliente() {
  const url = process.env.VITE_SUPABASE_URL
  const chave = process.env.VITE_SUPABASE_KEY
  if (!url || !chave) falhar('Faltam VITE_SUPABASE_URL e VITE_SUPABASE_KEY no .env.local.')
  return createClient(url, chave, { auth: { persistSession: false } })
}

function lerMl(valor, comando) {
  const ml = Number(valor)
  if (!Number.isFinite(ml) || ml <= 0) falhar(`Informe os ml: npm run dock -- ${comando} 150`)
  return ml
}

// Envia um dock_sync com as leituras (peso estável) e a telemetria simulada
async function sincronizar(estado, leituras = []) {
  const corpo = {
    id: estado.id,
    segredo: estado.segredo,
    codigo: estado.codigo,
    fw: 'simulador-1.0',
    bat_pct: 90,
    bat_v: 4.05,
    usb: true,
    rssi: -55,
    rede: 'Simulador',
    leituras: leituras.map(({ peso, posTara }) => ({
      g: estado.geracao,
      s: ++estado.seq,
      t: Math.floor(Date.now() / 1000),
      a: 0,
      p: Math.round(peso * 10) / 10,
      z: posTara ? 1 : 0,
    })),
  }
  const { data, error } = await cliente().rpc('dock_sync', { p: corpo })
  if (error) falhar(`Erro do Supabase: ${error.message}`)
  if (!data?.ok) falhar(`A dock foi recusada: ${data?.erro ?? 'resposta inesperada'}`)
  estado.ultimaResposta = data
  salvarEstado(estado)
  return data
}

function mostrarResposta(r, estado) {
  console.log(`  aceitas: ${r.aceitas} | LED: ${r.led} | vinculada: ${r.vinculada ? 'sim' : 'não'} | peso na garrafa: ${estado.peso} g`)
  if (r.tara) console.log('  → O site pediu para zerar a balança. Rode: npm run dock -- tara')
  if (!r.vinculada) console.log(`  → Ainda sem dono: vincule no site com o código ${estado.codigo}`)
}

const [comando, arg] = process.argv.slice(2)

switch (comando) {
  case 'registrar': {
    if (lerEstado()) falhar(`Já existe uma dock simulada (${lerEstado().id}). Use "status", ou "esquecer" para registrar outra.`)
    const letras = 'ABCDEFGHJKLMNPQRSTUVWXYZ' // sem I e O, para não confundir com 1 e 0
    const estado = {
      id: `wd-${randomBytes(3).toString('hex')}`,
      segredo: randomBytes(16).toString('hex'), // 32 caracteres
      codigo: Array.from({ length: 6 }, () => letras[randomInt(letras.length)]).join(''),
      geracao: randomInt(1, 100000),
      seq: 0,
      peso: 0,
      foraDaDock: false,
    }
    const r = await sincronizar(estado)
    console.log(`\n✓ Dock simulada registrada: ${estado.id}`)
    console.log(`\n  Código para vincular no site:  ${estado.codigo}\n`)
    mostrarResposta(r, estado)
    console.log(`\n  Estado salvo em ${ARQUIVO}\n`)
    break
  }
  case 'tara': {
    const estado = exigirEstado()
    estado.peso = 0
    estado.foraDaDock = false
    const r = await sincronizar(estado, [{ peso: 0, posTara: true }])
    console.log('\n✓ Balança zerada com a garrafa vazia')
    mostrarResposta(r, estado)
    break
  }
  case 'encher': {
    const estado = exigirEstado()
    if (estado.foraDaDock) falhar('A garrafa está fora da dock. Rode "devolver" antes.')
    estado.peso += lerMl(arg, 'encher')
    const r = await sincronizar(estado, [{ peso: estado.peso }])
    console.log(`\n✓ Garrafa reabastecida (+${arg} ml)`)
    mostrarResposta(r, estado)
    break
  }
  case 'gole': {
    const estado = exigirEstado()
    if (estado.foraDaDock) falhar('A garrafa está fora da dock. Use "devolver <ml>" para registrar o que bebeu fora.')
    const ml = lerMl(arg, 'gole')
    if (ml > estado.peso) falhar(`A garrafa só tem ${estado.peso} ml. Rode "encher" antes.`)
    estado.peso -= ml
    const r = await sincronizar(estado, [{ peso: estado.peso }])
    console.log(`\n✓ Gole de ${ml} ml`)
    mostrarResposta(r, estado)
    break
  }
  case 'tirar': {
    const estado = exigirEstado()
    if (estado.foraDaDock) falhar('A garrafa já está fora da dock.')
    estado.foraDaDock = true
    const r = await sincronizar(estado, [{ peso: PESO_FORA }])
    console.log('\n✓ Garrafa fora da dock')
    mostrarResposta(r, estado)
    break
  }
  case 'devolver': {
    const estado = exigirEstado()
    if (!estado.foraDaDock) falhar('A garrafa já está na dock.')
    const bebido = arg ? lerMl(arg, 'devolver') : 0
    if (bebido > estado.peso) falhar(`A garrafa só tinha ${estado.peso} ml.`)
    estado.peso -= bebido
    estado.foraDaDock = false
    const r = await sincronizar(estado, [{ peso: estado.peso }])
    console.log(`\n✓ Garrafa de volta${bebido ? ` (bebeu ${bebido} ml fora)` : ''}`)
    mostrarResposta(r, estado)
    break
  }
  case 'status': {
    const estado = exigirEstado()
    const r = await sincronizar(estado)
    console.log(`\n✓ Dock ${estado.id} (código ${estado.codigo})`)
    mostrarResposta(r, estado)
    break
  }
  case 'esquecer': {
    if (existsSync(ARQUIVO)) unlinkSync(ARQUIVO)
    console.log('\n✓ Estado local apagado. A dock continua no Supabase; se estiver vinculada, desvincule-a na WayCare Bottle.\n')
    break
  }
  default:
    console.log(AJUDA)
}
