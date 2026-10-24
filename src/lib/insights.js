// ============================================================================
//  Insights: transforma os dados de consumo em frases.
//  Cópia de pwa/src/lib/insights.js do pacote da dock (mesmos textos e fontes).
//  Entrada: o retorno da RPC insights_dados() (+ gênero de referência do perfil).
//  Tudo aqui é cálculo puro, sem rede, pra dar pra testar com dados fixos.
// ============================================================================

const TZ = 'America/Sao_Paulo'
const ml = (v) => `${Math.round(v ?? 0).toLocaleString('pt-BR')} ml`
const fmtParte = new Intl.DateTimeFormat('en-CA', {
  timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
})
const SEMANA = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado']
const SEMANA_PLURAL = ['domingos', 'segundas', 'terças', 'quartas', 'quintas', 'sextas', 'sábados']

// "dia" (AAAA-MM-DD) e minutos desde a meia-noite, no fuso de São Paulo
export function partes(ts) {
  const p = Object.fromEntries(fmtParte.formatToParts(new Date(ts)).map((x) => [x.type, x.value]))
  return { dia: `${p.year}-${p.month}-${p.day}`, min: Number(p.hour) * 60 + Number(p.minute) }
}
const diaDaSemana = (iso) => new Date(`${iso}T12:00:00Z`).getUTCDay()
const somaDias = (iso, n) => new Date(Date.parse(`${iso}T12:00:00Z`) + n * 86400000).toISOString().slice(0, 10)
const hhmm = (min) => `${String(Math.floor(min / 60)).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`
const duracao = (min) => {
  const h = Math.floor(min / 60), m = Math.round(min % 60)
  return h ? `${h}h${m ? String(m).padStart(2, '0') : ''}` : `${m} min`
}
const litros = (v) => `${(v / 1000).toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} L`
const pct = (v) => `${Math.round(Math.abs(v))}%`
const media = (xs) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0)
const mediana = (xs) => {
  if (!xs.length) return 0
  const s = [...xs].sort((a, b) => a - b), k = Math.floor(s.length / 2)
  return s.length % 2 ? s[k] : (s[k - 1] + s[k]) / 2
}

// Janela "acordado" usada pra ritmo e intervalos
const ACORDA = 7 * 60, DORME = 22 * 60

// ---------------------------------------------------------------------------
//  Ciência: só o que tem estudo por trás. Cada card diz de onde veio.
// ---------------------------------------------------------------------------
export const CIENCIA = {
  pedras: {
    titulo: 'Pedra nos rins',
    texto:
      'Beber água é a principal prevenção. Em quem já teve pedra, beber o suficiente pra urinar 2 L por dia reduziu as recaídas de 27% para 12% em 5 anos. Pra quem nunca teve, estudos observacionais associam mais de 2 L por dia a menos casos.',
    fonte: 'Borghi et al., J Urol 1996 · revisão Cochrane 2020 · Baker et al., GSSI 2022',
    link: 'https://www.cochrane.org/evidence/CD004292/increased-water-intake-preventing-urinary-stones',
  },
  foco: {
    titulo: 'Energia, humor e foco',
    texto:
      'Perder só 1 a 2% da água do corpo já foi ligado a mais cansaço, dor de cabeça e dificuldade de concentração em adultos jovens. A sede costuma aparecer só nessa faixa, então ela é um aviso atrasado.',
    fonte: 'Armstrong et al., J Nutr 2012 · Ganio et al., Br J Nutr 2011 · Wittbrodt & Millard-Stafford 2018',
    link: 'https://today.uconn.edu/2012/02/even-mild-dehydration-can-alter-mood/',
  },
  poucaAgua: {
    titulo: 'Quem bebe pouco sente a diferença',
    texto:
      'Adultos que bebiam cerca de 1 L por dia e passaram a 2,5 L relataram menos fadiga e menos confusão mental.',
    fonte: 'Pross et al., PLoS ONE 2014',
    link: 'https://doaj.org/article/8108a708b5a54ead9099e75401e57204',
  },
  urina: {
    titulo: 'Infecção urinária de repetição',
    texto:
      'Em mulheres com cistite de repetição que bebiam menos de 1,5 L por dia, tomar 1,5 L a mais de água reduziu as crises de 3,2 para 1,7 por ano.',
    fonte: 'Hooton et al., JAMA Internal Medicine 2018',
    link: 'https://pharmaceutical-journal.com/article/news/study-results-show-increased-hydration-can-prevent-recurrent-cystitis',
  },
  referencia: {
    titulo: 'Quanto é o recomendado',
    texto:
      'A referência europeia (EFSA) é de 2,0 L por dia de água total pra mulheres e 2,5 L pra homens, em clima ameno. Cerca de 20% disso vem da comida. A sua meta no app soma o calor do dia e a atividade física.',
    fonte: 'EFSA 2010 · Nordic Nutrition Recommendations 2023',
    link: 'https://pub.norden.org/nord2023-003/fluid-and-water-balance.html',
  },
  excesso: {
    titulo: 'Mais não é sempre melhor',
    texto:
      'Beber muito de uma vez pode baixar o sódio do sangue (hiponatremia). Em estudos com atletas, beber mais de 1,5 L numa hora aparece como fator de risco. Espalhar ao longo do dia é melhor do que compensar de uma vez.',
    fonte: 'López de Lara et al., Front Nutr 2022 (consenso internacional de hiponatremia)',
    link: 'https://www.frontiersin.org/journals/nutrition/articles/10.3389/fnut.2021.781229/full',
  },
}

