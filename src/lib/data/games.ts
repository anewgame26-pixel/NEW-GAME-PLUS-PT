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
    heroImageUrl: (row.hero_image_url as string | null) ?? null,
    heroFocusX: typeof row.hero_focus_x === "number" ? row.hero_focus_x : 50,
    heroFocusY: typeof row.hero_focus_y === "number" ? row.hero_focus_y : 50,
    heroZoom: typeof row.hero_zoom === "number" ? row.hero_zoom : 100,
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
 * Por omissão, devolve os jogos com a análise "Antes da Platina" publicada
 * (is_published = true), MAS também os jogos que ainda não têm essa
 * análise pronta, desde que tenham pelo menos um outro pilar publicado
 * (Uma Hora Com, Retro+ ou Descobertas+) — assim um jogo não fica
 * escondido do site só porque a review completa ainda não está feita.
 * O painel /admin passa includeUnpublished: true para ver mesmo tudo,
 * incluindo rascunhos sem nenhum pilar publicado (ex.: os adicionados
 * rapidamente via IGDB só para entrarem em votação).
 */
export async function getGames(options?: { includeUnpublished?: boolean }): Promise<Game[]> {
  if (options?.includeUnpublished) {
    const { data, error } = await supabase.from("games").select("*").order("title", { ascending: true });

    if (error) {
      console.error("Erro ao carregar jogos do Supabase:", error);
      return [];
    }

    return (data ?? []).map(mapRowToGame);
  }

  const [gamesRes, hourWithRes, retroRes, discoveryRes] = await Promise.all([
    supabase.from("games").select("*").order("title", { ascending: true }),
    supabase.from("hour_with_articles").select("game_id").eq("is_published", true).not("game_id", "is", null),
    supabase.from("retro_articles").select("game_id").eq("is_published", true).not("game_id", "is", null),
    supabase.from("discovery_articles").select("game_id").eq("is_published", true).not("game_id", "is", null),
  ]);

  if (gamesRes.error) {
    console.error("Erro ao carregar jogos do Supabase:", gamesRes.error);
    return [];
  }

  const linkedGameIds = new Set<string>([
    ...(hourWithRes.data ?? []).map((r) => r.game_id as string),
    ...(retroRes.data ?? []).map((r) => r.game_id as string),
    ...(discoveryRes.data ?? []).map((r) => r.game_id as string),
  ]);

  const rows = (gamesRes.data ?? []).filter(
    (row) => (row.is_published as boolean) === true || linkedGameIds.has(row.id as string)
  );

  return rows.map(mapRowToGame);
}

/**
 * Vai buscar um único jogo pelo "slug" (usado na página /guias/[slug]).
 * De propósito SEM filtro de publicação: essa página passou a funcionar
 * como o "hub" do jogo — mostra a análise Antes da Platina se existir,
 * ou outro pilar (Uma Hora Com, Retro+, Descobertas+) caso contrário. É a
 * própria página, já depois de saber o que existe, que decide se há
 * conteúdo suficiente para mostrar algo ou se deve devolver 404.
 */
export async function getGameBySlug(slug: string): Promise<Game | null> {
  const { data, error } = await supabase.from("games").select("*").eq("slug", slug).maybeSingle();

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

/** Todos os "slugs" que devem ter página pública — mesmo critério do getGames(). */
export async function getAllGameSlugs(): Promise<string[]> {
  const games = await getGames();
  return games.map((g) => g.slug);
}
