-- =====================================================================
-- 09-fundacao-visitantes.sql
--
-- Fase 2, passo 0 — separar "editor da equipa" de "visitante autenticado"
-- ANTES de existir qualquer registo público no site.
--
-- Até agora, qualquer conta autenticada tinha permissão de escrita em
-- TODAS as tabelas de conteúdo (RLS: auth.role() = 'authenticated').
-- Isto era seguro porque só a equipa tinha contas. Assim que visitantes
-- passarem a poder criar conta, isso deixa de ser verdade — por isso
-- este script troca essa regra por "só quem estiver na tabela `editors`
-- pode escrever", e cria a tabela `profiles` onde vão viver os dados
-- dos visitantes.
--
-- IMPORTANTE — correr por esta ordem, sem saltar passos:
--   1. Secção 1 (tabela editors) — não restringe nada ainda, é segura.
--   2. Secção 2 — AQUI TENS DE INSERIR O TEU PRÓPRIO EMAIL (e o de
--      qualquer outro editor da equipa). Sem isto, o próximo passo
--      tranca-te a ti mesmo fora do /admin.
--   3. Secção 3 (tabela profiles) — também segura, só cria coisas novas.
--   4. Secção 4 — esta é que troca a regra de segurança nas 8 tabelas
--      de conteúdo. Só correr depois de confirmar a secção 2.
-- =====================================================================


-- ---------------------------------------------------------------------
-- 1. Tabela `editors` — lista de quem pode escrever no /admin.
-- ---------------------------------------------------------------------
create table if not exists editors (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table editors enable row level security;

drop policy if exists "editors podem ver a lista de editores" on editors;
create policy "editors podem ver a lista de editores"
  on editors for select
  using (exists (select 1 from editors e where e.user_id = auth.uid()));

grant select on editors to authenticated;

-- Função auxiliar reutilizada pelas políticas das 8 tabelas de conteúdo,
-- para não repetir a mesma subquery em cada uma.
create or replace function is_editor()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (select 1 from editors where user_id = auth.uid());
$$;


-- ---------------------------------------------------------------------
-- 2. ⚠️  PASSO MANUAL — troca pelo(s) email(s) reais da equipa.
--    Corre uma linha destas por cada pessoa que já tem login no /admin.
--    Confirma no fim com o "select" que aparece a seguir.
-- ---------------------------------------------------------------------
insert into editors (user_id)
select id from auth.users where email = 'andrefgm13@gmail.com'
on conflict (user_id) do nothing;

insert into editors (user_id)
select id from auth.users where email = 'gjca01@hotmail.com'
on conflict (user_id) do nothing;

insert into editors (user_id)
select id from auth.users where email = 'joao_14_ramos@hotmail.com'
on conflict (user_id) do nothing;

insert into editors (user_id)
select id from auth.users where email = 'pk95@live.com.pt'
on conflict (user_id) do nothing;

insert into editors (user_id)
select id from auth.users where email = 'zema7777@hotmail.com'
on conflict (user_id) do nothing;

-- Confirma que ficou lá o número de pessoas que esperavas antes de continuar:
select u.email, e.created_at
from editors e
join auth.users u on u.id = e.user_id;


-- ---------------------------------------------------------------------
-- 3. Tabela `profiles` — um perfil por visitante, criado automaticamente
--    assim que alguém se regista (ver trigger mais abaixo).
-- ---------------------------------------------------------------------
create table if not exists profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  -- Sem "unique" por agora, de propósito: ainda não há nenhum sítio no
  -- site onde dois visitantes com o mesmo nome se cruzem (perfis
  -- públicos, rankings de comunidade, etc.), e é mais fácil adicionar
  -- essa regra mais tarde do que lidar agora com um registo a falhar
  -- de forma pouco clara por causa de um nome repetido.
  username   text,
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;

drop policy if exists "profiles - leitura propria" on profiles;
create policy "profiles - leitura propria"
  on profiles for select
  using (auth.uid() = id);

drop policy if exists "profiles - atualizacao propria" on profiles;
create policy "profiles - atualizacao propria"
  on profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

grant select, update on profiles to authenticated;

-- Cria o perfil sozinho, assim que uma conta nova aparece em auth.users
-- (ou seja, assim que alguém completa o registo em /registo).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, username)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'username', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


-- ---------------------------------------------------------------------
-- 4. ⚠️  Troca a regra de segurança nas 8 tabelas de conteúdo.
--    SÓ CORRER DEPOIS DE CONFIRMAR A SECÇÃO 2.
--    A partir daqui: qualquer pessoa continua a poder LER o conteúdo
--    (isso não muda), mas só quem estiver em `editors` consegue
--    criar, editar ou apagar.
-- ---------------------------------------------------------------------
do $$
declare
  tbl text;
  pol record;
begin
  foreach tbl in array array[
    'games', 'game_details', 'ranking_categories', 'glossary_terms',
    'faq_items', 'team_members', 'videos', 'now_playing'
  ]
  loop
    -- Remove TODAS as políticas antigas desta tabela, sejam quais forem
    -- os nomes que tinham (foram criadas em sessões diferentes, com
    -- nomes diferentes) — evita que uma política antiga mais permissiva
    -- fique "por baixo" a anular a nova.
    for pol in
      select policyname from pg_policies
      where schemaname = 'public' and tablename = tbl
    loop
      execute format('drop policy %I on %I', pol.policyname, tbl);
    end loop;

    -- Leitura continua pública (site continua a funcionar para visitantes).
    execute format('create policy "leitura publica" on %I for select using (true)', tbl);

    -- Escrita passa a exigir estar na tabela `editors`.
    execute format(
      'create policy "insercao so editores" on %I for insert with check (is_editor())', tbl
    );
    execute format(
      'create policy "atualizacao so editores" on %I for update using (is_editor()) with check (is_editor())', tbl
    );
    execute format(
      'create policy "eliminacao so editores" on %I for delete using (is_editor())', tbl
    );
  end loop;
end $$;
