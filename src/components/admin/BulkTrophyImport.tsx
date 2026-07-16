"use client";

import { useState } from "react";
import { ClipboardPaste, Plus } from "lucide-react";
import { TrophyListItem, TrophyTier } from "@/types";

interface BulkTrophyImportProps {
  onImport: (items: TrophyListItem[]) => void;
}

const VALID_TIERS: TrophyTier[] = ["bronze", "prata", "ouro", "platina"];

function parseBulkText(raw: string): TrophyListItem[] {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line) => {
      const [namePart, tierPart, ...descParts] = line.split("|").map((p) => p.trim());
      const tierNormalized = tierPart?.toLowerCase() as TrophyTier | undefined;
      const tier: TrophyTier = VALID_TIERS.includes(tierNormalized as TrophyTier)
        ? (tierNormalized as TrophyTier)
        : "bronze";

      return {
        name: namePart || "Troféu sem nome",
        tier,
        description: descParts.join("|").trim(),
      };
    });
}

export function BulkTrophyImport({ onImport }: BulkTrophyImportProps) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");

  function handleImport() {
    const items = parseBulkText(text);
    if (items.length === 0) return;
    onImport(items);
    setText("");
    setOpen(false);
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 self-start text-xs font-medium text-accent hover:text-accent-light"
      >
        <ClipboardPaste width={13} height={13} />
        Colar lista em bloco
      </button>
    );
  }

  return (
    <div className="rounded-sm border border-accent/30 bg-accent/5 p-3">
      <p className="mb-2 text-xs text-ink-muted">
        Uma linha por troféu, neste formato: <strong>Nome | Tier | Descrição</strong>
        <br />
        Tier é um de: bronze, prata, ouro, platina (se não escreveres, assume bronze).
        A descrição é opcional.
        <br />
        Exemplo: <code>Primeiro Sangue | bronze | Derrota o primeiro inimigo</code>
      </p>
      <textarea
        rows={6}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={"Primeiro Sangue | bronze | Derrota o primeiro inimigo\nMestre da Espada | ouro | Vence 100 combates"}
        className="w-full resize-y rounded-sm border border-border bg-bg-surface2 px-3 py-2.5 font-mono text-xs text-ink placeholder:text-ink-dim outline-none focus:border-primary"
      />
      <div className="mt-2 flex items-center gap-2">
        <button
          type="button"
          onClick={handleImport}
          className="flex items-center gap-1.5 rounded-sm bg-accent px-3.5 py-2 text-xs font-semibold text-white hover:bg-accent-light"
        >
          <Plus width={13} height={13} />
          Adicionar à Lista de Troféus
        </button>
        <button
          type="button"
          onClick={() => {
            setOpen(false);
            setText("");
          }}
          className="text-xs font-medium text-ink-muted hover:text-ink"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
