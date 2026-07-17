-- =====================================================================
-- 10-favoritos.sql
--
-- Fase 2, passo 1 — Favoritos. Cada visitante pode guardar jogos como
-- favoritos; só ele consegue ver, adicionar ou remover os seus próprios
-- (ninguém, nem outros visitantes nem a equipa, vê a lista de outra
-- pessoa através da API).
--
-- Pré-requisito: já teres corrido 09-fundacao-visitantes.sql antes
-- deste (é de lá que vem o conceito de "visitante autenticado").
-- =====================================================================

create table if not exists favorites (
  user_id    uuid not null references auth.users(id) on delete cascade,
  -- Se esta linha der erro de "tipos incompatíveis" ao correr o script,
  -- troca "uuid" por "text" aqui (significa que o id de `games` foi
  -- criado como texto em vez de uuid) e corre de novo.
  game_id    uuid not null references games(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, game_id)
);

alter table favorites enable row level security;

drop policy if exists "favoritos - leitura propria" on favorites;
create policy "favoritos - leitura propria"
  on favorites for select
  using (auth.uid() = user_id);

drop policy if exists "favoritos - insercao propria" on favorites;
create policy "favoritos - insercao propria"
  on favorites for insert
  with check (auth.uid() = user_id);

drop policy if exists "favoritos - eliminacao propria" on favorites;
create policy "favoritos - eliminacao propria"
  on favorites for delete
  using (auth.uid() = user_id);

grant select, insert, delete on favorites to authenticated;
