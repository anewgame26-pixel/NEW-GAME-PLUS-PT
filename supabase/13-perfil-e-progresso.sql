alter table profiles add column if not exists avatar_url text;
alter table profiles add column if not exists psn_url text;


insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

drop policy if exists "avatares - leitura publica" on storage.objects;
create policy "avatares - leitura publica"
  on storage.objects for select
  using (bucket_id = 'avatars');

drop policy if exists "avatares - upload propria pasta" on storage.objects;
create policy "avatares - upload propria pasta"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "avatares - atualizacao propria pasta" on storage.objects;
create policy "avatares - atualizacao propria pasta"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "avatares - eliminacao propria pasta" on storage.objects;
create policy "avatares - eliminacao propria pasta"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);


create table if not exists game_progress (
  user_id          uuid not null references auth.users(id) on delete cascade,
  game_id          uuid not null references games(id) on delete cascade,
  status           text not null default 'a_jogar' check (status in ('a_jogar', 'platinado', 'abandonado')),
  progress_percent integer not null default 0 check (progress_percent between 0 and 100),
  updated_at       timestamptz not null default now(),
  primary key (user_id, game_id)
);

alter table game_progress enable row level security;

drop policy if exists "progresso - leitura propria" on game_progress;
create policy "progresso - leitura propria"
  on game_progress for select
  using (auth.uid() = user_id);

drop policy if exists "progresso - insercao propria" on game_progress;
create policy "progresso - insercao propria"
  on game_progress for insert
  with check (auth.uid() = user_id);

drop policy if exists "progresso - atualizacao propria" on game_progress;
create policy "progresso - atualizacao propria"
  on game_progress for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "progresso - eliminacao propria" on game_progress;
create policy "progresso - eliminacao propria"
  on game_progress for delete
  using (auth.uid() = user_id);

grant select, insert, update, delete on game_progress to authenticated;
