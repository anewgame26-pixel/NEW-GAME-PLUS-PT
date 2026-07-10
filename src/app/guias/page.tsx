import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { GameBreadcrumb } from "@/components/game/GameBreadcrumb";
import { GameCard } from "@/components/game/GameCard";
import { games } from "@/data/mock/games";

export const metadata: Metadata = {
  title: "Guias | NewGame+",
  description: "Guias completos, capítulo a capítulo, para platinares qualquer jogo do catálogo NewGame+.",
};

export default function GuiasPage() {
  return (
    <>
      <Header />
      <GameBreadcrumb items={[{ label: "Guias" }]} />
      <main>
        <div className="border-b border-border bg-bg-raised py-8">
          <div className="mx-auto max-w-[1440px] px-4 lg:px-8">
            <h1 className="font-display text-3xl font-bold uppercase tracking-wide text-ink">
              Guias
            </h1>
            <p className="mt-1 text-sm text-ink-muted">
              Escolhe um jogo para veres o guia completo: dificuldade, missables, troféus
              difíceis, roadmap e dicas antes de começares.
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-[1440px] px-4 py-10 lg:px-8">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
            {games.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                className="w-full"
                href={`/guias/${game.slug}`}
              />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
