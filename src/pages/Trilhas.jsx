import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import { useApp } from '../context/AppContext'
import '../styles/trilhas.css'

// Dados das missões por trilha

const MISSOES_POR_TRILHA = {
  'sono-profundo': [
    { id: 1, nome: 'Dormir às 22h', hc: 50, status: 'concluida' },
    { id: 2, nome: 'Sem telas 1h antes de dormir', hc: 60, status: 'concluida' },
    { id: 3, nome: 'Meditação noturna 5 min', hc: 70, status: 'atual' },
    { id: 4, nome: 'Chá de camomila', hc: 40, status: 'bloqueada' },
    { id: 5, nome: 'Diário de gratidão', hc: 130, status: 'bloqueada' },
  ],
  'movimento-diario': [
    { id: 1, nome: 'Caminhar 5.000 passos', hc: 50, status: 'concluida' },
    { id: 2, nome: 'Alongamento matinal 10 min', hc: 30, status: 'atual' },
    { id: 3, nome: 'Subir escadas no trabalho', hc: 20, status: 'bloqueada' },
    { id: 4, nome: 'Caminhar 8.000 passos', hc: 80, status: 'bloqueada' },
    { id: 5, nome: 'Exercício leve 20 min', hc: 100, status: 'bloqueada' },
    { id: 6, nome: 'Alongamento pós-trabalho 10 min', hc: 60, status: 'bloqueada' },
    { id: 7, nome: 'Caminhar 10.000 passos', hc: 120, status: 'bloqueada' },
    { id: 8, nome: 'Atividade aeróbica 30 min', hc: 160, status: 'bloqueada' },
  ],
  'mente-tranquila': [
    { id: 1, nome: 'Respiração 4-7-8 por 5 min', hc: 40, status: 'disponivel' },
    { id: 2, nome: 'Meditação guiada 10 min', hc: 60, status: 'bloqueada' },
    { id: 3, nome: 'Pausa consciente no trabalho', hc: 50, status: 'bloqueada' },
    { id: 4, nome: 'Journaling de pensamentos', hc: 80, status: 'bloqueada' },
    { id: 5, nome: 'Caminhada mindful 15 min', hc: 90, status: 'bloqueada' },
    { id: 6, nome: 'Gratidão diária — 3 itens', hc: 100, status: 'bloqueada' },
  ],
  'alimentacao-consciente': [
    { id: 1, nome: 'Beber 2L de água no dia', hc: 50, status: 'disponivel' },
    { id: 2, nome: 'Substituir um snack processado', hc: 60, status: 'bloqueada' },
    { id: 3, nome: 'Comer sem telas por 1 refeição', hc: 70, status: 'bloqueada' },
    { id: 4, nome: 'Incluir verduras no almoço', hc: 60, status: 'bloqueada' },
    { id: 5, nome: 'Café da manhã nutritivo', hc: 80, status: 'bloqueada' },
    { id: 6, nome: 'Reduzir açúcar adicionado', hc: 90, status: 'bloqueada' },
    { id: 7, nome: 'Fruta como sobremesa', hc: 70, status: 'bloqueada' },
    { id: 8, nome: 'Mastigar devagar (20x por mordida)', hc: 80, status: 'bloqueada' },
    { id: 9, nome: 'Planejar refeições da semana', hc: 110, status: 'bloqueada' },
    { id: 10, nome: 'Semana sem fast food', hc: 130, status: 'bloqueada' },
  ],
  'checkup-preventivo': [
    { id: 1, nome: 'Agendar consulta com clínico geral', hc: 150, status: 'disponivel' },
    { id: 2, nome: 'Realizar exame de sangue de rotina', hc: 350, status: 'bloqueada' },
    { id: 3, nome: 'Consulta com dentista', hc: 300, status: 'bloqueada' },
    { id: 4, nome: 'Aferir pressão arterial e IMC', hc: 400, status: 'bloqueada' },
  ],
  'cardio-intenso': [],
}

