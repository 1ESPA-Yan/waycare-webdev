import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import GarrafaAnimada from '../components/GarrafaAnimada'
import GraficoHidratacao from '../components/GraficoHidratacao'
import { useApp } from '../context/AppContext'
import { useHidratacao } from '../hooks/useHidratacao'
import { useHistoricoHidratacao } from '../hooks/useHistoricoHidratacao'
import { tempoDesde, horaCurta } from '../lib/tempo'
import Topbar from '../components/Topbar'
import Card from '../components/Card'
import Icone from '../components/Icone'
import AvisoPrimeiroUso from '../components/AvisoPrimeiroUso'
import '../styles/waycare-bottle.css'

// Eventos do dia (painel do Supabase): ícone e texto de cada tipo
const EVENTOS = {
  gole: { icone: 'fa-droplet', texto: 'Gole' },
  reabastecimento: { icone: 'fa-fill-drip', texto: 'Garrafa reabastecida' },
  garrafa_fora: { icone: 'fa-bottle-water', texto: 'Garrafa fora da dock' },
  garrafa_volta: { icone: 'fa-bottle-water', texto: 'Garrafa de volta' },
  tara: { icone: 'fa-scale-balanced', texto: 'Balança zerada' },
}

// Qualidade do Wi-Fi pelo RSSI (mesmas faixas do PWA da dock)
function sinalWifi(rssi) {
  if (rssi == null) return ''
  if (rssi > -60) return 'sinal bom'
  if (rssi > -72) return 'sinal médio'
  return 'sinal fraco'
}

// Dados do gráfico semanal do modo demonstração (o dia de hoje usa o consumo simulado)
const dadosSemana = [
  { dia: 'Seg', ml: 0 },
  { dia: 'Ter', ml: 1400 },
  { dia: 'Qua', ml: 0 },
  { dia: 'Qui', ml: 1700 },
  { dia: 'Sex', ml: 0 },
  { dia: 'Sáb', ml: 0 },
  { dia: 'Hoje', ml: 450, hoje: true },
]

// "2026-10-21" -> "Ter" (o último dia do histórico vira "Hoje")
function rotuloDia(dia, ehHoje) {
  if (ehHoje) return 'Hoje'
  const nome = new Date(`${dia}T12:00:00`).toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '')
  return nome.charAt(0).toUpperCase() + nome.slice(1)
}

// Barras dos últimos 7 dias. dias = [{ rotulo, ml, meta, bateu, hoje }]
// Dia com a meta batida fica verde; hoje (sem meta batida) fica azul.
function GraficoSemana({ dias }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '144px' }}>
      {dias.map((dia, i) => {
        const altura = dia.ml > 0 ? Math.min(Math.max((dia.ml / dia.meta) * 120, 4), 120) : 4
        const cor = dia.bateu ? 'var(--color-primary)' : dia.hoje ? 'var(--color-info)' : dia.ml > 0 ? '#4aaee8aa' : 'var(--color-border)'
        return (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}
               title={`${dia.rotulo}: ${dia.ml} de ${dia.meta} ml${dia.bateu ? ' (meta batida)' : ''}`}>
            {dia.ml > 0 && (
              <span style={{ fontSize: '10px', color: dia.hoje ? 'var(--color-info-text)' : 'var(--color-text-muted)' }}>{dia.ml}</span>
            )}
            <div style={{ width: '100%', height: `${altura}px`, backgroundColor: cor, borderRadius: '4px 4px 0 0', transition: 'height 0.4s ease', marginTop: 'auto' }}></div>
            <span style={{ fontSize: '11px', color: dia.hoje ? 'var(--color-info-text)' : 'var(--color-text-muted)', fontWeight: dia.hoje ? '700' : '400' }}>
              {dia.rotulo}
            </span>
          </div>
        )
      })}
    </div>
  )
}

