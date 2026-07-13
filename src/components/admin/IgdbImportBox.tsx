"use client";

import { useState } from "react";
import Image from "next/image";
import { Search, Loader2, Download } from "lucide-react";
import type { Genre, Platform } from "@/types";

export interface IgdbImportResult {
  igdbId: number;
  title: string;
  coverUrl: string | null;
  releaseYear: number | null;
  releaseDate: string | null;
  developer: string | null;
  platforms: Platform[];
  genres: Genre[];
}

interface IgdbImportBoxProps {
  onImport: (result: IgdbImportResult) => void;
}

/**
 * Caixa de pesquisa da IGDB, usada só ao criar um jogo novo.
 * Ao escolher um resultado, o formulário à volta preenche automaticamente
 * título, capa, produtora, ano/data de lançamento, plataformas e géneros
 * (estes dois últimos de forma aproximada — vale a pena confirmar).
 */
export function IgdbImportBox({ onImport }: IgdbImportBoxProps) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<IgdbImportResult[] | null>(null);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const res = await fetch(`/api/admin/igdb-search?q=${encodeURIComponent(query)}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Não foi possível pesquisar na IGDB.");
        return;
      }

      setResults(data.results);
    } catch {
      setError("Não foi possível ligar à IGDB. Verifica a ligação à internet.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-sm border border-accent/30 bg-accent/5 p-4">
      <p className="mb-3 text-xs font-medium uppercase tracking-wide text-ink-dim">
        Importar da IGDB (opcional)
      </p>
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Pesquisar pelo nome do jogo..."
          className="h-10 flex-1 rounded-sm border border-border bg-bg-surface2 px-3 text-sm text-ink placeholder:text-ink-dim outline-none focus:border-accent"
        />
        <button
          type="submit"
          disabled={loading}
          className="flex h-10 items-center gap-1.5 rounded-sm border border-accent px-3 text-sm font-medium text-accent transition-colors hover:bg-accent/10 disabled:opacity-60"
        >
          {loading ? <Loader2 width={15} height={15} className="animate-spin" /> : <Search width={15} height={15} />}
          Pesquisar
        </button>
      </form>

      {error && <p className="mt-3 text-sm text-primary-light">{error}</p>}

      {results && results.length === 0 && (
        <p className="mt-3 text-sm text-ink-muted">Sem resultados para essa pesquisa.</p>
      )}

      {results && results.length > 0 && (
        <div className="mt-3 flex flex-col gap-2">
          {results.map((r) => (
            <button
              key={r.igdbId}
              type="button"
              onClick={() => onImport(r)}
              className="flex items-center gap-3 rounded-sm border border-border bg-bg-surface p-2 text-left transition-colors hover:border-accent"
            >
              <div className="relative h-14 w-11 shrink-0 overflow-hidden rounded-sm bg-bg-surface2">
                {r.coverUrl && (
                  <Image src={r.coverUrl} alt={r.title} fill className="object-cover" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-ink">{r.title}</p>
                <p className="truncate text-xs text-ink-muted">
                  {r.developer ?? "Produtora desconhecida"}
                  {r.releaseYear ? ` · ${r.releaseYear}` : ""}
                </p>
              </div>
              <Download width={15} height={15} className="shrink-0 text-ink-dim" />
            </button>
          ))}
        </div>
      )}

      <p className="mt-3 text-xs text-ink-dim">
        Plataformas e géneros são traduzidos de forma aproximada — confirma sempre depois de
        importar.
      </p>
    </div>
  );
}
