-- Vista com só o nome e a foto de perfil (nunca o PSN nem outros dados)
-- de qualquer visitante — necessária porque a tabela "profiles" em si é
-- privada (só o dono vê a sua própria ficha). Sem esta vista, não
-- haveria forma de mostrar "quem escreveu este comentário" a mais
-- ninguém, incluindo a visitantes sem sessão iniciada a ler a página.
create or replace view public_profiles as
select id, username, avatar_url
from profiles;

grant select on public_profiles to anon, authenticated;


create table if not exists game_comments (
  id         uuid primary key default gen_random_uuid(),
  game_id    uuid not null references games(id) on delete cascade,
  user_id    uuid not null references auth.users(id) on delete cascade,
  body       text not null,
  created_at timestamptz not null default now()
);

alter table game_comments enable row level security;

-- Qualquer pessoa lê os comentários, mesmo sem sessão iniciada — tal como
-- já acontecia com os comentários de demonstração antes disto.
drop policy if exists "comentarios - leitura publica" on game_comments;
create policy "comentarios - leitura publica"
  on game_comments for select
  using (true);

drop policy if exists "comentarios - insercao propria" on game_comments;
create policy "comentarios - insercao propria"
  on game_comments for insert
  with check (auth.uid() = user_id);

-- Cada visitante pode apagar os seus próprios comentários, e os editores
-- da equipa podem apagar qualquer um (moderação).
drop policy if exists "comentarios - eliminacao propria ou editor" on game_comments;
create policy "comentarios - eliminacao propria ou editor"
  on game_comments for delete
  using (auth.uid() = user_id or is_editor());

grant select on game_comments to anon, authenticated;
grant insert, delete on game_comments to authenticated;
