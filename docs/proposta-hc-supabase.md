# Proposta: Health Coins no Supabase

> **Status:** proposta para o grupo. Nada disto foi executado no banco. O schema do Supabase é mantido por quem cuida da dock; este documento só sugere o SQL e o que mudaria no site.
>
> **Validação:** o SQL abaixo foi rodado num Postgres local (PGlite), depois do `schema.sql` da dock v7, com cenários de crédito da água (sem duplicar), missão de água com e sem meta, boas-vindas, resgate com e sem saldo e permissões (o usuário só lê os próprios movimentos, não escreve direto na tabela, e o `anon` não executa nada).

## O problema

Hoje as Health Coins (HC) e o XP ficam no `localStorage` do navegador (`wc_hc`, `wc_xp`, `wc_missoes_concluidas`, `wc_resgates`). Com o login por código, isso causa:

- **Outro aparelho, outro saldo:** a mesma conta no celular e no computador tem saldos diferentes.
- **Contas no mesmo navegador dividem o saldo:** sair e entrar com outra conta mantém as HC da anterior.
- **Limpar os dados do site zera tudo.**
- **O navegador decide quanto vale cada coisa:** as HC das missões e o preço das recompensas vêm do JSON do site, e qualquer um pode alterar pelo console.

As HC da água já são calculadas a partir do `painel()` (1 HC a cada 25 ml, tarefa 44), mas o crédito também é feito no navegador.

## A ideia

1. **Uma tabela de movimentos** (`hc_movimentos`): cada crédito ou gasto é uma linha. O saldo é a soma; o XP é a soma dos créditos (a regra do site: 1 XP por HC ganho, gastar não tira XP).
2. **Uma chave única por origem** (`user_id, origem, ref`): o mesmo crédito não entra duas vezes, mesmo que o site chame a função de novo.
3. **O banco credita a água** a partir de `dias.consumo_ml`, sem depender do navegador estar aberto na hora.
4. **Missões e recompensas com valores no banco** (`hc_missoes`, `hc_recompensas`): o site manda só o id, e o banco sabe quanto vale.
5. **Escrita só pelas funções** (`security definer`), como já é feito no `schema.sql` da dock: o usuário logado só lê os próprios movimentos.

## SQL proposto

Segue as convenções do `schema.sql` da dock v7: `wc_hoje()` para o dia em São Paulo, funções `security definer` que checam `auth.uid()`, RLS só com leitura e `grant execute` explícito no fim.

