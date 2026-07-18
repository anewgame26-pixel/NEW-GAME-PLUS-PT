"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ArrowBigUp } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import { cn } from "@/lib/utils";

interface VoteButtonProps {
  candidateId: string;
  initialVotesCount: number;
}

export function VoteButton({ candidateId, initialVotesCount }: VoteButtonProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [voted, setVoted] = useState(false);
  const [count, setCount] = useState(initialVotesCount);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const supabase = createBrowserSupabaseClient();

    async function load(currentUser: User | null) {
      setUser(currentUser);
      if (currentUser) {
        const { data } = await supabase
          .from("votes")
          .select("candidate_id")
          .eq("user_id", currentUser.id)
          .eq("candidate_id", candidateId)
          .maybeSingle();
        setVoted(Boolean(data));
      } else {
        setVoted(false);
      }
      setReady(true);
    }

    supabase.auth.getUser().then(({ data }) => load(data.user));

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      load(session?.user ?? null);
    });

    return () => subscription.subscription.unsubscribe();
  }, [candidateId]);

  const handleClick = async () => {
    if (!ready || busy) return;

    if (!user) {
      router.push(`/entrar?next=${encodeURIComponent(pathname)}`);
      return;
    }

    setBusy(true);
    const supabase = createBrowserSupabaseClient();

    // Atualização otimista — a UI reage já, sem esperar pela rede.
    const wasVoted = voted;
    setVoted(!wasVoted);
    setCount((c) => (wasVoted ? c - 1 : c + 1));

    const { error } = wasVoted
      ? await supabase.from("votes").delete().eq("user_id", user.id).eq("candidate_id", candidateId)
      : await supabase.from("votes").insert({ user_id: user.id, candidate_id: candidateId });

    if (error) {
      console.error("Erro ao votar:", error);
      // Reverte, já que a gravação falhou.
      setVoted(wasVoted);
      setCount((c) => (wasVoted ? c + 1 : c - 1));
    }
    setBusy(false);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={!ready || busy}
      className={cn(
        "flex shrink-0 flex-col items-center gap-0.5 rounded-sm border px-3 py-2 transition-colors disabled:opacity-50",
        voted
          ? "border-primary bg-primary/10 text-primary-light"
          : "border-border text-ink-muted hover:border-border-light hover:text-ink"
      )}
      aria-pressed={voted}
      title={voted ? "Remover o meu voto" : "Votar neste jogo"}
    >
      <ArrowBigUp width={18} height={18} className={voted ? "fill-primary-light" : ""} />
      <span className="font-display text-sm font-bold leading-none">{count}</span>
    </button>
  );
}
