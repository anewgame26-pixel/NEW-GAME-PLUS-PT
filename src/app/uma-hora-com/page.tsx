import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Clock, ThumbsUp, ThumbsDown } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { GameBreadcrumb } from "@/components/game/GameBreadcrumb";
import { Card } from "@/components/ui/Card";
import { getHourWithArticles } from "@/lib/data/hour-with";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Uma Hora Com... | NewGame+",
  description:
    "60 minutos. Uma primeira impressão. Jogamos um jogo durante uma hora e contamos-te se merece o teu tempo.",
};

export default async function UmaHoraComPage() {
  const articles = await getHourWithArticles();

  return (
    <>
      <Header />
      <GameBreadcrumb items={[{ label: "Uma Hora Com..." }]} />
      <main>
        <div className="border-b border-border bg-bg-raised py-10">
          <div className="mx-auto max-w-[1440px] px-4 lg:px-8">
            <div className="flex items-center gap-2 text-primary">
              <Clock width={18} height={18} />
              <span className="text-xs font-semibold uppercase tracking-[0.15em]">
                60 minutos. Uma primeira impressão.
              </span>
            </div>
            <h1 className="mt-2 font-display text-3xl font-bold uppercase tracking-wide text-ink">
              Uma Hora Com...
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-ink-muted">
              Jogamos um jogo durante uma hora e damos-te a nossa primeira impressão sincera.
              Não é uma análise completa — é a pergunta mais simples de todas: depois disto,
              queremos continuar a jogar?
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
                <Link key={article.id} href={`/uma-hora-com/${article.slug}`}>
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
                      {article.continuarAJogar !== null && (
                        <span
                          className={`absolute right-2 top-2 flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${
                            article.continuarAJogar
                              ? "bg-accent/90 text-white"
                              : "bg-primary/90 text-white"
                          }`}
                        >
                          {article.continuarAJogar ? (
                            <ThumbsUp width={11} height={11} />
                          ) : (
                            <ThumbsDown width={11} height={11} />
                          )}
                          {article.continuarAJogar ? "Continuamos" : "Não continuamos"}
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
