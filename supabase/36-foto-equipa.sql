-- Permite adicionar uma foto a cada membro da equipa, na página Sobre
-- Nós. Fica opcional — sem foto, continua a mostrar as iniciais como
-- até agora.
alter table team_members add column if not exists photo_url text;
