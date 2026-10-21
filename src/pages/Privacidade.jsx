import DocumentoLegal from '../components/DocumentoLegal'

function Privacidade() {
  return (
    <DocumentoLegal titulo="Política de Privacidade" atualizadoEm="outubro de 2026">
      <h2>1. Quais dados usamos</h2>
      <ul>
        <li>Nome e e-mail informados no cadastro.</li>
        <li>Humor do dia, missões concluídas, Health Coins e resgates.</li>
        <li>
          Para a meta de hidratação: peso, sexo, nível de atividade física e cidade (usada para
          consultar a temperatura local).
        </li>
        <li>Leituras da dock: peso da garrafa, consumo do dia e sequência de dias com a meta batida.</li>
      </ul>

      <h2>2. Onde ficam guardados</h2>
      <p>
        Os dados do app ficam salvos no seu navegador. Quando a dock está conectada, o perfil de
        hidratação e as leituras da garrafa também ficam no servidor da dock, para calcular a sua
        meta e o seu consumo.
      </p>

      <h2>3. Para que usamos</h2>
      <p>
        Para calcular sua meta de hidratação, acompanhar seu progresso, liberar missões e conquistas
        e gerar descobertas sobre os seus hábitos. Não vendemos seus dados.
      </p>

      <h2>4. Seus direitos</h2>
      <p>
        Você pode pedir acesso, correção ou exclusão dos seus dados, conforme a Lei Geral de Proteção
        de Dados (LGPD). Os dados salvos no navegador são apagados ao limpar os dados do site.
      </p>
    </DocumentoLegal>
  )
}

export default Privacidade
