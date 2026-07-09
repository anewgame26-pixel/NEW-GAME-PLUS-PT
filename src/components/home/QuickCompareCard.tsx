import { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { Game } from "@/types";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StarRating } from "@/components/ui/StarRating";
import { formatPlatinumTime, difficultyLabel, grindLabel } from "@/lib/utils";

interface QuickCompareCardProps {
  gameA: Game;
  gameB: Game;
}

const ROWS: {
  label: string;
  get: (g: Game) => ReactNode;
}[] = [
  { label: "Tempo para Platina", get: (g) => formatPlatinumTime(g.platinumTimeMin, g.platinumTimeMax) },
  { label: "Dificuldade", get: (g) => `${difficultyLabel(g.difficulty)} · ${g.difficulty}/10` },
  { label: "Grind", get: (g) => grindLabel(g.grindLevel) },
  { label: "Missables", get: (g) => (g.hasMissables ? "Sim" : "Não") },
  { label: "Guia necessário", get: (g) => (g.guideRequired ? "Sim" : "Não") },
  { label: "Vale o dinheiro?", get: (g) => <StarRating value={g.worthBuying} /> },
  { label: "Vale a platina?", get: (g) => <StarRating value={g.worthPlatinum} /> },
];

export function QuickCompareCard({ gameA, gameB }: QuickCompareCardProps) {
  return (
    <Card className="p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-lg font-bold uppercase tracking-wide text-ink">
          Qual Devo Jogar?
        </h2>
        <Link
          href={`/comparar?a=${gameA.slug}&b=${gameB.slug}`}
          className="text-xs font-medium text-primary hover:text-primary-light"
        >
          Comparar
        </Link>
      </div>

      <div className="mb-4 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <GameThumb game={gameA} align="left" />
        <span className="font-display text-sm font-bold text-ink-dim">VS</span>
        <GameThumb game={gameB} align="right" />
      </div>

      <div className="flex flex-col divide-y divide-border text-sm">
        {ROWS.map((row) => (
          <div key={row.label} className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 py-2">
            <span className="font-mono text-xs text-ink">{row.get(gameA)}</span>
            <span className="text-center text-[10px] uppercase tracking-wide text-ink-dim">
              {row.label}
            </span>
            <span className="text-right font-mono text-xs text-ink">{row.get(gameB)}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <Button href={`/jogos/${gameA.slug}`} variant="secondary" size="sm">
          Ver Página
        </Button>
        <Button href={`/jogos/${gameB.slug}`} variant="primary" size="sm">
          Ver Página
        </Button>
      </div>
    </Card>
  );
}

function GameThumb({ game, align }: { game: Game; align: "left" | "right" }) {
  return (
    <Link
      href={`/jogos/${game.slug}`}
      className={`flex items-center gap-2 ${align === "right" ? "flex-row-reverse text-right" : "text-left"}`}
    >
      <div className="relative h-14 w-11 shrink-0 overflow-hidden rounded-sm border border-border">
        <Image src={game.coverUrl} alt={`Capa de ${game.title}`} fill sizes="44px" className="object-cover" />
      </div>
      <span className="truncate font-display text-xs font-semibold text-ink">{game.title}</span>
    </Link>
  );
}
