"use client";

import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";

interface ScreenshotsGalleryProps {
  urls: string[];
  gameTitle: string;
}

export function ScreenshotsGallery({ urls, gameTitle }: ScreenshotsGalleryProps) {
  const [active, setActive] = useState<number | null>(null);

  if (urls.length === 0) return null;

  return (
    <section className="border-t border-border py-10">
      <div className="mx-auto max-w-[1440px] px-4 lg:px-8">
        <h2 className="mb-5 font-display text-xl font-bold uppercase tracking-wide text-ink">
          Screenshots
        </h2>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {urls.map((url, i) => (
            <button
              key={url}
              type="button"
              onClick={() => setActive(i)}
              className="group relative aspect-video overflow-hidden rounded-sm border border-border transition-colors hover:border-primary/60"
            >
              <Image
                src={url}
                alt={`Screenshot ${i + 1} de ${gameTitle}`}
                fill
                sizes="(min-width: 1024px) 25vw, 50vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </button>
          ))}
        </div>
      </div>

      {active !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          role="dialog"
          aria-modal
          onClick={() => setActive(null)}
        >
          <button
            aria-label="Fechar"
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-sm border border-border-light text-ink hover:border-primary hover:text-primary"
            onClick={() => setActive(null)}
          >
            <X width={18} height={18} />
          </button>
          <div className="relative aspect-video w-full max-w-4xl">
            <Image
              src={urls[active]}
              alt={`Screenshot ${active + 1} de ${gameTitle}`}
              fill
              sizes="90vw"
              className="object-contain"
            />
          </div>
        </div>
      )}
    </section>
  );
}
