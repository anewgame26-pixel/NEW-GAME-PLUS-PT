"use client";

import { useMemo, useState } from "react";
import { SearchX } from "lucide-react";
import { Game } from "@/types";
import { GameCard } from "@/components/game/GameCard";
import {
  DIFFICULTY_OPTIONS,
  EMPTY_FILTERS,
  GameFilters,
  GameFiltersBar,
  TIME_OPTIONS,
} from "@/components/game/GameFiltersBar";

interface JogosListingClientProps {
  games: Game[];
}

export function JogosListingClient({ games }: JogosListingClientProps) {
  const [filters, setFilters] = useState<GameFilters>(EMPTY_FILTERS);

  const filteredGames = useMemo(() => {
    const timeOption = TIME_OPTIONS.find((t) => t.id === filters.timeId);
    const difficultyOption = DIFFICULTY_OPTIONS.find((d) => d.id === filters.difficultyId);

    return games.filter((game) => {
      if (
        filters.query &&
        !game.title.toLowerCase().includes(filters.query.toLowerCase())
      ) {
        return false;
      }
      if (filters.genres.length > 0 && !filters.genres.some((g) => game.genres.includes(g))) {
        return false;
      }
      if (
        filters.platforms.length > 0 &&
        !filters.platforms.some((p) => game.platforms.includes(p))
      ) {
        return false;
      }
      if (timeOption && game.platinumTimeMax > timeOption.max) {
        return false;
      }
      if (
        difficultyOption &&
        (game.difficulty < difficultyOption.min || game.difficulty > difficultyOption.max)
      ) {
        return false;
      }
      if (filters.noMissables && game.hasMissables) {
        return false;
      }
      return true;
    });
  }, [filters, games]);

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-10 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <GameFiltersBar
            filters={filters}
            onChange={setFilters}
            resultCount={filteredGames.length}
          />
        </aside>

        <div>
          {filteredGames.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 rounded-sm border border-border bg-bg-surface py-16 text-center">
              <SearchX width={32} height={32} className="text-ink-dim" />
              <p className="font-display text-sm font-semibold text-ink">
                Nenhum jogo encontrado
              </p>
              <p className="max-w-xs text-sm text-ink-muted">
                Ninguém sobreviveu a estes critérios. Experimenta ajustar os filtros.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
              {filteredGames.map((game) => (
                <GameCard key={game.id} game={game} className="w-full" />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
