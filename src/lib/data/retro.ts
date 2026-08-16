import { supabase } from "@/lib/supabase/client";
import type { RetroArticle } from "@/types";

function mapRowToArticle(row: Record<string, unknown>): RetroArticle {
  return {
    id: row.id as string,
    slug: row.slug as string,
    title: row.title as string,
    platform: (row.platform as string | null) ?? null,
    releaseYear: (row.release_year as number | null) ?? null,
    coverUrl: (row.cover_url as string | null) ?? null,
    heroImageUrl: (row.hero_image_url as string | null) ?? null,
    heroFocusX: typeof row.hero_focus_x === "number" ? row.hero_focus_x : 50,
    heroFocusY: typeof row.hero_focus_y === "number" ? row.hero_focus_y : 50,
    heroZoom: typeof row.hero_zoom === "number" ? row.hero_zoom : 100,
    youtubeUrl: (row.youtube_url as string | null) ?? null,
    body: (row.body as string) ?? "",
    pros: (row.pros as string[]) ?? [],
    contras: (row.contras as string[]) ?? [],
    veredicto: (row.veredicto as string) ?? "",
    valeAPenaHoje: (row.vale_a_pena_hoje as boolean | null) ?? null,
    isHeroFeatured: (row.is_hero_featured as boolean) ?? false,
    isPublished: (row.is_published as boolean) ?? false,
    createdAt: row.created_at as string,
  };
}

/** Artigos publicados, mais recentes primeiro — usado nas páginas públicas. */
export async function getRetroArticles(): Promise<RetroArticle[]> {
  const { data, error } = await supabase
    .from("retro_articles")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erro ao carregar artigos Retro+ do Supabase:", error);
    return [];
  }

  return (data ?? []).map(mapRowToArticle);
}

/** Um artigo publicado pelo slug — usado na página individual. */
export async function getRetroArticleBySlug(slug: string): Promise<RetroArticle | null> {
  const { data, error } = await supabase
    .from("retro_articles")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (error || !data) return null;
  return mapRowToArticle(data);
}

/** Todos os artigos, incluindo rascunhos — só para o admin. */
export async function getAllRetroArticlesAdmin(): Promise<RetroArticle[]> {
  const { data, error } = await supabase
    .from("retro_articles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erro ao carregar artigos Retro+ (admin) do Supabase:", error);
    return [];
  }

  return (data ?? []).map(mapRowToArticle);
}

/** Slugs publicados — usado para gerar o sitemap. */
export async function getAllRetroSlugs(): Promise<string[]> {
  const { data, error } = await supabase.from("retro_articles").select("slug").eq("is_published", true);
  if (error) return [];
  return (data ?? []).map((row) => row.slug as string);
}
