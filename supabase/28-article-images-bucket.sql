-- Bucket para as fotos anexadas nos editores de artigos (Top+, Retro+,
-- Descobertas+, etc.) — permite anexar um ficheiro em vez de teres de ir
-- procurar sempre um URL na net.

insert into storage.buckets (id, name, public)
values ('article-images', 'article-images', true)
on conflict (id) do nothing;

drop policy if exists "imagens de artigos - leitura publica" on storage.objects;
create policy "imagens de artigos - leitura publica"
  on storage.objects for select
  using (bucket_id = 'article-images');

drop policy if exists "imagens de artigos - upload so editores" on storage.objects;
create policy "imagens de artigos - upload so editores"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'article-images' and is_editor());

drop policy if exists "imagens de artigos - atualizacao so editores" on storage.objects;
create policy "imagens de artigos - atualizacao so editores"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'article-images' and is_editor());

drop policy if exists "imagens de artigos - eliminacao so editores" on storage.objects;
create policy "imagens de artigos - eliminacao so editores"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'article-images' and is_editor());
