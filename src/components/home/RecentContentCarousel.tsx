"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CATEGORY_BADGE_STYLES, Byline, type RecentContentItem } from "@/components/home/RecentContentShared";

interface RecentContentCarouselProps {
  items: RecentContentItem[];
  intervalMs?: number;
}

/**
 * O artigo principal (grande, à esquerda) e os secundários (pequenos, à
 * direita) rodam todos juntos como um grupo só: de tempos a tempos, o
 * principal "sai" para o topo da fila lateral, e o último da fila
 * lateral passa a ser o novo principal — como uma roda contínua entre
 * os mesmos artigos, em vez de páginas separadas.
 */
export function RecentContentCarousel({ items, intervalMs = 6000 }: RecentContentCarouselProps) {
  const count = items.length;
  const [leadIndex, setLeadIndex] = useState(0);

  useEffect(() => {
    if (count <= 1) return undefined;

    let intervalId: ReturnType<typeof setInterval> | null = null;

    const start = () => {
      intervalId = setInterval(() => {
        setLeadIndex((i) => (i + count - 1) % count);
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
  }, [count, intervalMs]);

  if (count === 0) return null;

  const lead = items[leadIndex];
  const side = Array.from({ length: count - 1 }, (_, k) => items[(leadIndex + 1 + k) % count]);

  return (
    <div>
      <div key={lead.key} className="animate-carousel-fade grid gap-6 lg:grid-cols-12">
        {/* Artigo principal — maior, à esquerda. */}
        <Link href={lead.href} className="group block lg:col-span-7">
          <div className="relative aspect-[16/9] overflow-hidden rounded-sm border border-border bg-bg-surface">
            {lead.imageUrl && (
              <Image
                src={lead.imageUrl}
                alt={lead.title}
                fill
                sizes="(min-width: 1024px) 60vw, 100vw"
                priority
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            )}
            <div className="absolute left-3 top-3">
              <span
                className={`inline-flex items-center rounded-sm px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide shadow-sm ${CATEGORY_BADGE_STYLES[lead.categoryTone]}`}
              >
                {lead.category}
              </span>
            </div>
          </div>
          <p className="mt-3 font-display text-2xl font-bold text-ink group-hover:text-primary-light sm:text-3xl">
            {lead.title}
          </p>
          {lead.subtitle && (
            <p className="mt-1.5 line-clamp-2 max-w-2xl text-sm text-ink-muted">{lead.subtitle}</p>
          )}
          <Byline item={lead} />
        </Link>

        {/* Artigos secundários — sempre os 4 visíveis, à direita. */}
        <div className="flex flex-col gap-6 lg:col-span-5">
          {side.map((item) => (
            <Link key={item.key} href={item.href} className="group flex gap-4">
              <div className="relative aspect-[4/3] w-[120px] shrink-0 overflow-hidden rounded-sm border border-border bg-bg-surface sm:w-[150px]">
                {item.imageUrl && (
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    sizes="150px"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                )}
                <div className="absolute left-1.5 top-1.5">
                  <span
                    className={`inline-flex items-center rounded-sm px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide shadow-sm ${CATEGORY_BADGE_STYLES[item.categoryTone]}`}
                  >
                    {item.category}
                  </span>
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <p className="line-clamp-2 font-display text-base font-bold text-ink group-hover:text-primary-light">
                  {item.title}
                </p>
                {item.subtitle && (
                  <p className="mt-1 line-clamp-2 text-xs text-ink-muted">{item.subtitle}</p>
                )}
                <Byline item={item} />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {count > 1 && (
        <div className="mt-5 flex items-center gap-1.5">
          {items.map((item, i) => (
            <button
              key={item.key}
              type="button"
              aria-label={`Destacar: ${item.title}`}
              aria-current={i === leadIndex}
              onClick={() => setLeadIndex(i)}
              className={
                i === leadIndex
                  ? "h-1.5 w-6 rounded-full bg-primary transition-all"
                  : "h-1.5 w-1.5 rounded-full bg-border transition-all hover:bg-border-light"
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
