-- Marca os membros que são autores convidados (e não da equipa fixa), para
-- aparecerem numa secção própria em "Sobre Nós". Continuam a poder ser
-- escolhidos como autores dos artigos e a ter página de autor.
alter table team_members add column if not exists is_guest boolean not null default false;
