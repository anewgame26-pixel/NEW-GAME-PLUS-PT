import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";
import { LatestBeforePlatinumEpisode } from "@/types";
import { getGameById } from "@/data/mock/games";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { PlatformIcons } from "@/components/game/PlatformIcons";

interface LatestBeforePlatinumProps {
  episodes: LatestBeforePlatinumEpisode[];
}

const formatter = new Intl.DateTimeFormat("pt-PT", { day: "2-digit", month: "short" });

export function LatestBeforePlatinum({ episodes }: LatestBeforePlatinumProps) {
  return (
    <Card className="p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-lg font-bold uppercase tracking-wide text-ink">
          Últimos Antes da Platina
        </h2>
        <Link
          href="/antes-da-platina"
          className="text-xs font-medium text-primary hover:text-primary-light"
        >
          Ver todos
        </Link>
      </div>

      <div className="flex flex-col divide-y divide-border">
        {episodes.map((ep) => {
          const game = getGameById(ep.gameId);
          if (!game) return null;

          return (
            <Link
              key={ep.id}
              href={`/jogos/${game.slug}`}
              className="group flex gap-3 py-3.5 first:pt-0 last:pb-0"
            >
              <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded-sm border border-border">
                <Image
                  src={game.coverUrl}
                  alt={`Capa de ${game.title}`}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                  <Play width={16} height={16} className="fill-white text-white" />
                </div>
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="truncate font-display text-sm font-semibold text-ink group-hover:text-primary-light">
                    {game.title}
                  </p>
                  <Badge tone="red" className="shrink-0">
                    {formatter.format(new Date(ep.publishDate))}
                  </Badge>
                </div>
                <PlatformIcons platforms={game.platforms} className="mt-1" />
                <p className="mt-1.5 line-clamp-2 text-xs text-ink-muted">{ep.verdict}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </Card>
  );
}
