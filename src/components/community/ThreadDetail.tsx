"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { Gamepad2, Send, Trash2, Loader2 } from "lucide-react";
import type { ForumThread, ForumReply } from "@/types";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { AuthorBadge } from "@/components/community/AuthorBadge";
import { BanButton } from "@/components/community/BanButton";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import { useCommunityAuth } from "@/lib/hooks/useCommunityAuth";

interface PublicProfileRow {
  id: string;
  username: string | null;
  avatar_url: string | null;
  psn_url: string | null;
}

export function ThreadDetail({ threadId }: { threadId: string }) {
  const { ready, user, isEditor, isBanned, banReason } = useCommunityAuth();

  const [thread, setThread] = useState<ForumThread | null | "not-found">(null);
  const [replies, setReplies] = useState<ForumReply[]>([]);
  const [draft, setDraft] = useState("");
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    const supabase = createBrowserSupabaseClient();

    const { data: threadRow, error: threadError } = await supabase
      .from("forum_threads")
      .select("id, user_id, game_id, title, body, created_at, games(title, slug)")
      .eq("id", threadId)
      .maybeSingle();

    if (threadError || !threadRow) {
      setThread("not-found");
      return;
    }

    const { data: replyRows } = await supabase
      .from("forum_replies")
      .select("id, user_id, body, created_at")
      .eq("thread_id", threadId)
      .order("created_at", { ascending: true });

    const authorIds = [
      ...new Set([threadRow.user_id as string, ...(replyRows ?? []).map((r) => r.user_id as string)]),
    ];
    let authorsById = new Map<string, PublicProfileRow>();
    if (authorIds.length > 0) {
      const { data: authorRows } = await supabase
        .from("public_profiles")
        .select("id, username, avatar_url, psn_url")
        .in("id", authorIds);
      authorsById = new Map((authorRows ?? []).map((a) => [a.id as string, a as PublicProfileRow]));
    }

    const threadAuthor = authorsById.get(threadRow.user_id as string);
    const gameEmbed = threadRow.games as
      | { title: string; slug: string }[]
      | { title: string; slug: string }
      | null;
    const game = Array.isArray(gameEmbed) ? (gameEmbed[0] ?? null) : gameEmbed;

    setThread({
      id: threadRow.id as string,
      userId: threadRow.user_id as string,
      username: threadAuthor?.username ?? null,
      avatarUrl: threadAuthor?.avatar_url ?? null,
      psnUrl: threadAuthor?.psn_url ?? null,
      gameId: threadRow.game_id as string | null,
      gameTitle: game?.title ?? null,
      gameSlug: game?.slug ?? null,
      title: threadRow.title as string,
      body: threadRow.body as string,
      createdAt: threadRow.created_at as string,
      repliesCount: (replyRows ?? []).length,
    });

    setReplies(
      (replyRows ?? []).map((r) => {
        const author = authorsById.get(r.user_id as string);
        return {
          id: r.id as string,
          threadId,
          userId: r.user_id as string,
          username: author?.username ?? null,
          avatarUrl: author?.avatar_url ?? null,
          psnUrl: author?.psn_url ?? null,
          body: r.body as string,
          createdAt: r.created_at as string,
        };
      })
    );
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [threadId]);

  async function handleReply(e: FormEvent) {
    e.preventDefault();
    if (!draft.trim() || !user) return;

    setPosting(true);
    setError(null);

    const supabase = createBrowserSupabaseClient();
    const { data: inserted, error: insertError } = await supabase
      .from("forum_replies")
      .insert({ thread_id: threadId, user_id: user.id, body: draft.trim() })
      .select("id, created_at")
      .single();

    setPosting(false);

    if (insertError || !inserted) {
      console.error("Erro ao responder:", insertError);
      setError("Não foi possível publicar. Tenta novamente.");
      return;
    }

    const { data: ownProfile } = await supabase
      .from("public_profiles")
      .select("username, avatar_url, psn_url")
      .eq("id", user.id)
      .maybeSingle();

    setReplies((prev) => [
      ...prev,
      {
        id: inserted.id as string,
        threadId,
        userId: user.id,
        username: ownProfile?.username ?? null,
        avatarUrl: ownProfile?.avatar_url ?? null,
        psnUrl: ownProfile?.psn_url ?? null,
        body: draft.trim(),
        createdAt: inserted.created_at as string,
      },
    ]);
    setDraft("");
  }

  async function handleDeleteReply(replyId: string) {
    const supabase = createBrowserSupabaseClient();
    const previous = replies;
    setReplies((prev) => prev.filter((r) => r.id !== replyId));
    const { error: deleteError } = await supabase.from("forum_replies").delete().eq("id", replyId);
    if (deleteError) setReplies(previous);
  }

  async function handleDeleteThread() {
    if (!confirm("Apagar este tópico e todas as respostas? Não é possível desfazer.")) return;
    const supabase = createBrowserSupabaseClient();
    const { error: deleteError } = await supabase.from("forum_threads").delete().eq("id", threadId);
    if (!deleteError) window.location.href = "/comunidade";
  }

  if (thread === "not-found") {
    return (
      <>
        <Header />
        <main>
          <PageHeader title="Tópico não encontrado" />
          <div className="mx-auto max-w-2xl px-4 py-10 lg:px-8">
            <Link href="/comunidade" className="text-sm text-primary hover:text-primary-light">
              ← Voltar à Comunidade
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main>
        <PageHeader title="Comunidade" />
        <div className="mx-auto max-w-2xl px-4 py-10 lg:px-8">
          <Link href="/comunidade" className="text-xs text-ink-muted hover:text-ink">
            ← Voltar aos tópicos
          </Link>

          {!thread ? (
            <p className="mt-6 text-sm text-ink-muted">A carregar...</p>
          ) : (
            <>
              <Card className="mt-4 p-6">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h1 className="font-display text-xl font-bold text-ink">{thread.title}</h1>
                    {thread.gameTitle && thread.gameSlug && (
                      <Link
                        href={`/guias/${thread.gameSlug}`}
                        className="mt-2 inline-flex items-center gap-1 rounded-full border border-accent/40 bg-accent/10 px-2 py-0.5 text-[11px] font-medium text-accent hover:bg-accent/20"
                      >
                        <Gamepad2 width={11} height={11} />
                        {thread.gameTitle}
                      </Link>
                    )}
                  </div>
                  {(user?.id === thread.userId || isEditor) && (
                    <button
                      type="button"
                      onClick={handleDeleteThread}
                      title="Apagar tópico"
                      className="shrink-0 text-ink-dim hover:text-primary-light"
                    >
                      <Trash2 width={15} height={15} />
                    </button>
                  )}
                </div>

                <p className="mt-4 whitespace-pre-line text-sm text-ink-muted">{thread.body}</p>

                <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                  <AuthorBadge
                    username={thread.username}
                    avatarUrl={thread.avatarUrl}
                    psnUrl={thread.psnUrl}
                    createdAt={thread.createdAt}
                  />
                  {isEditor && user?.id !== thread.userId && (
                    <BanButton targetUserId={thread.userId} targetUsername={thread.username} />
                  )}
                </div>
              </Card>

              <div className="mt-6 flex flex-col divide-y divide-border rounded-sm border border-border bg-bg-surface">
                {replies.map((reply) => (
                  <div key={reply.id} className="flex items-start justify-between gap-3 p-4">
                    <div className="min-w-0 flex-1">
                      <AuthorBadge
                        username={reply.username}
                        avatarUrl={reply.avatarUrl}
                        psnUrl={reply.psnUrl}
                        createdAt={reply.createdAt}
                      />
                      <p className="mt-1.5 whitespace-pre-line pl-10 text-sm text-ink-muted">
                        {reply.body}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      {isEditor && user?.id !== reply.userId && (
                        <BanButton targetUserId={reply.userId} targetUsername={reply.username} />
                      )}
                      {(user?.id === reply.userId || isEditor) && (
                        <button
                          type="button"
                          onClick={() => handleDeleteReply(reply.id)}
                          title="Apagar resposta"
                          className="text-ink-dim hover:text-primary-light"
                        >
                          <Trash2 width={13} height={13} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {replies.length === 0 && (
                  <p className="p-4 text-sm text-ink-muted">Ainda sem respostas.</p>
                )}
              </div>

              <div className="mt-4">
                {!ready ? null : isBanned ? (
                  <div className="rounded-sm border border-primary/30 bg-primary/5 px-4 py-3 text-sm text-ink-muted">
                    A tua conta está impedida de publicar.
                    {banReason && <span> Motivo: {banReason}</span>}
                  </div>
                ) : user ? (
                  <form onSubmit={handleReply} className="flex gap-2">
                    <input
                      type="text"
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      placeholder="Escreve uma resposta..."
                      disabled={posting}
                      className="h-11 min-w-0 flex-1 rounded-sm border border-border bg-bg-surface2 px-3 text-sm text-ink placeholder:text-ink-dim outline-none focus:border-primary disabled:opacity-60"
                    />
                    <Button type="submit" size="md" disabled={posting}>
                      {posting ? (
                        <Loader2 width={15} height={15} className="animate-spin" />
                      ) : (
                        <Send width={15} height={15} />
                      )}
                    </Button>
                  </form>
                ) : (
                  <Link
                    href={`/entrar?next=/comunidade/${threadId}`}
                    className="block rounded-sm border border-dashed border-border px-4 py-3 text-center text-sm text-ink-muted transition-colors hover:border-border-light hover:text-ink"
                  >
                    Entra na tua conta para responderes
                  </Link>
                )}
                {error && <p className="mt-2 text-xs text-primary-light">{error}</p>}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
