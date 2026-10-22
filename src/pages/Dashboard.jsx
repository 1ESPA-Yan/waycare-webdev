import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { useApp } from '../context/AppContext'
import { useDados } from '../hooks/useDados'
import Topbar from '../components/Topbar'
import FiltroPills from '../components/FiltroPills'
import Button from '../components/Button'
import Chip from '../components/Chip'
import '../styles/dashboard.css'

function CardMissao({ missao, mlConsumido }) {
  if (missao.tipo === 'bottle') {
    const pct = Math.round((mlConsumido / missao.metaMl) * 100)
    return (
      <div className="card-mission bottle-mission flex flex-col gap-4">
        <span className="bottle-mission-badge">
          <i className="fa-solid fa-droplet"></i>
          WayCare Bottle • Auto Sync
        </span>
        <div className="flex items-start gap-4">
          <div className={`mission-emoji mission-emoji--${missao.emojiCor}`}>
            <i className={`fa-solid ${missao.icone}`}></i>
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="mission-title">{missao.titulo}</h3>
            <p className="mission-desc">{missao.descricao}</p>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="bottle-mission-progress-label">{mlConsumido} ml / {missao.metaMl} ml</span>
          <span className="bottle-mission-progress-pct">{pct}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill bottle-progress-fill" style={{ width: `${pct}%` }}></div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="mission-time"><i className="fa-regular fa-clock"></i> {missao.tempo}</span>
            <Chip cor={missao.categoriaBadge}>{missao.categoria}</Chip>
          </div>
          <span className="mission-hc"><span className="fa-solid fa-coins"></span> +{missao.hc} HC</span>
        </div>
        <button className="btn-bottle-auto" disabled>
          <i className="fa-solid fa-droplet"></i>
          Monitorado automaticamente
        </button>
      </div>
    )
  }

  if (missao.status === 'concluida') {
    return (
      <div className="card-mission completed flex flex-col gap-4">
        <div className="flex items-start gap-4">
          <div className={`mission-emoji mission-emoji--${missao.emojiCor}`}>
            <i className={`fa-solid ${missao.icone}`}></i>
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="mission-title">{missao.titulo}</h3>
            <p className="mission-desc">{missao.descricao}</p>
          </div>
          <i className="fa-solid fa-check mission-check-icon ml-auto"></i>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="mission-time"><i className="fa-regular fa-clock"></i> {missao.tempo}</span>
            <Chip cor={missao.categoriaBadge}>{missao.categoria}</Chip>
          </div>
          <span className="mission-hc"><span className="fa-solid fa-coins"></span> +{missao.hc} HC</span>
        </div>
        <button className="btn mission-btn-done" disabled>
          <i className="fa-regular fa-circle-check"></i> Concluída
        </button>
      </div>
    )
  }

  return (
    <div className="card-mission flex flex-col gap-4">
      <div className="flex items-start gap-4">
        <div className={`mission-emoji mission-emoji--${missao.emojiCor}`}>
          <i className={`fa-solid ${missao.icone}`}></i>
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="mission-title">{missao.titulo}</h3>
          <p className="mission-desc">{missao.descricao}</p>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="mission-time"><i className="fa-regular fa-clock"></i> {missao.tempo}</span>
          <Chip cor={missao.categoriaBadge}>{missao.categoria}</Chip>
        </div>
        <span className="mission-hc"><span className="fa-solid fa-coins"></span> +{missao.hc} HC</span>
      </div>
      <Button to={`/missao/${missao.id}`} bloco className="btn-mission">
        Iniciar Missão
      </Button>
    </div>
  )
}

