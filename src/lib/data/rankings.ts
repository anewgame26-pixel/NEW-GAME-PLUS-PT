import { supabase } from "@/lib/supabase/client";
import type { RankingCategory } from "@/types";

/**
 * Vai buscar as categorias de rankings (tabela ranking_categories), na
 * mesma ordem definida no painel/editor (sort_order).
 */
export async function getRankingCategories(): Promise<RankingCategory[]> {
  const { data, error } = await supabase
    .from("ranking_categories")
    .select("slug, label, description, icon")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Erro ao carregar categorias de rankings do Supabase:", error);
    return [];
  }

  return (data ?? []).map((row) => ({
    id: row.slug as string,
    label: row.label as string,
    description: row.description as string,
    icon: row.icon as RankingCategory["icon"],
    href: `/rankings/${row.slug}`,
  }));
}
