"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { MessageCircle, Check } from "lucide-react";
import { CommunityPost } from "@/types";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface CommunityPanelProps {
  posts: CommunityPost[];
  onlineCount: number;
}

export function CommunityPanel({ posts, onlineCount }: CommunityPanelProps) {
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubscribed(true);
  };

  return (
    <section className="py-10">
      <div className="mx-auto grid max-w-[1440px] gap-4 px-4 lg:grid-cols-3 lg:px-8">
        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-base font-bold uppercase tracking-wide text-ink">
              Comunidade
            </h3>
            <Link href="/comunidade" className="text-xs font-medium text-primary hover:text-primary-light">
              Ver mais
            </Link>
          </div>
          <ul className="flex flex-col divide-y divide-border">
            {posts.map((post) => (
              <li key={post.id} className="py-2.5 first:pt-0 last:pb-0">
                <p className="truncate text-sm font-medium text-ink hover:text-primary-light">
                  {post.title}
                </p>
                <p className="mt-0.5 text-xs text-ink-dim">
                  por {post.author} · {post.timeAgo}
                </p>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="flex flex-col justify-between p-5">
          <div>
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-sm bg-accent/10 text-accent">
              <MessageCircle width={18} height={18} />
            </div>
            <h3 className="font-display text-base font-bold uppercase tracking-wide text-ink">
              Entra no nosso Discord!
            </h3>
            <p className="mt-2 text-sm text-ink-muted">
              Junta-te a milhares de jogadores, partilha dicas, ajuda a comunidade
              e encontra parceiros para conquistas online.
            </p>
          </div>
          <div>
            <Button variant="secondary" className="mt-4 w-full border-accent/40 text-accent hover:bg-accent/10">
              Entrar no Discord
            </Button>
            <p className="mt-3 flex items-center gap-1.5 text-xs text-ink-dim">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              {onlineCount} membros online
            </p>
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="font-display text-base font-bold uppercase tracking-wide text-ink">
            Newsletter
          </h3>
          <p className="mt-2 text-sm text-ink-muted">
            Nunca percas um novo guia, review ou vídeo! Recebe tudo em primeira mão.
          </p>

          {subscribed ? (
            <div className="mt-4 flex items-center gap-2 rounded-sm border border-emerald-500/30 bg-emerald-500/10 px-3 py-2.5 text-sm text-emerald-400">
              <Check width={15} height={15} />
              Subscrito! Verifica o teu email.
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="mt-4 flex gap-2">
              <input
                type="email"
                required
                placeholder="O teu email..."
                className="h-10 min-w-0 flex-1 rounded-sm border border-border bg-bg-surface2 px-3 text-sm text-ink placeholder:text-ink-dim outline-none focus:border-primary"
              />
              <Button type="submit" size="sm">
                Subscrever
              </Button>
            </form>
          )}

          <ul className="mt-4 flex flex-col gap-1.5 text-xs text-ink-dim">
            <li className="flex items-center gap-1.5">
              <Check width={12} height={12} className="text-primary" /> Novos guias e roadmaps
            </li>
            <li className="flex items-center gap-1.5">
              <Check width={12} height={12} className="text-primary" /> Dicas exclusivas
            </li>
            <li className="flex items-center gap-1.5">
              <Check width={12} height={12} className="text-primary" /> Reviews e antes da platina
            </li>
          </ul>
        </Card>
      </div>
    </section>
  );
}
