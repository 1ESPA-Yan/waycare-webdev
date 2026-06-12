import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import GarrafaAnimada from '../components/GarrafaAnimada'
import GraficoHidratacao from '../components/GraficoHidratacao'
import { useApp } from '../context/AppContext'
import { useWayCareDock } from '../hooks/useWayCareDock'
import { getHistory, postTara } from '../services/waycareApi'
import '../styles/waycare-bottle.css'

// Dados do gráfico semanal — usados só no fallback (sem conexão com a dock)
const dadosSemana = [
  { dia: 'Seg', ml: 0 },
  { dia: 'Ter', ml: 1400 },
  { dia: 'Qua', ml: 0 },
  { dia: 'Qui', ml: 1700 },
  { dia: 'Sex', ml: 0 },
  { dia: 'Sáb', ml: 0 },
  { dia: 'Hoje', ml: 450, hoje: true },
]

function WaycareBottle() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [liveVisivel, setLiveVisivel] = useState(true)

  // Dados simulados do contexto (fallback quando o backend está offline)
  const {
    mlGarrafa,
    mlConsumido,
    metaDiaria,
    leituras,
    hcGarrafa,
    CAPACIDADE_GARRAFA,
    pctMeta,
    simularGole,
    encherGarrafa,
    totalHC,
    naoLidas,
  } = useApp()

  // Dados reais do dispositivo (polling do /status a cada 3s)
  const { status, erro, carregando } = useWayCareDock(3000)
  const usandoReal = !carregando && !erro && !!status

  // Histórico real para o gráfico (atualiza a cada 60s)
  const [history, setHistory] = useState([])
  useEffect(() => {
    let ativo = true
    async function buscar() {
      try {
        const h = await getHistory(24)
        if (ativo) setHistory(Array.isArray(h) ? h : [])
      } catch { /* mantém o que já tem */ }
    }
    buscar()
    const id = setInterval(buscar, 60000)
    return () => { ativo = false; clearInterval(id) }
  }, [])

  // Tara (zera a balança no dispositivo)
  const [tarando, setTarando] = useState(false)
  const [taraMsg, setTaraMsg] = useState('')
  async function acionarTara() {
    setTarando(true)
    setTaraMsg('')
    try {
      await postTara()
      setTaraMsg('Balança zerada ✓')
    } catch {
      setTaraMsg('Erro ao zerar. Verifique a conexão.')
    } finally {
      setTarando(false)
      setTimeout(() => setTaraMsg(''), 3000)
    }
  }

  // Ponto LIVE piscando
  useEffect(() => {
    const intervalo = setInterval(() => setLiveVisivel(v => !v), 800)
    return () => clearInterval(intervalo)
  }, [])

  // ----- View model: dados reais OU simulação (fallback) --------------------
  const d = usandoReal
    ? {
        consumido: Math.round(status.consumo_dia ?? 0),
        meta: Math.round(status.meta ?? 0) || 2000,
        pct: Math.round(status.pct ?? 0),
        fatias: status.fatias ?? Math.min(4, Math.floor((status.pct ?? 0) / 25)),
        estado_led: status.estado_led || 'verde',
        streak: status.streak ?? 0,
        peso: status.peso,
        garrafa_presente: status.garrafa_presente !== false,
        online: status.online !== false,
        temp: status.temp ?? null,
        cidade: status.cidade ?? null,
      }
    : {
        consumido: mlConsumido,
        meta: metaDiaria,
        pct: pctMeta,
        fatias: Math.min(4, Math.floor(pctMeta / 25)),
        estado_led: pctMeta >= 100 ? 'verde_pulsando' : pctMeta >= 50 ? 'verde' : 'vermelho',
        streak: null,
        peso: null,
        garrafa_presente: true,
        online: false,
        temp: null,
        cidade: null,
      }

  const pctClamp = Math.min(100, Math.max(0, d.pct))
  const mlFaltam = Math.max(d.meta - d.consumido, 0)
  const metaBatida = d.estado_led === 'verde_pulsando' || d.pct >= 100
  const corMeta = d.estado_led === 'vermelho'
    ? 'var(--color-error)'
    : metaBatida
    ? 'var(--color-primary)'
    : pctClamp >= 50
    ? 'var(--color-info)'
    : 'var(--color-hc)'

  const ledTexto = {
    verde: 'Tudo certo — siga bebendo',
    vermelho: 'Faz um tempo que você não bebe',
    verde_pulsando: '🎉 Meta do dia batida!',
  }[d.estado_led] || 'Tudo certo'
  const ledClasse = d.estado_led === 'vermelho'
    ? 'bottle-led--vermelho'
    : d.estado_led === 'verde_pulsando'
    ? 'bottle-led--pulsando'
    : 'bottle-led--verde'

  return (
    <>
      <button className="sidebar-toggle" aria-label="Abrir menu" onClick={() => setSidebarOpen(!sidebarOpen)}>
        <i className="fa-solid fa-bars"></i>
      </button>

      <div className="app-layout">
        <Sidebar isOpen={sidebarOpen} />

        <main className="main-content" id="main-content">

          <header className="topbar bottle-topbar">
            <div className="d-flex align-items-start gap-3">
              <div className="d-flex flex-column gap-1">
                <div className="d-flex align-items-center gap-3">
                  <h1 className="bottle-page-title">WayCare Bottle</h1>
                  {usandoReal && d.online ? (
                    <span className="bottle-conectada-badge">
                      <i className="fa-solid fa-wifi"></i> Conectada
                    </span>
                  ) : (
                    <span className="bottle-conectada-badge bottle-conectada-badge--off">
                      <i className="fa-solid fa-plug-circle-xmark"></i> {usandoReal ? 'Offline' : 'Demonstração'}
                    </span>
                  )}
                </div>
                <div className="d-flex align-items-center gap-3 flex-wrap">
                  <span className="bottle-status-info">
                    <i className="fa-solid fa-signal"></i> {usandoReal ? 'Dock conectada' : 'Sensor IoT (demo)'}
                  </span>
                  {d.temp != null && (
                    <span className="bottle-status-info"><i className="fa-solid fa-temperature-half"></i> {d.temp}°C</span>
                  )}
                  {d.cidade && (
                    <span className="bottle-status-info"><i className="fa-solid fa-location-dot"></i> {d.cidade}</span>
                  )}
                </div>
              </div>
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
                {naoLidas > 0 && <span className="notif-dot">{naoLidas > 9 ? '9+' : naoLidas}</span>}
              </Link>
            </div>
          </header>

          <section id="page-content" className="page-transition">

            {/* Avisos de conexão / dispositivo */}
            {carregando && (
              <div className="bottle-aviso bottle-aviso--info mb-4">
                <i className="fa-solid fa-circle-notch fa-spin"></i> Conectando ao dispositivo…
              </div>
            )}
            {!carregando && !usandoReal && (
              <div className="bottle-aviso bottle-aviso--garrafa mb-4">
                <i className="fa-solid fa-triangle-exclamation"></i>
                Sem conexão com a dock — exibindo dados de demonstração.
              </div>
            )}
            {usandoReal && !d.online && (
              <div className="bottle-aviso bottle-aviso--offline mb-4">
                <i className="fa-solid fa-plug-circle-xmark"></i> Dispositivo offline — o ESP32 parou de enviar dados.
              </div>
            )}
            {usandoReal && !d.garrafa_presente && (
              <div className="bottle-aviso bottle-aviso--garrafa mb-4">
                <i className="fa-solid fa-bottle-water"></i> Garrafa fora da base.
              </div>
            )}

            {/* Cards de resumo */}
            <div className="bottle-resumo-grid mb-4">
              <div>
                <div className="card bottle-resumo-card">
                  <div className="bottle-resumo-icon bottle-resumo-icon--blue"><i className="fa-solid fa-droplet"></i></div>
                  <div className="d-flex flex-column gap-1">
                    <span className="bottle-resumo-valor">{d.consumido} ml</span>
                    <span className="bottle-resumo-label">Consumo de hoje</span>
                  </div>
                </div>
              </div>
              <div>
                <div className="card bottle-resumo-card">
                  <div className="bottle-resumo-icon bottle-resumo-icon--green"><i className="fa-solid fa-fire"></i></div>
                  <div className="d-flex flex-column gap-1">
                    <span className="bottle-resumo-valor">{d.streak != null ? `${d.streak} dia${d.streak === 1 ? '' : 's'}` : '—'}</span>
                    <span className="bottle-resumo-label">Streak (metas seguidas)</span>
                  </div>
                </div>
              </div>
              <div>
                <div className="card bottle-resumo-card">
                  <div className="bottle-resumo-icon bottle-resumo-icon--primary"><i className="fa-solid fa-temperature-half"></i></div>
                  <div className="d-flex flex-column gap-1">
                    <span className="bottle-resumo-valor">{d.temp != null ? `${d.temp}°C` : '—'}</span>
                    <span className="bottle-resumo-label">{d.cidade || 'Temperatura local'}</span>
                  </div>
                </div>
              </div>
              <div>
                <div className="card bottle-resumo-card">
                  <div className="bottle-resumo-icon bottle-resumo-icon--hc"><i className="fa-solid fa-coins"></i></div>
                  <div className="d-flex flex-column gap-1">
                    <span className="bottle-resumo-valor bottle-resumo-valor--hc">+{hcGarrafa} HC</span>
                    <span className="bottle-resumo-label">HC da garrafa</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bottle-layout">

              {/* Painel principal dark */}
              <div>
                <div className="bottle-painel">

                  <div className="d-flex align-items-center justify-content-between mb-4">
                    <div className="d-flex align-items-center gap-3">
                      <div className="bottle-painel-icon"><i className="fa-solid fa-droplet"></i></div>
                      <div>
                        <span className="bottle-painel-titulo">WayCare Bottle</span>
                        <span className="bottle-painel-subtitulo d-block">Suporte IoT de hidratação inteligente</span>
                      </div>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      {usandoReal && d.online ? (
                        <span className="bottle-live-badge">
                          <span className="bottle-live-dot" style={{ opacity: liveVisivel ? 1 : 0, transition: 'opacity 0.2s ease' }}></span>
                          LIVE
                        </span>
                      ) : (
                        <span className="bottle-live-badge bottle-live-badge--off">
                          {usandoReal ? 'OFFLINE' : 'DEMO'}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="bottle-painel-grid mb-4">

                    {/* Garrafa SVG animada — preenche conforme o progresso da meta */}
                    <div>
                      <span className="bottle-secao-label">PROGRESSO DE HOJE</span>
                      <GarrafaAnimada pct={pctClamp} ml={d.consumido} descricao="bebidos hoje" />

                      {/* Fatias da meta (0–4) */}
                      <div className="bottle-fatias" aria-label={`${d.fatias} de 4 fatias`}>
                        {[0, 1, 2, 3].map((i) => (
                          <span key={i} className={`bottle-fatia ${i < d.fatias ? 'bottle-fatia--on' : ''}`}></span>
                        ))}
                      </div>
                      <span className="bottle-fatias-label">{d.fatias}/4 fatias da meta</span>

                      {/* Indicador do LED */}
                      <div className={`bottle-led ${ledClasse}`}>
                        <span className="bottle-led-dot"></span>
                        {ledTexto}
                      </div>
                    </div>

                    {/* Meta diária */}
                    <div>
                      <span className="bottle-secao-label">META DIÁRIA</span>
                      <div className="bottle-meta-valor">
                        <span className="bottle-meta-ml">{d.consumido}</span>
                        <span className="bottle-meta-total">/ {d.meta.toLocaleString('pt-BR')} ml</span>
                      </div>
                      <div className="progress-bar bottle-meta-bar mb-1">
                        <div
                          className="progress-fill bottle-meta-fill"
                          style={{ width: `${pctClamp}%`, backgroundColor: corMeta, transition: 'width 0.4s ease' }}
                        ></div>
                      </div>
                      <div className="d-flex justify-content-between mb-4">
                        <span className="bottle-meta-faltam">
                          {mlFaltam > 0 ? `Faltam ${mlFaltam} ml` : '🎉 Meta atingida!'}
                        </span>
                        <span className="bottle-meta-pct" style={{ color: corMeta }}>{d.pct}%</span>
                      </div>

                      {metaBatida && (
                        <div className="bottle-celebracao mb-4">
                          <i className="fa-solid fa-trophy"></i> Mandou bem! Meta do dia concluída.
                        </div>
                      )}

                      {/* Mini estatísticas */}
                      <div className="bottle-mini-grid mb-4">
                        {usandoReal ? (
                          <>
                            <div>
                              <div className="bottle-mini-stat">
                                <i className="fa-solid fa-fire bottle-mini-icon"></i>
                                <span className="bottle-mini-valor">{d.streak}</span>
                                <span className="bottle-mini-label">Streak</span>
                              </div>
                            </div>
                            <div>
                              <div className="bottle-mini-stat">
                                <i className="fa-solid fa-layer-group bottle-mini-icon"></i>
                                <span className="bottle-mini-valor">{d.fatias}/4</span>
                                <span className="bottle-mini-label">Fatias</span>
                              </div>
                            </div>
                            <div>
                              <div className="bottle-mini-stat">
                                <i className="fa-solid fa-weight-scale bottle-mini-icon"></i>
                                <span className="bottle-mini-valor">{d.peso != null ? Math.round(d.peso) : '—'}</span>
                                <span className="bottle-mini-label">Peso (g)</span>
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            <div>
                              <div className="bottle-mini-stat">
                                <i className="fa-solid fa-droplet bottle-mini-icon"></i>
                                <span className="bottle-mini-valor">{leituras.length}</span>
                                <span className="bottle-mini-label">Goles</span>
                              </div>
                            </div>
                            <div>
                              <div className="bottle-mini-stat">
                                <i className="fa-solid fa-coins bottle-mini-icon bottle-mini-icon--hc"></i>
                                <span className="bottle-mini-valor">+{hcGarrafa}</span>
                                <span className="bottle-mini-label">HC ganhos</span>
                              </div>
                            </div>
                            <div>
                              <div className="bottle-mini-stat">
                                <i className="fa-regular fa-clock bottle-mini-icon"></i>
                                <span className="bottle-mini-valor">{leituras[0]?.hora || '--:--'}</span>
                                <span className="bottle-mini-label">Últ. sync</span>
                              </div>
                            </div>
                          </>
                        )}
                      </div>

                      <div className="bottle-como-funciona">
                        <span className="bottle-como-titulo">COMO FUNCIONA</span>
                        <p className="bottle-como-desc">
                          A balança lê o peso antes e depois do gole. A <strong>diferença</strong> vira
                          consumo e soma na sua meta diária.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Ação do dispositivo: Tara (real) ou simular gole (fallback) */}
                  {usandoReal ? (
                    <div>
                      <span className="bottle-secao-label mb-3 d-block">CONTROLE DO DISPOSITIVO</span>
                      <div className="d-flex align-items-center gap-3 flex-wrap">
                        <button className="btn bottle-tara-btn" onClick={acionarTara} disabled={tarando}>
                          <i className="fa-solid fa-scale-balanced"></i>
                          {tarando ? 'Zerando…' : 'Tarar balança'}
                        </button>
                        {taraMsg && <span className="bottle-tara-msg">{taraMsg}</span>}
                      </div>
                      <p className="bottle-simular-aviso">
                        Zera a balança no dispositivo via MQTT. Use após reabastecer a garrafa —
                        o salto de peso pós-tara não é contado como consumo.
                      </p>
                    </div>
                  ) : (
                    <div>
                      <span className="bottle-secao-label mb-3 d-block">SIMULAR LEITURA DA GARRAFA IOT</span>
                      <div className="d-flex gap-3 flex-wrap">
                        <button className="btn bottle-gole-btn" onClick={() => simularGole(100)} disabled={mlGarrafa < 100}>
                          Gole pequeno
                          <span className="bottle-gole-desc">−100 ml da garrafa</span>
                        </button>
                        <button className="btn bottle-gole-btn bottle-gole-btn--medio" onClick={() => simularGole(200)} disabled={mlGarrafa < 200}>
                          Gole médio
                          <span className="bottle-gole-desc">−200 ml da garrafa</span>
                        </button>
                        <button className="btn bottle-gole-btn bottle-gole-btn--grande" onClick={() => simularGole(300)} disabled={mlGarrafa < 300}>
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
                      <p className="bottle-simular-aviso">Simula o sensor detectando que o nível da garrafa caiu (modo demonstração)</p>
                    </div>
                  )}
                </div>

                {/* Gráfico de consumo */}
                <div className="card bottle-historico-card mt-4">
                  <div className="d-flex align-items-center justify-content-between mb-4">
                    <div className="d-flex align-items-center gap-2">
                      <i className="fa-solid fa-arrow-trend-up bottle-historico-icon"></i>
                      <h3 className="bottle-historico-titulo">{usandoReal ? 'Consumo de hoje' : 'Histórico Semanal'}</h3>
                    </div>
                    <div className="d-flex align-items-center gap-3">
                      <span className="bottle-legenda">
                        <span className="bottle-legenda-dot bottle-legenda-dot--primary"></span>
                        Consumo
                      </span>
                      <span className="bottle-legenda">
                        <span className="bottle-legenda-dot bottle-legenda-dot--muted"></span>
                        Meta ({d.meta}ml)
                      </span>
                    </div>
                  </div>

                  {usandoReal ? (
                    <GraficoHidratacao dados={history} meta={d.meta} />
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '144px' }}>
                      {dadosSemana.map((dia, i) => {
                        const ml = dia.hoje ? mlConsumido : dia.ml
                        const altura = ml > 0 ? Math.max((ml / metaDiaria) * 120, 4) : 4
                        const atingiu = ml >= metaDiaria
                        const cor = dia.hoje ? 'var(--color-info)' : atingiu ? 'var(--color-primary)' : ml > 0 ? '#4aaee8aa' : 'var(--color-border)'
                        return (
                          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                            {ml > 0 && (
                              <span style={{ fontSize: '10px', color: dia.hoje ? 'var(--color-info)' : 'var(--color-text-muted)' }}>{ml}</span>
                            )}
                            <div style={{ width: '100%', height: `${altura}px`, backgroundColor: cor, borderRadius: '4px 4px 0 0', transition: 'height 0.4s ease', marginTop: 'auto' }}></div>
                            <span style={{ fontSize: '11px', color: dia.hoje ? 'var(--color-info)' : 'var(--color-text-muted)', fontWeight: dia.hoje ? '700' : '400' }}>
                              {dia.dia}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Coluna direita */}
              <div className="d-flex flex-column gap-4">

                <div className="card">
                  <h3 className="bottle-col-titulo mb-4">
                    <i className="fa-solid fa-circle-info bottle-col-titulo-icon"></i>
                    Informações do Dispositivo
                  </h3>
                  <div className="d-flex flex-column gap-0">
                    <div className="bottle-info-row">
                      <span className="bottle-info-label"><i className="fa-solid fa-wifi bottle-info-icon--green"></i> Conexão</span>
                      <span className="bottle-info-valor">{usandoReal ? (d.online ? 'Online' : 'Offline') : 'Sem conexão'}</span>
                    </div>
                    <div className="bottle-info-divider"></div>
                    <div className="bottle-info-row">
                      <span className="bottle-info-label"><i className="fa-solid fa-bottle-water bottle-info-icon--blue-light"></i> Garrafa na base</span>
                      <span className="bottle-info-valor">{usandoReal ? (d.garrafa_presente ? 'Sim' : 'Fora da base') : '—'}</span>
                    </div>
                    <div className="bottle-info-divider"></div>
                    <div className="bottle-info-row">
                      <span className="bottle-info-label"><i className="fa-solid fa-temperature-half bottle-info-icon--blue-light"></i> Temperatura</span>
                      <span className="bottle-info-valor">{d.temp != null ? `${d.temp}°C` : '—'}</span>
                    </div>
                    <div className="bottle-info-divider"></div>
                    <div className="bottle-info-row">
                      <span className="bottle-info-label"><i className="fa-solid fa-location-dot bottle-info-icon--purple"></i> Cidade</span>
                      <span className="bottle-info-valor">{d.cidade || '—'}</span>
                    </div>
                    <div className="bottle-info-divider"></div>
                    <div className="bottle-info-row">
                      <span className="bottle-info-label"><i className="fa-solid fa-weight-scale bottle-info-icon--gray"></i> Peso na dock</span>
                      <span className="bottle-info-valor">{d.peso != null ? `${Math.round(d.peso)} g` : '—'}</span>
                    </div>
                    <div className="bottle-info-divider"></div>
                    <div className="bottle-info-row">
                      <span className="bottle-info-label"><i className="fa-solid fa-flask bottle-info-icon--blue-light"></i> Modelo</span>
                      <span className="bottle-info-valor">WayCare Bottle Pro</span>
                    </div>
                  </div>
                  {usandoReal && (
                    <button className="btn bottle-sync-btn mt-4" onClick={acionarTara} disabled={tarando}>
                      <i className="fa-solid fa-scale-balanced"></i> {tarando ? 'Zerando…' : 'Tarar balança'}
                    </button>
                  )}
                </div>

                {/* Meta de Hidratação — resumo + link para personalizar */}
                <div className="card">
                  <h3 className="bottle-col-titulo mb-4">
                    <i className="fa-solid fa-bullseye bottle-col-titulo-icon bottle-col-titulo-icon--green"></i>
                    Meta de Hidratação
                  </h3>
                  <div className="bottle-meta-card mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="bottle-meta-card-label">Meta diária</span>
                      <span className="bottle-meta-card-valor">{d.meta} ml</span>
                    </div>
                    <div className="progress-bar mb-1">
                      <div className="progress-fill" style={{ width: `${pctClamp}%`, transition: 'width 0.4s ease' }}></div>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="bottle-meta-card-consumido">{d.consumido} ml consumidos</span>
                      <span className="bottle-meta-card-pct">{d.pct}%</span>
                    </div>
                  </div>
                  <Link to="/perfil" className="bottle-meta-link">
                    <i className="fa-solid fa-sliders"></i> Personalizar minha meta
                    <i className="fa-solid fa-arrow-right bottle-meta-link-seta"></i>
                  </Link>
                  <p className="bottle-meta-link-desc">
                    Calculada por peso, sexo, atividade física e temperatura da sua cidade.
                  </p>
                </div>

                <div className="card">
                  <h3 className="bottle-col-titulo mb-4">
                    <i className="fa-solid fa-lightbulb bottle-col-titulo-icon bottle-col-titulo-icon--yellow"></i>
                    Dicas de Hidratação
                  </h3>
                  <div className="d-flex flex-column gap-3">
                    <div className="d-flex align-items-start gap-3">
                      <div className="bottle-dica-icon bottle-dica-icon--yellow"><i className="fa-solid fa-bolt"></i></div>
                      <p className="bottle-dica-texto">Beba um copo ao acordar para ativar o metabolismo</p>
                    </div>
                    <div className="d-flex align-items-start gap-3">
                      <div className="bottle-dica-icon bottle-dica-icon--blue"><i className="fa-regular fa-clock"></i></div>
                      <p className="bottle-dica-texto">Configure lembretes a cada 90 minutos durante o trabalho</p>
                    </div>
                    <div className="d-flex align-items-start gap-3">
                      <div className="bottle-dica-icon bottle-dica-icon--green"><i className="fa-solid fa-arrow-trend-up"></i></div>
                      <p className="bottle-dica-texto">Dias mais quentes elevam sua meta automaticamente</p>
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
