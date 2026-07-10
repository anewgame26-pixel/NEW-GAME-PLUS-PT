"use client";

import { FormEvent, useState } from "react";
import { Check, Flag } from "lucide-react";
import { Game } from "@/types";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface ReportFormProps {
  games: Game[];
}

export function ReportForm({ games }: ReportFormProps) {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
  };

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
          <select className="h-11 rounded-sm border border-border bg-bg-surface2 px-3 text-sm text-ink outline-none focus:border-primary">
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
            placeholder="Explica o que está incorreto ou em falta..."
            className="resize-none rounded-sm border border-border bg-bg-surface2 px-3 py-2.5 text-sm text-ink placeholder:text-ink-dim outline-none focus:border-primary"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium uppercase tracking-wide text-ink-dim">
            O teu email (opcional, caso precisemos de mais detalhes)
          </span>
          <input
            type="email"
            placeholder="o-teu-email@exemplo.com"
            className="h-11 rounded-sm border border-border bg-bg-surface2 px-3 text-sm text-ink placeholder:text-ink-dim outline-none focus:border-primary"
          />
        </label>

        <Button type="submit" className="self-start">
          <Flag width={15} height={15} />
          Reportar Erro
        </Button>
      </form>
    </Card>
  );
}
