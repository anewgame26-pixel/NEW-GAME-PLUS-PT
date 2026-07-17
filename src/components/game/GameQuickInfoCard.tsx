import { BarChart3, Clock, Trophy, AlertTriangle, Repeat, Wifi, Layers, Tag, Gem, Dices, BookOpen } from "lucide-react";
import { Game, GameDetail } from "@/types";
import { Card } from "@/components/ui/Card";
import { StarRating } from "@/components/ui/StarRating";
import {
  difficultyLabel,
  formatPlatinumTime,
  formatTrophyCount,
  grindLabel,
} from "@/lib/utils";

interface GameQuickInfoCardProps {
  game: Game;
  detail: GameDetail;
}

export function GameQuickInfoCard({ game, detail }: GameQuickInfoCardProps) {
  const rows: { icon: typeof BarChart3; label: string; value: string; warn?: boolean }[] = [
    {
      icon: BarChart3,
      label: "Dificuldade",
      value: `${difficultyLabel(game.difficulty)} · ${game.difficulty}/10`,
    },
    {
      icon: Clock,
      label: "Tempo para Platina",
      value: formatPlatinumTime(game.platinumTimeMin, game.platinumTimeMax),
    },
    {
      icon: Trophy,
      label: "Nº de Troféus",
      value: `${formatTrophyCount(game.trophyBreakdown)} (${game.trophyBreakdown.bronze}🥉 ${game.trophyBreakdown.prata}🥈 ${game.trophyBreakdown.ouro}🥇 ${game.trophyBreakdown.platina}🏆)`,
    },
    {
      icon: AlertTriangle,
      label: "Missables",
      value: game.hasMissables ? "Sim" : "Não",
      warn: game.hasMissables,
    },
    {
      icon: Repeat,
      label: "Grind",
      value: grindLabel(game.grindLevel),
    },
    {
      icon: Wifi,
      label: "Online Obrigatório",
      value: game.hasOnlineTrophies ? "Sim" : "Não",
      warn: game.hasOnlineTrophies,
    },
    {
      icon: Dices,
      label: "RNG",
      value: game.hasRng ? "Sim" : "Não",
      warn: game.hasRng,
    },
    {
      icon: BookOpen,
      label: "Precisa de Guia",
      value: game.guideRequired ? "Sim" : "Não",
      warn: game.guideRequired,
    },
    {
      icon: Layers,
      label: "Playthroughs Mínimos",
      value: `${detail.minPlaythroughs}x`,
    },
  ];

  return (
    <Card cut className="w-full p-5 lg:w-80">
      <h2 className="mb-4 font-display text-sm font-bold uppercase tracking-wide text-ink-dim">
        Ficha Rápida
      </h2>
      <div className="flex flex-col gap-3.5">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-3 text-sm">
            <span className="flex items-center gap-2 text-ink-muted">
              <row.icon width={15} height={15} className="text-ink-dim" />
              {row.label}
            </span>
            <span
              className={
                row.warn
                  ? "font-mono font-medium text-primary-light"
                  : "font-mono font-medium text-ink"
              }
            >
              {row.value}
            </span>
          </div>
        ))}

        <div className="my-1 h-px bg-border" />

        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="flex items-center gap-2 text-ink-muted">
            <Tag width={15} height={15} className="text-ink-dim" />
            Vale o dinheiro?
          </span>
          <StarRating value={game.worthBuying} />
        </div>
        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="flex items-center gap-2 text-ink-muted">
            <Gem width={15} height={15} className="text-ink-dim" />
            Vale a Platina?
          </span>
          <StarRating value={game.worthPlatinum} />
        </div>
      </div>
    </Card>
  );
}
