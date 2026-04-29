import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import '../styles/recompensas.css'

const RECOMPENSAS = [
  {
    id: 'consulta-nutricional',
    nome: 'Consulta Nutricional',
    desc: '1 sessão com nutricionista Care Plus',
    hc: 500,
    categoria: 'saude',
    thumb: 'recompensa-thumb--green',
    icone: 'fa-apple-whole',
    popular: true,
  },
  {
    id: 'kit-hidratacao',
    nome: 'Kit de Hidratação',
    desc: 'Garrafa térmica + squeeze personalizados',
    hc: 300,
    categoria: 'produtos',
    thumb: 'recompensa-thumb--blue',
    icone: 'fa-droplet',
    popular: false,
  },
  {
    id: 'desconto-academia',
    nome: 'Desconto Academia',
    desc: '20% off em academias parceiras por 3 meses',
    hc: 800,
    categoria: 'descontos',
    thumb: 'recompensa-thumb--orange',
    icone: 'fa-dumbbell',
    popular: false,
  },
  {
    id: 'massagem-relaxante',
    nome: 'Massagem Relaxante',
    desc: '1 hora de massagem terapêutica',
    hc: 1000,
    categoria: 'experiencias',
    thumb: 'recompensa-thumb--pink',
    icone: 'fa-heart',
    popular: false,
  },
  {
    id: 'checkup-gratuito',
    nome: 'Check-up Gratuito',
    desc: 'Consulta anual sem custo adicional',
    hc: 200,
    categoria: 'descontos',
    thumb: 'recompensa-thumb--red',
    icone: 'fa-heart-pulse',
    popular: true,
  },
  {
    id: 'aula-yoga',
    nome: 'Aula de Yoga',
    desc: '1 aula experimental online ou presencial',
    hc: 150,
    categoria: 'experiencias',
    thumb: 'recompensa-thumb--teal',
    icone: 'fa-brain',
    popular: false,
  },
]

const FILTROS = [
  { key: 'todos',        label: 'Todos' },
  { key: 'saude',        label: 'Saúde & Bem-estar' },
  { key: 'experiencias', label: 'Experiências' },
  { key: 'produtos',     label: 'Produtos' },
  { key: 'descontos',    label: 'Descontos Care Plus' },
]

function Recompensas() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [filtroAtivo, setFiltroAtivo] = useState('todos')

  const recompensasFiltradas = useMemo(() => {
    if (filtroAtivo === 'todos') return RECOMPENSAS
    return RECOMPENSAS.filter(r => r.categoria === filtroAtivo)
  }, [filtroAtivo])

  return (
    <>
      <button
        className="sidebar-toggle"
        aria-label="Abrir menu"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <i className="fa-solid fa-bars"></i>
      </button>

      <div className="app-layout">
        <div className={sidebarOpen ? 'open' : ''}>
          <Sidebar />
        </div>

        <main className="main-content" id="main-content">

          <header className="topbar">
            <Link to="/" className="recompensas-voltar">
              <i className="fa-solid fa-arrow-left"></i>
              Voltar
            </Link>
            <div className="hc-chip hc-chip--destaque">
              <span className="fa-solid fa-coins"></span>
              Seu saldo: <strong>1300 HC</strong>
            </div>
          </header>

          <section id="page-content">

            <div className="d-flex align-items-center gap-3 mb-4">
              <div className="recompensas-titulo-icon">
                <i className="fa-solid fa-gift"></i>
              </div>
              <h1 className="recompensas-titulo">Catálogo de Recompensas</h1>
            </div>

            {/* Filtros de categoria */}
            <div className="d-flex gap-2 flex-wrap mb-5">
              {FILTROS.map(f => (
                <button
                  key={f.key}
                  className={`recompensa-tag${filtroAtivo === f.key ? ' active' : ''}`}
                  onClick={() => setFiltroAtivo(f.key)}
                  aria-pressed={filtroAtivo === f.key}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Grid de recompensas */}
            {recompensasFiltradas.length > 0 ? (
              <div className="row g-4">
                {recompensasFiltradas.map(r => (
                  <div key={r.id} className="col-12 col-md-6 col-lg-4 recompensa-filter-item">
                    <div className="card recompensa-card">
                      <div className={`recompensa-thumb ${r.thumb}`}>
                        <i className={`fa-solid ${r.icone}`}></i>
                        {r.popular && <span className="recompensa-popular-badge">POPULAR</span>}
                      </div>
                      <div className="recompensa-info">
                        <h3 className="recompensa-nome">{r.nome}</h3>
                        <p className="recompensa-desc">{r.desc}</p>
                        <div className="recompensa-hc">
                          <span className="fa-solid fa-coins"></span>
                          {r.hc} HC
                        </div>
                        <button className="btn recompensa-btn">Resgatar Agora</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="recompensa-empty">
                <i className="fa-solid fa-filter-circle-xmark recompensa-empty-icon"></i>
                <p className="recompensa-empty-text">
                  Nenhuma recompensa disponível nesta categoria.
                </p>
                <button
                  className="btn recompensa-btn"
                  style={{ width: 'auto', padding: '8px 24px' }}
                  onClick={() => setFiltroAtivo('todos')}
                >
                  Ver todas
                </button>
              </div>
            )}

          </section>
        </main>
      </div>
    </>
  )
}

export default Recompensas