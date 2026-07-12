import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { GameBreadcrumb } from "@/components/game/GameBreadcrumb";
import { PageHeader } from "@/components/layout/PageHeader";
import { EpisodeRow } from "@/components/game/EpisodeRow";
import { getEpisodeArchive } from "@/lib/data/videos";
import { getGames } from "@/lib/data/games";

export const metadata: Metadata = {
  title: "Antes da Platina | NewGame+",
  description:
    "Todos os episódios Antes da Platina — publicados e agendados — num só lugar.",
};

export default async function AntesDaPlatinaPage() {
  const episodes = await getEpisodeArchive();
  const games = await getGames();

  return (
    <>
      <Header />
      <GameBreadcrumb items={[{ label: "Antes da Platina" }]} />
      <main>
        <PageHeader
          title="Antes da Platina"
          description="Todos os episódios, publicados e agendados, num só lugar."
        />

        <div className="mx-auto max-w-[1440px] px-4 py-10 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-2">
            {episodes.map((ep) => {
              const game = games.find((g) => g.id === ep.gameId);
              if (!game) return null;
              return (
                <EpisodeRow
                  key={ep.id}
                  game={game}
                  publishDate={ep.publishDate}
                  status={ep.status}
                  label={ep.label}
                />
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
