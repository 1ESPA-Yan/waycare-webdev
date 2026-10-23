import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { useHidratacao } from '../hooks/useHidratacao'
import { useTara } from '../hooks/useTara'
import { rpc } from '../lib/supabase'
import Topbar from '../components/Topbar'
import Card from '../components/Card'
import Button from '../components/Button'
import Icone from '../components/Icone'
import '../styles/vincular-dock.css'

// Um passo do primeiro uso: número (ou check quando feito), título e conteúdo
function Passo({ numero, titulo, feito, atual, children }) {
  return (
    <Card as="li" className={`vincular-passo ${atual ? 'vincular-passo--atual' : ''} ${feito ? 'vincular-passo--feito' : ''}`}>
      <span className="vincular-passo-num" aria-hidden="true">
        {feito ? <Icone nome="fa-check" /> : numero}
      </span>
      <div className="vincular-passo-corpo">
        <h2 className="vincular-passo-titulo">
          {titulo}
          {feito && <span className="sr-only"> (concluído)</span>}
        </h2>
        {children}
      </div>
    </Card>
  )
}

// Primeiro uso da conta real: perfil -> vínculo da dock -> tara
function VincularDock() {
  const { sairDaConta } = useApp()
  const { modo, perfil, dock, meta, carregando, recarregar } = useHidratacao()
  const tara = useTara()
  const [codigo, setCodigo] = useState('')
  const [ocupado, setOcupado] = useState(false)
  const [erro, setErro] = useState('')

  const vincular = async (e) => {
    e.preventDefault()
    setOcupado(true)
    setErro('')
    try {
      // O erro já vem do banco em português (código inválido, dock de outra conta...)
      await rpc('vincular_dock', { p_codigo: codigo })
      await recarregar()
      setCodigo('')
    } catch (falha) {
      setErro(falha.message)
    } finally {
      setOcupado(false)
    }
  }

  const perfilOk = Boolean(perfil?.peso_kg)
  const dockOk = Boolean(dock)
  const taraOk = Boolean(dock?.tarada)
  const tudoPronto = perfilOk && dockOk && taraOk

  return (
    <>
      <Topbar icone="fa-wifi" titulo="Conectar a dock" subtitulo="Três passos para medir a água da sua garrafa" />

      <section id="page-content" className="page-transition vincular-pagina">

        {modo === 'demo' && (
          <Card className="vincular-demo">
            <Icone nome="fa-compass" className="vincular-demo-icone" />
            <p>No modo demonstração não há dock de verdade: os goles são simulados na WayCare Bottle.</p>
            <p>Para conectar a sua dock, entre com a sua conta.</p>
            <div className="flex flex-wrap gap-3">
              <Button to="/" replace onClick={sairDaConta}>Entrar com minha conta</Button>
              <Button to="/waycare-bottle" variante="fantasma">Ir para a WayCare Bottle</Button>
            </div>
          </Card>
        )}

        {carregando && (
          <p className="vincular-carregando" role="status">
            <Icone nome="fa-circle-notch" girar /> Carregando os dados da sua conta…
          </p>
        )}

        {modo && modo !== 'demo' && (
          <>
            {tudoPronto && (
              <div className="vincular-pronto" role="status">
                <Icone nome="fa-circle-check" />
                Tudo pronto! A dock já mede o que você bebe.
                <Link to="/waycare-bottle" className="vincular-link">Ver na WayCare Bottle</Link>
              </div>
            )}

            <ol className="vincular-passos">
              <Passo numero={1} titulo="Complete seu perfil" feito={perfilOk} atual={!perfilOk}>
                {perfilOk ? (
                  <p className="vincular-texto">Sua meta de hoje é {meta} ml, calculada pelo seu peso, atividade e clima.</p>
                ) : (
                  <>
                    <p className="vincular-texto">Peso, atividade física e cidade definem a sua meta diária de água.</p>
                    <Button to="/perfil#meta-hidratacao" tamanho="sm">
                      <Icone nome="fa-user" /> Completar perfil
                    </Button>
                  </>
                )}
              </Passo>

              <Passo numero={2} titulo="Vincule a dock" feito={dockOk} atual={perfilOk && !dockOk}>
                {dockOk ? (
                  <p className="vincular-texto">
                    Dock <strong>{dock.apelido || dock.id}</strong> vinculada à sua conta
                    {dock.online ? ' e conectada.' : '. Ela ainda não deu sinal nos últimos minutos.'}
                  </p>
                ) : (
                  <>
                    <ol className="vincular-instrucoes">
                      <li>Ligue a dock. Se ela ainda não tem Wi-Fi, a luz fica azul e aparece a rede <strong>WayDock-…</strong> no celular.</li>
                      <li>Conecte o celular nessa rede. A página da dock abre sozinha (se não abrir, acesse 192.168.4.1).</li>
                      <li>Cadastre o Wi-Fi da sua casa. Na mesma página aparece o <strong>código da dock</strong>, com 6 letras.</li>
                      <li>Volte para a internet normal e digite o código aqui.</li>
                    </ol>

                    <form className="vincular-form" noValidate onSubmit={vincular}>
                      <label className="input-label" htmlFor="vincular-codigo">Código da dock</label>
                      <div className="vincular-form-linha">
                        <input
                          id="vincular-codigo"
                          className={`input-field vincular-codigo ${erro ? 'input-invalido' : ''}`}
                          autoCapitalize="characters"
                          autoComplete="off"
                          maxLength={6}
                          placeholder="K7MPQ2"
                          aria-invalid={!!erro}
                          aria-describedby={erro ? 'vincular-erro' : 'vincular-dica'}
                          value={codigo}
                          onChange={(e) => { setCodigo(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '')); setErro('') }}
                        />
                        <Button type="submit" disabled={ocupado || codigo.length !== 6}>
                          {ocupado ? 'Vinculando…' : 'Vincular dock'}
                        </Button>
                      </div>
                      {erro && <p id="vincular-erro" className="input-erro-msg" role="alert">{erro}</p>}
                      <p id="vincular-dica" className="vincular-dica">
                        O código só funciona depois que a dock se conectou à internet pelo menos uma vez.
                        Cada conta tem uma dock só.
                      </p>
                    </form>
                  </>
                )}
              </Passo>

              <Passo numero={3} titulo="Zere a balança" feito={taraOk} atual={dockOk && !taraOk}>
                {taraOk ? (
                  <p className="vincular-texto">Balança zerada. Cada gole tirado da garrafa já entra na sua meta.</p>
                ) : (
                  <>
                    <p className="vincular-texto">
                      Coloque a garrafa <strong>vazia</strong> na dock e zere a balança. Enquanto isso não for feito,
                      a luz da dock fica ciano pulsando e os goles não são contados.
                    </p>
                    <Button tamanho="sm" onClick={tara.pedir} disabled={!tara.disponivel || tara.enviando || tara.pendente}>
                      <Icone nome="fa-scale-balanced" />
                      {tara.enviando ? 'Enviando…' : tara.pendente ? 'Aguardando a dock…' : 'Zerar balança'}
                    </Button>
                    {tara.mensagem && <p className="vincular-texto" role="status">{tara.mensagem}</p>}
                    {tara.erro && <p className="input-erro-msg" role="alert">{tara.erro}</p>}
                  </>
                )}
              </Passo>
            </ol>
          </>
        )}
      </section>
    </>
  )
}

export default VincularDock