```sql
-- ============================================================================
--  HEALTH COINS (proposta) — rodar DEPOIS do schema.sql da dock v7
-- ============================================================================

-- Movimentos de HC: + crédito, - gasto. O saldo é a soma.
create table if not exists public.hc_movimentos (
  id       bigint generated always as identity primary key,
  user_id  uuid not null references auth.users on delete cascade,
  ts       timestamptz not null default now(),
  origem   text not null check (origem in ('agua', 'missao', 'resgate', 'boas_vindas', 'importacao')),
  ref      text not null,      -- agua: '2026-10-23' | missao: '2:2026-10-23' | resgate: código do voucher
  valor    integer not null,   -- positivo = crédito, negativo = gasto
  detalhe  jsonb,              -- ex.: { "recompensa": "kit-hidratacao", "nome": "Kit de Hidratação" }
  unique (user_id, origem, ref)
);
create index if not exists hc_movimentos_user_ts on public.hc_movimentos (user_id, ts desc);

-- Catálogos (os valores saem do navegador; o site manda só o id)
create table if not exists public.hc_missoes (
  id    integer primary key,   -- mesmo id de src/data/missoes-dashboard.json
  hc    integer not null check (hc > 0),
  tipo  text not null default 'normal' check (tipo in ('normal', 'bottle'))
);
create table if not exists public.hc_recompensas (
  id       text primary key,   -- mesmo id de src/data/recompensas.json
  preco    integer not null check (preco > 0),
  prefixo  text not null default 'RESG'
);

-- Valores de hoje do site (manter em sincronia com os JSON de src/data)
insert into public.hc_missoes (id, hc, tipo) values
  (1, 50, 'normal'), (2, 30, 'bottle'), (3, 40, 'normal'),
  (4, 30, 'normal'), (5, 500, 'normal'), (6, 20, 'normal')
on conflict (id) do update set hc = excluded.hc, tipo = excluded.tipo;
-- Preços de src/data/recompensas.json e prefixos do voucher (PREFIXOS_VOUCHER no AppContext)
insert into public.hc_recompensas (id, preco, prefixo) values
  ('consulta-nutricional', 500, 'NUTRI'),
  ('kit-hidratacao', 300, 'HIDRA'),
  ('desconto-academia', 800, 'ACAD'),
  ('massagem-relaxante', 1000, 'MASSA'),
  ('checkup-gratuito', 200, 'CHECK'),
  ('aula-yoga', 150, 'YOGA')
on conflict (id) do update set preco = excluded.preco, prefixo = excluded.prefixo;

-- RLS: cada usuário lê só os próprios movimentos; ninguém escreve direto
alter table public.hc_movimentos  enable row level security;
alter table public.hc_missoes     enable row level security;
alter table public.hc_recompensas enable row level security;
drop policy if exists hc_movimentos_sel on public.hc_movimentos;
create policy hc_movimentos_sel on public.hc_movimentos for select to authenticated using (user_id = auth.uid());
drop policy if exists hc_missoes_sel on public.hc_missoes;
create policy hc_missoes_sel on public.hc_missoes for select to authenticated using (true);
drop policy if exists hc_recompensas_sel on public.hc_recompensas;
create policy hc_recompensas_sel on public.hc_recompensas for select to authenticated using (true);
revoke all on public.hc_movimentos, public.hc_missoes, public.hc_recompensas from anon;
grant select on public.hc_movimentos, public.hc_missoes, public.hc_recompensas to authenticated;

-- Saldo e XP de um usuário (interna)
create or replace function public.wc_hc_resumo(p_user uuid) returns jsonb
language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'saldo', coalesce(sum(valor), 0),
    'xp',    coalesce(sum(valor) filter (where valor > 0), 0))
  from hc_movimentos where user_id = p_user
$$;

-- Saldo e XP do usuário logado
create or replace function public.hc_saldo() returns jsonb
language plpgsql stable security definer set search_path = public as $$
begin
  if auth.uid() is null then return jsonb_build_object('ok', false, 'erro', 'Entre na sua conta.'); end if;
  return jsonb_build_object('ok', true) || wc_hc_resumo(auth.uid());
end $$;

-- Credita a água dos últimos 7 dias: 1 HC a cada 25 ml de dias.consumo_ml.
-- Pode ser chamada quantas vezes quiser: só sobe o valor de cada dia, nunca duplica.
create or replace function public.hc_creditar_agua() returns jsonb
language plpgsql security definer set search_path = public as $$
declare u uuid := auth.uid();
begin
  if u is null then return jsonb_build_object('ok', false, 'erro', 'Entre na sua conta.'); end if;
  insert into hc_movimentos (user_id, origem, ref, valor)
  select u, 'agua', d.dia::text, floor(d.consumo_ml / 25)::int
    from dias d
   where d.user_id = u and d.dia >= wc_hoje() - 6 and floor(d.consumo_ml / 25) > 0
  on conflict (user_id, origem, ref)
  do update set valor = greatest(hc_movimentos.valor, excluded.valor), ts = now()
   where excluded.valor > hc_movimentos.valor;
  return jsonb_build_object('ok', true) || wc_hc_resumo(u);
end $$;

-- Conclui uma missão do dia (uma vez por dia). A missão de água ('bottle')
-- só conclui se o consumo de hoje já alcançou a meta.
create or replace function public.concluir_missao(p_missao integer) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  u uuid := auth.uid();
  m hc_missoes%rowtype;
  h dias%rowtype;
  n integer;
begin
  if u is null then return jsonb_build_object('ok', false, 'erro', 'Entre na sua conta.'); end if;
  select * into m from hc_missoes where id = p_missao;
  if not found then return jsonb_build_object('ok', false, 'erro', 'Missão não encontrada.'); end if;
  if m.tipo = 'bottle' then
    select * into h from dias where user_id = u and dia = wc_hoje();
    if not found or h.consumo_ml < h.meta_ml then
      return jsonb_build_object('ok', false, 'erro', 'A meta de água de hoje ainda não foi batida.');
    end if;
  end if;
  insert into hc_movimentos (user_id, origem, ref, valor)
  values (u, 'missao', p_missao || ':' || wc_hoje(), m.hc)
  on conflict (user_id, origem, ref) do nothing;
  get diagnostics n = row_count;
  return jsonb_build_object('ok', true, 'creditado', n > 0, 'hc', m.hc) || wc_hc_resumo(u);
end $$;

-- Resgata uma recompensa: confere o saldo, debita e devolve o código do voucher.
-- A trava por usuário evita gastar o mesmo saldo em dois resgates simultâneos.
create or replace function public.resgatar_recompensa(p_recompensa text) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  u uuid := auth.uid();
  r hc_recompensas%rowtype;
  saldo integer;
  cod text;
  tentativa integer := 0;
begin
  if u is null then return jsonb_build_object('ok', false, 'erro', 'Entre na sua conta.'); end if;
  select * into r from hc_recompensas where id = p_recompensa;
  if not found then return jsonb_build_object('ok', false, 'erro', 'Recompensa não encontrada.'); end if;
  perform pg_advisory_xact_lock(hashtext('hc:' || u::text));
  select coalesce(sum(valor), 0) into saldo from hc_movimentos where user_id = u;
  if saldo < r.preco then
    return jsonb_build_object('ok', false, 'erro', 'Saldo de HC insuficiente.', 'saldo', saldo);
  end if;
  loop
    tentativa := tentativa + 1;
    cod := 'WC-' || r.prefixo || '-' || extract(year from now() at time zone wc_tz())::int
           || '-' || lpad(floor(random() * 10000)::int::text, 4, '0');
    begin
      insert into hc_movimentos (user_id, origem, ref, valor, detalhe)
      values (u, 'resgate', cod, -r.preco, jsonb_build_object('recompensa', r.id));
      exit;
    exception when unique_violation then
      if tentativa >= 5 then raise; end if;
    end;
  end loop;
  return jsonb_build_object('ok', true, 'codigo', cod, 'preco', r.preco) || wc_hc_resumo(u);
end $$;

-- Saldo inicial de uma conta nova (o site dá 1300 HC no modo demonstração).
-- Uma vez por conta; chamar depois do primeiro login. Valor a decidir pelo grupo.
create or replace function public.hc_boas_vindas() returns jsonb
language plpgsql security definer set search_path = public as $$
declare u uuid := auth.uid();
begin
  if u is null then return jsonb_build_object('ok', false, 'erro', 'Entre na sua conta.'); end if;
  insert into hc_movimentos (user_id, origem, ref, valor)
  values (u, 'boas_vindas', 'conta', 1300)
  on conflict (user_id, origem, ref) do nothing;
  return jsonb_build_object('ok', true) || wc_hc_resumo(u);
end $$;

-- Funções novas ganham "execute" para public por padrão; o revoke do schema.sql
-- da dock só valeu para as que já existiam. Por isso o revoke explícito aqui.
revoke execute on function public.wc_hc_resumo(uuid), public.hc_saldo(), public.hc_creditar_agua(),
                          public.concluir_missao(integer), public.resgatar_recompensa(text),
                          public.hc_boas_vindas()
  from public, anon, authenticated;
grant execute on function public.hc_saldo(), public.hc_creditar_agua(), public.concluir_missao(integer),
                         public.resgatar_recompensa(text), public.hc_boas_vindas()
  to authenticated;
```

