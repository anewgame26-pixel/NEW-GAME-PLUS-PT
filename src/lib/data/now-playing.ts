import { supabase } from "@/lib/supabase/client";
import type { PlayingNow } from "@/types";

/**
 * Vai buscar os jogos que a equipa está atualmente a jogar/preparar.
 *
 * Nota: o campo "activePlayers" do tipo PlayingNow é preenchido aqui
 * mesmo (cruzando "team_member_ids" com a lista de membros da equipa
 * já carregada), porque a tabela só guarda os IDs — mais simples do
 * que fazer um "join" na própria base de dados.
 */
export async function getNowPlaying(): Promise<
  { gameId: string; progressPercent: number; teamMemberIds: string[] }[]
> {
  const { data, error } = await supabase
    .from("now_playing")
    .select("game_id, progress_percent, team_member_ids")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Erro ao carregar 'Estamos a Jogar' do Supabase:", error);
    return [];
  }

  return (data ?? []).map((row) => ({
    gameId: row.game_id as string,
    progressPercent: row.progress_percent as number,
    teamMemberIds: (row.team_member_ids as string[]) ?? [],
  }));
}

/**
 * Junta o resultado de getNowPlaying() com as listas de jogos e membros
 * da equipa já carregadas, devolvendo o formato "PlayingNow" completo
 * que o componente ContinuePlayingList já espera.
 */
export function resolveNowPlaying(
  rows: { gameId: string; progressPercent: number; teamMemberIds: string[] }[],
  teamMembers: { id: string; name: string; avatarInitials: string }[]
): PlayingNow[] {
  return rows.map((row) => ({
    gameId: row.gameId,
    progressPercent: row.progressPercent,
    activePlayers: row.teamMemberIds
      .map((id) => teamMembers.find((m) => m.id === id))
      .filter((m): m is NonNullable<typeof m> => Boolean(m)),
  }));
}
