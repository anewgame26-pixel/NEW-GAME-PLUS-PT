-- Top+ — série de vídeo em formato de listas (ex: "5 jogos mais difíceis
-- de platinar", "jogos que já não podes jogar"). Tal como "Retro+" e
-- "Descobertas+", é independente da tabela "games", porque uma lista
-- normalmente fala de vários jogos ao mesmo tempo, não de um só.
create table if not exists top_articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  cover_url text,
  hero_image_url text,
  youtube_url text,

  intro text not null default '',
  -- Lista de entradas do vídeo, por ordem (ex: {"label": "Elden Ring",
  -- "note": "O chefe final é uma aula de paciência"}). Guardado como JSON
  -- em vez de mais uma tabela, tal como "rating_breakdown" em "games".
  items jsonb not null default '[]',

  is_published boolean not null default false,
  created_at timestamptz not null default now()
);

alter table top_articles enable row level security;

do $$
declare
  pol record;
begin
  for pol in
    select policyname from pg_policies
    where schemaname = 'public' and tablename = 'top_articles'
  loop
    execute format('drop policy %I on top_articles', pol.policyname);
  end loop;
end $$;

create policy "leitura publica so publicados" on top_articles
  for select using (is_published = true or is_editor());

create policy "insercao so editores" on top_articles
  for insert with check (is_editor());

create policy "atualizacao so editores" on top_articles
  for update using (is_editor()) with check (is_editor());

create policy "eliminacao so editores" on top_articles
  for delete using (is_editor());