// Dados das trilhas
const TRILHAS_EM_ANDAMENTO = [
  {
    id: 'sono-profundo',
    nome: 'Sono Profundo',
    status: 'Em andamento',
    dificuldade: 'Fácil',
    nivel: 1,
    participantes: '1.240',
    descricao: 'Melhore a qualidade do seu sono com hábitos noturnos saudáveis e rotinas de relaxamento comprovadas.',
    tags: ['Relaxamento', 'Rotina', 'Descanso'],
    dias: 7, missoes: 5, hc: 350, progresso: 60,
    categoria: 'sono', variante: 'purple', icone: 'fa-moon',
  },
  {
    id: 'movimento-diario',
    nome: 'Movimento Diário',
    status: 'Em andamento',
    dificuldade: 'Médio',
    nivel: 2,
    participantes: '890',
    descricao: 'Incorpore atividade física leve à sua rotina diária sem precisar ir à academia.',
    tags: ['Passos', 'Cardio', 'Energia'],
    dias: 14, missoes: 8, hc: 620, progresso: 25,
    categoria: 'movimento', variante: 'blue', icone: 'fa-person-running',
  },
]

const TRILHAS_DISPONIVEIS = [
  {
    id: 'mente-tranquila',
    nome: 'Mente Tranquila',
    dificuldade: 'Fácil',
    nivel: 1,
    participantes: '2.100',
    descricao: 'Reduza o estresse e a ansiedade com técnicas de mindfulness e respiração consciente.',
    tags: ['Respiração', 'Foco', 'Ansiedade'],
    dias: 10, missoes: 6, hc: 420,
    categoria: 'mindfulness', variante: 'teal', icone: 'fa-brain', recomendada: true,
  },
  {
    id: 'alimentacao-consciente',
    nome: 'Alimentação Consciente',
    dificuldade: 'Difícil',
    nivel: 3,
    participantes: '660',
    descricao: 'Desenvolva uma relação saudável com a comida e melhore seus hábitos alimentares.',
    tags: ['Hidratação', 'Proteína', 'Vitaminas'],
    dias: 21, missoes: 10, hc: 900,
    categoria: 'nutricao', variante: 'orange', icone: 'fa-bowl-food', recomendada: true,
  },
  {
    id: 'checkup-preventivo',
    nome: 'Check-up Preventivo',
    dificuldade: 'Médio',
    nivel: 2,
    participantes: '440',
    descricao: 'Cuide da sua saúde com consultas regulares e exames preventivos essenciais.',
    tags: ['Consulta', 'Exames', 'Prevenção'],
    dias: 30, missoes: 4, hc: 1200,
    categoria: 'saude', variante: 'checkup', icone: 'fa-clipboard-list', recomendada: false,
  },
]

const TRILHAS_BLOQUEADAS = [
  {
    id: 'cardio-intenso',
    nome: 'Cardio Intenso',
    dificuldade: 'Difícil',
    nivel: 4,
    participantes: '280',
    descricao: 'Eleve seu condicionamento físico com atividades cardiovasculares progressivas.',
    tags: ['Resistência', 'Força', 'Velocidade'],
    dias: 21, missoes: 12, hc: 1100,
    categoria: 'movimento', icone: 'fa-person-biking',
  },
]

// Estilos por variante

