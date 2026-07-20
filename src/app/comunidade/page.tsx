"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MessageSquare, Plus, Gamepad2 } from "lucide-react";
import type { ForumThread } from "@/types";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { AuthorBadge } from "@/components/community/AuthorBadge";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import { useCommunityAuth } from "@/lib/hooks/useCommunityAuth";

interface PublicProfileRow {
  id: string;
  username: string | null;
  avatar_url: string | null;
  psn_url: string | null;
}

export default function ComunidadePage() {
  const { ready, user } = useCommunityAuth();
  const [threads, setThreads] = useState<ForumThread[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createBrowserSupabaseClient();

      const [{ data: threadRows, error }, { data: replyRows }] = await Promise.all([
        supabase
          .from("forum_threads")
          .select("id, user_id, game_id, title, body, created_at, games(title, slug)")
          .order("created_at", { ascending: false }),
        supabase.from("forum_replies").select("thread_id"),
      ]);

      if (error) {
        console.error("Erro ao carregar tópicos:", error);
        setLoading(false);
        return;
      }

      const repliesCountByThread = new Map<string, number>();
      (replyRows ?? []).forEach((r) => {
        const id = r.thread_id as string;
        repliesCountByThread.set(id, (repliesCountByThread.get(id) ?? 0) + 1);
      });

      const authorIds = [...new Set((threadRows ?? []).map((t) => t.user_id as string))];
      let authorsById = new Map<string, PublicProfileRow>();
      if (authorIds.length > 0) {
        const { data: authorRows } = await supabase
          .from("public_profiles")
          .select("id, username, avatar_url, psn_url")
          .in("id", authorIds);
        authorsById = new Map((authorRows ?? []).map((a) => [a.id as string, a as PublicProfileRow]));
      }

      setThreads(
        (threadRows ?? []).map((t) => {
          const author = authorsById.get(t.user_id as string);
          const gameEmbed = t.games as { title: string; slug: string }[] | { title: string; slug: string } | null;
          const game = Array.isArray(gameEmbed) ? (gameEmbed[0] ?? null) : gameEmbed;
          return {
            id: t.id as string,
            userId: t.user_id as string,
            username: author?.username ?? null,
            avatarUrl: author?.avatar_url ?? null,
            psnUrl: author?.psn_url ?? null,
            gameId: t.game_id as string | null,
            gameTitle: game?.title ?? null,
            gameSlug: game?.slug ?? null,
            title: t.title as string,
            body: t.body as string,
            createdAt: t.created_at as string,
            repliesCount: repliesCountByThread.get(t.id as string) ?? 0,
          };
        })
      );
      setLoading(false);
    }

    load();
  }, []);

  return (
    <>
      <Header />
      <main>
        <PageHeader
          title="Comunidade"
          description="Pede ajuda, discute estratégias ou fala sobre o que quiseres com outros caçadores de troféus."
        />
        <div className="mx-auto max-w-3xl px-4 py-10 lg:px-8">
          <div className="mb-6 flex justify-end">
            <Link
              href={ready && user ? "/comunidade/novo" : "/entrar?next=/comunidade/novo"}
              className="flex items-center gap-1.5 rounded-sm bg-primary px-4 py-2 text-sm font-semibold text-white shadow-glow hover:bg-primary-light"
            >
              <Plus width={15} height={15} />
              Novo Tópico
            </Link>
          </div>

          {loading ? (
            <p className="py-8 text-center text-sm text-ink-muted">A carregar...</p>
          ) : threads.length === 0 ? (
            <Card className="p-6">
              <p className="text-sm text-ink-muted">
                Ainda não há tópicos. Sê a primeira pessoa a criar um.
              </p>
            </Card>
          ) : (
            <div className="flex flex-col gap-3">
              {threads.map((thread) => (
                <Link key={thread.id} href={`/comunidade/${thread.id}`}>
                  <Card className="p-5 transition-colors hover:border-border-light hover:bg-bg-surface2">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="font-display text-base font-bold text-ink">{thread.title}</p>
                        <p className="mt-1 line-clamp-2 text-sm text-ink-muted">{thread.body}</p>

                        {thread.gameTitle && (
                          <span className="mt-2 inline-flex items-center gap-1 rounded-full border border-accent/40 bg-accent/10 px-2 py-0.5 text-[11px] font-medium text-accent">
                            <Gamepad2 width={11} height={11} />
                            {thread.gameTitle}
                          </span>
                        )}

                        <div className="mt-3">
                          <AuthorBadge
                            username={thread.username}
                            avatarUrl={thread.avatarUrl}
                            psnUrl={thread.psnUrl}
                            createdAt={thread.createdAt}
                          />
                        </div>
                      </div>

                      <span className="flex shrink-0 items-center gap-1 text-xs text-ink-dim">
                        <MessageSquare width={13} height={13} />
                        {thread.repliesCount}
                      </span>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
