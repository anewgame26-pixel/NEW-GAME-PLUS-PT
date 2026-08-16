-- Adiciona controlo de posição vertical (cima/baixo) à imagem larga,
-- para complementar o "hero_focus_x" (horizontal) e o "hero_zoom".
-- 0 = mostra o topo da imagem, 50 = centro (padrão), 100 = mostra a
-- base da imagem.

alter table games add column if not exists hero_focus_y smallint not null default 50;
alter table hour_with_articles add column if not exists hero_focus_y smallint not null default 50;
alter table retro_articles add column if not exists hero_focus_y smallint not null default 50;
alter table discovery_articles add column if not exists hero_focus_y smallint not null default 50;
alter table top_articles add column if not exists hero_focus_y smallint not null default 50;
