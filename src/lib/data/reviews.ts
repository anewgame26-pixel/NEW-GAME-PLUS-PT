import { supabase } from "@/lib/supabase/client";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { ReviewArticle } from "@/types";

function mapRowToArticle(row: Record<string, unknown>): ReviewArticle {
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
    intro: (row.intro as string) ?? "",
    gameplay: (row.gameplay as string) ?? "",
    historia: (row.historia as string) ?? "",
    graficos: (row.graficos as string) ?? "",
    somMusica: (row.som_musica as string) ?? "",
    performance: (row.performance as string) ?? "",
    pros: (row.pros as string[]) ?? [],
    contras: (row.contras as string[]) ?? [],
    veredicto: (row.veredicto as string) ?? "",
    nota: typeof row.nota === "number" ? row.nota : null,
    isHeroFeatured: (row.is_hero_featured as boolean) ?? false,
    heroOrder: typeof row.hero_order === "number" ? row.hero_order : null,
    isPublished: (row.is_published as boolean) ?? false,
    createdAt: row.created_at as string,
    authorId: (row.author_id as string | null) ?? null,
  };
}

/** Reviews publicadas, mais recentes primeiro — usado nas páginas públicas. */
export async function getReviews(): Promise<ReviewArticle[]> {
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("is_published", true)
    .order("date_played", { ascending: false, nullsFirst: false });

  if (error) {
    console.error("Erro ao carregar reviews do Supabase:", error);
    return [];
  }

  return (data ?? []).map(mapRowToArticle);
}

/** Uma review publicada pelo slug — usado na página individual. */
export async function getReviewBySlug(slug: string): Promise<ReviewArticle | null> {
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (error || !data) return null;
  return mapRowToArticle(data);
}

/** A review publicada ligada a este jogo (se existir) — usado na página do jogo. */
export async function getReviewByGameId(gameId: string): Promise<ReviewArticle | null> {
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("game_id", gameId)
    .eq("is_published", true)
    .maybeSingle();

  if (error || !data) return null;
  return mapRowToArticle(data);
}

/**
 * Todas as reviews, incluindo rascunhos — só para o admin.
 *
 * Usa o cliente do SERVIDOR (com a sessão do editor, lida dos cookies) em
 * vez do cliente público — os rascunhos (is_published = false) só são
 * visíveis para quem estiver autenticado como editor.
 */
export async function getAllReviewsAdmin(): Promise<ReviewArticle[]> {
  const supabaseServer = await createServerSupabaseClient();
  const { data, error } = await supabaseServer
    .from("reviews")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erro ao carregar reviews (admin) do Supabase:", error);
    return [];
  }

  return (data ?? []).map(mapRowToArticle);
}

/** Slugs publicados — usado para gerar o sitemap. */
export async function getAllReviewSlugs(): Promise<string[]> {
  const { data, error } = await supabase
    .from("reviews")
    .select("slug")
    .eq("is_published", true);

  if (error) return [];
  return (data ?? []).map((row) => row.slug as string);
}
