import { useState } from 'react'
import { rpc } from '../lib/supabase'
import Card from './Card'
import Icone from './Icone'

const ATALHOS = [200, 300, 500]
const MAXIMO_SOMAR = 3000

// Ajuste manual do consumo de hoje: rpc('ajustar_consumo', { p_ml }).
// Positivo soma (água bebida fora da garrafa); negativo tira do total, nunca mais
// do que o consumido hoje. O banco confere de novo e devolve o erro em português.
function AjusteConsumo({ consumo, recarregar }) {
  const [modo, setModo] = useState('somar')
  const [valor, setValor] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [mensagem, setMensagem] = useState(null)   // { tipo: 'ok' | 'erro', texto }

  const tirar = modo === 'tirar'
  const n = Math.round(Number(valor))
  const maximo = tirar ? consumo : MAXIMO_SOMAR
  const invalido = !n || n <= 0 || n > maximo
  const erroCampo = valor && n > maximo
    ? (tirar ? `Hoje você só tem ${consumo.toLocaleString('pt-BR')} ml registrados.` : 'No máximo 3.000 ml por vez.')
    : ''

  function trocarModo(novo) {
    setModo(novo)
    setMensagem(null)
  }

  async function enviar(e) {
    e.preventDefault()
    if (invalido) return
    setEnviando(true)
    setMensagem(null)
    try {
      await rpc('ajustar_consumo', { p_ml: tirar ? -n : n })
      await recarregar()
      setMensagem({ tipo: 'ok', texto: tirar ? `Tirei ${n} ml do total de hoje.` : `Somei ${n} ml ao total de hoje.` })
      setValor('')
    } catch (falha) {
      setMensagem({ tipo: 'erro', texto: falha.message })
    } finally {
      setEnviando(false)
    }
  }

  return (
    <Card>
      <h2 className="bottle-col-titulo mb-4">
        <Icone nome="fa-pen-to-square" className="bottle-col-titulo-icon" />
        Ajustar consumo
      </h2>

      <div className="bottle-ajuste-modos" role="group" aria-label="Tipo de ajuste">
        <button type="button" className={`bottle-ajuste-modo${!tirar ? ' ativo' : ''}`} aria-pressed={!tirar} onClick={() => trocarModo('somar')}>
          <Icone nome="fa-plus" /> Bebi fora da garrafa
        </button>
        <button type="button" className={`bottle-ajuste-modo${tirar ? ' ativo' : ''}`} aria-pressed={tirar} onClick={() => trocarModo('tirar')} disabled={consumo <= 0}>
          <Icone nome="fa-minus" /> Tirar do total
        </button>
      </div>
      <p className="bottle-ajuste-desc">
        {tirar
          ? 'Use se a dock contou algo que você não bebeu (garrafa sem tampa, água derramada).'
          : 'Água ou outro líquido que você bebeu sem passar pela garrafa.'}
      </p>

      <form onSubmit={enviar} className="flex flex-col gap-3">
        {!tirar && (
          <div className="flex gap-2 flex-wrap">
            {ATALHOS.map(v => (
              <button key={v} type="button" className={`filtro-pill${n === v ? ' active' : ''}`} aria-pressed={n === v} onClick={() => setValor(String(v))}>
                {v} ml
              </button>
            ))}
          </div>
        )}
        <div className="input-group">
          <label htmlFor="ajuste-ml" className="input-label">Quantidade (ml)</label>
          <input
            id="ajuste-ml"
            className="input-field"
            inputMode="numeric"
            value={valor}
            onChange={e => setValor(e.target.value.replace(/[^0-9]/g, ''))}
            placeholder={tirar ? `até ${consumo}` : 'ex.: 250'}
            aria-invalid={Boolean(erroCampo)}
            aria-describedby={erroCampo ? 'ajuste-ml-erro' : undefined}
          />
          {erroCampo && <p id="ajuste-ml-erro" className="input-erro-msg">{erroCampo}</p>}
        </div>
        <button type="submit" className={`btn ${tirar ? 'bottle-desvincular-btn' : 'btn-primary'}`} disabled={invalido || enviando}>
          {enviando ? 'Salvando…' : `${tirar ? 'Tirar' : 'Somar'}${n > 0 ? ` ${n} ml` : ''}`}
        </button>
      </form>

      {mensagem && (
        <p className={mensagem.tipo === 'erro' ? 'input-erro-msg mt-3' : 'bottle-ajuste-ok mt-3'} role={mensagem.tipo === 'erro' ? 'alert' : 'status'}>
          {mensagem.texto}
        </p>
      )}
    </Card>
  )
}

export default AjusteConsumo
