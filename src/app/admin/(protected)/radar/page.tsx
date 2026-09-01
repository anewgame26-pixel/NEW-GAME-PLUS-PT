import Link from "next/link";
import { Plus } from "lucide-react";
import { getAllRadarArticlesAdmin } from "@/lib/data/radar";
import { RADAR_TAGS } from "@/types";

export const dynamic = "force-dynamic";

function tagLabel(value: string): string {
  return RADAR_TAGS.find((t) => t.value === value)?.label ?? value;
}

export default async function AdminRadarPage() {
  const articles = await getAllRadarArticlesAdmin();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold uppercase tracking-wide text-ink">Radar+</h1>
          <p className="mt-1 text-sm text-ink-muted">
            Novos jogos, anúncios, lançamentos e notícias relevantes.
          </p>
        </div>
        <Link
          href="/admin/radar/novo"
          className="flex items-center gap-1.5 rounded-sm bg-primary px-4 py-2 text-sm font-semibold text-white shadow-glow hover:bg-primary-light"
        >
          <Plus width={15} height={15} />
          Novo Artigo
        </Link>
      </div>

      {articles.length === 0 ? (
        <p className="py-8 text-sm text-ink-muted">Ainda não há artigos. Cria o primeiro acima.</p>
      ) : (
        <div className="flex flex-col divide-y divide-border rounded-sm border border-border bg-bg-surface">
          {articles.map((article) => (
            <Link
              key={article.id}
              href={`/admin/radar/${article.id}`}
              className="flex items-center justify-between gap-4 p-4 transition-colors hover:bg-bg-surface2"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-display text-sm font-bold text-ink">{article.title}</p>
                  {!article.isPublished && (
                    <span className="shrink-0 rounded-full border border-gold/40 bg-gold/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-gold">
                      Rascunho
                    </span>
                  )}
                </div>
                <p className="text-xs text-ink-dim">
                  {article.tags.map(tagLabel).join(", ") || "Sem categoria"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
