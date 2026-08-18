import { supabase } from "@/lib/supabase/client";
import type { CommunityPost } from "@/types";

function timeAgo(dateStr: string): string {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "agora mesmo";
  if (minutes < 60) return `há ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `há ${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `há ${days} ${days === 1 ? "dia" : "dias"}`;
  const weeks = Math.floor(days / 7);
  return `há ${weeks} ${weeks === 1 ? "semana" : "semanas"}`;
}

interface CommunityHighlights {
  posts: CommunityPost[];
  /**
   * Não temos ligação em tempo real ao Discord (isso exigiria configurar
   * a integração lá no servidor deles), por isso este número é uma
   * aproximação: quantas pessoas diferentes publicaram ou responderam na
   * comunidade nos últimos 7 dias.
   */
  onlineCount: number;
}

/** Últimos tópicos da comunidade (/comunidade) para mostrar na homepage. */
export async function getCommunityHighlights(limit = 4): Promise<CommunityHighlights> {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const [{ data: threadRows, error }, { data: replyRows }, { data: recentActivity }] = await Promise.all([
    supabase
      .from("forum_threads")
      .select("id, user_id, title, created_at")
      .order("created_at", { ascending: false })
      .limit(limit),
    supabase.from("forum_replies").select("thread_id"),
    supabase
      .from("forum_replies")
      .select("user_id")
      .gte("created_at", sevenDaysAgo),
  ]);

  if (error) {
    console.error("Erro ao carregar destaques da comunidade:", error);
    return { posts: [], onlineCount: 0 };
  }

  const threads = threadRows ?? [];

  const repliesCountByThread = new Map<string, number>();
  (replyRows ?? []).forEach((r) => {
    const id = r.thread_id as string;
    repliesCountByThread.set(id, (repliesCountByThread.get(id) ?? 0) + 1);
  });

  const authorIds = [...new Set(threads.map((t) => t.user_id as string))];
  let authorsById = new Map<string, string>();
  if (authorIds.length > 0) {
    const { data: authorRows } = await supabase
      .from("public_profiles")
      .select("id, username")
      .in("id", authorIds);
    authorsById = new Map((authorRows ?? []).map((a) => [a.id as string, a.username as string]));
  }

  const posts: CommunityPost[] = threads.map((t) => ({
    id: t.id as string,
    author: authorsById.get(t.user_id as string) ?? "Anónimo",
    title: t.title as string,
    repliesCount: repliesCountByThread.get(t.id as string) ?? 0,
    timeAgo: timeAgo(t.created_at as string),
  }));

  const activeUserIds = new Set(
    [...(recentActivity ?? []).map((r) => r.user_id as string), ...threads.map((t) => t.user_id as string)]
  );

  return { posts, onlineCount: activeUserIds.size };
}
