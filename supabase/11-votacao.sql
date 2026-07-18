create table if not exists voting_candidates (
  id         uuid primary key default gen_random_uuid(),
  game_id    uuid not null references games(id) on delete cascade,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique (game_id)
);

alter table voting_candidates enable row level security;

drop policy if exists "candidatos - leitura publica" on voting_candidates;
create policy "candidatos - leitura publica"
  on voting_candidates for select
  using (true);

drop policy if exists "candidatos - escrita so editores" on voting_candidates;
create policy "candidatos - escrita so editores"
  on voting_candidates for all
  using (is_editor())
  with check (is_editor());

grant select on voting_candidates to anon, authenticated;
grant insert, update, delete on voting_candidates to authenticated;


create table if not exists votes (
  user_id      uuid not null references auth.users(id) on delete cascade,
  candidate_id uuid not null references voting_candidates(id) on delete cascade,
  created_at   timestamptz not null default now(),
  primary key (user_id, candidate_id)
);

alter table votes enable row level security;

-- Cada visitante só consegue ver os SEUS PRÓPRIOS votos (tal como já
-- acontece com os favoritos) — ninguém consegue, através da tabela,
-- descobrir em quem outra pessoa votou.
drop policy if exists "votos - leitura propria" on votes;
create policy "votos - leitura propria"
  on votes for select
  using (auth.uid() = user_id);

drop policy if exists "votos - insercao propria" on votes;
create policy "votos - insercao propria"
  on votes for insert
  with check (auth.uid() = user_id);

drop policy if exists "votos - eliminacao propria" on votes;
create policy "votos - eliminacao propria"
  on votes for delete
  using (auth.uid() = user_id);

grant select, insert, delete on votes to authenticated;

-- Função separada, só para o TOTAL de votos por candidato (sem expor
-- quem votou em quê) — esta sim, pode ser lida por qualquer visitante,
-- mesmo sem sessão, para mostrar os resultados publicamente.
create or replace function get_vote_counts()
returns table (candidate_id uuid, votes_count bigint)
language sql
security definer
set search_path = public
stable
as $$
  select candidate_id, count(*) as votes_count
  from votes
  group by candidate_id;
$$;

grant execute on function get_vote_counts() to anon, authenticated;
