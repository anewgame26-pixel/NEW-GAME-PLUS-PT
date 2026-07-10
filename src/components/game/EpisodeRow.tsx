import Image from "next/image";
import Link from "next/link";
import { Play, Clock } from "lucide-react";
import { Game } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { PlatformIcons } from "@/components/game/PlatformIcons";
import { formatDate } from "@/lib/utils";

interface EpisodeRowProps {
  game: Game;
  publishDate: string;
  status: "publicado" | "agendado";
  label: string;
}

export function EpisodeRow({ game, publishDate, status, label }: EpisodeRowProps) {
  const isScheduled = status === "agendado";

  return (
    <Link
      href={`/guias/${game.slug}`}
      className="group flex gap-4 rounded-sm border border-border bg-bg-surface p-4 transition-colors hover:border-primary/50 hover:bg-bg-surface2"
    >
      <div className="relative h-24 w-18 shrink-0 overflow-hidden rounded-sm border border-border sm:h-28 sm:w-20">
        <Image
          src={game.coverUrl}
          alt={`Capa de ${game.title}`}
          fill
          sizes="80px"
          className="object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
          <Play width={18} height={18} className="fill-white text-white" />
        </div>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone={isScheduled ? "blue" : "red"}>
            {isScheduled ? (
              <span className="flex items-center gap-1">
                <Clock width={11} height={11} />
                Estreia {formatDate(publishDate)}
              </span>
            ) : (
              formatDate(publishDate)
            )}
          </Badge>
          {isScheduled && <Badge tone="neutral">{label}</Badge>}
        </div>

        <p className="mt-2 font-display text-base font-semibold text-ink group-hover:text-primary-light">
          {game.title}
        </p>
        <PlatformIcons platforms={game.platforms} className="mt-1" />

        {!isScheduled && (
          <p className="mt-2 line-clamp-2 text-sm text-ink-muted">{label}</p>
        )}
      </div>
    </Link>
  );
}
