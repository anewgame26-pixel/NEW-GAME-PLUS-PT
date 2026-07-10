"use client";

import { Genre, Platform } from "@/types";
import { SearchInput } from "@/components/ui/SearchInput";
import { Chip } from "@/components/ui/Chip";
import { genreLabel, platformLabel } from "@/lib/utils";

export interface GameFilters {
  query: string;
  genres: Genre[];
  platforms: Platform[];
  timeId: string | null;
  difficultyId: string | null;
  noMissables: boolean;
}

export const EMPTY_FILTERS: GameFilters = {
  query: "",
  genres: [],
  platforms: [],
  timeId: null,
  difficultyId: null,
  noMissables: false,
};

export const TIME_OPTIONS = [
  { id: "10h", label: "Até 10h", max: 10 },
  { id: "20h", label: "Até 20h", max: 20 },
  { id: "40h", label: "Até 40h", max: 40 },
  { id: "40h+", label: "40h+", max: Infinity },
];

export const DIFFICULTY_OPTIONS = [
  { id: "facil", label: "Fácil", min: 1, max: 3 },
  { id: "medio", label: "Médio", min: 4, max: 6 },
  { id: "dificil", label: "Difícil", min: 7, max: 8 },
  { id: "extrema", label: "Extrema", min: 9, max: 10 },
];

const GENRE_OPTIONS: Genre[] = [
  "acao",
  "rpg",
  "terror",
  "soulslike",
  "aventura",
  "coop",
  "plataformas",
  "mundo-aberto",
];

const PLATFORM_OPTIONS: Platform[] = ["ps5", "ps4", "xbox", "switch", "pc"];

interface GameFiltersBarProps {
  filters: GameFilters;
  onChange: (filters: GameFilters) => void;
  resultCount: number;
}

export function GameFiltersBar({ filters, onChange, resultCount }: GameFiltersBarProps) {
  const toggleGenre = (g: Genre) => {
    onChange({
      ...filters,
      genres: filters.genres.includes(g)
        ? filters.genres.filter((x) => x !== g)
        : [...filters.genres, g],
    });
  };

  const togglePlatform = (p: Platform) => {
    onChange({
      ...filters,
      platforms: filters.platforms.includes(p)
        ? filters.platforms.filter((x) => x !== p)
        : [...filters.platforms, p],
    });
  };

  const hasActiveFilters =
    filters.query !== "" ||
    filters.genres.length > 0 ||
    filters.platforms.length > 0 ||
    filters.timeId !== null ||
    filters.difficultyId !== null ||
    filters.noMissables;

  return (
    <div className="flex flex-col gap-5">
      <SearchInput
        size="lg"
        placeholder="Pesquisar por nome do jogo..."
        value={filters.query}
        onChange={(e) => onChange({ ...filters, query: e.target.value })}
      />

      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-ink-dim">Género</p>
        <div className="flex flex-wrap gap-2">
          {GENRE_OPTIONS.map((g) => (
            <Chip key={g} active={filters.genres.includes(g)} onClick={() => toggleGenre(g)}>
              {genreLabel(g)}
            </Chip>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-ink-dim">Plataforma</p>
        <div className="flex flex-wrap gap-2">
          {PLATFORM_OPTIONS.map((p) => (
            <Chip key={p} active={filters.platforms.includes(p)} onClick={() => togglePlatform(p)}>
              {platformLabel(p)}
            </Chip>
          ))}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-ink-dim">
            Tempo para Platina
          </p>
          <div className="flex flex-wrap gap-2">
            {TIME_OPTIONS.map((t) => (
              <Chip
                key={t.id}
                active={filters.timeId === t.id}
                onClick={() => onChange({ ...filters, timeId: filters.timeId === t.id ? null : t.id })}
              >
                {t.label}
              </Chip>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-ink-dim">
            Dificuldade
          </p>
          <div className="flex flex-wrap gap-2">
            {DIFFICULTY_OPTIONS.map((d) => (
              <Chip
                key={d.id}
                active={filters.difficultyId === d.id}
                onClick={() =>
                  onChange({ ...filters, difficultyId: filters.difficultyId === d.id ? null : d.id })
                }
              >
                {d.label}
              </Chip>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-border pt-4">
        <Chip
          active={filters.noMissables}
          onClick={() => onChange({ ...filters, noMissables: !filters.noMissables })}
        >
          Sem Perdíveis
        </Chip>

        <div className="flex items-center gap-3">
          <span className="text-xs text-ink-dim">
            {resultCount} {resultCount === 1 ? "jogo encontrado" : "jogos encontrados"}
          </span>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={() => onChange(EMPTY_FILTERS)}
              className="text-xs font-medium text-primary hover:text-primary-light"
            >
              Limpar filtros
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
