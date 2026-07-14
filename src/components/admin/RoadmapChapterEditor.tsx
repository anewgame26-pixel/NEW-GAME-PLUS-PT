"use client";

import { useState } from "react";
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import type { RoadmapChapter, RoadmapChapterMissable } from "@/types";
import { ObjectListEditor } from "@/components/admin/ObjectListEditor";
import { RichTextEditor } from "@/components/admin/RichTextEditor";

interface RoadmapChapterEditorProps {
  chapters: RoadmapChapter[];
  onChange: (chapters: RoadmapChapter[]) => void;
}

const emptyChapter: RoadmapChapter = {
  title: "",
  description: "",
  youtubeId: "",
  missables: [],
};

export function RoadmapChapterEditor({ chapters, onChange }: RoadmapChapterEditorProps) {
  // Todos os capítulos começam abertos, exceto quando já há vários — nesse
  // caso só o primeiro fica aberto, para não sobrecarregar o ecrã.
  const [openIndexes, setOpenIndexes] = useState<Set<number>>(new Set([0]));

  function toggleOpen(i: number) {
    setOpenIndexes((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }

  function updateChapter(i: number, patch: Partial<RoadmapChapter>) {
    onChange(chapters.map((c, ci) => (ci === i ? { ...c, ...patch } : c)));
  }

  function removeChapter(i: number) {
    onChange(chapters.filter((_, ci) => ci !== i));
  }

  function addChapter() {
    onChange([...chapters, { ...emptyChapter }]);
    setOpenIndexes((prev) => new Set(prev).add(chapters.length));
  }

  return (
    <div className="flex flex-col gap-3">
      <span className="text-xs font-medium uppercase tracking-wide text-ink-dim">
        Capítulos do Roadmap
      </span>

      {chapters.length === 0 && (
        <p className="text-sm text-ink-dim">
          Ainda não há capítulos. Cria o primeiro abaixo — cada capítulo pode ter um
          vídeo do YouTube e os seus próprios missables, ambos opcionais.
        </p>
      )}

      {chapters.map((chapter, i) => {
        const isOpen = openIndexes.has(i);
        return (
          <div key={i} className="rounded-sm border border-border bg-bg-surface">
            <button
              type="button"
              onClick={() => toggleOpen(i)}
              className="flex w-full items-center justify-between gap-3 p-3 text-left"
            >
              <span className="min-w-0 flex-1 truncate text-sm font-semibold text-ink">
                {chapter.title.trim() || `Capítulo ${i + 1} (sem título)`}
              </span>
              <span className="flex shrink-0 items-center gap-2">
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(e) => {
                    e.stopPropagation();
                    removeChapter(i);
                  }}
                  aria-label="Remover capítulo"
                  className="flex h-7 w-7 items-center justify-center rounded-sm border border-border text-ink-muted hover:border-primary hover:text-primary"
                >
                  <Trash2 width={12} height={12} />
                </span>
                {isOpen ? (
                  <ChevronUp width={16} height={16} className="text-ink-dim" />
                ) : (
                  <ChevronDown width={16} height={16} className="text-ink-dim" />
                )}
              </span>
            </button>

            {isOpen && (
              <div className="flex flex-col gap-3 border-t border-border p-3 pt-4">
                <label className="flex flex-col gap-1.5">
                  <span className="text-[11px] text-ink-dim">Título do capítulo</span>
                  <input
                    type="text"
                    value={chapter.title}
                    onChange={(e) => updateChapter(i, { title: e.target.value })}
                    placeholder="Ex: Capítulo 1 — O Início"
                    className="h-10 rounded-sm border border-border bg-bg-surface2 px-3 text-sm text-ink placeholder:text-ink-dim outline-none focus:border-primary"
                  />
                </label>

                <label className="flex flex-col gap-1.5">
                  <span className="text-[11px] text-ink-dim">Descrição</span>
                  <RichTextEditor
                    value={chapter.description}
                    onChange={(html) => updateChapter(i, { description: html })}
                    placeholder="O que fazer nesta parte do jogo..."
                  />
                </label>

                <label className="flex flex-col gap-1.5">
                  <span className="text-[11px] text-ink-dim">
                    ID do vídeo do YouTube deste capítulo (opcional)
                  </span>
                  <input
                    type="text"
                    value={chapter.youtubeId ?? ""}
                    onChange={(e) => updateChapter(i, { youtubeId: e.target.value })}
                    placeholder="Ex: dQw4w9WgXcQ"
                    className="h-10 rounded-sm border border-border bg-bg-surface2 px-3 text-sm text-ink placeholder:text-ink-dim outline-none focus:border-primary"
                  />
                </label>

                <div className="rounded-sm border border-border bg-bg-surface2 p-3">
                  <ObjectListEditor<RoadmapChapterMissable & Record<string, unknown>>
                    label="Missables deste capítulo (opcional)"
                    items={
                      (chapter.missables ?? []) as (RoadmapChapterMissable &
                        Record<string, unknown>)[]
                    }
                    onChange={(missables) => updateChapter(i, { missables })}
                    emptyItem={{ title: "", description: "" }}
                    fields={[
                      { key: "title", label: "Título" },
                      { key: "description", label: "Descrição", type: "textarea" },
                    ]}
                  />
                </div>
              </div>
            )}
          </div>
        );
      })}

      <button
        type="button"
        onClick={addChapter}
        className="flex items-center gap-1.5 self-start text-xs font-medium text-accent hover:text-accent-light"
      >
        <Plus width={13} height={13} />
        Adicionar capítulo
      </button>
    </div>
  );
}
