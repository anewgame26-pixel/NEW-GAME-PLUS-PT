import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { GameBreadcrumb } from "@/components/game/GameBreadcrumb";
import { PageHeader } from "@/components/layout/PageHeader";
import { JogosListingClient } from "@/components/game/JogosListingClient";
import { getGames } from "@/lib/data/games";
import type { Genre } from "@/types";

export const metadata: Metadata = {
  title: "Todos os Jogos | NewGame+",
  description:
    "Pesquisa e filtra o catálogo completo da NewGame+ por género, plataforma, dificuldade e tempo para a platina.",
};

interface JogosPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function JogosPage({ searchParams }: JogosPageProps) {
  const games = await getGames();
  const params = await searchParams;

  // Filtros vindos dos "Filtros rápidos" da homepage (ex: /jogos?time=10h)
  // e da pesquisa do hero (ex: /jogos?q=elden+ring)
  const initialFilters = {
    query: typeof params.q === "string" ? params.q : "",
    timeId: typeof params.time === "string" ? params.time : null,
    difficultyId: typeof params.difficulty === "string" ? params.difficulty : null,
    genres: typeof params.genre === "string" ? [params.genre as Genre] : [],
    noMissables: params.noMissables === "1",
  };

  return (
    <>
      <Header />
      <GameBreadcrumb items={[{ label: "Jogos" }]} />
      <main>
        <PageHeader
          title="Todos os Jogos"
          description="Pesquisa e filtra por género, plataforma, dificuldade e tempo para a platina."
        />
        <JogosListingClient games={games} initialFilters={initialFilters} />
      </main>
      <Footer />
    </>
  );
}
