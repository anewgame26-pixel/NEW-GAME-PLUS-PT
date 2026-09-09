import Image from "next/image";
import Link from "next/link";
import type { HourWithArticle } from "@/types";

interface ValePenaStripProps {
  articles: HourWithArticle[];
}

/**
 * Fila com os artigos mais recentes do Vale a Pena, entre "Conteúdo Novo"
 * e "Estamos a Jogar". Ao contrário do carrossel de "Estamos a Jogar",
 * isto não tem setas nem scroll infinito — são sempre os últimos 5, e o
 * último cartão tem sempre um "Ver mais" a apontar para a página cheia.
 */
export function ValePenaStrip({ articles }: ValePenaStripProps) {
  const items = articles.slice(0, 5);
  if (items.length === 0) return null;

  return (
    <section className="border-t border-border py-10">
      <div className="mx-auto max-w-[1440px] px-4 lg:px-8">
        <div className="mb-4">
          <h2 className="font-display text-xl font-bold uppercase tracking-wide text-ink sm:text-2xl">
            Vale a Pena?
          </h2>
          <p className="mt-1 text-sm text-ink-muted">
            As primeiras horas mais recentes. Vale a pena continuar a jogar?
          </p>
        </div>

        <div className="no-scrollbar flex gap-4 overflow-x-auto pb-1 sm:grid sm:grid-cols-5 sm:overflow-visible">
          {items.map((article, i) => {
            const image = article.heroImageUrl ?? article.coverUrl;
            const isLast = i === items.length - 1;

            return (
              <div key={article.id} className="w-[180px] shrink-0 sm:w-auto">
                <Link href={`/vale-a-pena/${article.slug}`} className="group block">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-sm border border-border bg-bg-surface transition-colors duration-200 group-hover:border-primary/60">
                    {image && (
                      <Image
                        src={image}
                        alt={article.title}
                        fill
                        sizes="(min-width: 640px) 20vw, 180px"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-3">
                      <p className="line-clamp-2 font-display text-sm font-bold text-white">
                        {article.title}
                      </p>
                      {article.platform && (
                        <p className="mt-0.5 text-[11px] text-white/70">{article.platform}</p>
                      )}
                    </div>
                  </div>
                </Link>

                {isLast && (
                  <Link
                    href="/vale-a-pena"
                    className="mt-2 block text-center text-sm font-semibold text-primary-light hover:text-primary"
                  >
                    Ver mais →
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
