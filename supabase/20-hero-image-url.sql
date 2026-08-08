-- Adiciona uma coluna separada para a imagem larga (widescreen) usada no
-- carrossel principal da homepage. A capa normal (cover_url) é vertical
-- (como a caixa de um jogo) e não deve ser esticada num banner largo —
-- por isso passamos a guardar também uma imagem "hero", vinda das
-- artworks/screenshots da IGDB, que já vêm em formato largo.
alter table games add column if not exists hero_image_url text;
