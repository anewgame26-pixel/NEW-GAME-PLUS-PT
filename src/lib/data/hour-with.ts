import { supabase } from "@/lib/supabase/client";
import type { HourWithArticle } from "@/types";

function mapRowToArticle(row: Record<string, unknown>): HourWithArticle {
  return {
    id: row.id as string,
    slug: row.slug as string,
    title: row.title as string,
    platform: (row.platform as string | null) ?? null,
    gameId: (row.game_id as string | null) ?? null,
    coverUrl: (row.cover_url as string | null) ?? null,
    heroImageUrl: (row.hero_image_url as string | null) ?? null,
    heroFocusX: typeof row.hero_focus_x === "number" ? row.hero_focus_x : 50,
    heroFocusY: typeof row.hero_focus_y === "number" ? row.hero_focus_y : 50,
    heroZoom: typeof row.hero_zoom === "number" ? row.hero_zoom : 100,
    datePlayed: (row.date_played as string | null) ?? null,
    youtubeUrl: (row.youtube_url as string | null) ?? null,
    firstImpression: (row.first_impression as string) ?? "",
    gameplay: (row.gameplay as string) ?? "",
    historia: (row.historia as string) ?? "",
    graficos: (row.graficos as string) ?? "",
    somMusica: (row.som_musica as string) ?? "",
    performance: (row.performance as string) ?? "",
    pros: (row.pros as string[]) ?? [],
    contras: (row.contras as string[]) ?? [],
    veredicto: (row.veredicto as string) ?? "",
    continuarAJogar: (row.continuar_a_jogar as boolean | null) ?? null,
    isHeroFeatured: (row.is_hero_featured as boolean) ?? false,
    isPublished: (row.is_published as boolean) ?? false,
    createdAt: row.created_at as string,
  };
}

/** Artigos publicados, mais recentes primeiro — usado nas páginas públicas. */
export async function getHourWithArticles(): Promise<HourWithArticle[]> {
  const { data, error } = await supabase
    .from("hour_with_articles")
    .select("*")
    .eq("is_published", true)
    .order("date_played", { ascending: false, nullsFirst: false });

  if (error) {
    console.error("Erro ao carregar artigos 'Uma Hora Com' do Supabase:", error);
    return [];
  }

  return (data ?? []).map(mapRowToArticle);
}

/** Um artigo publicado pelo slug — usado na página individual. */
export async function getHourWithArticleBySlug(slug: string): Promise<HourWithArticle | null> {
  const { data, error } = await supabase
    .from("hour_with_articles")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (error || !data) return null;
  return mapRowToArticle(data);
}

/** O artigo publicado ligado a este jogo (se existir) — usado na página do jogo. */
export async function getHourWithArticleByGameId(gameId: string): Promise<HourWithArticle | null> {
  const { data, error } = await supabase
    .from("hour_with_articles")
    .select("*")
    .eq("game_id", gameId)
    .eq("is_published", true)
    .maybeSingle();

  if (error || !data) return null;
  return mapRowToArticle(data);
}

/** Todos os artigos, incluindo rascunhos — só para o admin. */
export async function getAllHourWithArticlesAdmin(): Promise<HourWithArticle[]> {
  const { data, error } = await supabase
    .from("hour_with_articles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erro ao carregar artigos 'Uma Hora Com' (admin) do Supabase:", error);
    return [];
  }

  return (data ?? []).map(mapRowToArticle);
}

/** Slugs publicados — usado para gerar o sitemap. */
export async function getAllHourWithSlugs(): Promise<string[]> {
  const { data, error } = await supabase
    .from("hour_with_articles")
    .select("slug")
    .eq("is_published", true);

  if (error) return [];
  return (data ?? []).map((row) => row.slug as string);
}
