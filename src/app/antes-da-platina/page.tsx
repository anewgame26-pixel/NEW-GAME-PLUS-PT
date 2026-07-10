import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { GameBreadcrumb } from "@/components/game/GameBreadcrumb";
import { EpisodeRow } from "@/components/game/EpisodeRow";
import { getEpisodeArchive } from "@/data/mock/homepage";
import { getGameById } from "@/data/mock/games";

export const metadata: Metadata = {
  title: "Antes da Platina | NewGame+",
  description:
    "Todos os episódios Antes da Platina — publicados e agendados — num só lugar.",
};

export default function AntesDaPlatinaPage() {
  const episodes = getEpisodeArchive();

  return (
    <>
      <Header />
      <GameBreadcrumb items={[{ label: "Antes da Platina" }]} />
      <main>
        <div className="border-b border-border bg-bg-raised py-8">
          <div className="mx-auto max-w-[1440px] px-4 lg:px-8">
            <h1 className="font-display text-3xl font-bold uppercase tracking-wide text-ink">
              Antes da Platina
            </h1>
            <p className="mt-1 text-sm text-ink-muted">
              Todos os episódios, publicados e agendados, num só lugar.
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-[1440px] px-4 py-10 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-2">
            {episodes.map((ep) => {
              const game = getGameById(ep.gameId);
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
