import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ListOrdered, Play } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { GameBreadcrumb } from "@/components/game/GameBreadcrumb";
import { Card } from "@/components/ui/Card";
import { getTopArticles } from "@/lib/data/top";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Top+ | NewGame+",
  description: "Listas, rankings e curiosidades sobre videojogos, em vídeo.",
};

export default async function TopPage() {
  const articles = await getTopArticles();

  return (
    <>
      <Header />
      <GameBreadcrumb items={[{ label: "Top+" }]} />
      <main>
        <div className="border-b border-border bg-bg-raised py-10">
          <div className="mx-auto max-w-[1440px] px-4 lg:px-8">
            <div className="flex items-center gap-2 text-primary">
              <ListOrdered width={18} height={18} />
              <span className="text-xs font-semibold uppercase tracking-[0.15em]">
                Listas em formato NG+
              </span>
            </div>
            <h1 className="mt-2 font-display text-3xl font-bold uppercase tracking-wide text-ink">
              Top+
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-ink-muted">
              &quot;5 melhores Platinas&quot;, &quot;jogos que já não podes jogar&quot;, &quot;Platinas que vão destruir a
              tua sanidade&quot; — listas em vídeo sobre videojogos, sem papas na língua.
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-[1440px] px-4 py-10 lg:px-8">
          {articles.length === 0 ? (
            <p className="py-12 text-center text-sm text-ink-muted">
              Ainda não há listas publicadas. Volta em breve.
            </p>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <Link key={article.id} href={`/top/${article.slug}`}>
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
                      {article.youtubeUrl && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/90">
                            <Play width={16} height={16} className="fill-white text-white" />
                          </span>
                        </div>
                      )}
                      <span className="absolute left-2 top-2 rounded-sm bg-bg/90 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-ink">
                        {article.items.length} {article.items.length === 1 ? "entrada" : "entradas"}
                      </span>
                    </div>
                    <div className="p-4">
                      <p className="font-display text-base font-bold uppercase tracking-wide text-ink">
                        {article.title}
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
