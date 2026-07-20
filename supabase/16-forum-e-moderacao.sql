-- ---------------------------------------------------------------------
-- 1. Link do PSN passa a ser opcional de mostrar publicamente.
-- ---------------------------------------------------------------------
alter table profiles add column if not exists psn_public boolean not null default false;

create or replace view public_profiles as
select
  id,
  username,
  avatar_url,
  case when psn_public then psn_url else null end as psn_url
from profiles;

grant select on public_profiles to anon, authenticated;


-- ---------------------------------------------------------------------
-- 2. Banimento — guardado numa tabela À PARTE de "profiles", de propósito.
--    Se estivesse na mesma tabela que o visitante já pode editar (nome,
--    foto, etc.), a própria pessoa banida conseguiria desligar o seu
--    banimento sozinha. Aqui, ninguém escreve diretamente nesta tabela
--    — só as duas funções abaixo (ban_user / unban_user), que confirmam
--    sempre que quem chama é um editor.
-- ---------------------------------------------------------------------
create table if not exists user_bans (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  reason     text,
  banned_by  uuid references auth.users(id),
  banned_at  timestamptz not null default now()
);

alter table user_bans enable row level security;

-- Um visitante só vê o SEU PRÓPRIO estado de banimento (para lhe
-- podermos mostrar o motivo no perfil dele); editores veem todos.
drop policy if exists "banimentos - leitura propria ou editor" on user_bans;
create policy "banimentos - leitura propria ou editor"
  on user_bans for select
  using (auth.uid() = user_id or is_editor());

-- Sem nenhuma política de insert/update/delete: ninguém escreve aqui
-- diretamente, nem editores — só através das funções abaixo.
grant select on user_bans to authenticated;

create or replace function is_user_banned(check_user_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (select 1 from user_bans where user_id = check_user_id);
$$;

create or replace function ban_user(target_user_id uuid, ban_reason text default null)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not is_editor() then
    raise exception 'Só editores podem banir contas.';
  end if;

  insert into user_bans (user_id, reason, banned_by)
  values (target_user_id, ban_reason, auth.uid())
  on conflict (user_id) do update set reason = excluded.reason, banned_at = now();
end;
$$;

create or replace function unban_user(target_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not is_editor() then
    raise exception 'Só editores podem levantar banimentos.';
  end if;

  delete from user_bans where user_id = target_user_id;
end;
$$;

grant execute on function ban_user(uuid, text) to authenticated;
grant execute on function unban_user(uuid) to authenticated;


-- ---------------------------------------------------------------------
-- 3. Uma pessoa banida deixa de conseguir publicar comentários novos
--    (continua a poder ler tudo e a navegar no site normalmente).
-- ---------------------------------------------------------------------
drop policy if exists "comentarios - insercao propria" on game_comments;
create policy "comentarios - insercao propria"
  on game_comments for insert
  with check (auth.uid() = user_id and not is_user_banned(auth.uid()));


-- ---------------------------------------------------------------------
-- 4. Fóruns — tópicos e respostas.
-- ---------------------------------------------------------------------
create table if not exists forum_threads (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  -- Opcional: liga o tópico a um jogo específico (ex.: "ajuda com X").
  game_id    uuid references games(id) on delete set null,
  title      text not null,
  body       text not null,
  created_at timestamptz not null default now()
);

alter table forum_threads enable row level security;

drop policy if exists "topicos - leitura publica" on forum_threads;
create policy "topicos - leitura publica"
  on forum_threads for select
  using (true);

drop policy if exists "topicos - insercao propria" on forum_threads;
create policy "topicos - insercao propria"
  on forum_threads for insert
  with check (auth.uid() = user_id and not is_user_banned(auth.uid()));

drop policy if exists "topicos - eliminacao propria ou editor" on forum_threads;
create policy "topicos - eliminacao propria ou editor"
  on forum_threads for delete
  using (auth.uid() = user_id or is_editor());

grant select on forum_threads to anon, authenticated;
grant insert, delete on forum_threads to authenticated;


create table if not exists forum_replies (
  id         uuid primary key default gen_random_uuid(),
  thread_id  uuid not null references forum_threads(id) on delete cascade,
  user_id    uuid not null references auth.users(id) on delete cascade,
  body       text not null,
  created_at timestamptz not null default now()
);

alter table forum_replies enable row level security;

drop policy if exists "respostas - leitura publica" on forum_replies;
create policy "respostas - leitura publica"
  on forum_replies for select
  using (true);

drop policy if exists "respostas - insercao propria" on forum_replies;
create policy "respostas - insercao propria"
  on forum_replies for insert
  with check (auth.uid() = user_id and not is_user_banned(auth.uid()));

drop policy if exists "respostas - eliminacao propria ou editor" on forum_replies;
create policy "respostas - eliminacao propria ou editor"
  on forum_replies for delete
  using (auth.uid() = user_id or is_editor());

grant select on forum_replies to anon, authenticated;
grant insert, delete on forum_replies to authenticated;
