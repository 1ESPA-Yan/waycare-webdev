import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import GarrafaAnimada from '../components/GarrafaAnimada'
import '../styles/waycare-bottle.css'

// Dados do gráfico semanal — ml consumidos por dia
const dadosSemana = [
  { dia: 'Seg', ml: 0 },
  { dia: 'Ter', ml: 1400 },
  { dia: 'Qua', ml: 0 },
  { dia: 'Qui', ml: 1700 },
  { dia: 'Sex', ml: 0 },
  { dia: 'Sáb', ml: 0 },
  { dia: 'Hoje', ml: 450, hoje: true },
]

const CAPACIDADE_GARRAFA = 750

// Opções de meta de hidratação
const metaOpcoes = [
  { nome: 'Sedentário', ml: 1500 },
  { nome: 'Moderado (Recomendado)', ml: 2000 },
  { nome: 'Ativo', ml: 2500 },
  { nome: 'Muito Ativo', ml: 3000 },
]

function WaycareBottle() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Meta diária — agora é estado, pode ser alterada pelo usuário
  const [metaDiaria, setMetaDiaria] = useState(2000)

  // Estado da garrafa física (ml restantes na garrafa)
  const [mlGarrafa, setMlGarrafa] = useState(600)

  // Estado do consumo diário total
  const [mlConsumido, setMlConsumido] = useState(450)

  // Histórico de leituras
  const [leituras, setLeituras] = useState([
    { hora: '09:50', de: 600, para: 500, diff: 100, hc: 4 },
    { hora: '08:45', de: 400, para: 250, diff: 150, hc: 6 },
    { hora: '07:32', de: 600, para: 400, diff: 200, hc: 8 },
  ])

  // HC ganhos
  const [hcGanhos, setHcGanhos] = useState(18)

  // Controla o piscar do ponto LIVE
  const [liveVisivel, setLiveVisivel] = useState(true)

  // Animação do ponto LIVE — pisca a cada 800ms
  useEffect(() => {
    const intervalo = setInterval(() => {
      setLiveVisivel(v => !v)
    }, 800)
    return () => clearInterval(intervalo)
  }, [])

  // Simular gole — desconta ml da garrafa e adiciona ao consumo
  const simularGole = (mlGole) => {
    if (mlGarrafa < mlGole) return

    const agora = new Date()
    const hora = agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    const mlAntes = mlGarrafa
    const mlDepois = mlGarrafa - mlGole
    const hcGanho = Math.floor(mlGole / 25)

    setMlGarrafa(mlDepois)
    setMlConsumido(prev => Math.min(prev + mlGole, metaDiaria))
    setHcGanhos(prev => prev + hcGanho)
    setLeituras(prev => [
      { hora, de: mlAntes, para: mlDepois, diff: mlGole, hc: hcGanho },
      ...prev,
    ].slice(0, 5))
  }

  // Encher garrafa — simula o usuário enchendo a garrafa física
  const encherGarrafa = () => {
    setMlGarrafa(CAPACIDADE_GARRAFA)
  }

  // Cálculos derivados
  const pctGarrafa = Math.round((mlGarrafa / CAPACIDADE_GARRAFA) * 100)
  const pctMeta = Math.round((mlConsumido / metaDiaria) * 100)
  const mlFaltam = Math.max(metaDiaria - mlConsumido, 0)

  // Cor da barra de meta — vermelho se < 50%, amarelo se < 80%, verde se >= 80%
  const corMeta = pctMeta >= 80 ? 'var(--color-primary)' : pctMeta >= 50 ? 'var(--color-hc)' : 'var(--color-error)'

  // Altura máxima do gráfico em px
  const alturaMaxGrafico = 120

  return (
    <>
      {/* Botão hamburguer */}
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

          {/* Header */}
          <header className="topbar bottle-topbar">
            <div className="d-flex align-items-start gap-3">
              <Link to="/" className="bottle-voltar">
                <i className="fa-solid fa-arrow-left"></i>
              </Link>
              <div className="d-flex flex-column gap-1">
                <div className="d-flex align-items-center gap-3">
                  <h1 className="bottle-page-title">WayCare Bottle</h1>
                  <span className="bottle-conectada-badge">
                    <i className="fa-brands fa-bluetooth-b"></i>
                    Conectada
                  </span>
                </div>
                <div className="d-flex align-items-center gap-3">
                  <span className="bottle-status-info">
                    <i className="fa-solid fa-signal"></i>
                    Sensor IoT ativo
                  </span>
                  <span className="bottle-status-info">
                    <i className="fa-solid fa-battery-three-quarters"></i>
                    87%
                  </span>
                  <span className="bottle-status-info">
                    <i className="fa-solid fa-wifi"></i>
                    Ótimo sinal
                  </span>
                </div>
              </div>
            </div>
            <div className="topbar-actions">
              <div className="hc-chip">
                <i className="fa-solid fa-coins"></i>
                1300 HC
              </div>
              <button className="notif-btn" aria-label="Notificações">
                <i className="fa-solid fa-bell"></i>
                <span className="notif-dot"></span>
              </button>
            </div>
          </header>

          <section id="page-content">

            {/* Cards de resumo */}
            <div className="row g-3 mb-4">
              <div className="col-6 col-lg-3">
                <div className="card bottle-resumo-card">
                  <div className="bottle-resumo-icon bottle-resumo-icon--blue">
                    <i className="fa-solid fa-droplet"></i>
                  </div>
                  <div className="d-flex flex-column gap-1">
                    <span className="bottle-resumo-valor">{mlConsumido} ml</span>
                    <span className="bottle-resumo-label">Hoje</span>
                  </div>
                </div>
              </div>
              <div className="col-6 col-lg-3">
                <div className="card bottle-resumo-card">
                  <div className="bottle-resumo-icon bottle-resumo-icon--green">
                    <i className="fa-solid fa-arrow-trend-up"></i>
                  </div>
                  <div className="d-flex flex-column gap-1">
                    <span className="bottle-resumo-valor">1493 ml</span>
                    <span className="bottle-resumo-label">Média semanal</span>
                  </div>
                </div>
              </div>
              <div className="col-6 col-lg-3">
                <div className="card bottle-resumo-card">
                  <div className="bottle-resumo-icon bottle-resumo-icon--primary">
                    <i className="fa-regular fa-circle-check"></i>
                  </div>
                  <div className="d-flex flex-column gap-1">
                    <span className="bottle-resumo-valor">2/7</span>
                    <span className="bottle-resumo-label">Metas atingidas</span>
                  </div>
                </div>
              </div>
              <div className="col-6 col-lg-3">
                <div className="card bottle-resumo-card">
                  <div className="bottle-resumo-icon bottle-resumo-icon--hc">
                    <i className="fa-solid fa-coins"></i>
                  </div>
                  <div className="d-flex flex-column gap-1">
                    <span className="bottle-resumo-valor bottle-resumo-valor--hc">+{hcGanhos} HC</span>
                    <span className="bottle-resumo-label">HC da garrafa</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="row g-4">

              {/* Painel principal dark */}
              <div className="col-12 col-xl-7">
                <div className="bottle-painel">

                  {/* Header do painel */}
                  <div className="d-flex align-items-center justify-content-between mb-4">
                    <div className="d-flex align-items-center gap-3">
                      <div className="bottle-painel-icon">
                        <i className="fa-solid fa-droplet"></i>
                      </div>
                      <div>
                        <span className="bottle-painel-titulo">WayCare Bottle</span>
                        <span className="bottle-painel-subtitulo d-block">Suporte IoT de hidratação inteligente</span>
                      </div>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      {/* Ponto LIVE piscando com useState + useEffect */}
                      <span className="bottle-live-badge">
                        <span
                          className="bottle-live-dot"
                          style={{ opacity: liveVisivel ? 1 : 0, transition: 'opacity 0.2s ease' }}
                        ></span>
                        LIVE
                      </span>
                      <span className="bottle-conectada-dark">
                        <i className="fa-brands fa-bluetooth-b"></i>
                        Conectada
                      </span>
                    </div>
                  </div>

                  {/* Garrafa + meta diária */}
                  <div className="row g-4 mb-4">

                    {/* Garrafa animada */}
                    <div className="col-12 col-md-5">
                      <span className="bottle-secao-label">GARRAFA FÍSICA</span>
                      <GarrafaAnimada pct={pctGarrafa} ml={mlGarrafa} />

                      <div className="bottle-como-funciona">
                        <span className="bottle-como-titulo">COMO FUNCIONA</span>
                        <p className="bottle-como-desc">
                          Garrafa lê o nível antes e depois do gole.
                          A <strong>diferença</strong> é adicionada à meta diária.
                        </p>
                      </div>
                    </div>

                    {/* Meta diária */}
                    <div className="col-12 col-md-7">
                      <span className="bottle-secao-label">META DIÁRIA</span>
                      <div className="bottle-meta-valor">
                        <span className="bottle-meta-ml">{mlConsumido}</span>
                        <span className="bottle-meta-total">/ {metaDiaria.toLocaleString('pt-BR')} ml</span>
                      </div>
                      <div className="progress-bar bottle-meta-bar mb-1">
                        <div
                          className="progress-fill bottle-meta-fill"
                          style={{ width: `${pctMeta}%`, backgroundColor: corMeta, transition: 'width 0.4s ease' }}
                        ></div>
                      </div>
                      <div className="d-flex justify-content-between mb-4">
                        <span className="bottle-meta-faltam">
                          {mlFaltam > 0 ? `Faltam ${mlFaltam} ml` : '🎉 Meta atingida!'}
                        </span>
                        <span className="bottle-meta-pct" style={{ color: corMeta }}>{pctMeta}%</span>
                      </div>

                      {/* Mini stats */}
                      <div className="row g-2 mb-4">
                        <div className="col-4">
                          <div className="bottle-mini-stat">
                            <i className="fa-solid fa-droplet bottle-mini-icon"></i>
                            <span className="bottle-mini-valor">{leituras.length}</span>
                            <span className="bottle-mini-label">Goles</span>
                          </div>
                        </div>
                        <div className="col-4">
                          <div className="bottle-mini-stat">
                            <i className="fa-solid fa-coins bottle-mini-icon bottle-mini-icon--hc"></i>
                            <span className="bottle-mini-valor">+{hcGanhos}</span>
                            <span className="bottle-mini-label">HC ganhos</span>
                          </div>
                        </div>
                        <div className="col-4">
                          <div className="bottle-mini-stat">
                            <i className="fa-regular fa-clock bottle-mini-icon"></i>
                            <span className="bottle-mini-valor">
                              {leituras[0]?.hora || '--:--'}
                            </span>
                            <span className="bottle-mini-label">Últ. sync</span>
                          </div>
                        </div>
                      </div>

                      {/* Histórico de leituras */}
                      <span className="bottle-secao-label mb-2 d-block">HISTÓRICO DE LEITURAS</span>
                      <div className="d-flex flex-column gap-2">
                        {leituras.map((l, i) => (
                          <div className="bottle-leitura-row" key={i}>
                            <span className="bottle-leitura-hora">{l.hora}</span>
                            <span className="bottle-leitura-de">{l.de}ml</span>
                            <i className="fa-solid fa-arrow-right bottle-leitura-seta"></i>
                            <span className="bottle-leitura-para">{l.para}ml</span>
                            <span className="bottle-leitura-diff">= +{l.diff}ml</span>
                            <i className="fa-solid fa-coins bottle-mini-icon bottle-mini-icon--hc"></i>
                            <span className="bottle-leitura-hc">+{l.hc}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Botões de simular gole */}
                  <div>
                    <span className="bottle-secao-label mb-3 d-block">SIMULAR LEITURA DA GARRAFA IOT</span>
                    <div className="d-flex gap-3 flex-wrap">
                      <button
                        className="btn bottle-gole-btn"
                        onClick={() => simularGole(100)}
                        disabled={mlGarrafa < 100}
                      >
                        Gole pequeno
                        <span className="bottle-gole-desc">−100 ml da garrafa</span>
                      </button>
                      <button
                        className="btn bottle-gole-btn bottle-gole-btn--medio"
                        onClick={() => simularGole(200)}
                        disabled={mlGarrafa < 200}
                      >
                        Gole médio
                        <span className="bottle-gole-desc">−200 ml da garrafa</span>
                      </button>
                      <button
                        className="btn bottle-gole-btn bottle-gole-btn--grande"
                        onClick={() => simularGole(300)}
                        disabled={mlGarrafa < 300}
                      >
                        Gole grande
                        <span className="bottle-gole-desc">−300 ml da garrafa</span>
                      </button>
                      <button
                        className="btn bottle-gole-btn"
                        onClick={encherGarrafa}
                        disabled={mlGarrafa === CAPACIDADE_GARRAFA}
                        style={{ borderColor: 'rgba(122,209,128,0.3)', backgroundColor: '#1a4a2c' }}
                      >
                        <i className="fa-solid fa-fill-drip" style={{ fontSize: '12px' }}></i>
                        Encher garrafa
                        <span className="bottle-gole-desc">+{CAPACIDADE_GARRAFA - mlGarrafa} ml</span>
                      </button>
                    </div>
                    <p className="bottle-simular-aviso">Simula o sensor detectando que o nível da garrafa caiu</p>
                  </div>
                </div>

                {/* Histórico semanal com gráfico real */}
                <div className="card bottle-historico-card mt-4">
                  <div className="d-flex align-items-center justify-content-between mb-4">
                    <div className="d-flex align-items-center gap-2">
                      <i className="fa-solid fa-arrow-trend-up bottle-historico-icon"></i>
                      <h3 className="bottle-historico-titulo">Histórico Semanal</h3>
                    </div>
                    <div className="d-flex align-items-center gap-3">
                      <span className="bottle-legenda">
                        <span className="bottle-legenda-dot bottle-legenda-dot--primary"></span>
                        Consumo diário
                      </span>
                      <span className="bottle-legenda">
                        <span className="bottle-legenda-dot bottle-legenda-dot--muted"></span>
                        Meta (2000ml)
                      </span>
                    </div>
                  </div>

                  {/* Gráfico de barras com alturas reais */}
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: `${alturaMaxGrafico + 24}px` }}>
                    {dadosSemana.map((dia, i) => {
                      const ml = dia.hoje ? mlConsumido : dia.ml
                      const altura = ml > 0 ? Math.max((ml / metaDiaria) * alturaMaxGrafico, 4) : 4
                      const atingiu = ml >= metaDiaria
                      const cor = dia.hoje
                        ? 'var(--color-info)'
                        : atingiu
                        ? 'var(--color-primary)'
                        : ml > 0
                        ? '#4aaee8aa'
                        : 'var(--color-border)'

                      return (
                        <div
                          key={i}
                          style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}
                        >
                          {/* Tooltip simples com ml */}
                          {ml > 0 && (
                            <span style={{ fontSize: '10px', color: dia.hoje ? 'var(--color-info)' : 'var(--color-text-muted)' }}>
                              {ml}
                            </span>
                          )}
                          <div
                            style={{
                              width: '100%',
                              height: `${altura}px`,
                              backgroundColor: cor,
                              borderRadius: '4px 4px 0 0',
                              transition: 'height 0.4s ease',
                              marginTop: 'auto',
                            }}
                          ></div>
                          <span
                            style={{
                              fontSize: '11px',
                              color: dia.hoje ? 'var(--color-info)' : 'var(--color-text-muted)',
                              fontWeight: dia.hoje ? '700' : '400',
                            }}
                          >
                            {dia.dia}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Coluna direita */}
              <div className="col-12 col-xl-5 d-flex flex-column gap-4">

                {/* Informações do dispositivo */}
                <div className="card">
                  <h3 className="bottle-col-titulo mb-4">
                    <i className="fa-solid fa-circle-info bottle-col-titulo-icon"></i>
                    Informações do Dispositivo
                  </h3>
                  <div className="d-flex flex-column gap-0">
                    <div className="bottle-info-row">
                      <span className="bottle-info-label">
                        <i className="fa-solid fa-droplet bottle-info-icon--blue-light"></i> Modelo
                      </span>
                      <span className="bottle-info-valor">WayCare Bottle Pro</span>
                    </div>
                    <div className="bottle-info-divider"></div>
                    <div className="bottle-info-row">
                      <span className="bottle-info-label">
                        <i className="fa-solid fa-rotate bottle-info-icon--gray"></i> Firmware
                      </span>
                      <span className="bottle-info-valor">v2.3.1</span>
                    </div>
                    <div className="bottle-info-divider"></div>
                    <div className="bottle-info-row">
                      <span className="bottle-info-label">
                        <i className="fa-brands fa-bluetooth-b bottle-info-icon--purple"></i> Bluetooth
                      </span>
                      <span className="bottle-info-valor">5.0 LE</span>
                    </div>
                    <div className="bottle-info-divider"></div>
                    <div className="bottle-info-row">
                      <span className="bottle-info-label">
                        <i className="fa-solid fa-battery-three-quarters bottle-info-icon--green-light"></i> Bateria
                      </span>
                      <span className="bottle-info-valor">87% — ~12 dias</span>
                    </div>
                    <div className="bottle-info-divider"></div>
                    <div className="bottle-info-row">
                      <span className="bottle-info-label">
                        <i className="fa-solid fa-wifi bottle-info-icon--green"></i> Conexão
                      </span>
                      <span className="bottle-info-valor">Excelente</span>
                    </div>
                    <div className="bottle-info-divider"></div>
                    <div className="bottle-info-row">
                      <span className="bottle-info-label">
                        <i className="fa-solid fa-flask bottle-info-icon--blue-light"></i> Capacidade
                      </span>
                      <span className="bottle-info-valor">750 ml</span>
                    </div>
                  </div>
                  <button className="btn bottle-sync-btn mt-4">
                    <i className="fa-solid fa-rotate"></i>
                    Sincronizar configurações
                  </button>
                </div>

                {/* Meta de Hidratação */}
                <div className="card">
                  <h3 className="bottle-col-titulo mb-4">
                    <i className="fa-solid fa-bullseye bottle-col-titulo-icon bottle-col-titulo-icon--green"></i>
                    Meta de Hidratação
                  </h3>
                  <div className="bottle-meta-card mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="bottle-meta-card-label">Meta diária</span>
                      <span className="bottle-meta-card-valor">{metaDiaria} ml</span>
                    </div>
                    <div className="progress-bar mb-1">
                      <div className="progress-fill" style={{ width: `${pctMeta}%`, transition: 'width 0.4s ease' }}></div>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="bottle-meta-card-consumido">{mlConsumido} ml consumidos</span>
                      <span className="bottle-meta-card-pct">{pctMeta}%</span>
                    </div>
                  </div>

                  {/* Opções clicáveis para alterar a meta */}
                  <div className="d-flex flex-column gap-2">
                    {metaOpcoes.map((opcao) => (
                      <div
                        key={opcao.ml}
                        className={`bottle-meta-opcao ${metaDiaria === opcao.ml ? 'bottle-meta-opcao--ativa' : ''}`}
                        onClick={() => setMetaDiaria(opcao.ml)}
                        style={{ cursor: 'pointer' }}
                      >
                        <span className="bottle-meta-opcao-nome">{opcao.nome}</span>
                        <span className="bottle-meta-opcao-ml">{opcao.ml} ml</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dicas de Hidratação */}
                <div className="card">
                  <h3 className="bottle-col-titulo mb-4">
                    <i className="fa-solid fa-lightbulb bottle-col-titulo-icon bottle-col-titulo-icon--yellow"></i>
                    Dicas de Hidratação
                  </h3>
                  <div className="d-flex flex-column gap-3">
                    <div className="d-flex align-items-start gap-3">
                      <div className="bottle-dica-icon bottle-dica-icon--yellow">
                        <i className="fa-solid fa-bolt"></i>
                      </div>
                      <p className="bottle-dica-texto">Beba um copo ao acordar para ativar o metabolismo</p>
                    </div>
                    <div className="d-flex align-items-start gap-3">
                      <div className="bottle-dica-icon bottle-dica-icon--blue">
                        <i className="fa-regular fa-clock"></i>
                      </div>
                      <p className="bottle-dica-texto">Configure lembretes a cada 90 minutos durante o trabalho</p>
                    </div>
                    <div className="d-flex align-items-start gap-3">
                      <div className="bottle-dica-icon bottle-dica-icon--green">
                        <i className="fa-solid fa-arrow-trend-up"></i>
                      </div>
                      <p className="bottle-dica-texto">Dias com mais atividade física requerem 20% mais hidratação</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  )
}

export default WaycareBottle