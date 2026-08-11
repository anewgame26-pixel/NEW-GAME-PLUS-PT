"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Skull, Clock, ShieldAlert, ShieldCheck, Gauge } from "lucide-react";
import { Game } from "@/types";
import { difficultyLabel, formatPlatinumTime, grindLabel } from "@/lib/utils";

interface BeforePlatinumCarouselProps {
  games: Game[];
}

/**
 * Carrossel horizontal "Antes da Platina" — um dos 3 blocos com destaque de
 * carrossel na homepage. Mostra, por jogo, exatamente a informação que
 * alguém precisa antes de começar a perseguir a Platina: dificuldade,
 * duração, perdíveis e grind.
 */
export function BeforePlatinumCarousel({ games }: BeforePlatinumCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 1 | -1) => {
    scrollRef.current?.scrollBy({ left: dir * 260, behavior: "smooth" });
  };

  if (games.length === 0) return null;

  return (
    <section className="border-t border-border py-10">
      <div className="mx-auto max-w-[1440px] px-4 lg:px-8">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 className="font-display text-xl font-bold uppercase tracking-wide text-ink sm:text-2xl">
              Antes da Platina
            </h2>
            <p className="mt-1 text-sm text-ink-muted">
              Tudo o que precisas de saber antes de perseguir uma Platina.
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
          {games.map((game) => (
            <Link
              key={game.id}
              href={`/guias/${game.slug}`}
              className="group block w-[190px] shrink-0 sm:w-[210px]"
            >
              <div className="relative aspect-[3/4] overflow-hidden rounded-sm border border-border bg-bg-surface transition-colors duration-200 group-hover:border-primary/60">
                <Image
                  src={game.coverUrl}
                  alt={`Capa de ${game.title}`}
                  fill
                  sizes="210px"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 to-transparent p-2.5 pt-8">
                  <div className="flex items-center gap-1 text-[11px] font-medium text-white">
                    <Skull width={11} height={11} className="text-primary-light" />
                    {difficultyLabel(game.difficulty)}
                  </div>
                  <div className="mt-1 flex items-center gap-1 text-[11px] text-white/80">
                    <Clock width={11} height={11} />
                    {formatPlatinumTime(game.platinumTimeMin, game.platinumTimeMax)}
                  </div>
                </div>
              </div>

              <p className="mt-2 truncate font-display text-sm font-semibold text-ink group-hover:text-primary-light">
                {game.title}
              </p>

              <div className="mt-1 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11px] text-ink-dim">
                <span className="flex items-center gap-1">
                  {game.hasMissables ? (
                    <ShieldAlert width={11} height={11} className="text-primary-light" />
                  ) : (
                    <ShieldCheck width={11} height={11} className="text-emerald-400" />
                  )}
                  {game.hasMissables ? "Tem perdíveis" : "Sem perdíveis"}
                </span>
                <span className="flex items-center gap-1">
                  <Gauge width={11} height={11} />
                  Grind {grindLabel(game.grindLevel)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
