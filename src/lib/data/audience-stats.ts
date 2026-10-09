import { supabase } from "@/lib/supabase/client";

export interface AudienceStats {
  tiktokFollowers: number;
  tiktokViews: number;
  tiktokViewsDays: number;
  youtubeSubscribers: number;
  youtubeViews: number;
  instagramFollowers: number;
  instagramViews: number;
  instagramViewsDays: number;
  /** Quando os números foram atualizados pela última vez (ISO). */
  updatedAt: string | null;
}

export const DEFAULT_AUDIENCE_STATS: AudienceStats = {
  tiktokFollowers: 826,
  tiktokViews: 42000,
  tiktokViewsDays: 60,
  youtubeSubscribers: 517,
  youtubeViews: 12644,
  instagramFollowers: 150,
  instagramViews: 15000,
  instagramViewsDays: 30,
  updatedAt: null,
};

export function mapRowToAudienceStats(row: Record<string, unknown>): AudienceStats {
  const num = (v: unknown, fallback: number) => (typeof v === "number" ? v : fallback);
  const d = DEFAULT_AUDIENCE_STATS;
  return {
    tiktokFollowers: num(row.tiktok_followers, d.tiktokFollowers),
    tiktokViews: num(row.tiktok_views, d.tiktokViews),
    tiktokViewsDays: num(row.tiktok_views_days, d.tiktokViewsDays),
    youtubeSubscribers: num(row.youtube_subscribers, d.youtubeSubscribers),
    youtubeViews: num(row.youtube_views, d.youtubeViews),
    instagramFollowers: num(row.instagram_followers, d.instagramFollowers),
    instagramViews: num(row.instagram_views, d.instagramViews),
    instagramViewsDays: num(row.instagram_views_days, d.instagramViewsDays),
    updatedAt: (row.updated_at as string | null) ?? null,
  };
}

/**
 * Números de audiência editados no admin (/admin/estatisticas). Se a
 * tabela ainda não existir ou falhar, usa valores por omissão em vez de
 * partir a página de Imprensa.
 */
export async function getAudienceStats(): Promise<AudienceStats> {
  const { data, error } = await supabase
    .from("audience_stats")
    .select("*")
    .eq("id", 1)
    .maybeSingle();

  if (error || !data) return DEFAULT_AUDIENCE_STATS;
  return mapRowToAudienceStats(data);
}

/** 42000 -> "42K", 12644 -> "12.6K", 805 -> "805". */
export function formatCount(n: number): string {
  if (n >= 1_000_000) {
    const m = n / 1_000_000;
    return `${Number.isInteger(m) ? m : m.toFixed(1)}M`;
  }
  if (n >= 1000) {
    const k = Math.round((n / 1000) * 10) / 10;
    return `${Number.isInteger(k) ? k : k.toFixed(1)}K`;
  }
  return String(n);
}

/** "outubro de 2026" a partir de uma data ISO. */
export function formatMonthYear(iso: string | null): string {
  const date = iso ? new Date(iso) : new Date();
  return date.toLocaleDateString("pt-PT", { month: "long", year: "numeric" });
}
