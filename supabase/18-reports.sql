create table if not exists reports (
  id              uuid primary key default gen_random_uuid(),
  game_id         uuid references games(id) on delete set null,
  location        text not null,
  description     text not null,
  reporter_email  text,
  user_id         uuid references auth.users(id) on delete set null,
  status          text not null default 'pendente' check (status in ('pendente', 'resolvido')),
  created_at      timestamptz not null default now()
);

alter table reports enable row level security;

-- Qualquer pessoa pode reportar um erro, mesmo sem sessão iniciada — o
-- formulário no site nunca exigiu login, de propósito (queremos o menor
-- atrito possível para alguém avisar de um erro).
drop policy if exists "reports - insercao publica" on reports;
create policy "reports - insercao publica"
  on reports for insert
  with check (true);

-- Só editores conseguem LER os reports — é uma caixa de entrada interna
-- da equipa, não conteúdo público.
drop policy if exists "reports - leitura so editores" on reports;
create policy "reports - leitura so editores"
  on reports for select
  using (is_editor());

drop policy if exists "reports - atualizacao so editores" on reports;
create policy "reports - atualizacao so editores"
  on reports for update
  using (is_editor())
  with check (is_editor());

drop policy if exists "reports - eliminacao so editores" on reports;
create policy "reports - eliminacao so editores"
  on reports for delete
  using (is_editor());

grant insert on reports to anon, authenticated;
grant select, update, delete on reports to authenticated;
