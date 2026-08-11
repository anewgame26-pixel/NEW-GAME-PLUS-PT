"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Botão de pesquisa do cabeçalho (versão computador). Ao clicar, abre um
 * campo de texto no lugar do próprio botão — ao escrever e premir Enter
 * (ou clicar de novo no ícone), leva para /jogos já com essa pesquisa
 * aplicada, tal como a pesquisa do Hero na homepage.
 */
export function HeaderSearch() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // Fecha ao clicar fora, sem perder o que a pessoa já tinha escrito.
  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    router.push(`/jogos?q=${encodeURIComponent(trimmed)}`);
    setOpen(false);
    setQuery("");
  }

  if (!open) {
    return (
      <button
        aria-label="Pesquisar"
        onClick={() => setOpen(true)}
        className="hidden h-9 w-9 items-center justify-center rounded-sm border border-border text-ink-muted transition-colors hover:border-border-light hover:text-ink lg:flex"
      >
        <Search width={16} height={16} />
      </button>
    );
  }

  return (
    <div ref={wrapperRef} className="relative hidden lg:block">
      <form onSubmit={handleSubmit} className="flex items-center">
        <Search className="pointer-events-none absolute left-3 text-ink-dim" width={14} height={14} />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Escape") setOpen(false);
          }}
          placeholder="Que jogo queres platinar?"
          className={cn(
            "h-9 w-56 rounded-sm border border-border bg-bg-surface pl-8 pr-8 text-sm text-ink outline-none",
            "placeholder:text-ink-dim focus:border-primary"
          )}
        />
        <button
          type="button"
          aria-label="Fechar pesquisa"
          onClick={() => setOpen(false)}
          className="absolute right-2 text-ink-dim hover:text-ink"
        >
          <X width={14} height={14} />
        </button>
      </form>
    </div>
  );
}
