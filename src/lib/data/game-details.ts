import { supabase } from "@/lib/supabase/client";
import type { GameDetail } from "@/types";

/**
 * Traduz uma linha da tabela "game_details" para o formato "GameDetail"
 * que o resto do site já espera. Os campos "roadmap_chapters",
 * "hardest_trophies" e "rating_breakdown" são guardados como JSON na base
 * de dados, mas já vêm com os nomes certos lá dentro — por isso não
 * precisam de tradução, só de um "cast" de tipo.
 */
function mapRowToGameDetail(row: Record<string, unknown>): GameDetail {
  return {
    gameId: row.game_id as string,
    minPlaythroughs: row.min_playthroughs as number,
    difficultyExplanation: row.difficulty_explanation as string,
    review: {
      intro: row.review_intro as string,
      whatToExpect: row.review_what_to_expect as string,
      pros: (row.review_pros as string[]) ?? [],
      cons: (row.review_cons as string[]) ?? [],
      verdict: row.review_verdict as string,
      sufferingBadge: (row.suffering_badge as GameDetail["review"]["sufferingBadge"]) ?? null,
    },
    roadmapChapters: (row.roadmap_chapters as GameDetail["roadmapChapters"]) ?? [],
    hardestTrophies: (row.hardest_trophies as GameDetail["hardestTrophies"]) ?? [],
    trophyList: (row.trophy_list as GameDetail["trophyList"]) ?? [],
    prepTips: (row.prep_tips as string[]) ?? [],
    videoId: (row.video_id as string | null) ?? undefined,
    guideHref: row.guide_href as string,
    roadmapHref: row.roadmap_href as string,
    overallScore: Number(row.overall_score),
    ratingBreakdown: (row.rating_breakdown as GameDetail["ratingBreakdown"]) ?? [],
    screenshotUrls: (row.screenshot_urls as string[]) ?? [],
  };
}

/**
 * Vai buscar a análise completa de um jogo (tabela game_details), a partir
 * do ID do jogo (não do slug — é assim que a tabela está ligada).
 */
export async function getGameDetail(gameId: string): Promise<GameDetail | null> {
  const { data, error } = await supabase
    .from("game_details")
    .select("*")
    .eq("game_id", gameId)
    .maybeSingle();

  if (error) {
    console.error("Erro ao carregar a análise do jogo do Supabase:", error);
    return null;
  }

  return data ? mapRowToGameDetail(data) : null;
}
