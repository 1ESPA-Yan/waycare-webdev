import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import Topbar from '../components/Topbar'
import FiltroPills from '../components/FiltroPills'
import Button from '../components/Button'
import Card from '../components/Card'
import '../styles/recompensas.css'

const FILTROS = [
  { key: 'todos', label: 'Todos' },
  { key: 'saude', label: 'Saúde & Bem-estar' },
  { key: 'experiencias', label: 'Experiências' },
  { key: 'produtos', label: 'Produtos' },
  { key: 'descontos', label: 'Descontos Care Plus' },
]

function Recompensas() {
  const [filtroAtivo, setFiltroAtivo] = useState('todos')
  const [recompensas, setRecompensas] = useState([])
  const [carregando, setCarregando] = useState(true)
  const { totalHC } = useApp()
  const navigate = useNavigate()

  const handleResgatar = (r) => {
    navigate('/resgate/confirmar', {
      state: { recompensa: { id: r.id, nome: r.nome, preco: r.hc, icone: r.icone } },
    })
  }

  // Consumo do JSON local — para simular a chamada de API
  useEffect(() => {
    fetch('/data/recompensas.json')
      .then(res => res.json())
      .then(data => {
        setRecompensas(data)
        setCarregando(false)
      })
      .catch(() => {
        // faz a importação direto se o fetch falhar
        import('../data/recompensas.json').then(mod => {
          setRecompensas(mod.default)
          setCarregando(false)
        })
      })
  }, [])

  const recompensasFiltradas = useMemo(() => {
    if (filtroAtivo === 'todos') return recompensas
    return recompensas.filter(r => r.categoria === filtroAtivo)
  }, [filtroAtivo, recompensas])

  return (
    <>
          {/* Topbar */}
          <Topbar icone="fa-gift" titulo="Catálogo de Recompensas" subtitulo="Troque seus Health Coins por prêmios" />

          <section id="page-content" className="page-transition">

            {/* Filtros de categoria */}
            <FiltroPills className="mb-5" rotulo="Filtrar recompensas" opcoes={FILTROS} ativo={filtroAtivo} aoMudar={setFiltroAtivo} />

            {/* Estado de carregamento */}
            {carregando && (
              <div className="d-flex justify-content-center align-items-center py-5">
                <div className="d-flex flex-column align-items-center gap-3">
                  <i className="fa-solid fa-spinner fa-spin text-primary" style={{ fontSize: '32px' }}></i>
                  <span className="text-muted">Carregando recompensas...</span>
                </div>
              </div>
            )}

            {/* Grid de recompensas */}
            {!carregando && recompensasFiltradas.length > 0 && (
              <div className="recompensas-grid">
                {recompensasFiltradas.map(r => (
                  <div key={r.id} className="recompensa-filter-item">
                    <Card className="recompensa-card">
                      <div className={`recompensa-thumb ${r.thumb}`}>
                        <i className={`fa-solid ${r.icone}`}></i>
                        {r.popular && <span className="recompensa-popular-badge">POPULAR</span>}
                      </div>
                      <div className="recompensa-info">
                        <h3 className="recompensa-nome">{r.nome}</h3>
                        <p className="recompensa-desc">{r.desc}</p>
                        <div className="recompensa-hc">
                          <span className="fa-solid fa-coins"></span>
                          {r.hc.toLocaleString('pt-BR')} HC
                        </div>
                        <Button
                          bloco
                          className="recompensa-btn"
                          disabled={totalHC < r.hc}
                          title={totalHC < r.hc ? 'HC insuficiente' : 'Resgatar'}
                          onClick={() => handleResgatar(r)}
                        >
                          {totalHC >= r.hc ? 'Resgatar Agora' : 'HC insuficiente'}
                        </Button>
                      </div>
                    </Card>
                  </div>
                ))}
              </div>
            )}

            {/* Estado vazio */}
            {!carregando && recompensasFiltradas.length === 0 && (
              <div className="recompensa-empty">
                <i className="fa-solid fa-filter-circle-xmark recompensa-empty-icon"></i>
                <p className="recompensa-empty-text">
                  Nenhuma recompensa disponível nesta categoria.
                </p>
                <Button
                  variante="secundario"
                  onClick={() => setFiltroAtivo('todos')}
                >
                  Ver todas
                </Button>
              </div>
            )}

          </section>
    </>
  )
}

export default Recompensas