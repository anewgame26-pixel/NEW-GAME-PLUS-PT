"use client";

import { useCallback, useEffect, useRef, useState, type TouchEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Game } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { FeaturedGameStats } from "@/components/home/FeaturedGameStats";

interface FeaturedGameCarouselProps {
  games: Game[];
  /** Intervalo do autoplay, em milissegundos. */
  intervalMs?: number;
}

const SWIPE_THRESHOLD_PX = 40;

export function FeaturedGameCarousel({ games, intervalMs = 10000 }: FeaturedGameCarouselProps) {
  const count = games.length;
  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const goTo = useCallback(
    (target: number) => setIndex(((target % count) + count) % count),
    [count]
  );
  const next = useCallback(() => setIndex((i) => (i + 1) % count), [count]);
  const prev = useCallback(() => setIndex((i) => (i - 1 + count) % count), [count]);

  // Autoplay — reinicia sempre que 'index' muda (incluindo navegação manual),
  // e pausa quando o separador do browser fica inativo.
  useEffect(() => {
    if (count <= 1) return undefined;

    let intervalId: ReturnType<typeof setInterval> | null = null;

    const start = () => {
      intervalId = setInterval(() => {
        setIndex((i) => (i + 1) % count);
      }, intervalMs);
    };

    const stop = () => {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    };

    const handleVisibilityChange = () => {
      stop();
      if (!document.hidden) start();
    };

    if (!document.hidden) start();

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      stop();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [index, count, intervalMs]);

  function handleTouchStart(e: TouchEvent<HTMLDivElement>) {
    touchStartX.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e: TouchEvent<HTMLDivElement>) {
    if (touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    if (deltaX > SWIPE_THRESHOLD_PX) prev();
    else if (deltaX < -SWIPE_THRESHOLD_PX) next();
    touchStartX.current = null;
  }

  if (count === 0) return null;

  const game = games[index];

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
      <div className="flex w-full flex-col gap-4 lg:w-72">
        <Badge tone="gold" className="w-fit">
          <Star width={11} height={11} className="fill-current" />
          Jogo em Destaque
        </Badge>

        <div
          className="relative h-64 w-full overflow-hidden rounded-sm border border-border sm:h-80 lg:h-[26rem]"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Capa clicável — abre a página do jogo. Fica por baixo do resto
              na pilha de camadas; a legenda por cima usa pointer-events-none
              para deixar o clique "passar" para este link. */}
          <Link
            key={game.id}
            href={`/guias/${game.slug}`}
            className="animate-carousel-fade absolute inset-0 block"
            aria-label={`Ver página de ${game.title}`}
          >
            <Image
              src={game.coverUrl}
              alt={`Capa de ${game.title}`}
              fill
              sizes="(min-width: 1024px) 288px, 100vw"
              className="object-cover"
              priority={index === 0}
            />
          </Link>

          {/* Legenda + indicadores, sobreposta ao link mas sem bloquear o clique
              (exceto nos próprios indicadores, que voltam a ser clicáveis). */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col gap-2 bg-gradient-to-t from-black/95 via-black/30 to-transparent p-5">
            {count > 1 && (
              <div className="pointer-events-auto flex items-center gap-1.5">
                {games.map((g, i) => (
                  <button
                    key={g.id}
                    type="button"
                    aria-label={`Ver ${g.title}`}
                    aria-current={i === index}
                    onClick={() => goTo(i)}
                    className={
                      i === index
                        ? "h-1.5 w-4 rounded-full bg-white transition-all"
                        : "h-1.5 w-1.5 rounded-full bg-white/40 transition-all hover:bg-white/70"
                    }
                  />
                ))}
              </div>
            )}
            <p className="font-display text-xl font-bold uppercase tracking-wide text-ink">
              {game.title}
            </p>
            <p className="text-xs text-ink-muted">{game.developer}</p>
          </div>

          {count > 1 && (
            <>
              <button
                type="button"
                aria-label="Jogo anterior"
                onClick={prev}
                className="absolute left-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
              >
                <ChevronLeft width={16} height={16} />
              </button>
              <button
                type="button"
                aria-label="Próximo jogo"
                onClick={next}
                className="absolute right-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
              >
                <ChevronRight width={16} height={16} />
              </button>
            </>
          )}
        </div>
      </div>

      <div key={game.id} className="animate-carousel-fade">
        <FeaturedGameStats game={game} />
      </div>
    </div>
  );
}
