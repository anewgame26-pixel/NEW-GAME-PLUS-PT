"use client";

import { useEffect, useState } from "react";
import { Trophy } from "lucide-react";
import { TrophyListItem, TrophyTier } from "@/types";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

interface TrophyListProps {
  trophies: TrophyListItem[];
}

const TIER_EMOJI: Record<TrophyTier, string> = {
  bronze: "🥉",
  prata: "🥈",
  ouro: "🥇",
  platina: "🏆",
};

const TIER_LABEL: Record<TrophyTier, string> = {
  bronze: "Bronze",
  prata: "Prata",
  ouro: "Ouro",
  platina: "Platina",
};

/**
 * Procura o nome do troféu dentro do texto da Review (secção #review) e,
 * se encontrar, faz scroll até lá e destaca por instantes. Devolve se
 * encontrou ou não, para sabermos se vale a pena tornar o troféu clicável.
 */
function findAndScrollToMention(name: string, { scroll }: { scroll: boolean }) {
  const container = document.getElementById("review");
  if (!container || !name.trim()) return false;

  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
  const query = name.trim().toLowerCase();
  let node: Node | null;

  while ((node = walker.nextNode())) {
    const text = node.textContent ?? "";
    if (text.toLowerCase().includes(query)) {
      if (scroll) {
        const el = node.parentElement;
        el?.scrollIntoView({ behavior: "smooth", block: "center" });
        el?.classList.add("trophy-mention-flash");
        setTimeout(() => el?.classList.remove("trophy-mention-flash"), 1600);
      }
      return true;
    }
  }
  return false;
}

export function TrophyList({ trophies }: TrophyListProps) {
  const [mentioned, setMentioned] = useState<Set<string>>(new Set());

  // Ao carregar, verifica em silêncio quais os troféus mencionados na
  // review, para só esses ficarem com o affordance de "clicar para ver".
  useEffect(() => {
    const found = new Set<string>();
    trophies.forEach((t) => {
      if (findAndScrollToMention(t.name, { scroll: false })) found.add(t.name);
    });
    setMentioned(found);
  }, [trophies]);

  if (trophies.length === 0) return null;

  return (
    <div>
      <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-bold uppercase tracking-wide text-ink">
        <Trophy width={18} height={18} className="text-gold" />
        Lista de Troféus
      </h2>

      <Card className="flex flex-col divide-y divide-border p-0">
        {trophies.map((trophy) => {
          const isClickable = mentioned.has(trophy.name);
          return (
            <button
              key={trophy.name}
              type="button"
              disabled={!isClickable}
              onClick={() => findAndScrollToMention(trophy.name, { scroll: true })}
              className={cn(
                "flex items-start gap-3 p-4 text-left transition-colors",
                isClickable ? "cursor-pointer hover:bg-bg-surface2" : "cursor-default"
              )}
            >
              <span className="text-lg leading-none">{TIER_EMOJI[trophy.tier]}</span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-display text-sm font-semibold text-ink">{trophy.name}</p>
                  <span className="text-[10px] uppercase tracking-wide text-ink-dim">
                    {TIER_LABEL[trophy.tier]}
                  </span>
                  {isClickable && (
                    <span className="text-[10px] font-medium text-gold">
                      → ver na review
                    </span>
                  )}
                </div>
                {trophy.description && (
                  <p className="mt-0.5 text-sm text-ink-muted">{trophy.description}</p>
                )}
              </div>
            </button>
          );
        })}
      </Card>
    </div>
  );
}
