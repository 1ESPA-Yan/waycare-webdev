# 💚 WayCare — Jornada Gamificada do Cuidado Contínuo

> Projeto acadêmico desenvolvido para o **Challenge Care Plus** — FIAP, 1º ano de Engenharia de Software.
> Aplicação web de saúde gamificada que transforma hábitos saudáveis em missões, recompensas e conquistas.

---

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Estrutura de Pastas](#estrutura-de-pastas)
- [Pré-requisitos](#pré-requisitos)
- [Instalação e Execução](#instalação-e-execução)
- [Páginas da Aplicação](#páginas-da-aplicação)
- [Design System](#design-system)
- [Integrantes](#integrantes)

---

## Sobre o Projeto

O **WayCare** é uma plataforma de saúde gamificada desenvolvida em parceria com a **Care Plus** como parte do Challenge FIAP. O objetivo é incentivar beneficiários a adotarem hábitos saudáveis por meio de trilhas personalizadas, missões diárias, conquistas e um sistema de recompensas com **Health Coins (HC)**.

O projeto foi desenvolvido em duas entregas principais:

- **Entrega 1 :** Prototipagem em HTML + CSS + Bootstrap + JavaScript Vanilla
- **Entrega 2 :** Migração completa para **React + Vite**, com Context API, roteamento, localStorage e integração entre componentes

---

## Funcionalidades

- 🔐 **Autenticação** — Login e Cadastro com validação de campos, indicador de força de senha e fluxo multi-step
- 🏠 **Dashboard** — Visão geral das missões do dia, trilha ativa, descobertas e banner de recompensas
- 🛤️ **Trilhas de Bem-estar** — Cards expansíveis com painel de missões por trilha, filtros por categoria e busca em tempo real
- 🏆 **Conquistas** — Progresso visual de conquistas desbloqueadas e bloqueadas
- 💡 **Descobertas** — Insights personalizados gerados com base nos hábitos do usuário
- 🎁 **Recompensas** — Catálogo de recompensas com filtros por categoria
- 👤 **Perfil** — Informações do usuário, estatísticas e conquistas recentes
- ⚙️ **Configurações** — Gerenciamento de conta, privacidade e preferências
- 💧 **WayCare Bottle** — Simulação do sensor IoT da garrafa inteligente com monitoramento de hidratação em tempo real
- 💰 **Carteira** — Saldo de Health Coins, histórico de ganhos e gráfico semanal
- 🔔 **Notificações** — Central de notificações da plataforma
- ❌ **Página 404** — Página de erro personalizada com navegação de volta

### Funcionalidades Técnicas

- **Estado global** com Context API — Health Coins, garrafa e usuário sincronizados em todas as páginas
- **Persistência de dados** com `localStorage` — nome e e-mail do usuário mantidos entre sessões
- **Transições suaves** entre páginas com animação CSS
- **Responsividade** completa para Desktop, Tablet e Mobile
- **Sidebar dinâmica** com item ativo detectado por rota e widget da garrafa atualizado em tempo real

---

## Tecnologias Utilizadas

| Tecnologia | Versão | Uso |
|---|---|---|
| [React](https://react.dev/) | 18+ | Biblioteca principal de UI |
| [Vite](https://vitejs.dev/) | 5+ | Ferramenta de build e dev server |
| [React Router DOM](https://reactrouter.com/) | 6+ | Roteamento entre páginas |
| [Bootstrap](https://getbootstrap.com/) | 5.3.3 | Grid, utilitários e componentes |
| [Font Awesome](https://fontawesome.com/) | 6.5.0 | Biblioteca de ícones |
| CSS Custom Properties | — | Design System com variáveis globais |
| Context API | — | Gerenciamento de estado global |
| localStorage | — | Persistência de dados do usuário |

---

## Estrutura de Pastas

```
waycare-react/
├── public/
│   └── images/
│       └── LogoWayCare.png
├── src/
│   ├── components/
│   │   ├── GarrafaAnimada.jsx     # SVG animado da WayCare Bottle
│   │   └── Sidebar.jsx            # Navegação lateral com widget da garrafa
│   ├── context/
│   │   └── AppContext.jsx         # Estado global (HC, garrafa, usuário)
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Cadastro.jsx
│   │   ├── Onboarding.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Trilhas.jsx
│   │   ├── Conquistas.jsx
│   │   ├── Descobertas.jsx
│   │   ├── Recompensas.jsx
│   │   ├── Perfil.jsx
│   │   ├── Configuracoes.jsx
│   │   ├── WaycareBottle.jsx
│   │   ├── Carteira.jsx
│   │   ├── Notificacoes.jsx
│   │   └── NotFound.jsx
│   ├── styles/
│   │   ├── global.css             # Design System principal
│   │   ├── auth.css
│   │   ├── dashboard.css
│   │   ├── trilhas.css
│   │   ├── conquistas.css
│   │   ├── descobertas.css
│   │   ├── recompensas.css
│   │   ├── perfil.css
│   │   ├── configuracoes.css
│   │   ├── waycare-bottle.css
│   │   ├── carteira.css
│   │   ├── notificacoes.css
│   │   └── notfound.css
│   ├── App.jsx                    # Roteamento principal
│   └── main.jsx                   # Ponto de entrada
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

---

## Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:

- **[Node.js](https://nodejs.org/)** — versão 18 ou superior
- **[npm](https://www.npmjs.com/)** — versão 9 ou superior (já vem com o Node.js)

Para verificar se já estão instalados, execute no terminal:

```bash
node --version
npm --version
```

---

## Instalação e Execução

### 1. Clone ou extraia o projeto

**Via Git:**
```bash
git clone https://github.com/1ESPA-Yan/waycare-webdev.git
cd waycare-webdev
```

**Via ZIP:**
Extraia o arquivo `.zip` recebido e acesse a pasta pelo terminal:
```bash
cd waycare-webdev
```

> ⚠️ A pasta `node_modules` não está incluída no ZIP. Execute o passo 2 para instalá-la.

### 2. Instale as dependências

```bash
npm install
```

Este comando instala todas as dependências listadas no `package.json`, incluindo React, Vite e React Router DOM.

### 3. Execute em modo de desenvolvimento

```bash
npm run dev
```

Após executar, o terminal exibirá algo como:

```
  VITE v5.x.x  ready in Xms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

Acesse **http://localhost:5173** no navegador. A aplicação abrirá na página de **Login**.

---

## Páginas da Aplicação

| Rota | Página | Descrição |
|---|---|---|
| `/` | Login | Entrada na aplicação |
| `/cadastro` | Cadastro | Criação de conta (3 passos) |
| `/onboarding` | Onboarding | Boas-vindas e aceite de termos |
| `/dashboard` | Dashboard | Página inicial do app |
| `/trilhas` | Trilhas | Trilhas de bem-estar com missões |
| `/conquistas` | Conquistas | Conquistas do usuário |
| `/descobertas` | Descobertas | Insights personalizados |
| `/recompensas` | Recompensas | Catálogo de recompensas |
| `/perfil` | Perfil | Dados e estatísticas do usuário |
| `/configuracoes` | Configurações | Preferências da conta |
| `/waycare-bottle` | WayCare Bottle | Monitoramento IoT de hidratação |
| `/carteira` | Carteira | Saldo e histórico de Health Coins |
| `/notificacoes` | Notificações | Central de notificações |
| `*` | 404 | Página não encontrada |

---

## Design System

O projeto utiliza um Design System próprio definido em `src/styles/global.css` com variáveis CSS que garantem consistência visual em toda a aplicação.

### Cores principais

| Variável | Valor | Uso |
|---|---|---|
| `--color-primary` | `#1c9770` | Verde principal — botões, destaques |
| `--color-hc` | `#f5a623` | Dourado — Health Coins |
| `--color-bg` | `#f5f5f5` | Fundo da aplicação |
| `--color-surface` | `#ffffff` | Fundo dos cards |
| `--color-error` | `#e53935` | Vermelho — erros e alertas |

---

## Integrantes

| Nome | RM |
|---|---|
| João Victor Melo Santos | RM 566640 |
| Gustavo Atsuyuki Hiruo | RM 567625 |
| Gustavo Macedo Daniel | RM 567594 |
| Yan Lucas Gonçalves da Silva | RM 567046 |

---

> Desenvolvido para o Challenge Care Plus