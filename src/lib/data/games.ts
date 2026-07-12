import { supabase } from "@/lib/supabase/client";
import type { Game } from "@/types";

/**
 * Traduz uma linha da tabela "games" (nomes em snake_case, à moda do
 * Postgres) para o formato "Game" que o resto do site já espera
 * (camelCase, à moda do TypeScript/React). Isto mantém todos os
 * componentes (GameCard, filtros, etc.) exatamente iguais a antes.
 */
function mapRowToGame(row: Record<string, unknown>): Game {
  return {
    id: row.id as string,
    slug: row.slug as string,
    title: row.title as string,
    coverUrl: row.cover_url as string,
    heroImageUrl: (row.hero_image_url as string | null) ?? undefined,
    platforms: row.platforms as Game["platforms"],
    genres: row.genres as Game["genres"],
    releaseYear: row.release_year as number,
    releaseDate: (row.release_date as string | null) ?? undefined,
    developer: row.developer as string,
    difficulty: row.difficulty as number,
    platinumTimeMin: row.platinum_time_min as number,
    platinumTimeMax: row.platinum_time_max as number,
    trophyBreakdown: row.trophy_breakdown as Game["trophyBreakdown"],
    hasMissables: row.has_missables as boolean,
    hasOnlineTrophies: row.has_online_trophies as boolean,
    grindLevel: row.grind_level as Game["grindLevel"],
    worthBuying: row.worth_buying as number,
    worthPlatinum: row.worth_platinum as number,
    guideRequired: row.guide_required as boolean,
    synopsis: row.synopsis as string,
    similarGameIds: (row.similar_game_ids as string[] | null) ?? [],
  };
}

/** Vai buscar todos os jogos à base de dados (tabela games). */
export async function getGames(): Promise<Game[]> {
  const { data, error } = await supabase
    .from("games")
    .select("*")
    .order("title", { ascending: true });

  if (error) {
    console.error("Erro ao carregar jogos do Supabase:", error);
    return [];
  }

  return (data ?? []).map(mapRowToGame);
}

/** Vai buscar um único jogo pelo "slug" (usado nas páginas /guias/[slug]). */
export async function getGameBySlug(slug: string): Promise<Game | null> {
  const { data, error } = await supabase
    .from("games")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("Erro ao carregar o jogo do Supabase:", error);
    return null;
  }

  return data ? mapRowToGame(data) : null;
}

/**
 * Vai buscar vários jogos de uma vez a partir de uma lista de IDs — usado,
 * por exemplo, para mostrar os "jogos semelhantes" na página de um jogo,
 * numa única pergunta à base de dados em vez de uma por jogo.
 */
export async function getGamesByIds(ids: string[]): Promise<Game[]> {
  if (ids.length === 0) return [];

  const { data, error } = await supabase.from("games").select("*").in("id", ids);

  if (error) {
    console.error("Erro ao carregar jogos semelhantes do Supabase:", error);
    return [];
  }

  return (data ?? []).map(mapRowToGame);
}

/** Todos os "slugs" existentes — usado para gerar as páginas estáticas de cada jogo. */
export async function getAllGameSlugs(): Promise<string[]> {
  const { data, error } = await supabase.from("games").select("slug");

  if (error) {
    console.error("Erro ao carregar a lista de slugs do Supabase:", error);
    return [];
  }

  return (data ?? []).map((row) => row.slug as string);
}