### Por que assim

- **A água não duplica:** o crédito de cada dia é uma linha só (`origem = 'agua'`, `ref = dia`). Chamar `hc_creditar_agua()` de novo só aumenta o valor se o consumo subiu. A água de ontem bebida com o site fechado entra na próxima chamada (janela de 7 dias).
- **A missão não duplica:** `ref = '<id>:<dia>'` com `on conflict do nothing`. Isso substitui o `wc_missoes_concluidas` do navegador.
- **A missão de água é conferida no banco:** só conclui se `dias.consumo_ml >= dias.meta_ml`.
- **O resgate não fica negativo:** a trava (`pg_advisory_xact_lock`) impede dois resgates simultâneos de gastarem o mesmo saldo.
- **Histórico completo:** a Carteira pode listar os movimentos (créditos e resgates) direto da tabela, em vez do `wc_resgates` do navegador.

### Alternativa: crédito da água dentro do `dock_sync`

Em vez de o site chamar `hc_creditar_agua()`, a função `wc_processar` do `schema.sql` poderia creditar a cada gole. Seria o mais correto (as HC entram mesmo sem ninguém abrir o site), mas mexe no código da dock. Por isso a proposta deixa a água numa função separada e idempotente, que o site chama.

## O que mudaria no site

Só na **conta real**. O modo demonstração continua todo no `localStorage`.

| Hoje (navegador) | Com a proposta |
|---|---|
| `totalHC` e `xp` lidos de `wc_hc` e `wc_xp` | `rpc('hc_saldo')` ao entrar e depois de cada ação (ou um campo `hc` dentro do `painel()`, se o grupo topar alterar a função) |
| `useCreditoAgua` credita a diferença com `wc_hc_agua_<dia>` | chama `rpc('hc_creditar_agua')` quando o painel traz consumo novo; o controle no navegador some |
| `concluirMissao(missao)` soma `missao.hc` | `rpc('concluir_missao', { p_missao: missao.id })`; o valor vem do banco |
| `resgatarRecompensa(recompensa)` debita e gera o código no navegador | `rpc('resgatar_recompensa', { p_recompensa: recompensa.id })` devolve o código |
| Carteira lê `wc_resgates` | lê `hc_movimentos` (`select` do próprio usuário) |
| Conta nova começa com 1300 HC (padrão do `AppContext`) | `rpc('hc_boas_vindas')` uma vez por conta |

O `AppContext` passaria a escolher entre as duas fontes pelo `contaReal`, como o `useHidratacao` já faz com a água.

## Decisões para o grupo

1. **Saldo inicial:** quantas HC uma conta nova ganha (hoje o site mostra 1300 no demo)? Ou começa em 0?
2. **Água no `dock_sync` ou no site:** creditar dentro do `wc_processar` (mais correto) ou pela função `hc_creditar_agua()` (não mexe na dock)?
3. **Saldo atual dos navegadores:** importar o saldo do `localStorage` uma vez por conta? Como o navegador não é confiável, uma importação teria que ter teto, ou não existir: todo mundo recomeça do saldo inicial.
4. **Catálogos:** manter `hc_missoes` e `hc_recompensas` em sincronia com os JSON do site à mão, ou o site passar a ler o catálogo do banco?
