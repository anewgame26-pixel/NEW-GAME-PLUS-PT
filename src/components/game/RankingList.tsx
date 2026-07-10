import Image from "next/image";
import Link from "next/link";
import { Game } from "@/types";
import { PlatformIcons } from "@/components/game/PlatformIcons";
import { cn } from "@/lib/utils";

interface RankingListProps {
  games: Game[];
  valueLabel: (game: Game) => string;
}

function rankTone(rank: number) {
  if (rank === 1) return "bg-gold/15 text-gold border-gold/30";
  if (rank <= 3) return "bg-primary/10 text-primary-light border-primary/30";
  return "bg-bg-surface2 text-ink-muted border-border-light";
}

export function RankingList({ games, valueLabel }: RankingListProps) {
  return (
    <div className="flex flex-col divide-y divide-border rounded-sm border border-border bg-bg-surface">
      {games.map((game, i) => {
        const rank = i + 1;
        return (
          <Link
            key={game.id}
            href={`/jogos/${game.slug}`}
            className="group flex items-center gap-4 p-4 transition-colors hover:bg-bg-surface2"
          >
            <span
              className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border font-display text-sm font-bold",
                rankTone(rank)
              )}
            >
              {rank}
            </span>

            <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded-sm border border-border">
              <Image
                src={game.coverUrl}
                alt={`Capa de ${game.title}`}
                fill
                sizes="48px"
                className="object-cover"
              />
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-sm font-semibold text-ink group-hover:text-primary-light">
                {game.title}
              </p>
              <PlatformIcons platforms={game.platforms} className="mt-1" />
            </div>

            <span className="shrink-0 font-mono text-sm font-medium text-ink">
              {valueLabel(game)}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
