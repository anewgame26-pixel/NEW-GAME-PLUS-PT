-- Descobertas+ — jogos que talvez ainda não conheças. Indies, pequenos
-- estúdios, jogos portugueses, early access, e por aí fora. Tal como os
-- outros dois pilares novos, é independente da tabela "games".
create table if not exists discovery_articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  platform text,
  release_year integer,
  cover_url text,
  hero_image_url text,

  -- Categorias livres (ex: 'indie', 'portugues', 'early-access',
  -- 'demo', 'experimental', 'recomendacao-comunidade') — usadas como
  -- filtros na página pública.
  tags text[] not null default '{}',

  body text not null default '',
  pros text[] not null default '{}',
  contras text[] not null default '{}',
  veredicto text not null default '',
  -- Resposta à pergunta principal: "Recomendamos?"
  recomendamos boolean,

  is_published boolean not null default false,
  created_at timestamptz not null default now()
);

alter table discovery_articles enable row level security;

do $$
declare
  pol record;
begin
  for pol in
    select policyname from pg_policies
    where schemaname = 'public' and tablename = 'discovery_articles'
  loop
    execute format('drop policy %I on discovery_articles', pol.policyname);
  end loop;
end $$;

create policy "leitura publica so publicados" on discovery_articles
  for select using (is_published = true or is_editor());

create policy "insercao so editores" on discovery_articles
  for insert with check (is_editor());

create policy "atualizacao so editores" on discovery_articles
  for update using (is_editor()) with check (is_editor());

create policy "eliminacao so editores" on discovery_articles
  for delete using (is_editor());
