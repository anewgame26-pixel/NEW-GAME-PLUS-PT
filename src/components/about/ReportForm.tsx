"use client";

import { FormEvent, useState } from "react";
import { Check, Flag } from "lucide-react";
import { Game } from "@/types";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

interface ReportFormProps {
  games: Game[];
}

export function ReportForm({ games }: ReportFormProps) {
  const [gameSlug, setGameSlug] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!location.trim() || !description.trim()) return;

    setSubmitting(true);
    setError(null);

    const supabase = createBrowserSupabaseClient();
    const { data: userRes } = await supabase.auth.getUser();
    const game = games.find((g) => g.slug === gameSlug);

    const { error: insertError } = await supabase.from("reports").insert({
      game_id: game?.id ?? null,
      location: location.trim(),
      description: description.trim(),
      reporter_email: email.trim() || null,
      user_id: userRes.user?.id ?? null,
    });

    setSubmitting(false);

    if (insertError) {
      console.error("Erro ao enviar o report:", insertError);
      setError("Não foi possível enviar. Tenta novamente.");
      return;
    }

    setSubmitted(true);
  }

  if (submitted) {
    return (
      <Card className="flex flex-col items-center gap-3 p-8 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
          <Check width={22} height={22} />
        </span>
        <p className="font-display text-base font-bold text-ink">Obrigado pelo aviso!</p>
        <p className="max-w-sm text-sm text-ink-muted">
          A equipa vai rever o erro reportado o mais rapidamente possível.
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium uppercase tracking-wide text-ink-dim">
            Jogo relacionado (opcional)
          </span>
          <select
            value={gameSlug}
            onChange={(e) => setGameSlug(e.target.value)}
            className="h-11 rounded-sm border border-border bg-bg-surface2 px-3 text-sm text-ink outline-none focus:border-primary"
          >
            <option value="">Não é sobre um jogo específico</option>
            {games.map((g) => (
              <option key={g.id} value={g.slug}>
                {g.title}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium uppercase tracking-wide text-ink-dim">
            Onde encontraste o erro?
          </span>
          <input
            required
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Ex: Guia, Roadmap, Timeline, dados de dificuldade..."
            className="h-11 rounded-sm border border-border bg-bg-surface2 px-3 text-sm text-ink placeholder:text-ink-dim outline-none focus:border-primary"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium uppercase tracking-wide text-ink-dim">
            Descrição do erro
          </span>
          <textarea
            required
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Explica o que está incorreto ou em falta..."
            className="resize-y rounded-sm border border-border bg-bg-surface2 px-3 py-2.5 text-sm text-ink placeholder:text-ink-dim outline-none focus:border-primary"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium uppercase tracking-wide text-ink-dim">
            O teu email (opcional, caso precisemos de mais detalhes)
          </span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="o-teu-email@exemplo.com"
            className="h-11 rounded-sm border border-border bg-bg-surface2 px-3 text-sm text-ink placeholder:text-ink-dim outline-none focus:border-primary"
          />
        </label>

        {error && <p className="text-sm text-primary-light">{error}</p>}

        <Button type="submit" disabled={submitting} className="self-start">
          <Flag width={15} height={15} />
          {submitting ? "A enviar..." : "Reportar Erro"}
        </Button>
      </form>
    </Card>
  );
}
