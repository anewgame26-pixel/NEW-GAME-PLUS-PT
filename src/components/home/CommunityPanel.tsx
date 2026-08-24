"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { CommunityPost } from "@/types";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Honeypot } from "@/components/forms/Honeypot";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

interface CommunityPanelProps {
  posts: CommunityPost[];
}

export function CommunityPanel({ posts }: CommunityPanelProps) {
  const [subscribed, setSubscribed] = useState(false);
  const [subscribing, setSubscribing] = useState(false);
  const [subscribeError, setSubscribeError] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState("");

  const handleSubscribe = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubscribeError(null);
    if (honeypot) return; // preenchido só por bots — ignora silenciosamente

    const form = e.currentTarget;
    const email = (new FormData(form).get("email") as string)?.trim().toLowerCase();
    if (!email) return;

    setSubscribing(true);
    const supabase = createBrowserSupabaseClient();
    const { error } = await supabase.from("newsletter_subscribers").insert({ email });
    setSubscribing(false);

    if (error) {
      // Código 23505 = "unique_violation" — este email já estava inscrito.
      // Não é bem um erro do ponto de vista de quem está a subscrever,
      // por isso mostramos a mesma mensagem de sucesso.
      if (error.code === "23505") {
        setSubscribed(true);
      } else {
        setSubscribeError("Não foi possível subscrever. Tenta novamente.");
      }
      return;
    }

    setSubscribed(true);
    form.reset();
  };

  return (
    <section className="py-10">
      <div className="mx-auto grid max-w-[1440px] gap-4 px-4 lg:grid-cols-2 lg:px-8">
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
              Subscrito! Vais receber as novidades no teu email.
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="mt-4 flex flex-col gap-2">
              <Honeypot value={honeypot} onChange={setHoneypot} />
              <div className="flex gap-2">
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="O teu email..."
                  className="h-10 min-w-0 flex-1 rounded-sm border border-border bg-bg-surface2 px-3 text-sm text-ink placeholder:text-ink-dim outline-none focus:border-primary"
                />
                <Button type="submit" size="sm" disabled={subscribing}>
                  {subscribing ? "..." : "Subscrever"}
                </Button>
              </div>
              {subscribeError && <p className="text-xs text-primary-light">{subscribeError}</p>}
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
