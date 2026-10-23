// ============================================================================
//  PerfilMetaHidratacao.jsx  -  configura a meta de hidratação personalizada
// ============================================================================
//  Form: peso, gênero, atividade física e cidade.
//  - Prévia ao vivo com calcularMeta() (src/lib/meta.js, mesma conta do PWA).
//  - A cidade é buscada na Open-Meteo 700 ms depois que o usuário para de
//    digitar; a temperatura atual dela entra no cálculo.
//  - Salvar: upsert em `perfis` e depois rpc('salvar_meta').
//  - No modo demonstração o formulário fica desabilitado.
//
//  A meta é uma estimativa (peso/sexo + temperatura local + atividade, base
//  EFSA/ACSM). Não substitui orientação médica.
// ============================================================================

import { useState, useEffect, useMemo, useRef } from 'react'
import { useHidratacao } from '../hooks/useHidratacao'
import { supabase, rpc } from '../lib/supabase'
import { ATIVIDADES, META_MIN, META_MAX, calcularMeta, geocodificar, temperaturaAtual } from '../lib/meta'
import Card from './Card'
import Icone from './Icone'

const FORM_VAZIO = { peso: '', genero: 'm', atividade: 'moderado', cidade: '' }

function PerfilMetaHidratacao() {
  const { modo, perfil, recarregar } = useHidratacao()
  const demo = modo === 'demo'

  const [form, setForm] = useState(FORM_VAZIO)
  const [local, setLocal] = useState(null)   // { lat, lon, nome } da cidade encontrada
  const [temp, setTemp] = useState(null)
  const [buscandoCidade, setBuscandoCidade] = useState(false)
  // Último texto já buscado (a Open-Meteo devolve "Recife, Pernambuco" para "Recife")
  const [cidadeBuscada, setCidadeBuscada] = useState('')
  const [erroCidade, setErroCidade] = useState('')
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState('')
  const [salvoAgora, setSalvoAgora] = useState(false)

  // Preenche uma vez com o perfil salvo, quando o painel chega
  const [preenchido, setPreenchido] = useState(false)
  if (!preenchido && perfil) {
    setPreenchido(true)
    setForm({
      peso: perfil.peso_kg ?? '',
      genero: perfil.genero || 'm',
      atividade: perfil.atividade || 'moderado',
      cidade: perfil.cidade || '',
    })
    if (perfil.lat != null) setLocal({ lat: perfil.lat, lon: perfil.lon, nome: perfil.cidade })
    setCidadeBuscada(perfil.cidade || '')
    setTemp(perfil.temp_c ?? null)
  }

  // Busca a cidade 700 ms depois que o usuário para de digitar. Só a resposta da
  // busca mais recente vale (o contador descarta as que ficaram para trás).
  const ultimaBusca = useRef(0)
  useEffect(() => {
    const cidade = form.cidade.trim()
    if (demo || !cidade || cidade === cidadeBuscada) return
    const id = setTimeout(async () => {
      const busca = ++ultimaBusca.current
      const ativo = () => busca === ultimaBusca.current
      setCidadeBuscada(cidade)
      setBuscandoCidade(true)
      setErroCidade('')
      try {
        const g = await geocodificar(cidade)
        if (!ativo()) return
        if (!g) {
          setLocal(null)
          setTemp(null)
          setErroCidade('Cidade não encontrada. Digite uma cidade, não um país ou estado.')
        } else {
          setLocal(g)
          const t = await temperaturaAtual(g.lat, g.lon)
          if (ativo()) setTemp(t)
        }
      } catch {
        if (ativo()) setErroCidade('Não foi possível buscar a cidade agora. Tente de novo em instantes.')
      } finally {
        if (ativo()) setBuscandoCidade(false)
      }
    }, 700)
    return () => clearTimeout(id)
  }, [form.cidade, cidadeBuscada, demo])

  const peso = Number(String(form.peso).replace(',', '.'))
  const pesoOk = peso >= 25 && peso <= 250
  const det = useMemo(
    () => (pesoOk ? calcularMeta(peso, form.genero, temp, form.atividade) : null),
    [peso, pesoOk, form.genero, form.atividade, temp]
  )

  const alterar = (campo, valor) => {
    setForm((f) => ({ ...f, [campo]: valor }))
    setSalvoAgora(false)
    if (campo === 'cidade') setErroCidade('')
  }

  async function salvar() {
    setErro('')
    if (!pesoOk) {
      setErro('Informe um peso entre 25 e 250 kg.')
      return
    }
    setSalvando(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      const { error } = await supabase.from('perfis').upsert({
        user_id: user.id,
        nome: perfil?.nome ?? null,
        peso_kg: peso,
        genero: form.genero,
        atividade: form.atividade,
        cidade: local?.nome || form.cidade.trim() || null,
        lat: local?.lat ?? null,
        lon: local?.lon ?? null,
        atualizado_em: new Date().toISOString(),
      })
      if (error) throw new Error('Não foi possível salvar o perfil. Tente de novo.', { cause: error })
      await rpc('salvar_meta', { p_meta: det.meta, p_temp: temp, p_detalhe: { ...det, temp } })
      await recarregar()
      setSalvoAgora(true)
    } catch (falha) {
      setErro(falha.message)
    } finally {
      setSalvando(false)
    }
  }

  const jaTinhaPerfil = Boolean(perfil?.peso_kg)

  return (
    <Card className="perfil-meta-hidratacao">
      <div className="flex items-center gap-2 mb-1">
        <div className="perfil-stat-icon perfil-stat-icon--blue">
          <Icone nome="fa-droplet" />
        </div>
        <div>
          <h3 className="perfil-secao-titulo">Meta de Hidratação</h3>
          <p className="perfil-meta-sub">Personalizada por peso, sexo, atividade e clima</p>
        </div>
      </div>

      {demo && (
        <p className="perfil-meta-aviso">
          <Icone nome="fa-circle-info" /> No modo demonstração a meta não é salva. Entre com a sua conta para personalizar.
        </p>
      )}

      <fieldset className="perfil-meta-form" disabled={demo}>
        <div className="perfil-meta-campo">
          <label className="perfil-edit-label" htmlFor="meta-peso">Peso (kg)</label>
          <input
            id="meta-peso"
            className="perfil-edit-input"
            type="number"
            inputMode="decimal"
            min="25"
            max="250"
            value={form.peso}
            placeholder="78"
            onChange={(e) => alterar('peso', e.target.value)}
          />
        </div>

        <div className="perfil-meta-campo">
          <label className="perfil-edit-label" htmlFor="meta-cidade">Cidade</label>
          <input
            id="meta-cidade"
            className="perfil-edit-input"
            type="text"
            value={form.cidade}
            placeholder="São Paulo"
            aria-invalid={!!erroCidade}
            aria-describedby={erroCidade ? 'meta-cidade-erro' : undefined}
            onChange={(e) => alterar('cidade', e.target.value)}
          />
        </div>

        <div className="perfil-meta-campo">
          <label className="perfil-edit-label" htmlFor="meta-genero">Gênero</label>
          <select
            id="meta-genero"
            className="perfil-edit-input"
            value={form.genero}
            onChange={(e) => alterar('genero', e.target.value)}
          >
            <option value="m">Masculino</option>
            <option value="f">Feminino</option>
          </select>
        </div>

        <div className="perfil-meta-campo">
          <label className="perfil-edit-label" htmlFor="meta-atividade">Atividade física</label>
          <select
            id="meta-atividade"
            className="perfil-edit-input"
            value={form.atividade}
            onChange={(e) => alterar('atividade', e.target.value)}
          >
            {ATIVIDADES.map((a) => (
              <option key={a.id} value={a.id} title={a.desc}>{a.nome}</option>
            ))}
          </select>
        </div>
      </fieldset>

      {erroCidade && <p id="meta-cidade-erro" className="perfil-meta-erro" role="alert">{erroCidade}</p>}
      {erro && <p className="perfil-meta-erro" role="alert">{erro}</p>}

      {det && !demo && (
        <div className={`perfil-meta-resultado ${salvoAgora ? 'perfil-meta-resultado--salvo' : ''}`}>
          <div className="perfil-meta-valor-wrap">
            <span className="perfil-meta-valor-label">
              {salvoAgora ? 'Meta salva' : 'Meta sugerida'} {buscandoCidade ? '· buscando a cidade…' : ''}
            </span>
            <span className="perfil-meta-valor-grande">{det.meta} <small>ml/dia</small></span>
          </div>

          <div className="perfil-meta-breakdown">
            <div className="perfil-meta-fator">
              <span><Icone nome="fa-weight-scale" /> Base (peso/sexo)</span>
              <strong>{det.base} ml</strong>
            </div>
            <div className="perfil-meta-fator">
              <span>
                <Icone nome="fa-temperature-half" /> Temperatura
                {temp != null && local ? ` · ${Math.round(temp)}°C em ${local.nome}` : ''}
              </span>
              <strong>+{det.ajuste_temp} ml</strong>
            </div>
            <div className="perfil-meta-fator">
              <span><Icone nome="fa-person-running" /> Atividade</span>
              <strong>+{det.ajuste_atividade} ml</strong>
            </div>
          </div>
          {(det.meta === META_MIN || det.meta === META_MAX) && (
            <p className="perfil-meta-aviso">
              <Icone nome="fa-triangle-exclamation" /> A meta fica sempre entre {META_MIN} e {META_MAX} ml.
            </p>
          )}
        </div>
      )}

      <button className="perfil-meta-btn" onClick={salvar} disabled={demo || salvando || !pesoOk || buscandoCidade}>
        {salvando ? 'Salvando…' : (jaTinhaPerfil ? 'Atualizar minha meta' : 'Salvar minha meta')}
      </button>

      <p className="perfil-meta-disclaimer">
        <Icone nome="fa-circle-info" />
        <span>
          Estimativa baseada em peso, sexo, atividade (ACSM) e temperatura local (EFSA).
          É uma <strong>meta sugerida</strong>, não substitui orientação médica. A meta é
          recalculada uma vez por dia com a temperatura do dia.
        </span>
      </p>
    </Card>
  )
}

export default PerfilMetaHidratacao
