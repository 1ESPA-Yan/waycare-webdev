import { useApp } from '../context/AppContext'
import { useDados } from '../hooks/useDados'
import Topbar from '../components/Topbar'
import Button from '../components/Button'
import Card from '../components/Card'
import '../styles/carteira.css'

function GraficoLinha({ dados }) {
  const maxValor = Math.max(...dados.map(d => d.valor))
  const altura = 160
  const largura = 100
  const pts = dados.map((d, i) => {
    const x = (i / (dados.length - 1)) * largura
    const y = altura - (d.valor / maxValor) * altura
    return `${x},${y}`
  })
  const pontos = pts.join(' ')
  const area = `0,${altura} ${pontos} ${largura},${altura}`

  return (
    <div className="grafico-wrapper">
      <svg viewBox={`0 0 100 ${altura}`} preserveAspectRatio="none" className="grafico-svg">
        <defs>
          <linearGradient id="gradArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1c9770" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#1c9770" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <polygon points={area} fill="url(#gradArea)" />
        <polyline points={pontos} fill="none" stroke="#1c9770" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        {dados.map((d, i) => {
          const x = (i / (dados.length - 1)) * largura
          const y = altura - (d.valor / maxValor) * altura
          return <circle key={i} cx={x} cy={y} r="2" fill="#1c9770" />
        })}
      </svg>
      <div className="grafico-labels">
        {dados.map(d => (
          <span key={d.dia} className="grafico-label">{d.dia}</span>
        ))}
      </div>
    </div>
  )
}

function Carteira() {
  const { dados } = useDados('carteira')
  const historico = dados?.historico ?? []
  const grafico = dados?.grafico ?? []
  const destaques = dados?.destaques ?? []
  const { totalHC } = useApp()

  return (
    <>
          <Topbar icone="fa-wallet" titulo="Minha Carteira" subtitulo="Seu extrato de Health Coins" />

          {/* Card de saldo */}
          <div className="carteira-saldo-card">
            <p className="carteira-saldo-label">Seu saldo disponível</p>
            <div className="carteira-saldo-valor">
              <i className="fa-solid fa-coins carteira-saldo-icon"></i>
              <span className="carteira-saldo-numero">{totalHC.toLocaleString('pt-BR')}</span>
            </div>
            <p className="carteira-saldo-subtexto">Health Coins</p>
          </div>

          {/* Layout de duas colunas */}
          <div className="carteira-grid">

            {/* Coluna esquerda */}
            <div className="carteira-col-esquerda">

              {/* Gráfico */}
              <Card className="carteira-card-grafico">
                <div className="carteira-card-header">
                  <i className="fa-solid fa-chart-line carteira-card-header-icon"></i>
                  <h2 className="carteira-card-titulo">Evolução dos últimos 7 dias</h2>
                </div>
                <GraficoLinha dados={grafico} />
              </Card>

              {/* Histórico */}
              <Card className="carteira-card-historico">
                <div className="carteira-card-header">
                  <i className="fa-solid fa-rectangle-list carteira-card-header-icon"></i>
                  <h2 className="carteira-card-titulo">Histórico de Ganhos</h2>
                </div>
                <ul className="historico-lista">
                  {historico.map(item => (
                    <li key={item.id} className="historico-item">
                      <div className={`historico-icone historico-icone--${item.cor}`}>
                        <i className={`fa-solid ${item.icone}`}></i>
                      </div>
                      <div className="historico-info">
                        <span className="historico-nome">{item.titulo}</span>
                        <span className="historico-tempo">{item.tempo}</span>
                      </div>
                      <span className="historico-hc">
                        <i className="fa-solid fa-coins"></i> {item.hc}
                      </span>
                    </li>
                  ))}
                </ul>
              </Card>

            </div>

            {/* Coluna direita */}
            <div className="carteira-col-direita">

              {/* Conquistas em destaque */}
              <Card className="carteira-card-conquistas">
                <div className="carteira-card-header">
                  <i className="fa-solid fa-trophy carteira-card-header-icon carteira-card-header-icon--warning"></i>
                  <h2 className="carteira-card-titulo">Conquistas em Destaque</h2>
                </div>
                <div className="conquistas-lista">
                  {destaques.map(c => (
                    <div key={c.id} className="carteira-conquista-card">
                      <div className={`conquista-icone conquista-icone--${c.cor}`}>
                        <i className={`fa-solid ${c.icone}`}></i>
                      </div>
                      <p className="carteira-conquista-nome">{c.titulo}</p>
                      <p className="carteira-conquista-tempo">{c.tempo}</p>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Promo recompensas */}
              <div className="carteira-card-promo">
                <div className="promo-icone">
                  <i className="fa-solid fa-gem"></i>
                </div>
                <p className="promo-texto">Troque seus coins por recompensas incríveis!</p>
                <Button to="/recompensas" bloco tamanho="sm">
                  Ver catálogo de recompensas
                </Button>
              </div>

            </div>
          </div>

    </>
  )
}

export default Carteira