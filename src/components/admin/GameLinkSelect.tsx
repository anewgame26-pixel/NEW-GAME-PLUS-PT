"use client";

import { useEffect, useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

interface GameOption {
  id: string;
  title: string;
}

interface GameLinkSelectProps {
  value: string | null;
  onChange: (gameId: string | null) => void;
}

/**
 * Menu para escolher a que jogo da lista (tabela "games") este artigo
 * pertence. Usado no Uma Hora Com, Retro+ e Descobertas+ — assim a
 * página do jogo consegue mostrar este artigo como um dos separadores,
 * mesmo que o jogo ainda não tenha a análise "Antes da Platina" feita.
 */
export function GameLinkSelect({ value, onChange }: GameLinkSelectProps) {
  const [games, setGames] = useState<GameOption[]>([]);

  useEffect(() => {
    const supabase = createBrowserSupabaseClient();
    supabase
      .from("games")
      .select("id, title")
      .order("title", { ascending: true })
      .then(({ data }) => setGames(data ?? []));
  }, []);

  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium uppercase tracking-wide text-ink-dim">
        Jogo (opcional)
      </span>
      <select
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value || null)}
        className="h-11 rounded-sm border border-border bg-bg-surface2 px-3 text-sm text-ink outline-none focus:border-primary"
      >
        <option value="">— Sem jogo associado —</option>
        {games.map((g) => (
          <option key={g.id} value={g.id}>
            {g.title}
          </option>
        ))}
      </select>
      <span className="text-xs text-ink-dim">
        Liga este artigo a um jogo da tua lista — aparece como separador na página
        desse jogo (mesmo que ainda não tenha a análise Antes da Platina feita).
      </span>
    </label>
  );
}
