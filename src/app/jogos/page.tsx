import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { GameBreadcrumb } from "@/components/game/GameBreadcrumb";
import { JogosListingClient } from "@/components/game/JogosListingClient";

export const metadata: Metadata = {
  title: "Todos os Jogos | NewGame+",
  description:
    "Pesquisa e filtra o catálogo completo da NewGame+ por género, plataforma, dificuldade e tempo para a platina.",
};

export default function JogosPage() {
  return (
    <>
      <Header />
      <GameBreadcrumb items={[{ label: "Jogos" }]} />
      <main>
        <div className="border-b border-border bg-bg-raised py-8">
          <div className="mx-auto max-w-[1440px] px-4 lg:px-8">
            <h1 className="font-display text-3xl font-bold uppercase tracking-wide text-ink">
              Todos os Jogos
            </h1>
            <p className="mt-1 text-sm text-ink-muted">
              Pesquisa e filtra por género, plataforma, dificuldade e tempo para a platina.
            </p>
          </div>
        </div>
        <JogosListingClient />
      </main>
      <Footer />
    </>
  );
}
