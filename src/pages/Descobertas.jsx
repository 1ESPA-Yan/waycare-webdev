import { useState, useMemo } from 'react'
import Topbar from '../components/Topbar'
import FiltroPills from '../components/FiltroPills'
import Button from '../components/Button'
import Card from '../components/Card'
import Chip from '../components/Chip'
import Icone from '../components/Icone'
import '../styles/descobertas.css'
import { useDados } from '../hooks/useDados'

const FILTROS = [
  { key: 'todos',  label: 'Todos' },
  { key: 'Alto',   label: 'Alto Impacto' },
  { key: 'Médio',  label: 'Médio Impacto' },
  { key: 'Baixo',  label: 'Baixo Impacto' },
]

// Cor do selo de impacto (as classes impactoBadge dos JSON nunca existiram no CSS)
const COR_IMPACTO = { Alto: 'error', Médio: 'warning', Baixo: 'info' }

function CardDescoberta({ d }) {
  return (
    <Card className="descoberta-card">
      <div className="flex items-start gap-6 mb-4">
        <div className={`descoberta-icon descoberta-icon--${d.cor}`}>
          <Icone nome={d.icone} />
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="descoberta-nome">{d.nome}</h3>
          <div className="flex items-center gap-2 flex-wrap">
            <Chip cor={d.categoriaBadge}>{d.categoria}</Chip>
            <Chip cor={COR_IMPACTO[d.impacto] || 'muted'}>Impacto: {d.impacto}</Chip>
            <span className="descoberta-data">{d.data}</span>
          </div>
        </div>
      </div>
      <div className="descoberta-insight">
        <Icone nome="fa-lightbulb" className="descoberta-insight-icon" />
        <span>{d.insight}</span>
      </div>
      <p className="descoberta-dado">
        <Icone nome="fa-arrow-trend-up" />
        {d.dado}
      </p>
      <div className="flex items-center gap-4 flex-wrap">
        <Button variante="secundario" tamanho="sm" className="descoberta-acao">Criar missão baseada nisto</Button>
        <Button variante="fantasma" tamanho="sm" className="descoberta-acao em-breve" disabled>Ver histórico completo <span className="badge-em-breve">Em breve</span></Button>
      </div>
    </Card>
  )
}

function Descobertas() {
  const { dados, carregando } = useDados('descobertas')
  const descobertas = useMemo(() => dados ?? [], [dados])
  const [filtroAtivo, setFiltroAtivo] = useState('todos')

  const filtradas = useMemo(() =>
    filtroAtivo === 'todos' ? descobertas : descobertas.filter(d => d.impacto === filtroAtivo),
    [descobertas, filtroAtivo]
  )

  return (
    <>
          <Topbar icone="fa-lightbulb" cor="dourado" titulo="Descobertas" subtitulo="Insights personalizados sobre seus hábitos de saúde" />

          <section id="page-content" className="page-transition">

            <FiltroPills className="mb-6" rotulo="Filtrar descobertas" opcoes={FILTROS} ativo={filtroAtivo} aoMudar={setFiltroAtivo} />

            {carregando ? (
              <div className="flex flex-col gap-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="card descoberta-card">
                    <div className="flex items-start gap-6 mb-4">
                      <div className="skeleton" style={{ width: 48, height: 48, borderRadius: '50%', flexShrink: 0 }}></div>
                      <div className="flex flex-col gap-2 grow">
                        <div className="skeleton" style={{ height: 14, width: '50%' }}></div>
                        <div className="skeleton" style={{ height: 11, width: '35%' }}></div>
                      </div>
                    </div>
                    <div className="skeleton" style={{ height: 40, marginBottom: 8 }}></div>
                    <div className="skeleton" style={{ height: 12, width: '70%' }}></div>
                  </div>
                ))}
              </div>
            ) : filtradas.length === 0 ? (
              <p className="text-muted text-center py-12">Nenhuma descoberta para este filtro.</p>
            ) : (
              <div className="flex flex-col gap-6">
                {filtradas.map(d => <CardDescoberta key={d.id} d={d} />)}
              </div>
            )}

            <div className="descobertas-info mt-12">
              <div className="descobertas-info-icon">
                <Icone nome="fa-circle-info" />
              </div>
              <div className="flex flex-col gap-2">
                <h4 className="descobertas-info-titulo">Como funcionam as descobertas?</h4>
                <p className="descobertas-info-desc">
                  A WayCare Bottle e a dock registram cada gole automaticamente: a balança da dock pesa a
                  garrafa e calcula quanto você bebeu ao longo do dia. Junto com suas missões e seu humor,
                  esses dados revelam padrões e correlações personalizadas para você. Quanto mais você usa a
                  WayCare Bottle, mais precisas ficam as descobertas!
                </p>
                <ul className="descobertas-info-lista">
                  <li><Icone nome="fa-circle-dot" /> Novas descobertas são geradas semanalmente</li>
                  <li><Icone nome="fa-circle-dot" /> Baseadas em pelo menos 7 dias de dados da garrafa</li>
                  <li><Icone nome="fa-circle-dot" /> Priorizamos insights com maior impacto na sua saúde</li>
                </ul>
              </div>
            </div>

          </section>
    </>
  )
}

export default Descobertas
