import { useState } from 'react'
import Topbar from '../components/Topbar'
import FiltroPills from '../components/FiltroPills'
import Card from '../components/Card'
import Icone from '../components/Icone'
import CartaoInsight from '../components/CartaoInsight'
import { useInsights } from '../hooks/useInsights'
import { CIENCIA } from '../lib/insights'
import '../styles/insights.css'

const PERIODOS = [
  { key: 'hoje', label: 'Hoje' },
  { key: 'semana', label: 'Semana' },
  { key: 'mes', label: 'Mês' },
]

const VAZIO = {
  hoje: 'Os insights de hoje aparecem depois dos primeiros goles.',
  semana: 'Com pelo menos 3 dias de uso na semana aparecem as comparações.',
  mes: 'Com uns 10 dias de uso aparecem as tendências do mês.',
}

// Sem conta (demonstração), mostra só os cartões de ciência fixos
const CIENCIA_DEMO = ['foco', 'pedras', 'referencia', 'excesso'].map(id => ({ id, ...CIENCIA[id] }))

// Anel do índice do dia (0–100)
function Indice({ indice }) {
  const r = 34
  const c = 2 * Math.PI * r
  return (
    <Card as="section" className="insights-indice mb-6" aria-label={`Índice de hidratação de hoje: ${indice.valor} de 100`}>
      <svg viewBox="0 0 84 84" width="104" height="104" aria-hidden="true" className="insights-indice-anel">
        <circle cx="42" cy="42" r={r} className="insights-indice-fundo" />
        <circle cx="42" cy="42" r={r} className="insights-indice-arco"
          strokeDasharray={`${(indice.valor / 100) * c} ${c}`} transform="rotate(-90 42 42)" />
        <text x="42" y="48" textAnchor="middle" className="insights-indice-num">{indice.valor}</text>
      </svg>
      <div className="flex flex-col gap-2 flex-1">
        <span className="insights-indice-rotulo">Índice de hoje</span>
        <p className="insights-indice-frase">{indice.frase}</p>
        <dl className="insights-indice-partes">
          <div>
            <dt>Volume pra hora</dt>
            <dd><Parte valor={indice.volume} /></dd>
          </div>
          <div>
            <dt>Regularidade</dt>
            <dd><Parte valor={indice.regularidade} /></dd>
          </div>
        </dl>
      </div>
    </Card>
  )
}

function Parte({ valor }) {
  return (
    <span className="insights-parte">
      <span className="progress-bar insights-parte-barra">
        <span className="progress-fill" style={{ width: `${valor}%` }}></span>
      </span>
      <strong>{valor}%</strong>
    </span>
  )
}

function Insights() {
  const { res, erro, disponivel, carregando } = useInsights()
  const [periodo, setPeriodo] = useState('hoje')
  const ciencia = res?.ciencia ?? CIENCIA_DEMO
  const lista = res?.[periodo] ?? []

  return (
    <>
      <Topbar
        icone="fa-chart-line"
        titulo="Insights"
        subtitulo="O que o seu consumo de água mostra, com base no que você bebeu e na ciência"
      />

      <section id="page-content" className="page-transition">
        {!disponivel && (
          <div className="bottle-aviso bottle-aviso--info mb-6">
            <Icone nome="fa-compass" />
            Modo demonstração: entre com sua conta para ver os insights do seu consumo.
          </div>
        )}
        {erro && (
          <div className="bottle-aviso bottle-aviso--offline mb-6" role="alert">
            <Icone nome="fa-triangle-exclamation" /> Não deu pra carregar os insights: {erro}
          </div>
        )}
        {carregando && (
          <div className="bottle-aviso bottle-aviso--info mb-6">
            <Icone nome="fa-circle-notch" girar /> Calculando…
          </div>
        )}

        {res && (
          <>
            {res.indice && <Indice indice={res.indice} />}

            <FiltroPills opcoes={PERIODOS} ativo={periodo} aoMudar={setPeriodo} rotulo="Período dos insights" className="mb-6" />

            {lista.length === 0 ? (
              <Card className="mb-8">
                <p className="insights-vazio">{VAZIO[periodo]}</p>
              </Card>
            ) : (
              <ul className="insights-lista mb-8">
                {lista.map(insight => <CartaoInsight key={insight.id} insight={insight} />)}
              </ul>
            )}
          </>
        )}

        <h2 className="insights-secao-titulo mb-4">
          <Icone nome="fa-flask" /> O que a ciência diz
        </h2>
        <div className="insights-ciencia mb-4">
          {ciencia.map(c => (
            <Card key={c.id} className="insights-ciencia-card">
              <h3 className="insights-ciencia-titulo">{c.titulo}</h3>
              <p className="insights-ciencia-texto">{c.texto}</p>
              <a href={c.link} target="_blank" rel="noreferrer" className="insights-ciencia-fonte">
                {c.fonte} <Icone nome="fa-arrow-up-right-from-square" />
              </a>
            </Card>
          ))}
        </div>
        <p className="insights-aviso-medico">
          Informativo, a partir de estudos publicados. Não substitui orientação médica: quem tem doença renal,
          cardíaca ou restrição de líquidos deve seguir o que o médico indicar.
        </p>
      </section>
    </>
  )
}

export default Insights
