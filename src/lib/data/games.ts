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
    hasRng: (row.has_rng as boolean | null) ?? false,
    grindLevel: row.grind_level as Game["grindLevel"],
    worthBuying: row.worth_buying as number,
    worthPlatinum: row.worth_platinum as number,
    guideRequired: row.guide_required as boolean,
    synopsis: row.synopsis as string,
    similarGameIds: (row.similar_game_ids as string[] | null) ?? [],
    isPublished: (row.is_published as boolean | null) ?? true,
  };
}

/**
 * Vai buscar todos os jogos à base de dados (tabela games).
 *
 * Por omissão, só devolve jogos publicados (is_published = true) — é o
 * que as páginas públicas do site (homepage, /jogos, rankings, etc.)
 * devem sempre usar. O painel /admin passa includeUnpublished: true
 * para também ver rascunhos e jogos ainda sem análise (ex.: os
 * adicionados rapidamente via IGDB só para entrarem em votação).
 */
export async function getGames(options?: { includeUnpublished?: boolean }): Promise<Game[]> {
  let query = supabase.from("games").select("*").order("title", { ascending: true });
  if (!options?.includeUnpublished) {
    query = query.eq("is_published", true);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Erro ao carregar jogos do Supabase:", error);
    return [];
  }

  return (data ?? []).map(mapRowToGame);
}

/**
 * Vai buscar um único jogo pelo "slug" (usado nas páginas /guias/[slug]).
 * Só devolve jogos publicados — um jogo ainda em rascunho (ex.: criado
 * rapidamente via IGDB só para votação) não tem página pública própria
 * ainda, mesmo que alguém tente aceder ao link diretamente.
 */
export async function getGameBySlug(slug: string): Promise<Game | null> {
  const { data, error } = await supabase
    .from("games")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (error) {
    console.error("Erro ao carregar o jogo do Supabase:", error);
    return null;
  }

  return data ? mapRowToGame(data) : null;
}

/**
 * Vai buscar os jogos marcados como "destaque" no CMS (campo is_featured),
 * ordenados por featured_order (quando definido) e depois por título. Usado
 * no carousel da homepage — nenhum jogo fica fixo no código.
 */
export async function getFeaturedGames(): Promise<Game[]> {
  const { data, error } = await supabase
    .from("games")
    .select("*")
    .eq("is_featured", true)
    .eq("is_published", true)
    .order("featured_order", { ascending: true, nullsFirst: false })
    .order("title", { ascending: true });

  if (error) {
    console.error("Erro ao carregar jogos em destaque do Supabase:", error);
    return [];
  }

  return (data ?? []).map(mapRowToGame);
}

/**
 * Vai buscar vários jogos de uma vez a partir de uma lista de IDs — usado,
 * por exemplo, para mostrar os "jogos semelhantes" na página de um jogo,
 * os favoritos de um visitante, ou os candidatos da votação. De propósito
 * SEM filtro de publicação: a votação, em particular, precisa de mostrar
 * candidatos que ainda não têm guia publicada.
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

/** Todos os "slugs" publicados — usado para gerar as páginas estáticas de cada jogo. */
export async function getAllGameSlugs(): Promise<string[]> {
  const { data, error } = await supabase.from("games").select("slug").eq("is_published", true);

  if (error) {
    console.error("Erro ao carregar a lista de slugs do Supabase:", error);
    return [];
  }

  return (data ?? []).map((row) => row.slug as string);
}
