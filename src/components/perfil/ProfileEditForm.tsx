"use client";

import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

interface ProfileEditFormProps {
  userId: string;
  initialUsername: string | null;
  initialPsnUrl: string | null;
}

export function ProfileEditForm({ userId, initialUsername, initialPsnUrl }: ProfileEditFormProps) {
  const [username, setUsername] = useState(initialUsername ?? "");
  const [psnUrl, setPsnUrl] = useState(initialPsnUrl ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    setError(null);

    const supabase = createBrowserSupabaseClient();
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        username: username.trim() || null,
        psn_url: psnUrl.trim() || null,
      })
      .eq("id", userId);

    setSaving(false);

    if (updateError) {
      console.error("Erro ao guardar o perfil:", updateError);
      setError("Não foi possível guardar. Tenta novamente.");
      return;
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="flex flex-col gap-3">
      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-medium uppercase tracking-wide text-ink-dim">Nome</span>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Como queres ser identificado"
          className="h-10 rounded-sm border border-border bg-bg-surface2 px-3 text-sm text-ink placeholder:text-ink-dim outline-none focus:border-primary"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-medium uppercase tracking-wide text-ink-dim">
          Link do perfil PSN (opcional)
        </span>
        <input
          type="url"
          value={psnUrl}
          onChange={(e) => setPsnUrl(e.target.value)}
          placeholder="https://psnprofiles.com/o-teu-nome"
          className="h-10 rounded-sm border border-border bg-bg-surface2 px-3 text-sm text-ink placeholder:text-ink-dim outline-none focus:border-primary"
        />
      </label>

      {error && <p className="text-xs text-primary-light">{error}</p>}

      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="flex w-fit items-center gap-1.5 rounded-sm border border-border px-4 py-2 text-sm font-medium text-ink-muted transition-colors hover:border-border-light hover:text-ink disabled:opacity-50"
      >
        {saving ? (
          <Loader2 width={14} height={14} className="animate-spin" />
        ) : saved ? (
          <Check width={14} height={14} className="text-accent" />
        ) : null}
        {saved ? "Guardado" : "Guardar alterações"}
      </button>
    </div>
  );
}
