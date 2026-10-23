// ============================================================================
//  Meta diária personalizada (cópia de pwa/src/lib/meta.js do pacote da dock)
// ============================================================================
//  Aproximação transparente (NÃO é prescrição médica). Bases:
//   - Base por peso/sexo: ml/kg clínico (~30-35 ml/kg), na ordem de grandeza
//     da EFSA (2,5 L homem / 2,0 L mulher, em clima e atividade moderados).
//   - Temperatura: ajuste só acima de 25 °C (topo da faixa moderada da EFSA),
//     percentual pequeno COM TETO, rotulado como estimativa.
//   - Atividade: adicional ancorado na ACSM (0,4-0,8 L por hora de exercício
//     intenso), convertido em médias diárias.
//  Mantenha igual ao PWA: os dois recalculam a mesma meta do dia.
// ============================================================================
export const ML_POR_KG = { m: 35, f: 31 }
export const TEMP_BASE = 25
export const PCT_POR_GRAU = 0.025
export const TEMP_ADD_MAX = 500
export const ATIVIDADE_ADD = { sedentario: 0, leve: 350, moderado: 700, intenso: 1200 }
export const META_MIN = 1500
export const META_MAX = 5000

export const ATIVIDADES = [
  { id: 'sedentario', nome: 'Pouca ou nenhuma', desc: 'Quase não faz exercício' },
  { id: 'leve', nome: 'Leve', desc: 'Exercício leve algumas vezes por semana' },
  { id: 'moderado', nome: 'Moderada', desc: 'Cerca de 1 h de exercício quase todo dia' },
  { id: 'intenso', nome: 'Intensa', desc: 'Treino longo ou pesado, nível atleta' },
]

export function calcularMeta(pesoKg, genero, temp, atividade) {
  const base = pesoKg * (genero === 'f' ? ML_POR_KG.f : ML_POR_KG.m)
  let ajusteTemp = 0
  if (temp != null && temp > TEMP_BASE) ajusteTemp = Math.min(base * PCT_POR_GRAU * (temp - TEMP_BASE), TEMP_ADD_MAX)
  const ajusteAtividade = ATIVIDADE_ADD[atividade] ?? 0
  const total = Math.max(META_MIN, Math.min(META_MAX, base + ajusteTemp + ajusteAtividade))
  return {
    meta: Math.round(total),
    base: Math.round(base),
    ajuste_temp: Math.round(ajusteTemp),
    ajuste_atividade: Math.round(ajusteAtividade),
  }
}

// Cidade -> {lat, lon, nome}. Só aceita lugar povoado (feature_code PPL*),
// rejeitando país/estado digitado por engano.
export async function geocodificar(cidade) {
  const u = new URL('https://geocoding-api.open-meteo.com/v1/search')
  u.search = new URLSearchParams({ name: cidade, count: '5', language: 'pt', format: 'json' })
  const r = await fetch(u)
  const j = await r.json()
  const g = (j.results || []).find((x) => (x.feature_code || '').startsWith('PPL'))
  return g ? { lat: g.latitude, lon: g.longitude, nome: `${g.name}${g.admin1 ? ', ' + g.admin1 : ''}` } : null
}

export async function temperaturaAtual(lat, lon) {
  try {
    const u = new URL('https://api.open-meteo.com/v1/forecast')
    u.search = new URLSearchParams({ latitude: lat, longitude: lon, current: 'temperature_2m' })
    const r = await fetch(u)
    const j = await r.json()
    return Number(j.current.temperature_2m)
  } catch {
    return null
  }
}
