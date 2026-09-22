-- Tal como os jogos já têm "featured_order" para escolher a ordem em que
-- aparecem no carrossel do Hero quando marcados como destaque, os outros
-- pilares de conteúdo (Vale a pena?, Retro+, Descobertas+, Radar+, Top+)
-- só tinham o interruptor "Destacar no Hero", sem forma de escolher a
-- ordem entre eles. Isto acrescenta essa mesma capacidade a todos.
alter table hour_with_articles add column if not exists hero_order integer;
alter table retro_articles add column if not exists hero_order integer;
alter table discovery_articles add column if not exists hero_order integer;
alter table radar_articles add column if not exists hero_order integer;
alter table top_articles add column if not exists hero_order integer;
