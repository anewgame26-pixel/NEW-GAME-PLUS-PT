create table if not exists contact_messages (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null,
  subject     text not null,
  message     text not null,
  is_read     boolean not null default false,
  created_at  timestamptz not null default now()
);

alter table contact_messages enable row level security;

-- Qualquer pessoa pode enviar uma mensagem pelo formulário de contacto,
-- mesmo sem sessão iniciada (tal como acontece com os "reports").
drop policy if exists "contact_messages - insercao publica" on contact_messages;
create policy "contact_messages - insercao publica"
  on contact_messages for insert
  with check (true);

-- Só editores conseguem LER as mensagens — é a caixa de entrada interna
-- da equipa, não conteúdo público.
drop policy if exists "contact_messages - leitura so editores" on contact_messages;
create policy "contact_messages - leitura so editores"
  on contact_messages for select
  using (is_editor());

drop policy if exists "contact_messages - atualizacao so editores" on contact_messages;
create policy "contact_messages - atualizacao so editores"
  on contact_messages for update
  using (is_editor())
  with check (is_editor());

drop policy if exists "contact_messages - eliminacao so editores" on contact_messages;
create policy "contact_messages - eliminacao so editores"
  on contact_messages for delete
  using (is_editor());

grant insert on contact_messages to anon, authenticated;
grant select, update, delete on contact_messages to authenticated;
