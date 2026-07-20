"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import { useCommunityAuth } from "@/lib/hooks/useCommunityAuth";

interface GameOption {
  id: string;
  title: string;
}

export default function NovoTopicoPage() {
  const router = useRouter();
  const { ready, user, isBanned, banReason } = useCommunityAuth();

  const [games, setGames] = useState<GameOption[]>([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [gameId, setGameId] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createBrowserSupabaseClient();
    supabase
      .from("games")
      .select("id, title")
      .eq("is_published", true)
      .order("title", { ascending: true })
      .then(({ data }) => setGames(data ?? []));
  }, []);

  useEffect(() => {
    if (ready && !user) {
      router.push("/entrar?next=/comunidade/novo");
    }
  }, [ready, user, router]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!user || !title.trim() || !body.trim()) return;

    setSaving(true);
    setError(null);

    const supabase = createBrowserSupabaseClient();
    const { data, error: insertError } = await supabase
      .from("forum_threads")
      .insert({
        user_id: user.id,
        title: title.trim(),
        body: body.trim(),
        game_id: gameId || null,
      })
      .select("id")
      .single();

    setSaving(false);

    if (insertError || !data) {
      console.error("Erro ao criar tópico:", insertError);
      setError("Não foi possível criar o tópico. Tenta novamente.");
      return;
    }

    router.push(`/comunidade/${data.id}`);
  }

  if (!ready || !user) return null;

  return (
    <>
      <Header />
      <main>
        <PageHeader title="Novo Tópico" description="Pergunta, discute ou partilha algo com a comunidade." />
        <div className="mx-auto max-w-2xl px-4 py-10 lg:px-8">
          {isBanned ? (
            <Card className="p-6">
              <p className="text-sm text-ink-muted">
                A tua conta está impedida de publicar.
                {banReason && <span> Motivo: {banReason}</span>}
              </p>
            </Card>
          ) : (
            <Card className="p-6">
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-medium uppercase tracking-wide text-ink-dim">
                    Título
                  </span>
                  <input
                    required
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex: Como apanhar o troféu X em Y?"
                    className="h-11 rounded-sm border border-border bg-bg-surface2 px-3 text-sm text-ink placeholder:text-ink-dim outline-none focus:border-primary"
                  />
                </label>

                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-medium uppercase tracking-wide text-ink-dim">
                    Jogo relacionado (opcional)
                  </span>
                  <select
                    value={gameId}
                    onChange={(e) => setGameId(e.target.value)}
                    className="h-11 rounded-sm border border-border bg-bg-surface2 px-3 text-sm text-ink outline-none focus:border-primary"
                  >
                    <option value="">— nenhum, é discussão geral —</option>
                    {games.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.title}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-medium uppercase tracking-wide text-ink-dim">
                    Mensagem
                  </span>
                  <textarea
                    required
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    rows={6}
                    className="resize-y rounded-sm border border-border bg-bg-surface2 px-3 py-2.5 text-sm text-ink outline-none focus:border-primary"
                  />
                </label>

                {error && <p className="text-sm text-primary-light">{error}</p>}

                <Button type="submit" disabled={saving} className="w-fit">
                  {saving ? "A publicar..." : "Publicar Tópico"}
                </Button>
              </form>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
