-- Permite ajustar, por jogo, que parte da imagem larga (hero) fica visível
-- no recorte estreito do telemóvel. 0 = mostra o lado esquerdo da imagem,
-- 50 = centro (padrão), 100 = mostra o lado direito da imagem.
alter table games add column if not exists hero_focus_x smallint not null default 50;
