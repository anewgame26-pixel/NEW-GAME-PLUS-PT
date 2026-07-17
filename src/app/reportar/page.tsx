import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { GameBreadcrumb } from "@/components/game/GameBreadcrumb";
import { PageHeader } from "@/components/layout/PageHeader";
import { ReportForm } from "@/components/about/ReportForm";
import { getGames } from "@/lib/data/games";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Reportar Erro | NewGame+",
  description: "Encontraste um erro num guia, roadmap ou ficha de jogo? Avisa-nos.",
};

export default async function ReportarPage() {
  const games = await getGames();

  return (
    <>
      <Header />
      <GameBreadcrumb items={[{ label: "Reportar Erro" }]} />
      <main>
        <PageHeader
          title="Reportar Erro"
          description="Encontraste algo incorreto ou em falta? Ajuda-nos a corrigir."
        />
        <div className="mx-auto max-w-2xl px-4 py-10 lg:px-8">
          <ReportForm games={games} />
        </div>
      </main>
      <Footer />
    </>
  );
}