// ---------------------------------------------------------------------------
export function gerarInsights(dados, { genero } = {}) {
  const agora = partes(dados.agora)
  const hoje = dados.hoje
  const meta = dados.meta_ml || 2500

  // consumo por dia (só dias com registro) e goles por dia
  const porDia = new Map(dados.dias.map((d) => [d.dia, Number(d.consumo_ml)]))
  const metaDia = new Map(dados.dias.map((d) => [d.dia, Number(d.meta_ml)]))
  const evDia = new Map()
  for (const e of dados.eventos) {
    const p = partes(e.ts)
    if (!evDia.has(p.dia)) evDia.set(p.dia, [])
    evDia.get(p.dia).push({ min: p.min, ml: Number(e.ml) })
  }
  const consumoHoje = porDia.get(hoje) ?? 0
  const evHoje = evDia.get(hoje) ?? []

  // dias passados com registro (mais recente primeiro)
  const passados = (n) => {
    const out = []
    for (let i = 1; i <= n; i++) {
      const d = somaDias(hoje, -i)
      if (porDia.has(d) && porDia.get(d) > 0) out.push(d)
    }
    return out
  }

  const r = { indice: null, hoje: [], semana: [], mes: [], ciencia: [], poucosDados: false }
  const cienciaUsada = new Set()
  const ciencia = (k) => { if (!cienciaUsada.has(k)) { cienciaUsada.add(k); r.ciencia.push({ id: k, ...CIENCIA[k] }); } }

  // ========================= HOJE =========================
  const base14 = passados(14)
  const ateAgora = (d) => (evDia.get(d) ?? []).filter((e) => e.min <= agora.min).reduce((s, e) => s + e.ml, 0)

  // fração típica do dia já bebida até esta hora (dos seus próprios dias)
  const fracoes = base14.map((d) => ateAgora(d) / porDia.get(d)).filter((f) => f >= 0 && f <= 1.2)
  const fracaoTipica = fracoes.length >= 3
    ? mediana(fracoes)
    : Math.min(1, Math.max(0, (agora.min - ACORDA) / (DORME - ACORDA)))   // sem histórico: linear 7h-22h
  const esperadoAgora = meta * fracaoTipica

  // 1. comparação com os outros dias até este horário
  const refAteAgora = base14.map(ateAgora)
  if (refAteAgora.length >= 3 && agora.min >= 9 * 60) {
    const m = media(refAteAgora)
    if (m > 50) {
      const dif = ((consumoHoje - m) / m) * 100
      if (Math.abs(dif) >= 10) {
        r.hoje.push({
          id: 'ritmo', tom: dif > 0 ? 'bom' : 'atencao',
          titulo: dif > 0 ? `${pct(dif)} acima do seu normal` : `${pct(dif)} abaixo do seu normal`,
          texto: `Até as ${hhmm(agora.min)} você bebeu ${ml(consumoHoje)}. Nos últimos ${refAteAgora.length} dias com registro, a essa hora você costumava estar em ${ml(m)}.`,
        })
      } else {
        r.hoje.push({
          id: 'ritmo', tom: 'neutro', titulo: 'No seu ritmo de sempre',
          texto: `Até as ${hhmm(agora.min)} você bebeu ${ml(consumoHoje)}, praticamente o mesmo que nos outros dias (${ml(m)}).`,
        })
      }
    }
  }

  // 2. previsão de fechamento do dia
  if (consumoHoje > 0 && agora.min >= 10 * 60 && agora.min < DORME && fracaoTipica >= 0.2 && consumoHoje < meta) {
    const previsto = Math.round(consumoHoje / fracaoTipica / 50) * 50
    const pm = (previsto / meta) * 100
    r.hoje.push({
      id: 'previsao', tom: pm >= 100 ? 'bom' : pm >= 80 ? 'neutro' : 'atencao',
      titulo: pm >= 100 ? 'No ritmo de bater a meta' : `Tendência: fechar o dia em ${litros(previsto)}`,
      texto: pm >= 100
        ? `Se mantiver o seu padrão, você deve fechar o dia perto de ${litros(previsto)}, acima da meta de ${litros(meta)}.`
        : `Mantendo o seu padrão, o dia termina perto de ${litros(previsto)}, ${Math.round(pm)}% da meta.`,
    })
  }

  // 3. quanto falta, espalhado até as 22h
  const falta = meta - consumoHoje
  if (falta > 0 && agora.min >= ACORDA && agora.min < DORME - 60) {
    const horas = (DORME - agora.min) / 60
    const porHora = Math.ceil(falta / horas / 10) * 10
    if (porHora <= 600) {
      r.hoje.push({
        id: 'falta', tom: 'neutro', titulo: `Faltam ${ml(falta)}`,
        texto: `Dá ${ml(porHora)} por hora até as 22h${porHora <= 250 ? ', mais ou menos um copo por hora' : ''}.`,
      })
    }
  } else if (falta <= 0) {
    r.hoje.push({ id: 'meta', tom: 'bom', titulo: 'Meta de hoje batida', texto: `Você já bebeu ${ml(consumoHoje)}, ${ml(-falta)} além da meta.` })
  }

  // 4. maior intervalo sem beber (entre 7h e agora)
  const goles = evHoje.filter((e) => e.ml > 0).map((e) => e.min).sort((a, b) => a - b)
  let maiorGap = 0, gapIni = 0, gapFim = 0
  if (goles.length && agora.min > ACORDA) {
    const pontos = [...goles.filter((m) => m >= ACORDA && m <= agora.min), Math.min(agora.min, DORME)]   // entre goles + desde o último
    for (let i = 1; i < pontos.length; i++) {
      const g = pontos[i] - pontos[i - 1]
      if (g > maiorGap) { maiorGap = g; gapIni = pontos[i - 1]; gapFim = pontos[i]; }
    }
    if (maiorGap >= 180) {
      const aberto = gapFim === Math.min(agora.min, DORME)
      r.hoje.push({
        id: 'intervalo', tom: 'atencao',
        titulo: aberto ? `Você está há ${duracao(maiorGap)} sem beber` : `Ficou ${duracao(maiorGap)} sem beber`,
        texto: aberto
          ? `Último gole às ${hhmm(gapIni)}. A sede costuma aparecer quando o corpo já perdeu 1 a 2% da água.`
          : `Das ${hhmm(gapIni)} às ${hhmm(gapFim)}. Espalhar os goles evita chegar nesse ponto.`,
      })
      ciencia('foco')
    }
  }

  // 5. muito de uma vez (60 min)
  const pos = evHoje.filter((e) => e.ml > 0).sort((a, b) => a.min - b.min)
  let maxHora = 0
  for (let i = 0; i < pos.length; i++) {
    let s = 0
    for (let j = i; j < pos.length && pos[j].min - pos[i].min < 60; j++) s += pos[j].ml
    maxHora = Math.max(maxHora, s)
  }
  if (maxHora > 1500) {
    r.hoje.push({
      id: 'excesso', tom: 'atencao', titulo: `${litros(maxHora)} em menos de 1 hora`,
      texto: 'Compensar de uma vez não é o ideal. Distribua ao longo do dia.',
    })
    ciencia('excesso')
  }

  // Índice do dia (0-100): volume pra hora (70) + regularidade (30). Não é medida clínica.
  if (agora.min >= ACORDA) {
    const volume = esperadoAgora > 0 ? Math.min(1, consumoHoje / esperadoAgora) : (consumoHoje > 0 ? 1 : 0)
    const gapAgora = goles.length ? maiorGap : Math.max(0, Math.min(agora.min, DORME) - ACORDA)
    const regularidade = Math.max(0, Math.min(1, 1 - (gapAgora - 120) / 180))   // até 2h = 100%, 5h = 0
    const valor = Math.round(70 * volume + 30 * regularidade)
    r.indice = {
      valor,
      volume: Math.round(volume * 100),
      regularidade: Math.round(regularidade * 100),
      frase: valor >= 85 ? 'Hidratação em dia pra este horário.'
        : valor >= 60 ? 'Bom, mas dá pra melhorar o ritmo.'
        : 'Abaixo do ideal pra este horário.',
    }
  }

  // ========================= SEMANA =========================
  const ult7 = [], ant7 = []
  for (let i = 1; i <= 7; i++) { const d = somaDias(hoje, -i); if (porDia.get(d) > 0) ult7.push(d); }
  for (let i = 8; i <= 14; i++) { const d = somaDias(hoje, -i); if (porDia.get(d) > 0) ant7.push(d); }

  if (ult7.length >= 3) {
    const m7 = media(ult7.map((d) => porDia.get(d)))
    const bateu = ult7.filter((d) => porDia.get(d) >= (metaDia.get(d) ?? meta)).length
    r.semana.push({
      id: 'media7', tom: bateu >= 5 ? 'bom' : bateu >= 3 ? 'neutro' : 'atencao',
      titulo: `Média de ${litros(m7)} por dia`,
      texto: `Nos últimos 7 dias você bateu a meta em ${bateu} de ${ult7.length} dias com registro.`,
    })
    if (ant7.length >= 3) {
      const ma = media(ant7.map((d) => porDia.get(d)))
      const dif = ((m7 - ma) / ma) * 100
      if (Math.abs(dif) >= 8) {
        r.semana.push({
          id: 'vs-anterior', tom: dif > 0 ? 'bom' : 'atencao',
          titulo: dif > 0 ? `${pct(dif)} a mais que na semana anterior` : `${pct(dif)} a menos que na semana anterior`,
          texto: `${litros(m7)} por dia contra ${litros(ma)} na semana anterior.`,
        })
      }
    }
    const melhor = [...ult7].sort((a, b) => porDia.get(b) - porDia.get(a))[0]
    const pior = [...ult7].sort((a, b) => porDia.get(a) - porDia.get(b))[0]
    if (porDia.get(melhor) - porDia.get(pior) >= 500) {
      r.semana.push({
        id: 'extremos', tom: 'neutro', titulo: 'Seu melhor e pior dia',
        texto: `Melhor: ${SEMANA[diaDaSemana(melhor)]} (${litros(porDia.get(melhor))}). Pior: ${SEMANA[diaDaSemana(pior)]} (${litros(porDia.get(pior))}).`,
      })
    }
    if (m7 < 1500) ciencia('poucaAgua')
  }

  // distribuição ao longo do dia (últimos 14 dias)
  let manha = 0, tarde = 0, noite = 0
  for (const d of base14) for (const e of evDia.get(d) ?? []) {
    if (e.ml <= 0) continue
    if (e.min < 12 * 60) manha += e.ml; else if (e.min < 18 * 60) tarde += e.ml; else noite += e.ml
  }
  const tot = manha + tarde + noite
  if (base14.length >= 5 && tot > 0) {
    const pm = (manha / tot) * 100, pt = (tarde / tot) * 100, pn = (noite / tot) * 100
    const resumo = `Manhã ${Math.round(pm)}%, tarde ${Math.round(pt)}%, noite ${Math.round(pn)}%.`
    if (pn >= 45) {
      r.semana.push({ id: 'distrib', tom: 'atencao', titulo: 'Sua água fica pra noite', texto: `${resumo} Beber mais cedo deixa o dia mais equilibrado e pode diminuir as idas ao banheiro de madrugada.` })
    } else if (pm < 20) {
      r.semana.push({ id: 'distrib', tom: 'atencao', titulo: 'Você começa o dia devagar', texto: `${resumo} Um copo ao acordar já adianta bastante.` })
    } else {
      r.semana.push({ id: 'distrib', tom: 'bom', titulo: 'Bem distribuído ao longo do dia', texto: resumo })
    }
  }

  // ========================= MÊS =========================
  const ult30 = passados(30)
  if (ult30.length >= 10) {
    const vals = ult30.map((d) => porDia.get(d))
    const acima2 = vals.filter((v) => v >= 2000).length
    r.mes.push({
      id: 'media30', tom: 'neutro', titulo: `Média de ${litros(media(vals))} por dia no mês`,
      texto: `Em ${acima2} dos ${ult30.length} dias com registro você passou de 2 L, a faixa que os estudos associam a menos pedra nos rins.`,
    })
    ciencia('pedras')

    // tendência (regressão linear em ml por semana)
    const xs = ult30.map((d) => -((Date.parse(`${hoje}T12:00:00Z`) - Date.parse(`${d}T12:00:00Z`)) / 86400000))
    const mx = media(xs), my = media(vals)
    const cov = xs.reduce((s, x, i) => s + (x - mx) * (vals[i] - my), 0)
    const vx = xs.reduce((s, x) => s + (x - mx) ** 2, 0)
    const porSemana = vx ? (cov / vx) * 7 : 0
    if (Math.abs(porSemana) >= 80) {
      r.mes.push({
        id: 'tendencia', tom: porSemana > 0 ? 'bom' : 'atencao',
        titulo: porSemana > 0 ? 'Tendência de alta' : 'Tendência de queda',
        texto: `Seu consumo vem ${porSemana > 0 ? 'subindo' : 'caindo'} cerca de ${ml(Math.abs(Math.round(porSemana / 10) * 10))} por semana.`
          + (porSemana < 0 && my - Math.abs(porSemana) * 2 < meta ? ' Se continuar assim, em 2 semanas fica bem abaixo da meta.' : ''),
      })
    } else {
      r.mes.push({ id: 'tendencia', tom: 'neutro', titulo: 'Consumo estável', texto: 'Sem tendência clara de alta ou queda no último mês.' })
    }

    // dia da semana mais fraco
    const porDow = Array.from({ length: 7 }, () => [])
    ult30.forEach((d) => porDow[diaDaSemana(d)].push(porDia.get(d)))
    const medias = porDow.map((xs2) => (xs2.length >= 2 ? media(xs2) : null))
    const validos = medias.map((m, i) => [m, i]).filter(([m]) => m != null)
    if (validos.length >= 5) {
      const [mPior, iPior] = validos.sort((a, b) => a[0] - b[0])[0]
      const dif = ((mPior - my) / my) * 100
      if (dif <= -15) {
        r.mes.push({
          id: 'dow', tom: 'atencao', titulo: `${SEMANA_PLURAL[iPior][0].toUpperCase()}${SEMANA_PLURAL[iPior].slice(1)} são seu ponto fraco`,
          texto: `Nas ${SEMANA_PLURAL[iPior]} você bebe ${pct(dif)} menos que a sua média (${litros(mPior)} contra ${litros(my)}).`,
        })
      }
    }
  }

  // ciência sempre presente (no fim, sem repetir)
  ['foco', 'pedras', 'referencia'].forEach(ciencia)
  if (genero === 'f') ciencia('urina')
  ciencia('excesso')
  r.poucosDados = passados(30).length < 3
  return r
}
