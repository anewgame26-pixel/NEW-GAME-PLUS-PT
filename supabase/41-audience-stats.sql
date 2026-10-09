-- Números de audiência (seguidores / visualizações) mostrados na página
-- de Imprensa. Ficam numa tabela com uma única linha (id = 1) para os
-- editores poderem atualizar no admin, sem mexer em código.
create table if not exists audience_stats (
  id integer primary key default 1 check (id = 1),
  tiktok_followers integer not null default 0,
  tiktok_views integer not null default 0,
  tiktok_views_days integer not null default 60,
  youtube_subscribers integer not null default 0,
  youtube_views integer not null default 0,
  instagram_followers integer not null default 0,
  instagram_views integer not null default 0,
  instagram_views_days integer not null default 30,
  updated_at timestamptz not null default now()
);

-- Valores iniciais (seguidores a 08/10/2026; visualizações a 29/09/2026).
-- Confirma e atualiza em /admin/estatisticas.
insert into audience_stats (
  id, tiktok_followers, tiktok_views, youtube_subscribers, youtube_views,
  instagram_followers, instagram_views
) values (1, 826, 42000, 517, 12644, 150, 15000)
on conflict (id) do nothing;

alter table audience_stats enable row level security;

do $$
declare
  pol record;
begin
  for pol in
    select policyname from pg_policies
    where schemaname = 'public' and tablename = 'audience_stats'
  loop
    execute format('drop policy %I on audience_stats', pol.policyname);
  end loop;
end $$;

create policy "leitura publica" on audience_stats
  for select using (true);

create policy "insercao so editores" on audience_stats
  for insert with check (is_editor());

create policy "atualizacao so editores" on audience_stats
  for update using (is_editor()) with check (is_editor());
