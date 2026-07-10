import Image from "next/image";
import { Game } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { PlatformIcons } from "@/components/game/PlatformIcons";
import { GameCTAButtons } from "@/components/game/GameCTAButtons";
import { formatDate, genreLabel } from "@/lib/utils";

interface GameHeroProps {
  game: Game;
  roadmapHref: string;
}

export function GameHero({ game, roadmapHref }: GameHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="absolute inset-0 bg-radial-fade" aria-hidden />
      <div className="relative mx-auto flex max-w-[1440px] flex-col gap-8 px-4 py-10 lg:flex-row lg:items-end lg:px-8 lg:py-14">
        <div className="relative mx-auto h-72 w-52 shrink-0 overflow-hidden rounded-sm border border-border shadow-glow sm:h-80 sm:w-60 lg:mx-0">
          <Image
            src={game.coverUrl}
            alt={`Capa de ${game.title}`}
            fill
            sizes="240px"
            className="object-cover"
            priority
          />
        </div>

        <div className="flex flex-1 flex-col">
          <div className="mb-3 flex flex-wrap gap-1.5">
            {game.genres.map((g) => (
              <Badge key={g} tone="neutral">
                {genreLabel(g)}
              </Badge>
            ))}
          </div>

          <h1 className="text-balance font-display text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl lg:text-5xl">
            {game.title}
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-ink-muted">
            <span>{game.developer}</span>
            <span className="text-ink-dim">·</span>
            <span>{game.releaseDate ? formatDate(game.releaseDate) : game.releaseYear}</span>
            <span className="text-ink-dim">·</span>
            <PlatformIcons platforms={game.platforms} showLabel />
          </div>

          <GameCTAButtons
            roadmapHref={roadmapHref}
            className="mt-6"
          />
        </div>
      </div>
    </section>
  );
}