function Dashboard() {
  const { dados, carregando } = useDados('missoes-dashboard')
  const missoes = useMemo(() => dados ?? [], [dados])
  const [filtroAtivo, setFiltroAtivo] = useState('todos')
  const [filtrosVisiveis, setFiltrosVisiveis] = useState(false)
  const { totalHC, nomeUsuario, humor, HUMOR_CONFIG, consumidoHoje: mlConsumido, missaoConcluida } = useApp()
  const humorAtual = HUMOR_CONFIG[humor]

  const categorias = useMemo(() => {
    const unicas = [...new Set(missoes.map(m => m.categoria))]
    return [{ key: 'todos', label: 'Todas' }, ...unicas.map(c => ({ key: c, label: c }))]
  }, [missoes])

  const missoesFiltradas = useMemo(() =>
    filtroAtivo === 'todos' ? missoes : missoes.filter(m => m.categoria === filtroAtivo),
    [missoes, filtroAtivo]
  )

  return (
    <>
          {/* Topbar */}
          <Topbar
            className="dashboard-topbar"
            titulo={`Olá, ${nomeUsuario}! 👋`}
            subtitulo={
              <div className="flex items-center gap-4">
                <span className="humor-badge" style={{ backgroundColor: humorAtual.badgeBg, color: humorAtual.badgeColor, borderColor: humorAtual.badgeBorder }}>
                  <i className={`fa-solid ${humorAtual.icon}`}></i>
                  {humorAtual.label}
                </span>
                <Link to="/humor" className="humor-change-btn">mudar humor</Link>
              </div>
            }
          />

          <section id="page-content" className="page-transition">

            {/* Trilha de hoje — baseada no humor selecionado */}
            <div className="trilha-card dashboard-section">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="trilha-hoje-icon" style={{ color: humorAtual.badgeColor, backgroundColor: humorAtual.badgeBg }}>
                    <i className={`fa-solid ${humorAtual.icon}`}></i>
                  </div>
                  <h2 className="trilha-card-title">Sua Trilha de Hoje: {humorAtual.trilha}</h2>
                </div>
                <Link to="/trilhas" className="trilha-link">Ver trilha completa →</Link>
              </div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-secondary">3/5 missões completadas</span>
                <span className="text-sm font-bold trilha-pct">60%</span>
              </div>
              <div className="progress-bar trilha-progress-bar mb-4">
                <div className="progress-fill" style={{ width: '60%' }}></div>
              </div>
              <div className="trilha-slots">
                <div className="trilha-slot completed" role="img" aria-label="Missão concluída"><i className="fa-solid fa-check"></i></div>
                <div className="trilha-slot completed" role="img" aria-label="Missão concluída"><i className="fa-solid fa-check"></i></div>
                <div className="trilha-slot completed" role="img" aria-label="Missão concluída"><i className="fa-solid fa-check"></i></div>
                <div className="trilha-slot pending" role="img" aria-label="Missão pendente"><i className="fa-solid fa-spa"></i></div>
                <div className="trilha-slot pending" role="img" aria-label="Missão pendente"><i className="fa-solid fa-clipboard-list"></i></div>
              </div>
            </div>

            {/* Missões disponíveis */}
            <div className="dashboard-section">
              <div className="flex items-center justify-between mb-6">
                <h2 className="section-title">Missões Disponíveis</h2>
                <button
                  className={`filter-btn${filtrosVisiveis ? ' active' : ''}`}
                  onClick={() => setFiltrosVisiveis(v => !v)}
                  aria-expanded={filtrosVisiveis}
                >
                  Filtrar <i className={`fa-solid fa-chevron-down filter-btn-chevron${filtrosVisiveis ? ' rotated' : ''}`}></i>
                </button>
              </div>

              {filtrosVisiveis && (
                <FiltroPills className="mb-6" rotulo="Filtrar missões" opcoes={categorias} ativo={filtroAtivo} aoMudar={setFiltroAtivo} />
              )}

              {carregando ? (
                <div className="missions-grid">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="card-mission" style={{ padding: 'var(--space-5)' }}>
                      <div className="flex items-start gap-4 mb-4">
                        <div className="skeleton" style={{ width: 44, height: 44, borderRadius: '50%', flexShrink: 0 }}></div>
                        <div className="flex flex-col gap-2 grow">
                          <div className="skeleton" style={{ height: 14, width: '65%' }}></div>
                          <div className="skeleton" style={{ height: 11, width: '85%' }}></div>
                        </div>
                      </div>
                      <div className="skeleton" style={{ height: 12, width: '50%', marginBottom: 12 }}></div>
                      <div className="skeleton" style={{ height: 40, borderRadius: 8 }}></div>
                    </div>
                  ))}
                </div>
              ) : (
                <motion.div
                  className="missions-grid"
                  key={filtroAtivo}
                  initial="hidden"
                  animate="visible"
                  variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
                >
                  {missoesFiltradas.map(missao => (
                    <motion.div
                      key={missao.id}
                      variants={{
                        hidden:  { opacity: 0, y: 18 },
                        visible: { opacity: 1, y: 0, transition: { duration: 0.28, ease: 'easeOut' } },
                      }}
                    >
                      <CardMissao
                        missao={missaoConcluida(missao.id) ? { ...missao, status: 'concluida' } : missao}
                        mlConsumido={mlConsumido}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Descoberta do dia */}
            <div className="descoberta-card dashboard-section">
              <div className="descoberta-icon"><i className="fa-solid fa-lightbulb"></i></div>
              <div className="flex flex-col gap-2">
                <h3 className="font-bold">Descoberta do Dia</h3>
                <p className="mission-title">Você dorme melhor nos dias que caminha à tarde!</p>
                <span className="text-sm text-muted">Completou 5 caminhadas → Dormiu 7h+ em 4 noites</span>
                <Link to="/descobertas" className="descoberta-link">Ver todas as descobertas →</Link>
              </div>
            </div>

            {/* Banner catálogo de recompensas */}
            <Link
              to="/recompensas"
              className="recompensas-banner dashboard-section flex items-center justify-between"
            >
              <div className="flex items-center gap-6">
                <i className="fa-solid fa-gem recompensas-banner-gem"></i>
                <div className="flex flex-col gap-1">
                  <h3 className="recompensas-banner-title">Catálogo de Recompensas</h3>
                  <p className="recompensas-banner-desc">Troque seus {totalHC.toLocaleString('pt-BR')} Health Coins por prêmios incríveis!</p>
                </div>
              </div>
              <i className="fa-solid fa-gift recompensas-banner-gift"></i>
            </Link>

          </section>
    </>
  )
}

export default Dashboard
