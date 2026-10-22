import { useState, useMemo, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import Topbar from '../components/Topbar'
import FiltroPills from '../components/FiltroPills'
import Button from '../components/Button'
import Card from '../components/Card'
import Chip from '../components/Chip'
import '../styles/trilhas.css'

// Cor da categoria: só no ícone (thumb) e nas tags
const VARIANTE_STYLES = {
  purple:  { thumb: 'trilha-thumb--purple', tagBadge: 'badge-purple' },
  blue:    { thumb: 'trilha-thumb--blue',   tagBadge: 'badge-info' },
  teal:    { thumb: 'trilha-thumb--green',  tagBadge: 'badge-teal' },
  orange:  { thumb: 'trilha-thumb--orange', tagBadge: 'badge-warning' },
  checkup: { thumb: 'trilha-thumb--red',    tagBadge: 'badge-error' },
}

const DIFICULDADE_BADGE = {
  'Fácil': 'badge-facil',
  'Médio': 'badge-medio',
  'Difícil': 'badge-dificil',
}

const FILTROS = [
  { key: 'todos',       label: 'Todos',       icon: 'fa-circle-dot' },
  { key: 'movimento',   label: 'Movimento',   icon: 'fa-person-running' },
  { key: 'sono',        label: 'Sono',        icon: 'fa-moon' },
  { key: 'nutricao',    label: 'Nutrição',    icon: 'fa-apple-whole' },
  { key: 'mindfulness', label: 'Mindfulness', icon: 'fa-brain' },
  { key: 'saude',       label: 'Saúde',       icon: 'fa-heart-pulse' },
]

const FILTRO_LABEL = Object.fromEntries(FILTROS.map(f => [f.key, f.label]))

// Painel de missões
function PainelMissoes({ trilha, missoesPorTrilha }) {
  const missoes = missoesPorTrilha[trilha.id] || []

  return (
    <div className="trilha-painel-missoes">
      <div className="trilha-painel-header">
        <div className="d-flex align-items-center gap-2">
          <i className="fa-solid fa-list-check"></i>
          <span className="trilha-painel-titulo">Missões da Trilha</span>
        </div>
        <span className="trilha-painel-total">
          {missoes.filter(m => m.status === 'concluida').length}/{missoes.length} concluídas
        </span>
      </div>

      <div className="trilha-missoes-lista">
        {missoes.map((missao, i) => (
          <div key={missao.id} className={`trilha-missao-item trilha-missao-item--${missao.status}`}>
            <div className={`trilha-missao-icone trilha-missao-icone--${missao.status}`}>
              {missao.status === 'concluida'  && <i className="fa-solid fa-check"></i>}
              {missao.status === 'atual'      && <i className="fa-solid fa-play"></i>}
              {missao.status === 'disponivel' && <i className="fa-solid fa-play"></i>}
              {missao.status === 'bloqueada'  && <i className="fa-solid fa-lock"></i>}
            </div>

            {/* Número + nome */}
            <div className="trilha-missao-info">
              <span className="trilha-missao-num">{i + 1}.</span>
              <span className="trilha-missao-nome">{missao.nome}</span>
            </div>

            {/* HC */}
            <span className={`trilha-missao-hc trilha-missao-hc--${missao.status}`}>
              <i className="fa-solid fa-coins"></i>
              +{missao.hc}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// Card em andamento
function TrilhaEmAndamento({ trilha, expandida, onToggle, missoesPorTrilha }) {
  const s = VARIANTE_STYLES[trilha.variante]
  return (
    <div className={`trilha-filter-item${expandida ? ' trilha-filter-item--expandida' : ''}`}>
      <Card
        className={`trilha-card d-flex ${expandida ? 'trilha-card-expandida' : 'flex-column'} gap-3`}
        onClick={onToggle}
        style={{ cursor: 'pointer' }}
      >
        {/* Conteúdo principal do card */}
        <div className={`trilha-card-conteudo ${expandida ? 'trilha-card-conteudo--expandida' : 'flex-column'} d-flex gap-3`}>
          <div className="d-flex align-items-start gap-3">
            <div className={`trilha-thumb ${s.thumb}`}>
              <i className={`fa-solid ${trilha.icone}`}></i>
            </div>
            <div className="d-flex flex-column gap-1">
              <div className="d-flex align-items-center gap-2">
                <h3 className="trilha-nome">{trilha.nome}</h3>
                <span className="trilha-status-badge">● {trilha.status}</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <Chip cor={DIFICULDADE_BADGE[trilha.dificuldade]}>{trilha.dificuldade}</Chip>
                <span className="text-xs text-muted">Nível {trilha.nivel} · {trilha.participantes} participantes</span>
              </div>
            </div>
            {/* Ícone de expandir */}
            <div className="trilha-expand-icon ms-auto">
              <i className={`fa-solid ${expandida ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
            </div>
          </div>
          <p className="trilha-desc">{trilha.descricao}</p>
          <div className="d-flex gap-2 flex-wrap">
            {trilha.tags.map(tag => (
              <Chip key={tag} cor={s.tagBadge}>{tag}</Chip>
            ))}
          </div>
          <div className="d-flex justify-content-between align-items-center">
            <span className="text-sm text-secondary">Progresso da trilha</span>
            <span className="text-sm font-bold trilha-pct">{trilha.progresso}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${trilha.progresso}%` }}></div>
          </div>
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-3">
              <span className="trilha-meta-item"><i className="fa-regular fa-calendar"></i> {trilha.dias} dias</span>
              <span className="trilha-meta-item"><i className="fa-regular fa-circle-check"></i> {trilha.missoes} missões</span>
            </div>
            <span className="mission-hc"><span className="fa-solid fa-coins"></span> +{trilha.hc} HC</span>
          </div>
          <div onClick={e => e.stopPropagation()}>
            <Button bloco>
              <i className="fa-solid fa-play"></i> Continuar Trilha
            </Button>
          </div>
        </div>

        {/* Painel lateral de missões (só aparece quando expandido) */}
        {expandida && (
          <div onClick={e => e.stopPropagation()}>
            <PainelMissoes trilha={trilha} missoesPorTrilha={missoesPorTrilha} />
          </div>
        )}
      </Card>
    </div>
  )
}

// Card disponível
function TrilhaDisponivel({ trilha, expandida, onToggle, missoesPorTrilha }) {
  const s = VARIANTE_STYLES[trilha.variante]
  return (
    <div className={`trilha-filter-item${expandida ? ' trilha-filter-item--expandida' : ''}`}>
      <Card
        className={`trilha-card d-flex ${expandida ? 'trilha-card-expandida' : 'flex-column'} gap-3`}
        onClick={onToggle}
        style={{ cursor: 'pointer' }}
      >
        <div className={`trilha-card-conteudo ${expandida ? 'trilha-card-conteudo--expandida' : 'flex-column'} d-flex gap-3`}>
          {trilha.recomendada && (
            <span className="trilha-recomendada-label">
              <i className="fa-solid fa-star"></i> Recomendada para seu humor
            </span>
          )}
          <div className="d-flex align-items-start gap-3">
            <div className={`trilha-thumb ${s.thumb}`}>
              <i className={`fa-solid ${trilha.icone}`}></i>
            </div>
            <div className="d-flex flex-column gap-1">
              <h3 className="trilha-nome">{trilha.nome}</h3>
              <div className="d-flex align-items-center gap-2">
                <Chip cor={DIFICULDADE_BADGE[trilha.dificuldade]}>{trilha.dificuldade}</Chip>
                <span className="text-xs text-muted">Nível {trilha.nivel} · {trilha.participantes} participantes</span>
              </div>
            </div>
            <div className="trilha-expand-icon ms-auto">
              <i className={`fa-solid ${expandida ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
            </div>
          </div>
          <p className="trilha-desc">{trilha.descricao}</p>
          <div className="d-flex gap-2 flex-wrap">
            {trilha.tags.map(tag => (
              <Chip key={tag} cor={s.tagBadge}>{tag}</Chip>
            ))}
          </div>
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-3">
              <span className="trilha-meta-item"><i className="fa-regular fa-calendar"></i> {trilha.dias} dias</span>
              <span className="trilha-meta-item"><i className="fa-regular fa-circle-check"></i> {trilha.missoes} missões</span>
            </div>
            <span className="mission-hc"><span className="fa-solid fa-coins"></span> +{trilha.hc} HC</span>
          </div>
          <div onClick={e => e.stopPropagation()}>
            <Button variante="secundario" bloco>+ Iniciar Trilha</Button>
          </div>
        </div>
        {expandida && (
          <div onClick={e => e.stopPropagation()}>
            <PainelMissoes trilha={trilha} missoesPorTrilha={missoesPorTrilha} />
          </div>
        )}
      </Card>
    </div>
  )
}

// Card bloqueado
function TrilhaBloqueada({ trilha }) {
  return (
    <div className="trilha-filter-item">
      <Card className="trilha-card trilha-card-bloqueada d-flex flex-column gap-3">
        <div className="d-flex align-items-start gap-3">
          <div className="trilha-thumb trilha-thumb--locked">
            <i className={`fa-solid ${trilha.icone}`}></i>
          </div>
          <div className="d-flex flex-column gap-1">
            <div className="d-flex align-items-center gap-2">
              <h3 className="trilha-nome text-muted">{trilha.nome}</h3>
              <i className="fa-solid fa-lock text-muted text-sm"></i>
            </div>
            <div className="d-flex align-items-center gap-2">
              <Chip cor={DIFICULDADE_BADGE[trilha.dificuldade]}>{trilha.dificuldade}</Chip>
              <span className="text-xs text-muted">Nível {trilha.nivel} · {trilha.participantes} participantes</span>
            </div>
          </div>
        </div>
        <p className="trilha-desc text-muted">{trilha.descricao}</p>
        <div className="d-flex gap-2 flex-wrap">
          {trilha.tags.map(tag => (
            <Chip key={tag} cor="muted">{tag}</Chip>
          ))}
        </div>
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-3">
            <span className="trilha-meta-item text-muted"><i className="fa-regular fa-calendar"></i> {trilha.dias} dias</span>
            <span className="trilha-meta-item text-muted"><i className="fa-regular fa-circle-check"></i> {trilha.missoes} missões</span>
          </div>
          <span className="mission-hc"><span className="fa-solid fa-coins"></span> +{trilha.hc} HC</span>
        </div>
        <Button variante="fantasma" bloco disabled>
          <i className="fa-solid fa-lock"></i> Bloqueada
        </Button>
      </Card>
    </div>
  )
}

// Seção vazia
function SecaoVazia({ label }) {
  return (
    <div className="trilha-empty-state">
      <i className="fa-solid fa-filter-circle-xmark trilha-empty-icon"></i>
      <p className="trilha-empty-text">Nenhuma trilha de <strong>{label}</strong> nesta seção.</p>
    </div>
  )
}

// Filtra uma lista de trilhas pela categoria e pelo texto da busca
function aplicarFiltros(lista, filtroAtivo, busca) {
  return lista.filter(t => {
    const bateFiltro = filtroAtivo === 'todos' || t.categoria === filtroAtivo
    const bateBusca  = busca.trim() === '' ||
      t.nome.toLowerCase().includes(busca.toLowerCase()) ||
      t.descricao.toLowerCase().includes(busca.toLowerCase()) ||
      t.tags.some(tag => tag.toLowerCase().includes(busca.toLowerCase()))
    return bateFiltro && bateBusca
  })
}

// Página principal
function Trilhas() {
  const [filtroAtivo, setFiltroAtivo]     = useState('todos')
  const [busca, setBusca]                 = useState('')
  const [trilhaExpandida, setTrilhaExpandida] = useState(null)
  const [trilhasData, setTrilhasData]     = useState({ emAndamento: [], disponiveis: [], bloqueadas: [] })
  const [missoesPorTrilha, setMissoesPorTrilha] = useState({})
  const [carregando, setCarregando]       = useState(true)
  const { totalHC, humor, HUMOR_CONFIG }  = useApp()

  // Busca trilhas e missões dos JSONs locais
  useEffect(() => {
    Promise.all([
      fetch('/data/trilhas.json').then(r => r.json()),
      fetch('/data/missoes.json').then(r => r.json()),
    ])
      .then(([trilhas, missoes]) => {
        setTrilhasData(trilhas)
        setMissoesPorTrilha(missoes)
        setCarregando(false)
      })
      .catch(async () => {
        // Fallback via import direto
        const [trilhas, missoes] = await Promise.all([
          import('../data/trilhas.json').then(m => m.default),
          import('../data/missoes.json').then(m => m.default),
        ])
        setTrilhasData(trilhas)
        setMissoesPorTrilha(missoes)
        setCarregando(false)
      })
  }, [])

  const toggleExpandir = (id) => {
    setTrilhaExpandida(prev => prev === id ? null : id)
  }

  const andamento   = useMemo(() => aplicarFiltros(trilhasData.emAndamento, filtroAtivo, busca),  [filtroAtivo, busca, trilhasData])
  const disponiveis = useMemo(() => aplicarFiltros(trilhasData.disponiveis, filtroAtivo, busca),  [filtroAtivo, busca, trilhasData])
  const bloqueadas  = useMemo(() => aplicarFiltros(trilhasData.bloqueadas, filtroAtivo, busca),   [filtroAtivo, busca, trilhasData])

  const totalResultados = andamento.length + disponiveis.length + bloqueadas.length
  const semResultados   = !carregando && totalResultados === 0

  return (
    <>
          {/* Topbar */}
          <Topbar
            icone="fa-route"
            titulo="Trilhas de Bem-estar"
            subtitulo={
              <>
                Recomendado: <i className={`fa-solid ${HUMOR_CONFIG[humor].icon} trilhas-subtitle-icon`}></i>
                <span className="trilhas-subtitle-texto"> {HUMOR_CONFIG[humor].trilha}</span>
              </>
            }
          />

          <section id="page-content" className="page-transition">

            {/* Cards de resumo */}
            <div className="trilhas-resumo-grid mb-4">
              <div>
                <Card className="resumo-card">
                  <div className="resumo-icon resumo-icon--primary"><i className="fa-solid fa-bullseye"></i></div>
                  <div className="resumo-card-body">
                    <span className="resumo-valor">{trilhasData.emAndamento.length}</span>
                    <span className="resumo-label">Trilhas Ativas</span>
                  </div>
                </Card>
              </div>
              <div>
                <Card className="resumo-card">
                  <div className="resumo-icon resumo-icon--success"><i className="fa-solid fa-circle-check"></i></div>
                  <div className="resumo-card-body">
                    <span className="resumo-valor">3</span>
                    <span className="resumo-label">Missões Concluídas</span>
                  </div>
                </Card>
              </div>
              <div>
                <Card className="resumo-card">
                  <div className="resumo-icon resumo-icon--warning"><i className="fa-solid fa-fire"></i></div>
                  <div className="resumo-card-body">
                    <span className="resumo-valor text-warning">5 dias</span>
                    <span className="resumo-label">Sequência</span>
                  </div>
                </Card>
              </div>
              <div>
                <Card className="resumo-card">
                  <div className="resumo-icon resumo-icon--hc"><i className="fa-solid fa-coins"></i></div>
                  <div className="resumo-card-body">
                    <span className="resumo-valor resumo-valor--hc">{totalHC.toLocaleString('pt-BR')}</span>
                    <span className="resumo-label">Health Coins</span>
                  </div>
                </Card>
              </div>
            </div>

            {/* Busca e filtros */}
            <div className="d-flex align-items-center gap-3 mb-5 flex-wrap">
              <div className="trilhas-search grow">
                <i className="fa-solid fa-magnifying-glass trilhas-search-icon"></i>
                <input
                  type="search"
                  className="input-field trilhas-search-input"
                  placeholder="Buscar trilhas..."
                  value={busca}
                  onChange={e => setBusca(e.target.value)}
                />
              </div>
              <FiltroPills rotulo="Filtrar trilhas" opcoes={FILTROS} ativo={filtroAtivo} aoMudar={setFiltroAtivo} />
            </div>

            {/* Spinner de carregamento */}
            {carregando && (
              <div className="d-flex justify-content-center align-items-center py-5">
                <div className="d-flex flex-column align-items-center gap-3">
                  <i className="fa-solid fa-spinner fa-spin text-primary" style={{ fontSize: '32px' }}></i>
                  <span className="text-muted">Carregando trilhas...</span>
                </div>
              </div>
            )}

            {/* Estado vazio global */}
            {semResultados && (
              <div className="trilha-empty-global">
                <i className="fa-solid fa-magnifying-glass trilha-empty-icon"></i>
                <p className="trilha-empty-text">
                  Nenhuma trilha encontrada
                  {busca && <> para "<strong>{busca}</strong>"</>}
                  {filtroAtivo !== 'todos' && <> na categoria <strong>{FILTRO_LABEL[filtroAtivo]}</strong></>}.
                </p>
                <Button
                  variante="secundario"
                  className="mt-3"
                  onClick={() => { setFiltroAtivo('todos'); setBusca('') }}
                >
                  Limpar filtros
                </Button>
              </div>
            )}

            {/* Trilhas em andamento */}
            {!carregando && !semResultados && (
              <div className="trilhas-secao">
                <div className="d-flex align-items-center gap-3 mb-4">
                  <span className="trilhas-secao-barra trilhas-secao-barra--primary"></span>
                  <h2 className="trilhas-secao-titulo">Trilhas em Andamento</h2>
                  <Chip cor="primary">{andamento.length} ativas</Chip>
                </div>
                {andamento.length > 0 ? (
                  <div className="trilhas-cards-grid">
                    {andamento.map(t => (
                      <TrilhaEmAndamento
                        key={t.id}
                        trilha={t}
                        expandida={trilhaExpandida === t.id}
                        onToggle={() => toggleExpandir(t.id)}
                        missoesPorTrilha={missoesPorTrilha}
                      />
                    ))}
                  </div>
                ) : <SecaoVazia label={FILTRO_LABEL[filtroAtivo]} />}
              </div>
            )}

            {/* Trilhas disponíveis */}
            {!carregando && !semResultados && (
              <div className="trilhas-secao">
                <div className="d-flex align-items-center gap-3 mb-4">
                  <span className="trilhas-secao-barra trilhas-secao-barra--warning"></span>
                  <h2 className="trilhas-secao-titulo">Trilhas Disponíveis</h2>
                  <Chip cor="warning">{disponiveis.length} disponíveis</Chip>
                </div>
                {disponiveis.length > 0 ? (
                  <div className="trilhas-cards-grid">
                    {disponiveis.map(t => (
                      <TrilhaDisponivel
                        key={t.id}
                        trilha={t}
                        expandida={trilhaExpandida === t.id}
                        onToggle={() => toggleExpandir(t.id)}
                        missoesPorTrilha={missoesPorTrilha}
                      />
                    ))}
                  </div>
                ) : <SecaoVazia label={FILTRO_LABEL[filtroAtivo]} />}
              </div>
            )}

            {/* Trilhas bloqueadas */}
            {!carregando && !semResultados && (
              <div className="trilhas-secao">
                <div className="d-flex align-items-center gap-3 mb-4">
                  <span className="trilhas-secao-barra trilhas-secao-barra--muted"></span>
                  <h2 className="trilhas-secao-titulo">Trilhas Bloqueadas</h2>
                  <span className="text-sm text-muted">Complete outras trilhas para desbloquear</span>
                </div>
                {bloqueadas.length > 0 ? (
                  <div className="trilhas-cards-grid">
                    {bloqueadas.map(t => <TrilhaBloqueada key={t.id} trilha={t} />)}
                  </div>
                ) : <SecaoVazia label={FILTRO_LABEL[filtroAtivo]} />}
              </div>
            )}

          </section>
    </>
  )
}

export default Trilhas