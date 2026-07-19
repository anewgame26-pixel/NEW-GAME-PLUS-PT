"use client";

import { FormEvent, useState } from "react";
import { MessageCircle, Send } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface MockComment {
  id: string;
  author: string;
  text: string;
}

const SEED_COMMENTS: MockComment[] = [
  { id: "c1", author: "Rui_Platina", text: "O troféu de New Game+ dá mesmo trabalho, mas vale muito a pena." },
  { id: "c2", author: "AnaGamerPT", text: "Segui o roadmap daqui e poupei horas de grind desnecessário." },
];

interface GameEngagementBarProps {
  gameTitle: string;
}

export function GameEngagementBar({ gameTitle }: GameEngagementBarProps) {
  const [comments, setComments] = useState<MockComment[]>(SEED_COMMENTS);
  const [draft, setDraft] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!draft.trim()) return;
    setComments((prev) => [
      { id: crypto.randomUUID(), author: "Tu", text: draft.trim() },
      ...prev,
    ]);
    setDraft("");
  };

  return (
    <section className="border-t border-border py-10">
      <div className="mx-auto max-w-[1440px] px-4 lg:px-8">
        <Card className="p-6">
          <div className="border-b border-border pb-5">
            <h2 className="font-display text-lg font-bold uppercase tracking-wide text-ink">
              O que achas de {gameTitle}?
            </h2>
            <p className="mt-1 text-sm text-ink-muted">
              Deixa o teu comentário à comunidade. (Favoritos e progresso já estão no topo da
              página.)
            </p>
          </div>

          <div className="mt-5">
            {/*
              Os comentários abaixo continuam só de demonstração (dados
              inventados, perdem-se ao recarregar a página) — ainda fazem
              parte da fase "Comunidade", ainda por construir.
            */}
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="text"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Escreve um comentário..."
                className="h-11 min-w-0 flex-1 rounded-sm border border-border bg-bg-surface2 px-3 text-sm text-ink placeholder:text-ink-dim outline-none focus:border-primary"
              />
              <Button type="submit" size="md">
                <Send width={15} height={15} />
              </Button>
            </form>

            <div className="mt-5 flex items-center gap-2 text-xs uppercase tracking-wide text-ink-dim">
              <MessageCircle width={13} height={13} />
              {comments.length} comentários
            </div>

            <ul className="mt-3 flex flex-col divide-y divide-border">
              {comments.map((comment) => (
                <li key={comment.id} className="py-3 first:pt-0 last:pb-0">
                  <p className="font-display text-sm font-semibold text-ink">{comment.author}</p>
                  <p className="mt-0.5 text-sm text-ink-muted">{comment.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      </div>
    </section>
  );
}
