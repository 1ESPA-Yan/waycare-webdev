// Gráfico de área do consumo ao longo do dia (dados reais do GET /history)
// Recebe `dados` = [{ ts, consumo, pct }] e a `meta` diária em ml.

function GraficoHidratacao({ dados = [], meta = 2000 }) {
  if (!dados.length) {
    return (
      <div className="bottle-grafico-vazio">
        <i className="fa-regular fa-chart-bar"></i>
        Ainda sem leituras hoje. Beba água para começar a registrar.
      </div>
    )
  }

  const W = 600, H = 180, pad = 12
  const consumos = dados.map(d => d.consumo)
  const maxY = Math.max(meta, ...consumos) || 1
  const n = dados.length

  const x = (i) => pad + (i / Math.max(1, n - 1)) * (W - pad * 2)
  const y = (v) => H - pad - (v / maxY) * (H - pad * 2)

  const linha = dados
    .map((d, i) => `${i === 0 ? 'M' : 'L'} ${x(i).toFixed(1)} ${y(d.consumo).toFixed(1)}`)
    .join(' ')
  const area = `${linha} L ${x(n - 1).toFixed(1)} ${H - pad} L ${x(0).toFixed(1)} ${H - pad} Z`
  const yMeta = y(meta)

  const formatarHora = (ts) => {
    try {
      return new Date(ts).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    } catch { return '' }
  }

  // Mostra no máximo ~6 marcações de horário, espaçadas
  const passo = Math.max(1, Math.ceil(n / 6))
  const marcacoes = dados.filter((_, i) => i % passo === 0 || i === n - 1)

  return (
    <div>
      <svg className="bottle-grafico-svg" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Consumo ao longo do dia">
        <defs>
          <linearGradient id="grad-hidrat" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(33,150,243,0.35)" />
            <stop offset="100%" stopColor="rgba(33,150,243,0)" />
          </linearGradient>
        </defs>

        {meta <= maxY && (
          <>
            <line x1={pad} x2={W - pad} y1={yMeta} y2={yMeta}
                  stroke="var(--color-border)" strokeWidth="1" strokeDasharray="5 5" />
            <text x={W - pad} y={yMeta - 6} textAnchor="end"
                  fill="var(--color-text-muted)" fontSize="11">meta {meta}ml</text>
          </>
        )}

        <path d={area} fill="url(#grad-hidrat)" />
        <path d={linha} fill="none" stroke="var(--color-info)" strokeWidth="2.5"
              strokeLinejoin="round" strokeLinecap="round" />
      </svg>

      <div className="bottle-grafico-horas">
        {marcacoes.map((d, i) => (
          <span key={i}>{formatarHora(d.ts)}</span>
        ))}
      </div>
    </div>
  )
}

export default GraficoHidratacao
