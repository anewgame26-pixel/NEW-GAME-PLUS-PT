import type { Metadata } from "next";
import { Compass } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { GameBreadcrumb } from "@/components/game/GameBreadcrumb";
import { DiscoveryListingClient } from "@/components/discovery/DiscoveryListingClient";
import { getDiscoveryArticles } from "@/lib/data/discovery";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Descobertas+ | NewGame+",
  description: "Jogos que talvez ainda não conheças. Indies, pequenos estúdios, jogos portugueses e mais.",
};

export default async function DescobertasPage() {
  const articles = await getDiscoveryArticles();

  return (
    <>
      <Header />
      <GameBreadcrumb items={[{ label: "Descobertas+" }]} />
      <main>
        <div className="border-b border-border bg-bg-raised py-10">
          <div className="mx-auto max-w-[1440px] px-4 lg:px-8">
            <div className="flex items-center gap-2 text-primary">
              <Compass width={18} height={18} />
              <span className="text-xs font-semibold uppercase tracking-[0.15em]">
                Jogos que talvez ainda não conheças.
              </span>
            </div>
            <h1 className="mt-2 font-display text-3xl font-bold uppercase tracking-wide text-ink">
              Descobertas+
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-ink-muted">
              Indies, pequenos estúdios, jogos portugueses, early access e tudo o que merece
              atenção mesmo sem ser um grande lançamento AAA.
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-[1440px] px-4 py-10 lg:px-8">
          {articles.length === 0 ? (
            <p className="py-12 text-center text-sm text-ink-muted">
              Ainda não há artigos publicados. Volta em breve.
            </p>
          ) : (
            <DiscoveryListingClient articles={articles} />
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
