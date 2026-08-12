-- Permite à equipa marcar, editor a editor, quais os artigos de Uma Hora
-- Com, Retro+ e Top+ que devem aparecer no carrossel do Hero da homepage
-- (tal como já existia "is_featured" para jogos/Antes da Platina).
alter table hour_with_articles add column if not exists is_hero_featured boolean not null default false;
alter table retro_articles add column if not exists is_hero_featured boolean not null default false;
alter table top_articles add column if not exists is_hero_featured boolean not null default false;
