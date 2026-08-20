-- Permite escolher, por jogo, qual membro da equipa escreveu a review
-- (Antes da Platina). Fica ligado à tabela "team_members" — se a pessoa
-- for removida da equipa, o campo fica vazio em vez de dar erro.
alter table game_details
  add column if not exists review_author_id uuid references team_members(id) on delete set null;
