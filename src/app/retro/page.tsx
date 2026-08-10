import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { History, ThumbsUp, ThumbsDown } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { GameBreadcrumb } from "@/components/game/GameBreadcrumb";
import { Card } from "@/components/ui/Card";
import { getRetroArticles } from "@/lib/data/retro";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Retro+ | NewGame+",
  description: "Alguns jogos merecem ser jogados outra vez. Estes ainda valem a pena hoje?",
};

export default async function RetroPage() {
  const articles = await getRetroArticles();

  return (
    <>
      <Header />
      <GameBreadcrumb items={[{ label: "Retro+" }]} />
      <main>
        <div className="border-b border-border bg-bg-raised py-10">
          <div className="mx-auto max-w-[1440px] px-4 lg:px-8">
            <div className="flex items-center gap-2 text-primary">
              <History width={18} height={18} />
              <span className="text-xs font-semibold uppercase tracking-[0.15em]">
                Alguns jogos merecem ser jogados outra vez.
              </span>
            </div>
            <h1 className="mt-2 font-display text-3xl font-bold uppercase tracking-wide text-ink">
              Retro+
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-ink-muted">
              Clássicos e nem tão clássicos que continuam a merecer o teu tempo — e alguns que,
              sejamos honestos, não envelheceram lá muito bem.
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
                <Link key={article.id} href={`/retro/${article.slug}`}>
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
                      {article.valeAPenaHoje !== null && (
                        <span
                          className={`absolute right-2 top-2 flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${
                            article.valeAPenaHoje ? "bg-accent/90 text-white" : "bg-primary/90 text-white"
                          }`}
                        >
                          {article.valeAPenaHoje ? (
                            <ThumbsUp width={11} height={11} />
                          ) : (
                            <ThumbsDown width={11} height={11} />
                          )}
                          {article.valeAPenaHoje ? "Ainda vale a pena" : "Já envelheceu"}
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
      </main>
      <Footer />
    </>
  );
}
