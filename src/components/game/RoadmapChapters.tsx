"use client";

import { useEffect, useState } from "react";
import { Map as MapIcon, AlertTriangle, ChevronDown } from "lucide-react";
import type { RoadmapChapter } from "@/types";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { RichText } from "@/components/ui/RichText";

interface RoadmapChaptersProps {
  chapters: RoadmapChapter[];
}

/**
 * Nome do evento usado pela Lista de Troféus (TrophyList.tsx) para pedir
 * a abertura de um capítulo específico, quando um troféu está ligado a
 * esse capítulo (ou o nome do troféu é encontrado no texto dele).
 */
export const OPEN_ROADMAP_CHAPTER_EVENT = "ngp:open-roadmap-chapter";

export function RoadmapChapters({ chapters }: RoadmapChaptersProps) {
  // O primeiro capítulo começa aberto, para o leitor perceber logo do que
  // se trata; os restantes ficam fechados até serem clicados.
  const [openIndex, setOpenIndex] = useState<number | null>(chapters.length > 0 ? 0 : null);

  // Permite que a Lista de Troféus (secção separada da página) peça a
  // abertura de um capítulo específico, quando o visitante clica num
  // troféu ligado a esse capítulo do roadmap.
  useEffect(() => {
    function handleOpenRequest(e: Event) {
      const index = (e as CustomEvent<{ index: number }>).detail?.index;
      if (typeof index === "number") setOpenIndex(index);
    }
    window.addEventListener(OPEN_ROADMAP_CHAPTER_EVENT, handleOpenRequest);
    return () => window.removeEventListener(OPEN_ROADMAP_CHAPTER_EVENT, handleOpenRequest);
  }, []);

  return (
    <section id="roadmap" className="scroll-mt-20 border-t border-border py-10">
      <div className="mx-auto max-w-[1440px] px-4 lg:px-8">
        <div className="mb-5 flex items-center gap-2">
          <MapIcon width={18} height={18} className="text-accent" />
          <h2 className="font-display text-xl font-bold uppercase tracking-wide text-ink">
            Roadmap
          </h2>
        </div>

        {chapters.length === 0 ? (
          <Card className="p-6">
            <p className="text-sm text-ink-muted">
              O roadmap completo deste jogo ainda está a ser preparado.
            </p>
          </Card>
        ) : (
          <div className="flex flex-col gap-3">
            {chapters.map((chapter, i) => {
              const isOpen = openIndex === i;
              return (
                <Card
                  key={i}
                  data-chapter-index={i}
                  id={`roadmap-capitulo-${i}`}
                  className="scroll-mt-24 overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-3 p-5 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="flex items-center gap-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent/10 font-mono text-xs font-semibold text-accent">
                        {i + 1}
                      </span>
                      <span className="font-display text-base font-bold text-ink">
                        {chapter.title}
                      </span>
                    </span>
                    <ChevronDown
                      width={18}
                      height={18}
                      className={`shrink-0 text-ink-dim transition-transform ${isOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {/*
                    O texto (descrição + missables) fica sempre presente no
                    HTML, só escondido visualmente quando o capítulo está
                    fechado — em vez de deixar de existir por completo. É
                    isto que permite à Lista de Troféus encontrar o nome de
                    um troféu dentro de um capítulo mesmo antes de o abrir.
                    Vídeo e imagens, por serem mais pesados, continuam a só
                    carregar quando o capítulo é aberto.
                  */}
                  <div
                    className={
                      isOpen
                        ? "flex flex-col gap-5 border-t border-border p-5"
                        : "hidden"
                    }
                  >
                    {chapter.description && (
                      <RichText html={chapter.description} className="text-sm text-ink-muted" />
                    )}

                    {chapter.missables && chapter.missables.length > 0 && (
                      <div>
                        <div className="mb-2 flex items-center gap-1.5">
                          <AlertTriangle width={14} height={14} className="text-primary" />
                          <span className="text-xs font-semibold uppercase tracking-wide text-ink-dim">
                            Missables neste capítulo
                          </span>
                        </div>
                        <div className="flex flex-col divide-y divide-border rounded-sm border border-border bg-bg-surface2">
                          {chapter.missables.map((m, mi) => (
                            <div key={mi} className="flex flex-col gap-1 p-3">
                              <div className="flex items-center gap-2">
                                <Badge tone="red">Missable</Badge>
                                <p className="font-display text-sm font-semibold text-ink">
                                  {m.title}
                                </p>
                              </div>
                              <p className="text-sm text-ink-muted">{m.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {isOpen && chapter.youtubeId && (
                      <div className="relative aspect-video w-full overflow-hidden rounded-sm">
                        <iframe
                          className="absolute inset-0 h-full w-full"
                          src={`https://www.youtube.com/embed/${chapter.youtubeId}`}
                          title={`${chapter.title} — vídeo`}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    )}

                    {isOpen && chapter.imageUrls && chapter.imageUrls.length > 0 && (
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {chapter.imageUrls.map((url, ui) => (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            key={url + ui}
                            src={url}
                            alt={`${chapter.title} — imagem ${ui + 1}`}
                            loading="lazy"
                            className="aspect-video w-full rounded-sm border border-border object-cover"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
