-- Adiciona controlo de "zoom" (aproximar/afastar) à imagem larga, para
-- complementar o "hero_focus_x" (que só escolhe a posição horizontal).
-- 100 = tamanho normal (sem zoom), até 200 = imagem ampliada 2x.
-- Aplicado a todos os pilares que já tinham hero_focus_x, incluindo jogos.

alter table games add column if not exists hero_zoom smallint not null default 100;
alter table hour_with_articles add column if not exists hero_zoom smallint not null default 100;
alter table retro_articles add column if not exists hero_zoom smallint not null default 100;
alter table discovery_articles add column if not exists hero_zoom smallint not null default 100;
alter table top_articles add column if not exists hero_zoom smallint not null default 100;
