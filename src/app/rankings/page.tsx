import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { GameBreadcrumb } from "@/components/game/GameBreadcrumb";
import { PageHeader } from "@/components/layout/PageHeader";
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
        <PageHeader
          title="Rankings"
          description="Escolhe uma categoria para veres o catálogo ordenado por esse critério."
        />
        <RankingsGrid categories={rankingCategories} />
      </main>
      <Footer />
    </>
  );
}
