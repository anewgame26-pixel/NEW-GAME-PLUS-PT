import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { GameBreadcrumb } from "@/components/game/GameBreadcrumb";
import { RankingsGrid } from "@/components/home/RankingsGrid";
import { rankingCategories } from "@/data/mock/homepage";

export const metadata: Metadata = {
  title: "Rankings | NewGame+",
  description: "As melhores, piores, mais rápidas e mais difíceis platinas do catálogo NewGame+.",
};

export default function RankingsPage() {
  return (
    <>
      <Header />
      <GameBreadcrumb items={[{ label: "Rankings" }]} />
      <main>
        <div className="border-b border-border bg-bg-raised py-8">
          <div className="mx-auto max-w-[1440px] px-4 lg:px-8">
            <h1 className="font-display text-3xl font-bold uppercase tracking-wide text-ink">
              Rankings
            </h1>
            <p className="mt-1 text-sm text-ink-muted">
              Escolhe uma categoria para veres o catálogo ordenado por esse critério.
            </p>
          </div>
        </div>
        <RankingsGrid categories={rankingCategories} />
      </main>
      <Footer />
    </>
  );
}