const VARIANTE_STYLES = {
  purple: {
    card: '', thumb: 'trilha-thumb--purple',
    statusBadge: 'trilha-status-badge--purple',
    pct: 'trilha-pct--purple', fill: 'trilha-fill--purple',
    btn: 'trilha-btn-continuar', tagBadge: 'badge-purple',
    painelHeader: 'trilha-painel-header--purple',
    border: 'trilha-card--purple-expanded',
  },
  blue: {
    card: 'trilha-card--blue', thumb: 'trilha-thumb--blue',
    statusBadge: 'trilha-status-badge--blue',
    pct: 'trilha-pct--blue', fill: 'trilha-fill--blue',
    btn: 'trilha-btn-continuar trilha-btn-continuar--blue', tagBadge: 'badge-info',
    painelHeader: 'trilha-painel-header--blue',
    border: 'trilha-card--blue-expanded',
  },
  teal: {
    card: 'trilha-card-recomendada', thumb: 'trilha-thumb--green',
    btn: 'trilha-btn-iniciar trilha-btn-iniciar--teal', tagBadge: 'badge-teal',
    painelHeader: 'trilha-painel-header--teal',
    border: 'trilha-card-recomendada-teal',
  },
  orange: {
    card: 'trilha-card-recomendada', thumb: 'trilha-thumb--orange',
    btn: 'trilha-btn-iniciar trilha-btn-iniciar--orange', tagBadge: 'badge-warning',
    painelHeader: 'trilha-painel-header--orange',
    border: 'trilha-card-recomendada-orange',
  },
  checkup: {
    card: 'trilha-card-checkup', thumb: 'trilha-thumb--red',
    btn: 'trilha-btn-iniciar trilha-btn-iniciar--checkup', tagBadge: 'badge-error',
    painelHeader: 'trilha-painel-header--red',
    border: 'trilha-card-checkup',
  },
}

const DIFICULDADE_BADGE = {
  'Fácil': 'badge-facil',
  'Médio': 'badge-medio',
  'Difícil': 'badge-dificil',
}

// Painel de missões

function PainelMissoes({ trilha, variante }) {
  const missoes = MISSOES_POR_TRILHA[trilha.id] || []
  const s = variante ? VARIANTE_STYLES[variante] : {}

  return (
    <div className="trilha-painel-missoes">
      <div className={`trilha-painel-header ${s.painelHeader || ''}`}>
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
          <div
            key={missao.id}
            className={`trilha-missao-item trilha-missao-item--${missao.status}`}
          >
            {/* Ícone de status */}
            <div className={`trilha-missao-icone trilha-missao-icone--${missao.status}`}>
              {missao.status === 'concluida' && <i className="fa-solid fa-check"></i>}
              {missao.status === 'atual' && <i className="fa-solid fa-play"></i>}
              {missao.status === 'disponivel' && <i className="fa-solid fa-play"></i>}
              {missao.status === 'bloqueada' && <i className="fa-solid fa-lock"></i>}
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

function TrilhaEmAndamento({ trilha, expandida, onToggle }) {
  const s = VARIANTE_STYLES[trilha.variante]
  return (
    <div className={`col-12 trilha-filter-item ${expandida ? 'trilha-expandida-col' : 'col-lg-6'}`}>
      <div
        className={`card trilha-card ${s.card} ${s.border} d-flex ${expandida ? 'trilha-card-expandida' : 'flex-column'} gap-3`}
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
                <span className={`trilha-status-badge ${s.statusBadge}`}>● {trilha.status}</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <span className={`badge ${DIFICULDADE_BADGE[trilha.dificuldade]}`}>{trilha.dificuldade}</span>
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
              <span key={tag} className={`badge ${s.tagBadge}`}>{tag}</span>
            ))}
          </div>
          <div className="d-flex justify-content-between align-items-center">
            <span className="text-sm text-secondary">Progresso da trilha</span>
            <span className={`text-sm font-bold ${s.pct}`}>{trilha.progresso}%</span>
          </div>
          <div className="progress-bar">
            <div className={`progress-fill ${s.fill}`} style={{ width: `${trilha.progresso}%` }}></div>
          </div>
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-3">
              <span className="trilha-meta-item"><i className="fa-regular fa-calendar"></i> {trilha.dias} dias</span>
              <span className="trilha-meta-item"><i className="fa-regular fa-circle-check"></i> {trilha.missoes} missões</span>
            </div>
            <span className="mission-hc"><span className="fa-solid fa-coins"></span> +{trilha.hc} HC</span>
          </div>
          <div onClick={e => e.stopPropagation()}>
            <button className={`btn ${s.btn} w-100`}>
              <i className="fa-solid fa-play"></i> Continuar Trilha
            </button>
          </div>
        </div>

        {/* Painel lateral de missões (só aparece quando expandido) */}
        {expandida && (
          <div onClick={e => e.stopPropagation()}>
            <PainelMissoes trilha={trilha} variante={trilha.variante} />
          </div>
        )}
      </div>
    </div>
  )
}

