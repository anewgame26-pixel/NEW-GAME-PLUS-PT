-- "Uma Hora Com..." — novo pilar de conteúdo: jogamos um jogo durante
-- uma hora e damos a primeira impressão. É propositadamente independente
-- da tabela "games" (que é focada em platinas/troféus), porque este
-- formato pode cobrir jogos que ainda não têm perfil de platina no site.
create table if not exists hour_with_articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  platform text,
  cover_url text,
  hero_image_url text,
  date_played date,
  youtube_url text,

  first_impression text not null default '',
  gameplay text not null default '',
  historia text not null default '',
  graficos text not null default '',
  som_musica text not null default '',
  performance text not null default '',
  pros text[] not null default '{}',
  contras text[] not null default '{}',
  veredicto text not null default '',
  -- Resposta à pergunta principal: "Depois de uma hora, queremos continuar a jogar?"
  continuar_a_jogar boolean,

  is_published boolean not null default false,
  created_at timestamptz not null default now()
);

alter table hour_with_articles enable row level security;

do $$
declare
  pol record;
begin
  for pol in
    select policyname from pg_policies
    where schemaname = 'public' and tablename = 'hour_with_articles'
  loop
    execute format('drop policy %I on hour_with_articles', pol.policyname);
  end loop;
end $$;

-- Leitura pública só dos artigos publicados; editores veem tudo
-- (incluindo rascunhos, no admin).
create policy "leitura publica so publicados" on hour_with_articles
  for select using (is_published = true or is_editor());

create policy "insercao so editores" on hour_with_articles
  for insert with check (is_editor());

create policy "atualizacao so editores" on hour_with_articles
  for update using (is_editor()) with check (is_editor());

create policy "eliminacao so editores" on hour_with_articles
  for delete using (is_editor());
