import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { GameBreadcrumb } from "@/components/game/GameBreadcrumb";
import { PageHeader } from "@/components/layout/PageHeader";
import { JogosListingClient } from "@/components/game/JogosListingClient";
import { getGames } from "@/lib/data/games";

export const metadata: Metadata = {
  title: "Todos os Jogos | NewGame+",
  description:
    "Pesquisa e filtra o catálogo completo da NewGame+ por género, plataforma, dificuldade e tempo para a platina.",
};

export default async function JogosPage() {
  const games = await getGames();

  return (
    <>
      <Header />
      <GameBreadcrumb items={[{ label: "Jogos" }]} />
      <main>
        <PageHeader
          title="Todos os Jogos"
          description="Pesquisa e filtra por género, plataforma, dificuldade e tempo para a platina."
        />
        <JogosListingClient games={games} />
      </main>
      <Footer />
    </>
  );
}
