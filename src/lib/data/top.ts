import { supabase } from "@/lib/supabase/client";
import type { TopArticle } from "@/types";

function mapRowToArticle(row: Record<string, unknown>): TopArticle {
  return {
    id: row.id as string,
    slug: row.slug as string,
    title: row.title as string,
    coverUrl: (row.cover_url as string | null) ?? null,
    heroImageUrl: (row.hero_image_url as string | null) ?? null,
    heroFocusX: typeof row.hero_focus_x === "number" ? row.hero_focus_x : 50,
    heroZoom: typeof row.hero_zoom === "number" ? row.hero_zoom : 100,
    youtubeUrl: (row.youtube_url as string | null) ?? null,
    intro: (row.intro as string) ?? "",
    items: (row.items as TopArticle["items"]) ?? [],
    isHeroFeatured: (row.is_hero_featured as boolean) ?? false,
    isPublished: (row.is_published as boolean) ?? false,
    createdAt: row.created_at as string,
  };
}

/** Artigos publicados, mais recentes primeiro — usado nas páginas públicas. */
export async function getTopArticles(): Promise<TopArticle[]> {
  const { data, error } = await supabase
    .from("top_articles")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erro ao carregar artigos Top+ do Supabase:", error);
    return [];
  }

  return (data ?? []).map(mapRowToArticle);
}

/** Um artigo publicado pelo slug — usado na página individual. */
export async function getTopArticleBySlug(slug: string): Promise<TopArticle | null> {
  const { data, error } = await supabase
    .from("top_articles")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (error || !data) return null;
  return mapRowToArticle(data);
}

/** Todos os artigos, incluindo rascunhos — só para o admin. */
export async function getAllTopArticlesAdmin(): Promise<TopArticle[]> {
  const { data, error } = await supabase
    .from("top_articles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erro ao carregar artigos Top+ (admin) do Supabase:", error);
    return [];
  }

  return (data ?? []).map(mapRowToArticle);
}

/** Slugs publicados — usado para gerar o sitemap. */
export async function getAllTopSlugs(): Promise<string[]> {
  const { data, error } = await supabase.from("top_articles").select("slug").eq("is_published", true);
  if (error) return [];
  return (data ?? []).map((row) => row.slug as string);
}
