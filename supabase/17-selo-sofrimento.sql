alter table game_details
  add column if not exists suffering_badge text
  check (suffering_badge in ('sofrimento_moderado', 'sofrimento_extremo', 'sem_sofrimento'));
