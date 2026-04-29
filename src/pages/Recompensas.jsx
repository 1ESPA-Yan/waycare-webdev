import { useState } from 'react'
import { Link } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import '../styles/recompensas.css'

function Recompensas() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <>
      {/* Botão hamburguer — só aparece no mobile */}
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

          {/* Topbar */}
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

            {/* Título da página */}
            <div className="d-flex align-items-center gap-3 mb-4">
              <div className="recompensas-titulo-icon">
                <i className="fa-solid fa-gift"></i>
              </div>
              <h1 className="recompensas-titulo">Catálogo de Recompensas</h1>
            </div>

            {/* Filtros de categoria */}
            <div className="d-flex gap-2 flex-wrap mb-5">
              <button className="recompensa-tag active">Todos</button>
              <button className="recompensa-tag">Saúde &amp; Bem-estar</button>
              <button className="recompensa-tag">Experiências</button>
              <button className="recompensa-tag">Produtos</button>
              <button className="recompensa-tag">Descontos Care Plus</button>
            </div>

            {/* Grid de recompensas */}
            <div className="row g-4">

              {/* Consulta Nutricional — popular */}
              <div className="col-12 col-md-6 col-lg-4">
                <div className="card recompensa-card">
                  <div className="recompensa-thumb recompensa-thumb--green">
                    <i className="fa-solid fa-apple-whole"></i>
                    <span className="recompensa-popular-badge">POPULAR</span>
                  </div>
                  <div className="recompensa-info">
                    <h3 className="recompensa-nome">Consulta Nutricional</h3>
                    <p className="recompensa-desc">1 sessão com nutricionista Care Plus</p>
                    <div className="recompensa-hc">
                      <span className="fa-solid fa-coins"></span>
                      500 HC
                    </div>
                    <button className="btn recompensa-btn">Resgatar Agora</button>
                  </div>
                </div>
              </div>

              {/* Kit de Hidratação */}
              <div className="col-12 col-md-6 col-lg-4">
                <div className="card recompensa-card">
                  <div className="recompensa-thumb recompensa-thumb--blue">
                    <i className="fa-solid fa-droplet"></i>
                  </div>
                  <div className="recompensa-info">
                    <h3 className="recompensa-nome">Kit de Hidratação</h3>
                    <p className="recompensa-desc">Garrafa térmica + squeeze personalizados</p>
                    <div className="recompensa-hc">
                      <span className="fa-solid fa-coins"></span>
                      300 HC
                    </div>
                    <button className="btn recompensa-btn">Resgatar Agora</button>
                  </div>
                </div>
              </div>

              {/* Desconto Academia */}
              <div className="col-12 col-md-6 col-lg-4">
                <div className="card recompensa-card">
                  <div className="recompensa-thumb recompensa-thumb--orange">
                    <i className="fa-solid fa-dumbbell"></i>
                  </div>
                  <div className="recompensa-info">
                    <h3 className="recompensa-nome">Desconto Academia</h3>
                    <p className="recompensa-desc">20% off em academias parceiras por 3 meses</p>
                    <div className="recompensa-hc">
                      <span className="fa-solid fa-coins"></span>
                      800 HC
                    </div>
                    <button className="btn recompensa-btn">Resgatar Agora</button>
                  </div>
                </div>
              </div>

              {/* Massagem Relaxante */}
              <div className="col-12 col-md-6 col-lg-4">
                <div className="card recompensa-card">
                  <div className="recompensa-thumb recompensa-thumb--pink">
                    <i className="fa-solid fa-heart"></i>
                  </div>
                  <div className="recompensa-info">
                    <h3 className="recompensa-nome">Massagem Relaxante</h3>
                    <p className="recompensa-desc">1 hora de massagem terapêutica</p>
                    <div className="recompensa-hc">
                      <span className="fa-solid fa-coins"></span>
                      1000 HC
                    </div>
                    <button className="btn recompensa-btn">Resgatar Agora</button>
                  </div>
                </div>
              </div>

              {/* Check-up Gratuito — popular */}
              <div className="col-12 col-md-6 col-lg-4">
                <div className="card recompensa-card">
                  <div className="recompensa-thumb recompensa-thumb--red">
                    <i className="fa-solid fa-heart-pulse"></i>
                    <span className="recompensa-popular-badge">POPULAR</span>
                  </div>
                  <div className="recompensa-info">
                    <h3 className="recompensa-nome">Check-up Gratuito</h3>
                    <p className="recompensa-desc">Consulta anual sem custo adicional</p>
                    <div className="recompensa-hc">
                      <span className="fa-solid fa-coins"></span>
                      200 HC
                    </div>
                    <button className="btn recompensa-btn">Resgatar Agora</button>
                  </div>
                </div>
              </div>

              {/* Aula de Yoga */}
              <div className="col-12 col-md-6 col-lg-4">
                <div className="card recompensa-card">
                  <div className="recompensa-thumb recompensa-thumb--teal">
                    <i className="fa-solid fa-brain"></i>
                  </div>
                  <div className="recompensa-info">
                    <h3 className="recompensa-nome">Aula de Yoga</h3>
                    <p className="recompensa-desc">1 aula experimental online ou presencial</p>
                    <div className="recompensa-hc">
                      <span className="fa-solid fa-coins"></span>
                      150 HC
                    </div>
                    <button className="btn recompensa-btn">Resgatar Agora</button>
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

export default Recompensas