// Card disponível

function TrilhaDisponivel({ trilha, expandida, onToggle }) {
  const s = VARIANTE_STYLES[trilha.variante]
  return (
    <div className={`col-12 trilha-filter-item ${expandida ? 'trilha-expandida-col' : 'col-lg-6'}`}>
      <div
        className={`card trilha-card ${s.card} ${s.border} d-flex ${expandida ? 'trilha-card-expandida' : 'flex-column'} gap-3`}
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
                <span className={`badge ${DIFICULDADE_BADGE[trilha.dificuldade]}`}>{trilha.dificuldade}</span>
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
              <span key={tag} className={`badge ${s.tagBadge}`}>{tag}</span>
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
            <button className={`btn ${s.btn} w-100`}>+ Iniciar Trilha</button>
          </div>
        </div>

        {expandida && (
          <div onClick={e => e.stopPropagation()}>
            <PainelMissoes trilha={trilha} variante={trilha.variante} />
          </div>
        )}
      </div>
    </div>
  )
}

// Card bloqueado

function TrilhaBloqueada({ trilha }) {
  return (
    <div className="col-12 col-lg-6 trilha-filter-item">
      <div className="card trilha-card trilha-card-bloqueada d-flex flex-column gap-3">
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
              <span className={`badge ${DIFICULDADE_BADGE[trilha.dificuldade]}`}>{trilha.dificuldade}</span>
              <span className="text-xs text-muted">Nível {trilha.nivel} · {trilha.participantes} participantes</span>
            </div>
          </div>
        </div>
        <p className="trilha-desc text-muted">{trilha.descricao}</p>
        <div className="d-flex gap-2 flex-wrap">
          {trilha.tags.map(tag => (
            <span key={tag} className="badge badge-muted">{tag}</span>
          ))}
        </div>
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-3">
            <span className="trilha-meta-item text-muted"><i className="fa-regular fa-calendar"></i> {trilha.dias} dias</span>
            <span className="trilha-meta-item text-muted"><i className="fa-regular fa-circle-check"></i> {trilha.missoes} missões</span>
          </div>
          <span className="mission-hc"><span className="fa-solid fa-coins"></span> +{trilha.hc} HC</span>
        </div>
        <button className="btn trilha-btn-bloqueada" disabled>
          <i className="fa-solid fa-lock"></i> Bloqueada
        </button>
      </div>
    </div>
  )
}

