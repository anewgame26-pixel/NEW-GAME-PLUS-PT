import { supabase } from "@/lib/supabase/client";
import { getGamesByIds } from "@/lib/data/games";
import type { VotingCandidate } from "@/types";

/**
 * Vai buscar a lista de candidatos escolhidos pela equipa (tabela
 * voting_candidates) já com o total de votos de cada um, ordenados do
 * mais votado para o menos votado. Não depende de sessão — funciona
 * mesmo para visitantes sem conta (só não conseguem votar).
 */
export async function getVotingCandidates(): Promise<VotingCandidate[]> {
  const { data: candidateRows, error: candidatesError } = await supabase
    .from("voting_candidates")
    .select("id, game_id, sort_order")
    .order("sort_order", { ascending: true });

  if (candidatesError) {
    console.error("Erro ao carregar candidatos a votação:", candidatesError);
    return [];
  }
  if (!candidateRows || candidateRows.length === 0) return [];

  const [{ data: countRows, error: countsError }, games] = await Promise.all([
    supabase.rpc("get_vote_counts"),
    getGamesByIds(candidateRows.map((c) => c.game_id as string)),
  ]);

  if (countsError) {
    console.error("Erro ao carregar contagem de votos:", countsError);
  }

  const countsByCandidateId = new Map<string, number>(
    (countRows ?? []).map((r: { candidate_id: string; votes_count: number }) => [
      r.candidate_id,
      Number(r.votes_count),
    ])
  );
  const gamesById = new Map(games.map((g) => [g.id, g]));

  const candidates: VotingCandidate[] = candidateRows
    .map((row) => {
      const game = gamesById.get(row.game_id as string);
      if (!game) return null;
      return {
        id: row.id as string,
        game,
        votesCount: countsByCandidateId.get(row.id as string) ?? 0,
      };
    })
    .filter((c): c is VotingCandidate => c !== null);

  return candidates.sort((a, b) => b.votesCount - a.votesCount);
}
