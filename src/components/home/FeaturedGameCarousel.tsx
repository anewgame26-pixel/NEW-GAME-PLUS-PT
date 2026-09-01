"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode, type TouchEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { HeroSlide } from "@/types";
import { FeaturedGameStats } from "@/components/home/FeaturedGameStats";
import { HeroFactsCard } from "@/components/home/HeroFactsCard";

interface FeaturedGameCarouselProps {
  slides: HeroSlide[];
  /** Conteúdo estático (logo, sugestões) sobreposto ao topo da imagem. */
  children?: ReactNode;
  /** Barra de pesquisa, sobreposta ao fundo da imagem, junto ao título. */
  search?: ReactNode;
  /** Intervalo do autoplay, em milissegundos. */
  intervalMs?: number;
}

const SWIPE_THRESHOLD_PX = 40;
// Larguras a partir daqui já contam como "desktop" e mantêm sempre a
// imagem centrada — o ajuste de enquadramento só se aplica abaixo disto.
const MOBILE_BREAKPOINT_QUERY = "(max-width: 639px)";

const CATEGORY_LABEL_STYLES: Record<HeroSlide["category"], string> = {
  "Antes da Platina": "text-primary-light",
  "Uma Hora Com": "text-accent-light",
  "Retro+": "text-gold",
  "Descobertas+": "text-sky-400",
  "Radar+": "text-fuchsia-400",
  "Top+": "text-emerald-400",
};

export function FeaturedGameCarousel({
  slides,
  children,
  search,
  intervalMs = 10000,
}: FeaturedGameCarouselProps) {
  const count = slides.length;
  const [index, setIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    const mql = window.matchMedia(MOBILE_BREAKPOINT_QUERY);
    const update = () => setIsMobile(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

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

  const slide = slides[index];

  return (
    <section
      className="relative w-full overflow-hidden border-b border-border"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Imagem de fundo, a ocupar toda a largura da secção. */}
      <div className="animate-carousel-fade absolute inset-0" key={slide.id}>
        <Image
          src={slide.imageUrl}
          alt={`Imagem de destaque: ${slide.title}`}
          fill
          sizes="100vw"
          className="object-cover"
          style={{
            objectPosition: `${isMobile ? (slide.heroFocusX ?? 50) : 50}% ${isMobile ? (slide.heroFocusY ?? 50) : 50}%`,
            transform: `scale(${(isMobile ? (slide.heroZoom ?? 100) : 100) / 100})`,
          }}
          priority={index === 0}
        />
        {/* Camada escura sobre a imagem, para o texto por cima ficar legível. */}
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/40" />
      </div>

      {/* Conteúdo por cima da imagem. A altura é fixa de propósito — o
          cartão de estatísticas (à direita, em baixo) está posicionado
          "flutuante" por cima da imagem em vez de empurrar este bloco,
          para o Hero nunca mudar de tamanho ao trocar de slide, mesmo
          quando um jogo tem mais estatísticas do que um artigo. */}
      <div className="relative mx-auto flex h-[320px] max-w-[1440px] flex-col justify-between gap-6 px-4 pb-6 pt-6 sm:h-[360px] lg:h-[400px] lg:px-8 lg:pt-8">
        <div>{children}</div>

        <div className="flex max-w-xl gap-3.5">
          <div className="w-1 shrink-0 rounded-full bg-primary" aria-hidden />

          <div>
            <p
              className={`mb-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] ${CATEGORY_LABEL_STYLES[slide.category]}`}
            >
              {slide.category}
            </p>

            {count > 1 && (
              <div className="mb-3 flex items-center gap-1.5">
                {slides.map((s, i) => (
                  <button
                    key={s.id}
                    type="button"
                    aria-label={`Ver ${s.title}`}
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

            <Link key={slide.id} href={slide.href} className="group block w-fit">
              <p className="font-display text-3xl font-bold uppercase tracking-wide text-ink group-hover:text-primary-light sm:text-4xl">
                {slide.title}
              </p>
              {slide.subtitle && (
                <p className="mt-1 line-clamp-1 max-w-md text-sm text-ink-muted">{slide.subtitle}</p>
              )}
            </Link>

            {search && <div className="mt-4 w-full max-w-md rounded-sm shadow-glow">{search}</div>}
          </div>
        </div>
      </div>

      {/* Cartão de estatísticas/factos — posicionado por cima da imagem,
          sem afetar a altura da secção (ver nota acima). */}
      <div
        key={`stats-${slide.id}`}
        className="animate-carousel-fade absolute bottom-6 right-4 z-[1] hidden lg:right-8 lg:block"
      >
        {slide.game ? (
          <FeaturedGameStats game={slide.game} />
        ) : slide.facts ? (
          <HeroFactsCard facts={slide.facts} />
        ) : null}
      </div>

      {count > 1 && (
        <>
          <button
            type="button"
            aria-label="Anterior"
            onClick={prev}
            className="absolute left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
          >
            <ChevronLeft width={18} height={18} />
          </button>
          <button
            type="button"
            aria-label="Seguinte"
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
