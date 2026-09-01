import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Radar as RadarIcon } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { GameBreadcrumb } from "@/components/game/GameBreadcrumb";
import { Card } from "@/components/ui/Card";
import { getRadarArticles } from "@/lib/data/radar";
import { RADAR_TAGS } from "@/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Radar+ | NewGame+",
  description: "Novos jogos, anúncios, lançamentos e notícias que achamos relevantes.",
};

function tagLabel(value: string): string {
  return RADAR_TAGS.find((t) => t.value === value)?.label ?? value;
}

export default async function RadarPage() {
  const articles = await getRadarArticles();

  return (
    <>
      <Header />
      <GameBreadcrumb items={[{ label: "Radar+" }]} />
      <main>
        <div className="border-b border-border bg-bg-raised py-10">
          <div className="mx-auto max-w-[1440px] px-4 lg:px-8">
            <div className="flex items-center gap-2 text-primary">
              <RadarIcon width={18} height={18} />
              <span className="text-xs font-semibold uppercase tracking-[0.15em]">
                Sempre de olho no que aí vem.
              </span>
            </div>
            <h1 className="mt-2 font-display text-3xl font-bold uppercase tracking-wide text-ink">
              Radar+
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-ink-muted">
              Novos jogos, anúncios, lançamentos e notícias que achamos que vale a pena partilhar.
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-[1440px] px-4 py-10 lg:px-8">
          {articles.length === 0 ? (
            <p className="py-12 text-center text-sm text-ink-muted">
              Ainda não há artigos publicados. Volta em breve.
            </p>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <Link key={article.id} href={`/radar/${article.slug}`}>
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
                      {article.tags[0] && (
                        <span className="absolute right-2 top-2 rounded-full bg-primary/90 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
                          {tagLabel(article.tags[0])}
                        </span>
                      )}
                    </div>
                    <div className="p-4">
                      <p className="font-display text-base font-bold uppercase tracking-wide text-ink">
                        {article.title}
                      </p>
                      {article.platform && <p className="mt-1 text-xs text-ink-dim">{article.platform}</p>}
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
