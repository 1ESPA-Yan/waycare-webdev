// ============================================================================
//  PerfilMetaHidratacao.jsx  -  configura a meta de hidratação personalizada
// ============================================================================
//  Form: peso, gênero, atividade física e cidade.
//  - Preview ao vivo via POST /calcular-meta (debounce enquanto digita).
//  - Salvar via POST /perfil → recalcula a meta que vale para a dock.
//  - Pré-preenche com GET /perfil ao montar.
//
//  A meta é uma estimativa (peso/sexo + temperatura local + atividade, base
//  EFSA/ACSM). Não substitui orientação médica.
// ============================================================================

import { useState, useEffect, useRef } from 'react'
import { getPerfil, postPerfil, calcularMetaPreview } from '../services/waycareApi'

const ATIVIDADES = [
  ['sedentario', 'Sedentário (pouca ou nenhuma)'],
  ['leve', 'Leve (poucas vezes/semana)'],
  ['moderado', 'Moderado (~1h quase todo dia)'],
  ['intenso', 'Intenso (treino longo / atleta)'],
]

function PerfilMetaHidratacao() {
  const [form, setForm] = useState({ peso: '', genero: 'm', atividade: 'moderado', cidade: '' })
  const [preview, setPreview] = useState(null)
  const [resultado, setResultado] = useState(null)
  const [salvando, setSalvando] = useState(false)
  const [carregandoPreview, setCarregandoPreview] = useState(false)
  const [erro, setErro] = useState('')
  const debounceRef = useRef()

  // Pré-preenche com o perfil salvo no backend
  useEffect(() => {
    getPerfil()
      .then((resp) => {
        // aceita perfil plano ou aninhado em { perfil: {...} }
        const p = resp?.perfil || resp
        if (p && (p.peso || p.cidade)) {
          setForm((f) => ({
            peso: p.peso ?? f.peso,
            genero: p.genero ?? f.genero,
            atividade: p.atividade ?? f.atividade,
            cidade: p.cidade ?? f.cidade,
          }))
        }
      })
      .catch(() => {})
  }, [])

  // Preview com debounce quando peso e cidade estão preenchidos
  useEffect(() => {
    clearTimeout(debounceRef.current)
    if (!form.peso || !form.cidade) {
      setPreview(null)
      setCarregandoPreview(false)
      return
    }
    setCarregandoPreview(true)
    debounceRef.current = setTimeout(async () => {
      try {
        const r = await calcularMetaPreview({
          peso: Number(form.peso),
          genero: form.genero,
          atividade: form.atividade,
          cidade: form.cidade,
        })
        setPreview(r)
      } catch {
        setPreview(null)
      } finally {
        setCarregandoPreview(false)
      }
    }, 600)
    return () => clearTimeout(debounceRef.current)
  }, [form.peso, form.genero, form.atividade, form.cidade])

  const alterar = (campo, valor) => setForm((f) => ({ ...f, [campo]: valor }))

  async function salvar() {
    setErro('')
    if (!form.peso || !form.cidade) {
      setErro('Preencha ao menos peso e cidade.')
      return
    }
    setSalvando(true)
    try {
      const r = await postPerfil({
        peso: Number(form.peso),
        genero: form.genero,
        atividade: form.atividade,
        cidade: form.cidade,
      })
      setResultado(r)
    } catch (e) {
      setErro(e.message)
    } finally {
      setSalvando(false)
    }
  }

  // Mostra resultado salvo; senão o preview ao vivo
  const r = resultado || preview
  const salvo = !!resultado

  return (
    <div className="card perfil-meta-hidratacao">
      <div className="d-flex align-items-center gap-2 mb-1">
        <div className="perfil-stat-icon perfil-stat-icon--blue">
          <i className="fa-solid fa-droplet"></i>
        </div>
        <div>
          <h3 className="perfil-secao-titulo">Meta de Hidratação</h3>
          <p className="perfil-meta-sub">Personalizada por peso, sexo, atividade e clima</p>
        </div>
      </div>

      <div className="perfil-meta-form">
        <div className="perfil-meta-campo">
          <label className="perfil-edit-label">Peso (kg)</label>
          <input
            className="perfil-edit-input"
            type="number"
            inputMode="decimal"
            min="1"
            value={form.peso}
            placeholder="78"
            onChange={(e) => alterar('peso', e.target.value)}
          />
        </div>

        <div className="perfil-meta-campo">
          <label className="perfil-edit-label">Cidade</label>
          <input
            className="perfil-edit-input"
            type="text"
            value={form.cidade}
            placeholder="São Paulo"
            onChange={(e) => alterar('cidade', e.target.value)}
          />
        </div>

        <div className="perfil-meta-campo">
          <label className="perfil-edit-label">Gênero</label>
          <select
            className="perfil-edit-input"
            value={form.genero}
            onChange={(e) => alterar('genero', e.target.value)}
          >
            <option value="m">Masculino</option>
            <option value="f">Feminino</option>
          </select>
        </div>

        <div className="perfil-meta-campo">
          <label className="perfil-edit-label">Atividade física</label>
          <select
            className="perfil-edit-input"
            value={form.atividade}
            onChange={(e) => alterar('atividade', e.target.value)}
          >
            {ATIVIDADES.map(([v, label]) => (
              <option key={v} value={v}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      {erro && <p className="perfil-meta-erro">{erro}</p>}

      {r && (
        <div className={`perfil-meta-resultado ${salvo ? 'perfil-meta-resultado--salvo' : ''}`}>
          {r.aviso && <p className="perfil-meta-aviso"><i className="fa-solid fa-triangle-exclamation"></i> {r.aviso}</p>}

          <div className="perfil-meta-valor-wrap">
            <span className="perfil-meta-valor-label">
              {salvo ? 'Meta salva' : 'Meta sugerida'} {carregandoPreview && !salvo ? '· atualizando…' : ''}
            </span>
            <span className="perfil-meta-valor-grande">{r.meta} <small>ml/dia</small></span>
          </div>

          <div className="perfil-meta-breakdown">
            <div className="perfil-meta-fator">
              <span><i className="fa-solid fa-weight-scale"></i> Base (peso/sexo)</span>
              <strong>{r.base} ml</strong>
            </div>
            <div className="perfil-meta-fator">
              <span>
                <i className="fa-solid fa-temperature-half"></i> Temperatura
                {r.temp != null ? ` · ${r.temp}°C em ${r.cidade}` : ''}
              </span>
              <strong>+{r.ajuste_temp} ml</strong>
            </div>
            <div className="perfil-meta-fator">
              <span><i className="fa-solid fa-person-running"></i> Atividade</span>
              <strong>+{r.ajuste_atividade} ml</strong>
            </div>
          </div>
        </div>
      )}

      <button className="perfil-meta-btn" onClick={salvar} disabled={salvando}>
        {salvando ? 'Salvando…' : (resultado ? 'Atualizar minha meta' : 'Salvar minha meta')}
      </button>

      <p className="perfil-meta-disclaimer">
        <i className="fa-solid fa-circle-info"></i>
        Estimativa baseada em peso, sexo, atividade (ACSM) e temperatura local (EFSA).
        É uma <strong>meta sugerida</strong>, não substitui orientação médica.
      </p>
    </div>
  )
}

export default PerfilMetaHidratacao
