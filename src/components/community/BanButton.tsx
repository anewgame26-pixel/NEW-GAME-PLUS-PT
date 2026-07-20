"use client";

import { useState } from "react";
import { ShieldOff } from "lucide-react";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

interface BanButtonProps {
  targetUserId: string;
  targetUsername: string | null;
  onBanned?: () => void;
}

export function BanButton({ targetUserId, targetUsername, onBanned }: BanButtonProps) {
  const [banning, setBanning] = useState(false);

  async function handleBan() {
    const reason = window.prompt(
      `Banir "${targetUsername || "este visitante"}" — deixa de conseguir publicar comentários ou tópicos.\n\nMotivo (fica registado, opcional):`
    );
    // Cancelar no prompt devolve null — só continuamos se a pessoa
    // confirmou (mesmo que tenha deixado o motivo em branco).
    if (reason === null) return;

    setBanning(true);
    const supabase = createBrowserSupabaseClient();
    const { error } = await supabase.rpc("ban_user", {
      target_user_id: targetUserId,
      ban_reason: reason.trim() || null,
    });
    setBanning(false);

    if (error) {
      console.error("Erro ao banir:", error);
      alert("Não foi possível banir. Tenta novamente.");
      return;
    }

    onBanned?.();
  }

  return (
    <button
      type="button"
      onClick={handleBan}
      disabled={banning}
      title="Banir este visitante"
      className="shrink-0 text-ink-dim hover:text-primary-light disabled:opacity-50"
    >
      <ShieldOff width={13} height={13} />
    </button>
  );
}