function WaycareBottle() {
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
  } = useApp()

  // Conta real: painel do Supabase. Demonstração: valores simulados do AppContext
  const hidratacao = useHidratacao()
  const { modo, dock, perfil, eventos, carregando } = hidratacao
  const usandoReal = modo !== 'demo'

  // Gráficos da conta real: curva do dia (goles) e últimos 7 dias (historico)
  const { curva, semana } = useHistoricoHidratacao()
  const diasSemana = usandoReal
    ? semana.map((dia, i) => ({
        rotulo: rotuloDia(dia.dia, i === semana.length - 1),
        ml: dia.consumo_ml,
        meta: dia.meta_ml,
        bateu: dia.bateu,
        hoje: i === semana.length - 1,
      }))
    : dadosSemana.map(dia => {
        const ml = dia.hoje ? mlConsumido : dia.ml
        return { rotulo: dia.dia, ml, meta: metaDiaria, bateu: ml >= metaDiaria, hoje: !!dia.hoje }
      })

  // Ponto LIVE piscando
  useEffect(() => {
    const intervalo = setInterval(() => setLiveVisivel(v => !v), 800)
    return () => clearInterval(intervalo)
  }, [])

  // ----- View model: dados reais OU simulação (fallback) --------------------
  const d = usandoReal
    ? {
        consumido: Math.round(hidratacao.consumo),
        meta: hidratacao.meta,
        pct: Math.round(hidratacao.pct),
        fatias: hidratacao.fatias,
        estado_led: dock?.led || 'sem_dono',
        streak: hidratacao.streak,
        goles: hidratacao.goles,
        peso: dock?.peso_atual ?? null,
        garrafa_presente: dock ? !dock.garrafa_fora : true,
        online: Boolean(dock?.online),
        temp: perfil?.temp_c != null ? Math.round(perfil.temp_c) : null,
        cidade: perfil?.cidade ?? null,
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

  // Versão clara da mesma cor para o texto sobre o painel escuro
  const corMetaTexto = d.estado_led === 'vermelho'
    ? '#ff8a80'
    : metaBatida
    ? '#4fd1a5'
    : pctClamp >= 50
    ? '#64b5f6'
    : 'var(--color-hc)'

  const ledTexto = {
    sem_dono: 'Dock sem dono: vincule pelo código',
    verde: 'Tudo certo — siga bebendo',
    vermelho: 'Faz um tempo que você não bebe',
    verde_pulsando: '🎉 Meta do dia batida!',
  }[d.estado_led] || 'Tudo certo'
  const ledClasse = d.estado_led === 'vermelho'
    ? 'bottle-led--vermelho'
    : d.estado_led === 'verde_pulsando'
    ? 'bottle-led--pulsando'
    : d.estado_led === 'sem_dono'
    ? 'bottle-led--neutro'
    : 'bottle-led--verde'

  // Bateria fraca só importa fora do USB
  const bateriaFraca = dock && !dock.usb && dock.bateria_pct != null && dock.bateria_pct <= 15

  return (
    <>
          <Topbar
            className="bottle-topbar"
            titulo="WayCare Bottle"
            aoLadoDoTitulo={d.online ? (
              <span className="bottle-conectada-badge">
                <Icone nome="fa-wifi" /> Conectada
              </span>
            ) : (
              <span className="bottle-conectada-badge bottle-conectada-badge--off">
                <Icone nome="fa-plug-circle-xmark" /> {!usandoReal ? 'Demonstração' : dock ? 'Offline' : 'Sem dock'}
              </span>
            )}
            subtitulo={
              <div className="flex items-center gap-4 flex-wrap">
                <span className="bottle-status-info">
                  <Icone nome="fa-signal" /> {!usandoReal ? 'Sensor IoT (demo)' : dock ? `Dock ${dock.apelido || dock.id}` : 'Nenhuma dock vinculada'}
                </span>
                {d.temp != null && (
                  <span className="bottle-status-info"><Icone nome="fa-temperature-half" /> {d.temp}°C</span>
                )}
                {d.cidade && (
                  <span className="bottle-status-info"><Icone nome="fa-location-dot" /> {d.cidade}</span>
                )}
              </div>
            }
          />

          <section id="page-content" className="page-transition">

            {/* Passo pendente do primeiro uso (perfil, vínculo ou tara) */}
            <AvisoPrimeiroUso className="mb-6" />

            {/* Avisos de conexão / dispositivo */}
            {carregando && (
              <div className="bottle-aviso bottle-aviso--info mb-6">
                <Icone nome="fa-circle-notch" girar /> Carregando os dados da sua dock…
              </div>
            )}
            {!usandoReal && (
              <div className="bottle-aviso bottle-aviso--info mb-6">
                <Icone nome="fa-compass" />
                Modo demonstração: os goles são simulados com os botões do painel.
              </div>
            )}
            {/* Sem perfil, o AvisoPrimeiroUso fala do perfil; aqui a tara não fica escondida */}
            {dock && !dock.tarada && !perfil?.peso_kg && (
              <div className="bottle-aviso bottle-aviso--garrafa mb-6">
                <Icone nome="fa-scale-balanced" /> Balança não zerada: os goles só contam depois da tara com a garrafa vazia.
              </div>
            )}
            {dock && !dock.online && (
              <div className="bottle-aviso bottle-aviso--offline mb-6">
                <Icone nome="fa-plug-circle-xmark" />
                Dock offline{dock.ultimo_contato ? ` (último contato ${tempoDesde(dock.ultimo_contato)})` : ''}. O que ela medir
                nesse tempo sobe quando voltar a ter Wi-Fi.
              </div>
            )}
            {bateriaFraca && (
              <div className="bottle-aviso bottle-aviso--garrafa mb-6">
                <Icone nome="fa-triangle-exclamation" /> Bateria fraca ({dock.bateria_pct}%). Coloque a dock para carregar.
              </div>
            )}
            {dock && !d.garrafa_presente && (
              <div className="bottle-aviso bottle-aviso--garrafa mb-6">
                <Icone nome="fa-bottle-water" /> Garrafa fora da dock.
              </div>
            )}

            {/* Cards de resumo */}
            <div className="bottle-resumo-grid mb-6">
              <div>
                <Card className="bottle-resumo-card">
                  <div className="bottle-resumo-icon bottle-resumo-icon--blue"><Icone nome="fa-droplet" /></div>
                  <div className="flex flex-col gap-1">
                    <span className="bottle-resumo-valor">{d.consumido} ml</span>
                    <span className="bottle-resumo-label">Consumo de hoje</span>
                  </div>
                </Card>
              </div>
              <div>
                <Card className="bottle-resumo-card">
                  <div className="bottle-resumo-icon bottle-resumo-icon--green"><Icone nome="fa-fire" /></div>
                  <div className="flex flex-col gap-1">
                    <span className="bottle-resumo-valor">{d.streak != null ? `${d.streak} dia${d.streak === 1 ? '' : 's'}` : '—'}</span>
                    <span className="bottle-resumo-label">Streak (metas seguidas)</span>
                  </div>
                </Card>
              </div>
              <div>
                <Card className="bottle-resumo-card">
                  <div className="bottle-resumo-icon bottle-resumo-icon--primary"><Icone nome="fa-temperature-half" /></div>
                  <div className="flex flex-col gap-1">
                    <span className="bottle-resumo-valor">{d.temp != null ? `${d.temp}°C` : '—'}</span>
                    <span className="bottle-resumo-label">{d.cidade || 'Temperatura local'}</span>
                  </div>
                </Card>
              </div>
              <div>
                <Card className="bottle-resumo-card">
                  <div className="bottle-resumo-icon bottle-resumo-icon--hc"><Icone nome="fa-coins" /></div>
                  <div className="flex flex-col gap-1">
                    <span className="bottle-resumo-valor bottle-resumo-valor--hc">+{hcGarrafa} HC</span>
                    <span className="bottle-resumo-label">HC da garrafa</span>
                  </div>
                </Card>
              </div>
            </div>

            <div className="bottle-layout">

              {/* Painel principal dark */}
              <div>
                <div className="bottle-painel">

                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="bottle-painel-icon"><Icone nome="fa-droplet" /></div>
                      <div>
                        <span className="bottle-painel-titulo">WayCare Bottle</span>
                        <span className="bottle-painel-subtitulo block">Suporte IoT de hidratação inteligente</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {d.online ? (
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

                  <div className="bottle-painel-grid mb-6">

                    {/* Garrafa SVG animada — preenche conforme o progresso da meta */}
                    <div>
                      <span className="bottle-secao-label">PROGRESSO DE HOJE</span>
                      <GarrafaAnimada pct={pctClamp} ml={d.consumido} descricao="bebidos hoje" />

                      {/* Fatias da meta (0–4) */}
                      <div className="bottle-fatias" aria-hidden="true">
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
                      <div className="flex justify-between mb-6">
                        <span className="bottle-meta-faltam">
                          {mlFaltam > 0 ? `Faltam ${mlFaltam} ml` : '🎉 Meta atingida!'}
                        </span>
                        <span className="bottle-meta-pct" style={{ color: corMetaTexto }}>{d.pct}%</span>
                      </div>

                      {metaBatida && (
                        <div className="bottle-celebracao mb-6">
                          <Icone nome="fa-trophy" /> Mandou bem! Meta do dia concluída.
                        </div>
                      )}

                      {/* Mini estatísticas */}
                      <div className="bottle-mini-grid mb-6">
                        {usandoReal ? (
                          <>
                            <div>
                              <div className="bottle-mini-stat">
                                <Icone nome="fa-fire" className="bottle-mini-icon" />
                                <span className="bottle-mini-valor">{d.streak}</span>
                                <span className="bottle-mini-label">Streak</span>
                              </div>
                            </div>
                            <div>
                              <div className="bottle-mini-stat">
                                <Icone nome="fa-droplet" className="bottle-mini-icon" />
                                <span className="bottle-mini-valor">{d.goles}</span>
                                <span className="bottle-mini-label">Goles</span>
                              </div>
                            </div>
                            <div>
                              <div className="bottle-mini-stat">
                                <Icone nome="fa-weight-scale" className="bottle-mini-icon" />
                                <span className="bottle-mini-valor">{d.peso != null ? Math.round(d.peso) : '—'}</span>
                                <span className="bottle-mini-label">Peso (g)</span>
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            <div>
                              <div className="bottle-mini-stat">
                                <Icone nome="fa-droplet" className="bottle-mini-icon" />
                                <span className="bottle-mini-valor">{leituras.length}</span>
                                <span className="bottle-mini-label">Goles</span>
                              </div>
                            </div>
                            <div>
                              <div className="bottle-mini-stat">
                                <Icone nome="fa-coins" className="bottle-mini-icon bottle-mini-icon--hc" />
                                <span className="bottle-mini-valor">+{hcGarrafa}</span>
                                <span className="bottle-mini-label">HC ganhos</span>
                              </div>
                            </div>
                            <div>
                              <div className="bottle-mini-stat">
                                <Icone nome="fa-clock" className="bottle-mini-icon" />
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

                  {/* Ação do dispositivo: tara (conta real com dock) ou simular gole (demonstração) */}
                  {usandoReal ? dock && (
                    <div>
                      <span className="bottle-secao-label mb-4 block">CONTROLE DO DISPOSITIVO</span>
                      <div className="flex items-center gap-4 flex-wrap">
                        {/* O pedido de tara pelo Supabase entra na tarefa 42 */}
                        <button className="btn bottle-tara-btn em-breve" disabled>
                          <Icone nome="fa-scale-balanced" />
                          Zerar balança <span className="badge-em-breve">Em breve</span>
                        </button>
                      </div>
                      <p className="bottle-simular-aviso">
                        Com a garrafa vazia na dock, zera a balança. Os goles e reabastecimentos são
                        calculados a partir desse ponto.
                      </p>
                    </div>
                  ) : (
                    <div>
                      <span className="bottle-secao-label mb-4 block">SIMULAR LEITURA DA GARRAFA IOT</span>
                      <div className="flex gap-4 flex-wrap">
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
                          <Icone nome="fa-fill-drip" style={{ fontSize: '12px' }} />
                          Encher garrafa
                          <span className="bottle-gole-desc">+{CAPACIDADE_GARRAFA - mlGarrafa} ml</span>
                        </button>
                      </div>
                      <p className="bottle-simular-aviso">Simula o sensor detectando que o nível da garrafa caiu (modo demonstração)</p>
                    </div>
                  )}
                </div>

                {/* Consumo de hoje: curva acumulada dos goles (só conta real) */}
                {usandoReal && (
                  <Card className="bottle-historico-card mt-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2">
                        <Icone nome="fa-arrow-trend-up" className="bottle-historico-icon" />
                        <h2 className="bottle-historico-titulo">Consumo de hoje</h2>
                      </div>
                      <div className="flex items-center gap-4">
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
                    <GraficoHidratacao dados={curva} meta={d.meta} />
                  </Card>
                )}

                {/* Histórico semanal: rpc historico (real) ou valores fixos (demo) */}
                <Card className="bottle-historico-card mt-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <Icone nome="fa-chart-bar" className="bottle-historico-icon" />
                      <h2 className="bottle-historico-titulo">Histórico Semanal</h2>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="bottle-legenda">
                        <span className="bottle-legenda-dot bottle-legenda-dot--meta"></span>
                        Meta batida
                      </span>
                      <span className="bottle-legenda">
                        <span className="bottle-legenda-dot bottle-legenda-dot--primary"></span>
                        Abaixo da meta
                      </span>
                    </div>
                  </div>
                  {diasSemana.length ? (
                    <GraficoSemana dias={diasSemana} />
                  ) : (
                    <div className="bottle-grafico-vazio">
                      <Icone nome="fa-chart-bar" />
                      Carregando o histórico…
                    </div>
                  )}
                </Card>
              </div>

              {/* Coluna direita */}
              <div className="flex flex-col gap-6">

                <Card>
                  <h2 className="bottle-col-titulo mb-6">
                    <Icone nome="fa-circle-info" className="bottle-col-titulo-icon" />
                    Informações do Dispositivo
                  </h2>
                  <div className="flex flex-col gap-0">
                    <div className="bottle-info-row">
                      <span className="bottle-info-label"><Icone nome="fa-wifi" className="bottle-info-icon--green" /> Conexão</span>
                      <span className="bottle-info-valor">
                        {!dock ? (usandoReal ? 'Sem dock vinculada' : 'Demonstração')
                          : dock.online ? 'Conectada'
                          : `Offline${dock.ultimo_contato ? `, última vez ${tempoDesde(dock.ultimo_contato)}` : ''}`}
                      </span>
                    </div>
                    <div className="bottle-info-divider"></div>
                    <div className="bottle-info-row">
                      <span className="bottle-info-label"><Icone nome="fa-bottle-water" className="bottle-info-icon--blue-light" /> Garrafa na base</span>
                      <span className="bottle-info-valor">{dock ? (d.garrafa_presente ? 'Sim' : 'Fora da dock') : '—'}</span>
                    </div>
                    <div className="bottle-info-divider"></div>
                    <div className="bottle-info-row">
                      <span className="bottle-info-label"><Icone nome="fa-bolt" className="bottle-info-icon--purple" /> Bateria</span>
                      <span className="bottle-info-valor">
                        {!dock ? '—' : dock.usb ? 'No USB' : dock.bateria_pct != null ? `${dock.bateria_pct}%` : '—'}
                      </span>
                    </div>
                    <div className="bottle-info-divider"></div>
                    <div className="bottle-info-row">
                      <span className="bottle-info-label"><Icone nome="fa-signal" className="bottle-info-icon--green" /> Wi-Fi</span>
                      <span className="bottle-info-valor">
                        {dock?.rede ? `${dock.rede}${dock.rssi != null ? `, ${sinalWifi(dock.rssi)}` : ''}` : '—'}
                      </span>
                    </div>
                    <div className="bottle-info-divider"></div>
                    <div className="bottle-info-row">
                      <span className="bottle-info-label"><Icone nome="fa-weight-scale" className="bottle-info-icon--gray" /> Peso na dock</span>
                      <span className="bottle-info-valor">{d.peso != null ? `${Math.round(d.peso)} g` : '—'}</span>
                    </div>
                    <div className="bottle-info-divider"></div>
                    <div className="bottle-info-row">
                      <span className="bottle-info-label"><Icone nome="fa-flask" className="bottle-info-icon--blue-light" /> Firmware</span>
                      <span className="bottle-info-valor">{dock?.fw || '—'}</span>
                    </div>
                  </div>
                </Card>

                {/* Eventos do dia: painel do Supabase (real) ou leituras simuladas (demo) */}
                <Card>
                  <h2 className="bottle-col-titulo mb-6">
                    <Icone nome="fa-clock" className="bottle-col-titulo-icon" />
                    Eventos de hoje
                  </h2>
                  {eventos.length === 0 ? (
                    <p className="bottle-eventos-vazio">Nenhum evento hoje ainda. Os goles aparecem aqui assim que a dock registrar.</p>
                  ) : (
                    <ul className="bottle-eventos">
                      {eventos.map((ev, i) => {
                        const tipo = EVENTOS[ev.tipo] ?? { icone: 'fa-circle-info', texto: ev.tipo }
                        return (
                          <li key={`${ev.ts ?? ev.hora}-${i}`} className={`bottle-evento bottle-evento--${ev.tipo}`}>
                            <Icone nome={tipo.icone} className="bottle-evento-icone" />
                            <span className="bottle-evento-texto">{tipo.texto}</span>
                            {ev.tipo === 'gole' && ev.ml > 0 && <span className="bottle-evento-ml">{ev.ml} ml</span>}
                            {ev.tipo === 'reabastecimento' && ev.ml > 0 && <span className="bottle-evento-ml">+{ev.ml} ml</span>}
                            <span className="bottle-evento-hora">{ev.ts ? horaCurta(ev.ts) : ev.hora}</span>
                          </li>
                        )
                      })}
                    </ul>
                  )}
                </Card>

                {/* Meta de Hidratação — resumo + link para personalizar */}
                <Card>
                  <h2 className="bottle-col-titulo mb-6">
                    <Icone nome="fa-bullseye" className="bottle-col-titulo-icon bottle-col-titulo-icon--green" />
                    Meta de Hidratação
                  </h2>
                  <div className="bottle-meta-card mb-6">
                    <div className="flex justify-between items-center mb-1">
                      <span className="bottle-meta-card-label">Meta diária</span>
                      <span className="bottle-meta-card-valor">{d.meta} ml</span>
                    </div>
                    <div className="progress-bar mb-1">
                      <div className="progress-fill" style={{ width: `${pctClamp}%`, transition: 'width 0.4s ease' }}></div>
                    </div>
                    <div className="flex justify-between">
                      <span className="bottle-meta-card-consumido">{d.consumido} ml consumidos</span>
                      <span className="bottle-meta-card-pct">{d.pct}%</span>
                    </div>
                  </div>
                  <Link to="/perfil" className="bottle-meta-link">
                    <Icone nome="fa-sliders" /> Personalizar minha meta
                    <Icone nome="fa-arrow-right" className="bottle-meta-link-seta" />
                  </Link>
                  <p className="bottle-meta-link-desc">
                    Calculada por peso, sexo, atividade física e temperatura da sua cidade.
                  </p>
                </Card>

                <Card>
                  <h2 className="bottle-col-titulo mb-6">
                    <Icone nome="fa-lightbulb" className="bottle-col-titulo-icon bottle-col-titulo-icon--yellow" />
                    Dicas de Hidratação
                  </h2>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-start gap-4">
                      <div className="bottle-dica-icon bottle-dica-icon--yellow"><Icone nome="fa-bolt" /></div>
                      <p className="bottle-dica-texto">Beba um copo ao acordar para ativar o metabolismo</p>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="bottle-dica-icon bottle-dica-icon--blue"><Icone nome="fa-clock" /></div>
                      <p className="bottle-dica-texto">Configure lembretes a cada 90 minutos durante o trabalho</p>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="bottle-dica-icon bottle-dica-icon--green"><Icone nome="fa-arrow-trend-up" /></div>
                      <p className="bottle-dica-texto">Dias mais quentes elevam sua meta automaticamente</p>
                    </div>
                  </div>
                </Card>

              </div>
            </div>
          </section>
    </>
  )
}

export default WaycareBottle
