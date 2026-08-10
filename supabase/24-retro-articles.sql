-- Retro+ — jogos que merecem ser revisitados. Tal como "Uma Hora Com",
-- é independente da tabela "games", para poder cobrir jogos que nunca
-- vão ter uma ficha de platina completa no site.
create table if not exists retro_articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  platform text,
  release_year integer,
  cover_url text,
  hero_image_url text,

  body text not null default '',
  pros text[] not null default '{}',
  contras text[] not null default '{}',
  veredicto text not null default '',
  -- Resposta à pergunta principal: "Ainda vale a pena jogar isto hoje?"
  vale_a_pena_hoje boolean,

  is_published boolean not null default false,
  created_at timestamptz not null default now()
);

alter table retro_articles enable row level security;

do $$
declare
  pol record;
begin
  for pol in
    select policyname from pg_policies
    where schemaname = 'public' and tablename = 'retro_articles'
  loop
    execute format('drop policy %I on retro_articles', pol.policyname);
  end loop;
end $$;

create policy "leitura publica so publicados" on retro_articles
  for select using (is_published = true or is_editor());

create policy "insercao so editores" on retro_articles
  for insert with check (is_editor());

create policy "atualizacao so editores" on retro_articles
  for update using (is_editor()) with check (is_editor());

create policy "eliminacao so editores" on retro_articles
  for delete using (is_editor());
