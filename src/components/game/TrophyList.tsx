"use client";

import { useEffect, useState } from "react";
import { Trophy } from "lucide-react";
import { TrophyListItem, TrophyTier } from "@/types";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { OPEN_ROADMAP_CHAPTER_EVENT } from "@/components/game/RoadmapChapters";

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

interface Mention {
  location: "review" | "roadmap";
  /** Só definido quando location === "roadmap" */
  chapterIndex: number | null;
  element: Element;
}

/** Percorre todo o texto dentro de um contentor à procura de "query". */
function walkForText(container: Element, query: string): Node | null {
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
  let node: Node | null;
  while ((node = walker.nextNode())) {
    if ((node.textContent ?? "").toLowerCase().includes(query)) return node;
  }
  return null;
}

/**
 * Descobre onde um troféu é mencionado, por esta ordem:
 * 1. Ligação direta a um capítulo do roadmap (definida no /admin) — a mais
 *    fiável, porque não depende de nomes escritos coincidirem.
 * 2. O nome do troféu escrito dentro de algum capítulo do roadmap.
 * 3. O nome do troféu escrito na Review.
 */
function findMention(trophy: TrophyListItem): Mention | null {
  if (typeof trophy.roadmapChapterIndex === "number") {
    const chapterEl = document.querySelector(
      `[data-chapter-index="${trophy.roadmapChapterIndex}"]`
    );
    if (chapterEl) {
      return { location: "roadmap", chapterIndex: trophy.roadmapChapterIndex, element: chapterEl };
    }
  }

  const query = trophy.name.trim().toLowerCase();
  if (!query) return null;

  const roadmapContainer = document.getElementById("roadmap");
  if (roadmapContainer) {
    const node = walkForText(roadmapContainer, query);
    const el = node?.parentElement;
    if (el) {
      const chapterEl = el.closest("[data-chapter-index]");
      const chapterIndex = chapterEl
        ? Number(chapterEl.getAttribute("data-chapter-index"))
        : null;
      return { location: "roadmap", chapterIndex, element: el };
    }
  }

  const reviewContainer = document.getElementById("review");
  if (reviewContainer) {
    const node = walkForText(reviewContainer, query);
    const el = node?.parentElement;
    if (el) return { location: "review", chapterIndex: null, element: el };
  }

  return null;
}

function scrollAndFlash(el: Element) {
  el.scrollIntoView({ behavior: "smooth", block: "center" });
  el.classList.add("trophy-mention-flash");
  setTimeout(() => el.classList.remove("trophy-mention-flash"), 1600);
}

function goToMention(trophy: TrophyListItem) {
  const mention = findMention(trophy);
  if (!mention) return;

  if (mention.location === "roadmap" && mention.chapterIndex !== null) {
    // Pede ao Roadmap para abrir o capítulo certo primeiro (pode estar
    // fechado) e só faz scroll depois de lhe dar tempo para abrir.
    window.dispatchEvent(
      new CustomEvent(OPEN_ROADMAP_CHAPTER_EVENT, { detail: { index: mention.chapterIndex } })
    );
    requestAnimationFrame(() => {
      requestAnimationFrame(() => scrollAndFlash(mention.element));
    });
  } else {
    scrollAndFlash(mention.element);
  }
}

export function TrophyList({ trophies }: TrophyListProps) {
  const [mentions, setMentions] = useState<Map<string, "review" | "roadmap">>(new Map());

  useEffect(() => {
    const found = new Map<string, "review" | "roadmap">();
    trophies.forEach((t) => {
      const mention = findMention(t);
      if (mention) found.set(t.name, mention.location);
    });
    setMentions(found);
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
                  const mentionLocation = mentions.get(trophy.name);
                  const isClickable = Boolean(mentionLocation);
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
                        onClick={() => goToMention(trophy)}
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
                              {mentionLocation === "roadmap" ? "→ ver no roadmap" : "→ ver na review"}
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
