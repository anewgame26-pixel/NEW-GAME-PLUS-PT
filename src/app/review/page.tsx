import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { GameBreadcrumb } from "@/components/game/GameBreadcrumb";
import { Card } from "@/components/ui/Card";
import { getReviews } from "@/lib/data/reviews";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Review | NewGame+",
  description:
    "Análises completas dos jogos que jogámos até ao fim — gameplay, história, gráficos, som e a nota final.",
};

export default async function ReviewsPage() {
  const articles = await getReviews();

  return (
    <>
      <Header />
      <GameBreadcrumb items={[{ label: "Review" }]} />
      <main>
        <div className="border-b border-border bg-bg-raised py-10">
          <div className="mx-auto max-w-[1440px] px-4 lg:px-8">
            <div className="flex items-center gap-2 text-primary">
              <Star width={18} height={18} />
              <span className="text-xs font-semibold uppercase tracking-[0.15em]">
                A análise completa.
              </span>
            </div>
            <h1 className="mt-2 font-display text-3xl font-bold uppercase tracking-wide text-ink">
              Review
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-ink-muted">
              Jogámos até ao fim e dizemos-te tudo: gameplay, história, gráficos, som e
              performance — com uma nota final a fechar cada análise.
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-[1440px] px-4 py-10 lg:px-8">
          {articles.length === 0 ? (
            <p className="py-12 text-center text-sm text-ink-muted">
              Ainda não há reviews publicadas. Volta em breve.
            </p>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <Link key={article.id} href={`/review/${article.slug}`}>
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
                      {article.nota !== null && (
                        <span className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-primary/90 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
                          <Star width={11} height={11} />
                          {article.nota}/10
                        </span>
                      )}
                    </div>
                    <div className="p-4">
                      <p className="font-display text-base font-bold uppercase tracking-wide text-ink">
                        {article.title}
                      </p>
                      <p className="mt-1 text-xs text-ink-dim">{article.platform}</p>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
