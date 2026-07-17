import { supabase } from "@/lib/supabase/client";
import type { PlatformStat } from "@/types";

/**
 * Calcula os 6 números da barra de estatísticas (StatsBar) diretamente a
 * partir da base de dados, em vez de valores fixos no código. Substitui
 * o antigo "platformStats" de src/data/mock/homepage.ts.
 */
export async function getPlatformStats(): Promise<PlatformStat[]> {
  const [gamesResult, detailsResult, videosResult] = await Promise.all([
    supabase.from("games").select("trophy_breakdown, platinum_time_max"),
    supabase.from("game_details").select("review_verdict, roadmap_chapters"),
    supabase.from("videos").select("id", { count: "exact", head: true }).eq("status", "publicado"),
  ]);

  if (gamesResult.error) {
    console.error("Erro ao carregar jogos para as estatísticas:", gamesResult.error);
  }
  if (detailsResult.error) {
    console.error("Erro ao carregar análises para as estatísticas:", detailsResult.error);
  }
  if (videosResult.error) {
    console.error("Erro ao carregar vídeos para as estatísticas:", videosResult.error);
  }

  const games = gamesResult.data ?? [];
  const details = detailsResult.data ?? [];

  const gamesAnalisados = games.length;

  const guiasCompletos = details.filter(
    (d) => typeof d.review_verdict === "string" && d.review_verdict.trim().length > 0
  ).length;

  const roadmapsCriados = details.filter(
    (d) => Array.isArray(d.roadmap_chapters) && d.roadmap_chapters.length > 0
  ).length;

  const videosPublicados = videosResult.count ?? 0;

  const trofeusCatalogados = games.reduce((total, g) => {
    const breakdown = g.trophy_breakdown as
      | { bronze?: number; prata?: number; ouro?: number; platina?: number }
      | null;
    if (!breakdown) return total;
    return (
      total +
      (breakdown.bronze ?? 0) +
      (breakdown.prata ?? 0) +
      (breakdown.ouro ?? 0) +
      (breakdown.platina ?? 0)
    );
  }, 0);

  const horasGameplay = games.reduce((total, g) => total + ((g.platinum_time_max as number) ?? 0), 0);

  return [
    { label: "Jogos Analisados", value: formatNumber(gamesAnalisados), icon: "gamepad" },
    { label: "Guias Completos", value: formatNumber(guiasCompletos), icon: "book" },
    { label: "Roadmaps Criados", value: formatNumber(roadmapsCriados), icon: "map" },
    { label: "Vídeos Publicados", value: formatNumber(videosPublicados), icon: "video" },
    { label: "Troféus Catalogados", value: formatRounded(trofeusCatalogados), icon: "trophy" },
    { label: "Horas de Gameplay", value: formatRounded(horasGameplay), icon: "clock" },
  ];
}

/** Formata um número inteiro simples (ex.: 653). */
function formatNumber(n: number): string {
  return n.toLocaleString("pt-PT");
}

/**
 * Formata números grandes de forma arredondada para baixo, tipo "18 000+"
 * (mesmo estilo visual que os valores fixos tinham antes).
 */
function formatRounded(n: number): string {
  if (n < 1000) return formatNumber(n);
  const rounded = Math.floor(n / 1000) * 1000;
  return `${formatNumber(rounded)}+`;
}
