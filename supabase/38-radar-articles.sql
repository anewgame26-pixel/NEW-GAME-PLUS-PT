-- Radar+ — novo pilar de conteúdo: novos jogos, anúncios, lançamentos e
-- notícias que achamos relevantes. Ao contrário do Uma Hora Com/Retro+/
-- Descobertas+, não é uma "review" (sem pros/contras/veredicto) — é só
-- um texto livre (com imagens e vídeo à mistura), como uma notícia.
create table if not exists radar_articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  platform text,
  cover_url text,
  hero_image_url text,
  hero_focus_x smallint not null default 50,
  hero_focus_y smallint not null default 50,
  hero_zoom smallint not null default 100,
  youtube_url text,

  -- Categoria livre (ex: 'lancamento', 'noticia', 'rumor', 'trailer',
  -- 'anuncio', 'atualizacao') — usada como filtro/selo na página pública.
  tags text[] not null default '{}',

  -- Ligação opcional a um jogo já catalogado no site (tal como o
  -- Uma Hora Com/Retro+/Descobertas+ já permitem).
  game_id uuid references games(id) on delete set null,

  body text not null default '',

  author_id uuid references team_members(id) on delete set null,

  is_hero_featured boolean not null default false,
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_radar_articles_game_id on radar_articles(game_id);

alter table radar_articles enable row level security;

do $$
declare
  pol record;
begin
  for pol in
    select policyname from pg_policies
    where schemaname = 'public' and tablename = 'radar_articles'
  loop
    execute format('drop policy %I on radar_articles', pol.policyname);
  end loop;
end $$;

-- Leitura pública só dos artigos publicados; editores veem tudo
-- (incluindo rascunhos, no admin).
create policy "leitura publica so publicados" on radar_articles
  for select using (is_published = true or is_editor());

create policy "insercao so editores" on radar_articles
  for insert with check (is_editor());

create policy "atualizacao so editores" on radar_articles
  for update using (is_editor()) with check (is_editor());

create policy "eliminacao so editores" on radar_articles
  for delete using (is_editor());
