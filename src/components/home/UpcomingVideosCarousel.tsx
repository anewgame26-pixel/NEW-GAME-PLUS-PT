"use client";

import { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { UpcomingVideo } from "@/types";
import { getGameById } from "@/data/mock/games";
import { GameCard } from "@/components/game/GameCard";

interface UpcomingVideosCarouselProps {
  videos: UpcomingVideo[];
}

const formatter = new Intl.DateTimeFormat("pt-PT", { day: "2-digit", month: "short" });

export function UpcomingVideosCarousel({ videos }: UpcomingVideosCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 1 | -1) => {
    scrollRef.current?.scrollBy({ left: dir * 220, behavior: "smooth" });
  };

  return (
    <section className="py-10">
      <div className="mx-auto max-w-[1440px] px-4 lg:px-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold uppercase tracking-wide text-ink">
            Próximos Vídeos
          </h2>
          <div className="flex items-center gap-2">
            <Link href="/antes-da-platina" className="text-xs font-medium text-primary hover:text-primary-light">
              Ver todos
            </Link>
            <div className="ml-2 hidden items-center gap-1 sm:flex">
              <button
                aria-label="Anterior"
                onClick={() => scroll(-1)}
                className="flex h-7 w-7 items-center justify-center rounded-sm border border-border text-ink-muted hover:border-border-light hover:text-ink"
              >
                <ChevronLeft width={14} height={14} />
              </button>
              <button
                aria-label="Seguinte"
                onClick={() => scroll(1)}
                className="flex h-7 w-7 items-center justify-center rounded-sm border border-border text-ink-muted hover:border-border-light hover:text-ink"
              >
                <ChevronRight width={14} height={14} />
              </button>
            </div>
          </div>
        </div>

        <div ref={scrollRef} className="no-scrollbar flex gap-4 overflow-x-auto pb-1">
          {videos.map((video) => {
            const game = getGameById(video.gameId);
            if (!game) return null;
            return (
              <GameCard
                key={video.id}
                game={game}
                eyebrow={formatter.format(new Date(video.publishDate))}
                footer={<p className="mt-0.5 text-xs text-ink-muted">{video.type}</p>}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
