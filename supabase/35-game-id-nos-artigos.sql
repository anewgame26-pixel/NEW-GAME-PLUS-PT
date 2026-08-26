-- Liga cada artigo (Uma Hora Com, Retro+, Descobertas+) a um jogo
-- concreto da tabela "games", de forma fiável — em vez de dependeres de o
-- título do artigo "parecer-se" com o título do jogo. Fica opcional: um
-- artigo pode continuar sem jogo associado (ex.: um Descobertas+ sobre um
-- jogo que ainda não está catalogado no site).
alter table hour_with_articles
  add column if not exists game_id uuid references games(id) on delete set null;
alter table retro_articles
  add column if not exists game_id uuid references games(id) on delete set null;
alter table discovery_articles
  add column if not exists game_id uuid references games(id) on delete set null;

create index if not exists idx_hour_with_articles_game_id on hour_with_articles(game_id);
create index if not exists idx_retro_articles_game_id on retro_articles(game_id);
create index if not exists idx_discovery_articles_game_id on discovery_articles(game_id);
