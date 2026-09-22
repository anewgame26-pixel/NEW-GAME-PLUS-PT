-- "Review" — novo pilar de conteúdo: a análise completa de um jogo, ao
-- contrário do "Vale a pena?" (que é só a primeira impressão da primeira
-- hora). Estruturalmente é muito parecido com hour_with_articles, mas
-- troca o "queremos continuar a jogar?" por uma nota final (0-10).
-- Propositadamente independente da tabela "games", tal como os outros
-- pilares, para poder cobrir jogos sem perfil de platina no site.
create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  platform text,
  game_id uuid references games(id) on delete set null,
  cover_url text,
  hero_image_url text,
  hero_focus_x numeric not null default 50,
  hero_focus_y numeric not null default 50,
  hero_zoom numeric not null default 100,
  date_played date,
  youtube_url text,

  intro text not null default '',
  gameplay text not null default '',
  historia text not null default '',
  graficos text not null default '',
  som_musica text not null default '',
  performance text not null default '',
  pros text[] not null default '{}',
  contras text[] not null default '{}',
  veredicto text not null default '',
  -- Nota final da review, de 0 a 10 (ex: 8.5).
  nota numeric,

  is_hero_featured boolean not null default false,
  hero_order integer,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  author_id uuid references team_members(id) on delete set null
);

alter table reviews enable row level security;

do $$
declare
  pol record;
begin
  for pol in
    select policyname from pg_policies
    where schemaname = 'public' and tablename = 'reviews'
  loop
    execute format('drop policy %I on reviews', pol.policyname);
  end loop;
end $$;

-- Leitura pública só das reviews publicadas; editores veem tudo
-- (incluindo rascunhos, no admin).
create policy "leitura publica so publicados" on reviews
  for select using (is_published = true or is_editor());

create policy "insercao so editores" on reviews
  for insert with check (is_editor());

create policy "atualizacao so editores" on reviews
  for update using (is_editor()) with check (is_editor());

create policy "eliminacao so editores" on reviews
  for delete using (is_editor());
