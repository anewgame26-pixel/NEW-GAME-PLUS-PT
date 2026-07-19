insert into profiles (id, username)
select id, split_part(email, '@', 1)
from auth.users
where id not in (select id from profiles)
on conflict (id) do nothing;

-- Faltava esta política: só havia permissão para ATUALIZAR uma ficha já
-- existente, não para a CRIAR. Sem isto, se alguma conta ficar outra vez
-- sem ficha de perfil por algum motivo, gravar o perfil falhava sem
-- explicação — mesmo problema que aconteceu com as contas criadas antes
-- deste sistema existir.
drop policy if exists "profiles - insercao propria" on profiles;
create policy "profiles - insercao propria"
  on profiles for insert
  with check (auth.uid() = id);

grant insert on profiles to authenticated;
