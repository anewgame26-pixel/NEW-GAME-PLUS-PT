"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CATEGORY_BADGE_STYLES, Byline, type RecentContentItem } from "@/components/home/RecentContentShared";

interface RecentSecondaryCarouselProps {
  items: RecentContentItem[];
  intervalMs?: number;
}

/**
 * Mostra os artigos secundários do "Conteúdo Novo" 2 a 2, avançando
 * sozinho ao fim de um tempo (tal como o carrossel do Hero) — assim dá
 * para caber mais artigos em destaque sem a coluna ficar comprida.
 */
export function RecentSecondaryCarousel({ items, intervalMs = 6000 }: RecentSecondaryCarouselProps) {
  const pageSize = 2;
  const pageCount = Math.ceil(items.length / pageSize);
  const [page, setPage] = useState(0);

  const next = useCallback(() => setPage((p) => (p + 1) % pageCount), [pageCount]);
  const prev = useCallback(() => setPage((p) => (p - 1 + pageCount) % pageCount), [pageCount]);

  useEffect(() => {
    if (pageCount <= 1) return undefined;
    const id = setInterval(next, intervalMs);
    return () => clearInterval(id);
  }, [next, pageCount, intervalMs, page]);

  if (items.length === 0) return null;

  const visible = items.slice(page * pageSize, page * pageSize + pageSize);

  return (
    <div className="flex flex-col">
      <div key={page} className="animate-carousel-fade flex flex-col gap-6">
        {visible.map((item) => (
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

      {pageCount > 1 && (
        <div className="mt-4 flex items-center justify-end gap-2">
          <div className="mr-auto flex items-center gap-1.5">
            {Array.from({ length: pageCount }).map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Ver página ${i + 1} de artigos secundários`}
                aria-current={i === page}
                onClick={() => setPage(i)}
                className={
                  i === page
                    ? "h-1.5 w-4 rounded-full bg-primary transition-all"
                    : "h-1.5 w-1.5 rounded-full bg-border transition-all hover:bg-border-light"
                }
              />
            ))}
          </div>
          <button
            type="button"
            aria-label="Artigos anteriores"
            onClick={prev}
            className="flex h-7 w-7 items-center justify-center rounded-sm border border-border text-ink-muted hover:border-border-light hover:text-ink"
          >
            <ChevronLeft width={14} height={14} />
          </button>
          <button
            type="button"
            aria-label="Próximos artigos"
            onClick={next}
            className="flex h-7 w-7 items-center justify-center rounded-sm border border-border text-ink-muted hover:border-border-light hover:text-ink"
          >
            <ChevronRight width={14} height={14} />
          </button>
        </div>
      )}
    </div>
  );
}
