-- Permite escolher, por artigo, qual membro da equipa escreveu/editou
-- o artigo (Uma Hora Com, Retro+, Descobertas+ e Top+), tal como já
-- acontece com "review_author_id" em game_details. Fica ligado à
-- tabela "team_members" — se a pessoa for removida da equipa, o campo
-- fica vazio em vez de dar erro.

alter table hour_with_articles
  add column if not exists author_id uuid references team_members(id) on delete set null;

alter table retro_articles
  add column if not exists author_id uuid references team_members(id) on delete set null;

alter table discovery_articles
  add column if not exists author_id uuid references team_members(id) on delete set null;

alter table top_articles
  add column if not exists author_id uuid references team_members(id) on delete set null;
