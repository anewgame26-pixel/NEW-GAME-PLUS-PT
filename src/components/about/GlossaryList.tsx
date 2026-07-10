"use client";

import { useMemo, useState } from "react";
import { GlossaryTerm } from "@/data/mock/glossary";
import { SearchInput } from "@/components/ui/SearchInput";
import { Card } from "@/components/ui/Card";

interface GlossaryListProps {
  terms: GlossaryTerm[];
}

export function GlossaryList({ terms }: GlossaryListProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return terms;
    const q = query.toLowerCase();
    return terms.filter(
      (t) => t.term.toLowerCase().includes(q) || t.definition.toLowerCase().includes(q)
    );
  }, [terms, query]);

  return (
    <div className="flex flex-col gap-6">
      <SearchInput
        placeholder="Pesquisar termo (ex: missable, grind, NG+)..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {filtered.length === 0 ? (
        <p className="text-sm text-ink-muted">Nenhum termo encontrado para &quot;{query}&quot;.</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {filtered.map((t) => (
            <Card key={t.term} className="p-5">
              <p className="font-display text-sm font-bold text-primary-light">{t.term}</p>
              <p className="mt-1.5 text-sm text-ink-muted">{t.definition}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
