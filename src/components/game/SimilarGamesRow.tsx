import { Game } from "@/types";
import { GameCard } from "@/components/game/GameCard";

interface SimilarGamesRowProps {
  games: Game[];
}

export function SimilarGamesRow({ games }: SimilarGamesRowProps) {
  if (games.length === 0) return null;

  return (
    <section className="border-t border-border py-10">
      <div className="mx-auto max-w-[1440px] px-4 lg:px-8">
        <h2 className="mb-5 font-display text-xl font-bold uppercase tracking-wide text-ink">
          Jogos Semelhantes
        </h2>
        <div className="no-scrollbar flex gap-4 overflow-x-auto pb-1">
          {games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </div>
    </section>
  );
}
