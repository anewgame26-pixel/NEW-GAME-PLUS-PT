-- Retro+ e Descobertas+ ainda não tinham campo para link do YouTube
-- (ao contrário do Top+, que já tinha). E Descobertas+ ainda não tinha
-- a opção de aparecer no carrossel do Hero da homepage (Retro+ e Top+
-- já tinham, desde a 27-hero-featured.sql).

alter table retro_articles add column if not exists youtube_url text;
alter table discovery_articles add column if not exists youtube_url text;
alter table discovery_articles add column if not exists is_hero_featured boolean not null default false;
