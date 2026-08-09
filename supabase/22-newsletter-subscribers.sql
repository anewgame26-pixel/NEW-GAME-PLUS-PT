-- Tabela para guardar quem se inscreve na newsletter (a caixa que está
-- na página inicial, secção "Comunidade"). Até agora o botão só fingia
-- que funcionava — não guardava o email em lado nenhum.
create table if not exists newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now()
);

alter table newsletter_subscribers enable row level security;

-- Qualquer pessoa (mesmo sem sessão iniciada) pode inscrever-se — é
-- suposto ser tão simples como escrever o email e carregar num botão.
create policy "qualquer pessoa pode subscrever" on newsletter_subscribers
  for insert with check (true);

-- Só editores podem VER a lista de emails — ninguém mais deve conseguir
-- descarregar a lista de subscritores de outras pessoas.
create policy "so editores veem a lista" on newsletter_subscribers
  for select using (is_editor());

create policy "so editores apagam subscritores" on newsletter_subscribers
  for delete using (is_editor());