// Seção vazia quando nenhuma trilha bate com o filtro
function SecaoVazia({ label }) {
  return (
    <div className="trilha-empty-state">
      <i className="fa-solid fa-filter-circle-xmark trilha-empty-icon"></i>
      <p className="trilha-empty-text">Nenhuma trilha de <strong>{label}</strong> nesta seção.</p>
    </div>
  )
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

// Página principal

function Trilhas() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [filtroAtivo, setFiltroAtivo] = useState('todos')
  const [busca, setBusca] = useState('')
  const [trilhaExpandida, setTrilhaExpandida] = useState(null)
  const { totalHC, humor, HUMOR_CONFIG } = useApp()

  const toggleExpandir = (id) => {
    setTrilhaExpandida(prev => prev === id ? null : id)
  }

  const aplicarFiltros = (lista) => {
    return lista.filter(t => {
      const bateFiltro = filtroAtivo === 'todos' || t.categoria === filtroAtivo
      const bateBusca = busca.trim() === '' ||
        t.nome.toLowerCase().includes(busca.toLowerCase()) ||
        t.descricao.toLowerCase().includes(busca.toLowerCase()) ||
        t.tags.some(tag => tag.toLowerCase().includes(busca.toLowerCase()))
      return bateFiltro && bateBusca
    })
  }

  const andamento   = useMemo(() => aplicarFiltros(TRILHAS_EM_ANDAMENTO),  [filtroAtivo, busca])
  const disponiveis = useMemo(() => aplicarFiltros(TRILHAS_DISPONIVEIS),    [filtroAtivo, busca])
  const bloqueadas  = useMemo(() => aplicarFiltros(TRILHAS_BLOQUEADAS),     [filtroAtivo, busca])

  const totalResultados = andamento.length + disponiveis.length + bloqueadas.length
  const semResultados   = totalResultados === 0

  return (
    <>
      <button className="sidebar-toggle" aria-label="Abrir menu" onClick={() => setSidebarOpen(!sidebarOpen)}>
        <i className="fa-solid fa-bars"></i>
      </button>

      <div className="app-layout">
        <div className={sidebarOpen ? 'open' : ''}>
          <Sidebar />
        </div>

        <main className="main-content" id="main-content">

          {/* Topbar */}
          <header className="topbar">
            <div>
              <h1 className="trilhas-page-title">Trilhas de Bem-estar</h1>
              <p className="trilhas-page-subtitle">
                Recomendado para você: <i className={`fa-solid ${HUMOR_CONFIG[humor].icon} trilhas-subtitle-icon`}></i>
                <span className="trilhas-subtitle-texto"> {HUMOR_CONFIG[humor].trilha}</span>
              </p>
            </div>
            <div className="topbar-actions">
              <div className="hc-chip">
                <i className="fa-solid fa-coins"></i>
                {totalHC} HC
              </div>
              <Link to="/carteira" className="notif-btn" aria-label="Carteira">
                <i className="fa-solid fa-wallet"></i>
              </Link>
              <Link to="/notificacoes" className="notif-btn" aria-label="Notificações">
                <i className="fa-solid fa-bell"></i>
                <span className="notif-dot"></span>
              </Link>
            </div>
          </header>

          <section id="page-content" className="page-transition">

            {/* Cards de resumo */}
            <div className="row g-3 mb-4">
              <div className="col-6 col-lg-3">
                <div className="card resumo-card">
                  <div className="resumo-icon resumo-icon--primary"><i className="fa-solid fa-bullseye"></i></div>
                  <div className="resumo-card-body">
                    <span className="resumo-valor">2</span>
                    <span className="resumo-label">Trilhas Ativas</span>
                  </div>
                </div>
              </div>
              <div className="col-6 col-lg-3">
                <div className="card resumo-card">
                  <div className="resumo-icon resumo-icon--success"><i className="fa-solid fa-circle-check"></i></div>
                  <div className="resumo-card-body">
                    <span className="resumo-valor">3</span>
                    <span className="resumo-label">Missões Concluídas</span>
                  </div>
                </div>
              </div>
              <div className="col-6 col-lg-3">
                <div className="card resumo-card">
                  <div className="resumo-icon resumo-icon--warning"><i className="fa-solid fa-fire"></i></div>
                  <div className="resumo-card-body">
                    <span className="resumo-valor text-warning">5 dias</span>
                    <span className="resumo-label">Sequência</span>
                  </div>
                </div>
              </div>
              <div className="col-6 col-lg-3">
                <div className="card resumo-card">
                  <div className="resumo-icon resumo-icon--hc"><i className="fa-solid fa-coins"></i></div>
                  <div className="resumo-card-body">
                    <span className="resumo-valor resumo-valor--hc">{totalHC}</span>
                    <span className="resumo-label">Health Coins</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Busca e filtros */}
            <div className="d-flex align-items-center gap-3 mb-5 flex-wrap">
              <div className="trilhas-search flex-grow-1">
                <i className="fa-solid fa-magnifying-glass trilhas-search-icon"></i>
                <input
                  type="search"
                  className="input-field trilhas-search-input"
                  placeholder="Buscar trilhas..."
                  value={busca}
                  onChange={e => setBusca(e.target.value)}
                />
              </div>
              <div className="d-flex gap-2 flex-wrap">
                {FILTROS.map(f => (
                  <button
                    key={f.key}
                    className={`trilha-tag${filtroAtivo === f.key ? ' active' : ''}`}
                    onClick={() => setFiltroAtivo(f.key)}
                    aria-pressed={filtroAtivo === f.key}
                  >
                    <i className={`fa-solid ${f.icon}`}></i> {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Estado vazio global */}
            {semResultados && (
              <div className="trilha-empty-global">
                <i className="fa-solid fa-magnifying-glass trilha-empty-icon"></i>
                <p className="trilha-empty-text">
                  Nenhuma trilha encontrada
                  {busca && <> para "<strong>{busca}</strong>"</>}
                  {filtroAtivo !== 'todos' && <> na categoria <strong>{FILTRO_LABEL[filtroAtivo]}</strong></>}.
                </p>
                <button
                  className="btn trilha-btn-iniciar mt-3"
                  style={{ width: 'auto', padding: '8px 24px' }}
                  onClick={() => { setFiltroAtivo('todos'); setBusca('') }}
                >
                  Limpar filtros
                </button>
              </div>
            )}

            {/* Trilhas em andamento */}
            {!semResultados && (
              <div className="trilhas-secao">
                <div className="d-flex align-items-center gap-3 mb-4">
                  <span className="trilhas-secao-barra trilhas-secao-barra--primary"></span>
                  <h2 className="trilhas-secao-titulo">Trilhas em Andamento</h2>
                  <span className="badge badge-primary">{andamento.length} ativas</span>
                </div>
                {andamento.length > 0 ? (
                  <div className="row g-4">
                    {andamento.map(t => (
                      <TrilhaEmAndamento
                        key={t.id}
                        trilha={t}
                        expandida={trilhaExpandida === t.id}
                        onToggle={() => toggleExpandir(t.id)}
                      />
                    ))}
                  </div>
                ) : <SecaoVazia label={FILTRO_LABEL[filtroAtivo]} />}
              </div>
            )}

            {/* Trilhas disponíveis */}
            {!semResultados && (
              <div className="trilhas-secao">
                <div className="d-flex align-items-center gap-3 mb-4">
                  <span className="trilhas-secao-barra trilhas-secao-barra--warning"></span>
                  <h2 className="trilhas-secao-titulo">Trilhas Disponíveis</h2>
                  <span className="badge badge-warning">{disponiveis.length} disponíveis</span>
                </div>
                {disponiveis.length > 0 ? (
                  <div className="row g-4">
                    {disponiveis.map(t => (
                      <TrilhaDisponivel
                        key={t.id}
                        trilha={t}
                        expandida={trilhaExpandida === t.id}
                        onToggle={() => toggleExpandir(t.id)}
                      />
                    ))}
                  </div>
                ) : <SecaoVazia label={FILTRO_LABEL[filtroAtivo]} />}
              </div>
            )}

            {/* Trilhas bloqueadas */}
            {!semResultados && (
              <div className="trilhas-secao">
                <div className="d-flex align-items-center gap-3 mb-4">
                  <span className="trilhas-secao-barra trilhas-secao-barra--muted"></span>
                  <h2 className="trilhas-secao-titulo">Trilhas Bloqueadas</h2>
                  <span className="text-sm text-muted">Complete outras trilhas para desbloquear</span>
                </div>
                {bloqueadas.length > 0 ? (
                  <div className="row g-4">
                    {bloqueadas.map(t => <TrilhaBloqueada key={t.id} trilha={t} />)}
                  </div>
                ) : <SecaoVazia label={FILTRO_LABEL[filtroAtivo]} />}
              </div>
            )}

          </section>
        </main>
      </div>
    </>
  )
}

export default Trilhas