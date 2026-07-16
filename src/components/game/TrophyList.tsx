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
  platina: "🏆",
  ouro: "🥇",
  prata: "🥈",
  bronze: "🥉",
};

const TIER_LABEL: Record<TrophyTier, string> = {
  platina: "Platina",
  ouro: "Ouro",
  prata: "Prata",
  bronze: "Bronze",
};

// Ordem de apresentação e estilo visual de cada tier — a Platina destaca-se
// propositadamente das restantes (é o objetivo final da caça aos troféus).
const TIER_ORDER: TrophyTier[] = ["platina", "ouro", "prata", "bronze"];

const TIER_STYLES: Record<TrophyTier, string> = {
  platina: "border-primary/40 hover:border-primary/70",
  ouro: "border-gold/40 hover:border-gold/70",
  prata: "border-ink-dim/40 hover:border-ink-muted/70",
  bronze: "border-border-light hover:border-ink-dim",
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

  useEffect(() => {
    const found = new Set<string>();
    trophies.forEach((t) => {
      if (findAndScrollToMention(t.name, { scroll: false })) found.add(t.name);
    });
    setMentioned(found);
  }, [trophies]);

  if (trophies.length === 0) return null;

  const counts = TIER_ORDER.map((tier) => ({
    tier,
    count: trophies.filter((t) => t.tier === tier).length,
  })).filter((c) => c.count > 0);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 font-display text-lg font-bold uppercase tracking-wide text-ink">
          <Trophy width={18} height={18} className="text-gold" />
          Lista de Troféus
        </h2>
        <div className="flex items-center gap-3 text-sm text-ink-muted">
          {counts.map((c) => (
            <span key={c.tier} className="flex items-center gap-1">
              {TIER_EMOJI[c.tier]} {c.count}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {TIER_ORDER.map((tier) => {
          const items = trophies.filter((t) => t.tier === tier);
          if (items.length === 0) return null;

          return (
            <div key={tier}>
              <p className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-ink-dim">
                {TIER_EMOJI[tier]} {TIER_LABEL[tier]} · {items.length}
              </p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((trophy) => {
                  const isClickable = mentioned.has(trophy.name);
                  return (
                    <Card
                      key={trophy.name}
                      className={cn(
                        "overflow-hidden border transition-colors",
                        TIER_STYLES[tier]
                      )}
                    >
                      <button
                        type="button"
                        disabled={!isClickable}
                        onClick={() => findAndScrollToMention(trophy.name, { scroll: true })}
                        className={cn(
                          "flex w-full items-start gap-3 p-4 text-left",
                          isClickable ? "cursor-pointer hover:bg-bg-surface2" : "cursor-default"
                        )}
                      >
                        <span className="text-lg leading-none">{TIER_EMOJI[tier]}</span>
                        <div className="min-w-0 flex-1">
                          <p className="font-display text-sm font-semibold text-ink">
                            {trophy.name}
                          </p>
                          {trophy.description && (
                            <p className="mt-1 text-xs text-ink-muted">{trophy.description}</p>
                          )}
                          {isClickable && (
                            <span className="mt-1.5 inline-block text-[10px] font-medium text-gold">
                              → ver na review
                            </span>
                          )}
                        </div>
                      </button>
                    </Card>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
