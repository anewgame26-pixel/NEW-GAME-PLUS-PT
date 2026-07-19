"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Gamepad2, Loader2 } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import type { GameProgressStatus } from "@/types";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

interface ProgressTrackerProps {
  gameId: string;
}

const STATUS_OPTIONS: { value: GameProgressStatus; label: string }[] = [
  { value: "a_jogar", label: "A jogar" },
  { value: "platinado", label: "Platinado" },
  { value: "abandonado", label: "Abandonado" },
];

export function ProgressTracker({ gameId }: ProgressTrackerProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [tracking, setTracking] = useState(false);
  const [status, setStatus] = useState<GameProgressStatus>("a_jogar");
  const [percent, setPercent] = useState(0);
  const [percentDraft, setPercentDraft] = useState("0");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createBrowserSupabaseClient();

    async function load(currentUser: User | null) {
      setUser(currentUser);
      if (currentUser) {
        const { data } = await supabase
          .from("game_progress")
          .select("status, progress_percent")
          .eq("user_id", currentUser.id)
          .eq("game_id", gameId)
          .maybeSingle();

        if (data) {
          setTracking(true);
          setStatus(data.status as GameProgressStatus);
          setPercent(data.progress_percent as number);
          setPercentDraft(String(data.progress_percent));
        } else {
          setTracking(false);
        }
      }
      setReady(true);
    }

    supabase.auth.getUser().then(({ data }) => load(data.user));

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      load(session?.user ?? null);
    });

    return () => subscription.subscription.unsubscribe();
  }, [gameId]);

  async function persist(nextStatus: GameProgressStatus, nextPercent: number): Promise<boolean> {
    if (!user) return false;
    setSaving(true);
    setError(null);
    const supabase = createBrowserSupabaseClient();
    const { error: saveError } = await supabase.from("game_progress").upsert({
      user_id: user.id,
      game_id: gameId,
      status: nextStatus,
      progress_percent: nextPercent,
      updated_at: new Date().toISOString(),
    });
    setSaving(false);
    if (saveError) {
      console.error("Erro ao guardar progresso:", saveError);
      setError("Não foi possível guardar. Tenta recarregar a página.");
      return false;
    }
    return true;
  }

  async function handleStart() {
    if (!ready) return;
    if (!user) {
      router.push(`/entrar?next=${encodeURIComponent(pathname)}`);
      return;
    }
    // Grava primeiro, e só muda a UI para "a acompanhar" se a gravação
    // resultar mesmo — evita mostrar o progresso como guardado quando na
    // realidade falhou (ex.: tabela ainda não criada na base de dados).
    const ok = await persist("a_jogar", 0);
    if (!ok) return;
    setTracking(true);
    setStatus("a_jogar");
    setPercent(0);
    setPercentDraft("0");
  }

  function handleStatusChange(nextStatus: GameProgressStatus) {
    setStatus(nextStatus);
    // "Platinado" já é 100% por definição — poupa o clique de o teres de
    // arrastar até ao fim manualmente.
    const nextPercent = nextStatus === "platinado" ? 100 : percent;
    setPercent(nextPercent);
    setPercentDraft(String(nextPercent));
    persist(nextStatus, nextPercent);
  }

  function handlePercentBlur() {
    const parsed = Math.max(0, Math.min(100, Number(percentDraft) || 0));
    setPercent(parsed);
    setPercentDraft(String(parsed));
    if (parsed !== percent) persist(status, parsed);
  }

  async function handleRemove() {
    if (!user) return;
    setSaving(true);
    const supabase = createBrowserSupabaseClient();
    const { error } = await supabase
      .from("game_progress")
      .delete()
      .eq("user_id", user.id)
      .eq("game_id", gameId);
    setSaving(false);
    if (error) {
      console.error("Erro ao remover progresso:", error);
      return;
    }
    setTracking(false);
  }

  if (!ready) return null;

  if (!tracking) {
    return (
      <div className="flex flex-col items-start gap-1.5">
        <button
          type="button"
          onClick={handleStart}
          disabled={saving}
          className="flex items-center gap-2 rounded-sm border border-border px-4 py-2.5 text-sm font-medium text-ink-muted transition-colors hover:border-border-light hover:text-ink disabled:opacity-60"
        >
          {saving ? (
            <Loader2 width={15} height={15} className="animate-spin" />
          ) : (
            <Gamepad2 width={15} height={15} />
          )}
          Acompanhar o meu progresso
        </button>
        {error && <p className="text-xs text-primary-light">{error}</p>}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex flex-wrap items-center gap-3 rounded-sm border border-border bg-bg-surface2 px-4 py-3">
        <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-ink-dim">
          <Gamepad2 width={14} height={14} />
          O meu progresso
        </span>

        <select
          value={status}
          onChange={(e) => handleStatusChange(e.target.value as GameProgressStatus)}
          className="h-9 rounded-sm border border-border bg-bg-surface px-2.5 text-sm text-ink outline-none focus:border-primary"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <label className="flex items-center gap-1.5 text-sm text-ink-muted">
          <input
            type="number"
            min={0}
            max={100}
            value={percentDraft}
            onChange={(e) => setPercentDraft(e.target.value)}
            onBlur={handlePercentBlur}
            disabled={status === "platinado"}
            className="h-9 w-16 rounded-sm border border-border bg-bg-surface px-2 text-sm text-ink outline-none focus:border-primary disabled:opacity-50"
          />
          %
        </label>

        {saving && <Loader2 width={14} height={14} className="animate-spin text-ink-dim" />}

        <button
          type="button"
          onClick={handleRemove}
          className="ml-auto text-xs text-ink-dim underline-offset-2 hover:text-primary-light hover:underline"
        >
          Deixar de acompanhar
        </button>
      </div>
      {error && <p className="text-xs text-primary-light">{error}</p>}
    </div>
  );
}
