"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { DISCOVERY_TAGS, type DiscoveryArticle } from "@/types";

export function DiscoveryListingClient({ articles }: { articles: DiscoveryArticle[] }) {
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (!activeTag) return articles;
    return articles.filter((a) => a.tags.includes(activeTag));
  }, [articles, activeTag]);

  const availableTags = useMemo(() => {
    const present = new Set(articles.flatMap((a) => a.tags));
    return DISCOVERY_TAGS.filter((t) => present.has(t.value));
  }, [articles]);

  return (
    <div>
      {availableTags.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTag(null)}
            className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
              activeTag === null
                ? "border-primary bg-primary/10 text-primary-light"
                : "border-border text-ink-muted hover:text-ink"
            }`}
          >
            Tudo
          </button>
          {availableTags.map((tag) => (
            <button
              key={tag.value}
              onClick={() => setActiveTag(tag.value)}
              className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                activeTag === tag.value
                  ? "border-primary bg-primary/10 text-primary-light"
                  : "border-border text-ink-muted hover:text-ink"
              }`}
            >
              {tag.label}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="py-12 text-center text-sm text-ink-muted">
          Nada por aqui ainda com este filtro.
        </p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((article) => (
            <Link key={article.id} href={`/descobertas/${article.slug}`}>
              <Card hover className="h-full overflow-hidden">
                <div className="relative aspect-video bg-bg-surface2">
                  {(article.heroImageUrl || article.coverUrl) && (
                    <Image
                      src={(article.heroImageUrl ?? article.coverUrl) as string}
                      alt={article.title}
                      fill
                      className="object-cover"
                    />
                  )}
                  {article.recomendamos !== null && (
                    <span
                      className={`absolute right-2 top-2 flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${
                        article.recomendamos ? "bg-accent/90 text-white" : "bg-primary/90 text-white"
                      }`}
                    >
                      {article.recomendamos ? (
                        <ThumbsUp width={11} height={11} />
                      ) : (
                        <ThumbsDown width={11} height={11} />
                      )}
                      {article.recomendamos ? "Recomendamos" : "Não recomendamos"}
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <p className="font-display text-base font-bold uppercase tracking-wide text-ink">
                    {article.title}
                  </p>
                  <p className="mt-1 text-xs text-ink-dim">
                    {article.platform}
                    {article.releaseYear ? ` · ${article.releaseYear}` : ""}
                  </p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
