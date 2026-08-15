-- Estende a "Uma Hora Com", Retro+, Descobertas+ e Top+ a mesma opção que
-- os jogos (Antes da Platina) já tinham: escolher que parte horizontal da
-- imagem larga fica visível quando é cortada (0 = esquerda, 50 = centro,
-- 100 = direita). Ver 21-hero-focus-x.sql para a versão original (jogos).

alter table hour_with_articles add column if not exists hero_focus_x smallint not null default 50;
alter table retro_articles add column if not exists hero_focus_x smallint not null default 50;
alter table discovery_articles add column if not exists hero_focus_x smallint not null default 50;
alter table top_articles add column if not exists hero_focus_x smallint not null default 50;
