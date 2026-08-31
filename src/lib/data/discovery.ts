import { supabase } from "@/lib/supabase/client";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { DiscoveryArticle } from "@/types";

function mapRowToArticle(row: Record<string, unknown>): DiscoveryArticle {
  return {
    id: row.id as string,
    slug: row.slug as string,
    title: row.title as string,
    platform: (row.platform as string | null) ?? null,
    releaseYear: (row.release_year as number | null) ?? null,
    gameId: (row.game_id as string | null) ?? null,
    coverUrl: (row.cover_url as string | null) ?? null,
    heroImageUrl: (row.hero_image_url as string | null) ?? null,
    heroFocusX: typeof row.hero_focus_x === "number" ? row.hero_focus_x : 50,
    heroFocusY: typeof row.hero_focus_y === "number" ? row.hero_focus_y : 50,
    heroZoom: typeof row.hero_zoom === "number" ? row.hero_zoom : 100,
    youtubeUrl: (row.youtube_url as string | null) ?? null,
    tags: (row.tags as string[]) ?? [],
    body: (row.body as string) ?? "",
    pros: (row.pros as string[]) ?? [],
    contras: (row.contras as string[]) ?? [],
    veredicto: (row.veredicto as string) ?? "",
    recomendamos: (row.recomendamos as boolean | null) ?? null,
    isHeroFeatured: (row.is_hero_featured as boolean) ?? false,
    isPublished: (row.is_published as boolean) ?? false,
    createdAt: row.created_at as string,
    authorId: (row.author_id as string | null) ?? null,
  };
}

/** Artigos publicados, mais recentes primeiro — usado nas páginas públicas. */
export async function getDiscoveryArticles(): Promise<DiscoveryArticle[]> {
  const { data, error } = await supabase
    .from("discovery_articles")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erro ao carregar artigos Descobertas+ do Supabase:", error);
    return [];
  }

  return (data ?? []).map(mapRowToArticle);
}

/** Um artigo publicado pelo slug — usado na página individual. */
export async function getDiscoveryArticleBySlug(slug: string): Promise<DiscoveryArticle | null> {
  const { data, error } = await supabase
    .from("discovery_articles")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (error || !data) return null;
  return mapRowToArticle(data);
}

/** O artigo publicado ligado a este jogo (se existir) — usado na página do jogo. */
export async function getDiscoveryArticleByGameId(gameId: string): Promise<DiscoveryArticle | null> {
  const { data, error } = await supabase
    .from("discovery_articles")
    .select("*")
    .eq("game_id", gameId)
    .eq("is_published", true)
    .maybeSingle();

  if (error || !data) return null;
  return mapRowToArticle(data);
}

/** Todos os artigos, incluindo rascunhos — só para o admin. */
export async function getAllDiscoveryArticlesAdmin(): Promise<DiscoveryArticle[]> {
  const supabaseServer = await createServerSupabaseClient();
  const { data, error } = await supabaseServer
    .from("discovery_articles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erro ao carregar artigos Descobertas+ (admin) do Supabase:", error);
    return [];
  }

  return (data ?? []).map(mapRowToArticle);
}

/** Slugs publicados — usado para gerar o sitemap. */
export async function getAllDiscoverySlugs(): Promise<string[]> {
  const { data, error } = await supabase
    .from("discovery_articles")
    .select("slug")
    .eq("is_published", true);
  if (error) return [];
  return (data ?? []).map((row) => row.slug as string);
}
