"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageCircle, Send, Trash2, Loader2 } from "lucide-react";
import type { GameComment } from "@/types";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import { useCommunityAuth } from "@/lib/hooks/useCommunityAuth";
import { AuthorBadge } from "@/components/community/AuthorBadge";
import { BanButton } from "@/components/community/BanButton";

interface GameEngagementBarProps {
  gameId: string;
  gameTitle: string;
}

interface PublicProfileRow {
  id: string;
  username: string | null;
  avatar_url: string | null;
  psn_url: string | null;
}

export function GameEngagementBar({ gameId, gameTitle }: GameEngagementBarProps) {
  const pathname = usePathname();
  const { ready, user, isEditor, isBanned, banReason } = useCommunityAuth();

  const [comments, setComments] = useState<GameComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState("");
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadComments() {
    const supabase = createBrowserSupabaseClient();
    const { data: commentRows, error: commentsError } = await supabase
      .from("game_comments")
      .select("id, user_id, body, created_at")
      .eq("game_id", gameId)
      .order("created_at", { ascending: false });

    if (commentsError) {
      console.error("Erro ao carregar comentários:", commentsError);
      setLoading(false);
      return;
    }

    const authorIds = [...new Set((commentRows ?? []).map((c) => c.user_id as string))];
    let authorsById = new Map<string, PublicProfileRow>();

    if (authorIds.length > 0) {
      const { data: authorRows } = await supabase
        .from("public_profiles")
        .select("id, username, avatar_url, psn_url")
        .in("id", authorIds);
      authorsById = new Map((authorRows ?? []).map((a) => [a.id as string, a as PublicProfileRow]));
    }

    setComments(
      (commentRows ?? []).map((c) => {
        const author = authorsById.get(c.user_id as string);
        return {
          id: c.id as string,
          userId: c.user_id as string,
          username: author?.username ?? null,
          avatarUrl: author?.avatar_url ?? null,
          psnUrl: author?.psn_url ?? null,
          body: c.body as string,
          createdAt: c.created_at as string,
        };
      })
    );
    setLoading(false);
  }

  useEffect(() => {
    loadComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameId]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!draft.trim() || !user) return;

    setPosting(true);
    setError(null);

    const supabase = createBrowserSupabaseClient();
    const { data: inserted, error: insertError } = await supabase
      .from("game_comments")
      .insert({ game_id: gameId, user_id: user.id, body: draft.trim() })
      .select("id, created_at")
      .single();

    setPosting(false);

    if (insertError || !inserted) {
      console.error("Erro ao publicar comentário:", insertError);
      setError("Não foi possível publicar. Tenta novamente.");
      return;
    }

    const { data: ownProfile } = await supabase
      .from("public_profiles")
      .select("username, avatar_url, psn_url")
      .eq("id", user.id)
      .maybeSingle();

    setComments((prev) => [
      {
        id: inserted.id as string,
        userId: user.id,
        username: ownProfile?.username ?? null,
        avatarUrl: ownProfile?.avatar_url ?? null,
        psnUrl: ownProfile?.psn_url ?? null,
        body: draft.trim(),
        createdAt: inserted.created_at as string,
      },
      ...prev,
    ]);
    setDraft("");
  }

  async function handleDelete(commentId: string) {
    const supabase = createBrowserSupabaseClient();
    const previous = comments;
    setComments((prev) => prev.filter((c) => c.id !== commentId));

    const { error: deleteError } = await supabase.from("game_comments").delete().eq("id", commentId);
    if (deleteError) {
      console.error("Erro ao apagar comentário:", deleteError);
      setComments(previous);
    }
  }

  return (
    <section className="border-t border-border py-10">
      <div className="mx-auto max-w-[1440px] px-4 lg:px-8">
        <Card className="p-6">
          <div className="border-b border-border pb-5">
            <h2 className="font-display text-lg font-bold uppercase tracking-wide text-ink">
              O que achas de {gameTitle}?
            </h2>
            <p className="mt-1 text-sm text-ink-muted">
              Deixa o teu comentário, tira dúvidas ou pede ajuda à comunidade.
            </p>
          </div>

          <div className="mt-5">
            {!ready ? null : isBanned ? (
              <div className="rounded-sm border border-primary/30 bg-primary/5 px-4 py-3 text-sm text-ink-muted">
                A tua conta está impedida de publicar.
                {banReason && <span> Motivo: {banReason}</span>}
              </div>
            ) : user ? (
              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Escreve um comentário..."
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
                href={`/entrar?next=${encodeURIComponent(pathname)}`}
                className="block rounded-sm border border-dashed border-border px-4 py-3 text-center text-sm text-ink-muted transition-colors hover:border-border-light hover:text-ink"
              >
                Entra na tua conta para deixares um comentário
              </Link>
            )}
            {error && <p className="mt-2 text-xs text-primary-light">{error}</p>}

            <div className="mt-5 flex items-center gap-2 text-xs uppercase tracking-wide text-ink-dim">
              <MessageCircle width={13} height={13} />
              {loading ? "A carregar..." : `${comments.length} comentários`}
            </div>

            <ul className="mt-3 flex flex-col divide-y divide-border">
              {comments.map((comment) => (
                <li key={comment.id} className="flex items-start justify-between gap-3 py-3 first:pt-0 last:pb-0">
                  <div className="min-w-0 flex-1">
                    <AuthorBadge
                      username={comment.username}
                      avatarUrl={comment.avatarUrl}
                      psnUrl={comment.psnUrl}
                    />
                    <p className="mt-1.5 pl-10 text-sm text-ink-muted">{comment.body}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    {isEditor && user?.id !== comment.userId && (
                      <BanButton targetUserId={comment.userId} targetUsername={comment.username} />
                    )}
                    {(user?.id === comment.userId || isEditor) && (
                      <button
                        type="button"
                        onClick={() => handleDelete(comment.id)}
                        aria-label="Apagar comentário"
                        title="Apagar comentário"
                        className="text-ink-dim hover:text-primary-light"
                      >
                        <Trash2 width={13} height={13} />
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>

            {!loading && comments.length === 0 && (
              <p className="py-4 text-sm text-ink-muted">
                Ainda não há comentários — sê o primeiro a escrever.
              </p>
            )}
          </div>
        </Card>
      </div>
    </section>
  );
}
