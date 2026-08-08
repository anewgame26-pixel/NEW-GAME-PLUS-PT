"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode, type TouchEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Game } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { FeaturedGameStats } from "@/components/home/FeaturedGameStats";

interface FeaturedGameCarouselProps {
  games: Game[];
  /** Conteúdo estático (logo, pesquisa, sugestões) sobreposto à imagem. */
  children?: ReactNode;
  /** Intervalo do autoplay, em milissegundos. */
  intervalMs?: number;
}

const SWIPE_THRESHOLD_PX = 40;

export function FeaturedGameCarousel({ games, children, intervalMs = 10000 }: FeaturedGameCarouselProps) {
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
    <section
      className="relative w-full overflow-hidden border-b border-border"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Imagem de fundo, a ocupar toda a largura da secção. */}
      <div className="animate-carousel-fade absolute inset-0" key={game.id}>
        <Image
          src={game.heroImageUrl ?? game.coverUrl}
          alt={`Imagem de destaque de ${game.title}`}
          fill
          sizes="100vw"
          className="object-cover"
          priority={index === 0}
        />
        {/* Camada escura sobre a imagem, para o texto por cima ficar legível. */}
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/40" />
      </div>

      {/* Conteúdo por cima da imagem. */}
      <div className="relative mx-auto flex min-h-[560px] max-w-[1440px] flex-col justify-between gap-8 px-4 pb-8 pt-6 sm:min-h-[600px] lg:px-8 lg:pt-8">
        <div>{children}</div>

        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <Badge tone="gold" className="mb-3 w-fit">
              <Star width={11} height={11} className="fill-current" />
              Destaques
            </Badge>

            {count > 1 && (
              <div className="mb-3 flex items-center gap-1.5">
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

            <Link key={game.id} href={`/guias/${game.slug}`} className="group block w-fit">
              <p className="font-display text-3xl font-bold uppercase tracking-wide text-ink group-hover:text-primary-light sm:text-4xl">
                {game.title}
              </p>
              <p className="mt-1 text-sm text-ink-muted">{game.developer}</p>
            </Link>
          </div>

          <div key={`stats-${game.id}`} className="animate-carousel-fade hidden lg:block">
            <FeaturedGameStats game={game} />
          </div>
        </div>
      </div>

      {count > 1 && (
        <>
          <button
            type="button"
            aria-label="Jogo anterior"
            onClick={prev}
            className="absolute left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
          >
            <ChevronLeft width={18} height={18} />
          </button>
          <button
            type="button"
            aria-label="Próximo jogo"
            onClick={next}
            className="absolute right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
          >
            <ChevronRight width={18} height={18} />
          </button>
        </>
      )}
    </section>
  );
}
