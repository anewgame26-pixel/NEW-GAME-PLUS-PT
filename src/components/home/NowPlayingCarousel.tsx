"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Game, PlayingNow } from "@/types";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { PlatformIcons } from "@/components/game/PlatformIcons";

interface NowPlayingCarouselProps {
  items: PlayingNow[];
  games: Game[];
}

/**
 * Versão "forte" de Estamos a Jogar: carrossel horizontal com capas
 * grandes, pensado para ser um dos 3 blocos com destaque de carrossel na
 * homepage (os outros dois são o Hero e Antes da Platina).
 */
export function NowPlayingCarousel({ items, games }: NowPlayingCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 1 | -1) => {
    scrollRef.current?.scrollBy({ left: dir * 280, behavior: "smooth" });
  };

  const entries = items
    .map((item) => ({ item, game: games.find((g) => g.id === item.gameId) }))
    .filter((e): e is { item: PlayingNow; game: Game } => Boolean(e.game));

  if (entries.length === 0) return null;

  return (
    <section className="border-t border-border py-10">
      <div className="mx-auto max-w-[1440px] px-4 lg:px-8">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 className="font-display text-xl font-bold uppercase tracking-wide text-ink sm:text-2xl">
              Estamos a Jogar
            </h2>
            <p className="mt-1 text-sm text-ink-muted">
              Vê no que a equipa do New Game Plus está metida neste momento.
            </p>
          </div>
          <div className="hidden shrink-0 items-center gap-2 sm:flex">
            <button
              aria-label="Anterior"
              onClick={() => scroll(-1)}
              className="flex h-8 w-8 items-center justify-center rounded-sm border border-border text-ink-muted hover:border-border-light hover:text-ink"
            >
              <ChevronLeft width={15} height={15} />
            </button>
            <button
              aria-label="Seguinte"
              onClick={() => scroll(1)}
              className="flex h-8 w-8 items-center justify-center rounded-sm border border-border text-ink-muted hover:border-border-light hover:text-ink"
            >
              <ChevronRight width={15} height={15} />
            </button>
          </div>
        </div>

        <div ref={scrollRef} className="no-scrollbar flex gap-4 overflow-x-auto pb-1">
          {entries.map(({ item, game }) => (
            <Link
              key={item.gameId}
              href={`/guias/${game.slug}`}
              className="group block w-[220px] shrink-0 sm:w-[260px]"
            >
              <div className="relative aspect-[16/10] overflow-hidden rounded-sm border border-border bg-bg-surface transition-colors duration-200 group-hover:border-primary/60">
                <Image
                  src={game.heroImageUrl ?? game.coverUrl}
                  alt={`Capa de ${game.title}`}
                  fill
                  sizes="260px"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent" />

                <span className="absolute left-2 top-2 rounded-sm border border-primary/40 bg-primary/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary-light backdrop-blur-sm">
                  Estamos a jogar
                </span>
                <span className="absolute right-2 top-2 font-mono text-xs font-bold text-white">
                  {item.progressPercent}%
                </span>

                <div className="absolute inset-x-0 bottom-0 p-3">
                  <p className="truncate font-display text-base font-bold text-white">{game.title}</p>
                  <PlatformIcons platforms={game.platforms} className="mt-1" />
                  <ProgressBar value={item.progressPercent} className="mt-2" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
