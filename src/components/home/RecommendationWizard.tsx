"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Genre } from "@/types";
import { games } from "@/data/mock/games";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { Button } from "@/components/ui/Button";
import { GameCard } from "@/components/game/GameCard";

const TIME_OPTIONS = [
  { id: "10h", label: "Até 10h", max: 10 },
  { id: "10-20h", label: "10-20h", max: 20 },
  { id: "20-40h", label: "20-40h", max: 40 },
  { id: "40h+", label: "40h+", max: Infinity },
];

const GENRE_OPTIONS: { id: Genre; label: string }[] = [
  { id: "acao", label: "Ação" },
  { id: "rpg", label: "RPG" },
  { id: "terror", label: "Terror" },
  { id: "soulslike", label: "Soulslike" },
  { id: "aventura", label: "Aventura" },
  { id: "coop", label: "Coop" },
];

export function RecommendationWizard() {
  const [time, setTime] = useState(TIME_OPTIONS[1].id);
  const [genre, setGenre] = useState<Genre>("acao");
  const [showResults, setShowResults] = useState(false);

  const results = useMemo(() => {
    const selectedTime = TIME_OPTIONS.find((t) => t.id === time)!;
    return games
      .filter((g) => g.platinumTimeMax <= selectedTime.max && g.genres.includes(genre))
      .slice(0, 4);
  }, [time, genre]);

  return (
    <Card className="p-5">
      <div className="mb-4 flex items-center gap-2">
        <Sparkles width={18} height={18} className="text-primary" />
        <h2 className="font-display text-lg font-bold uppercase tracking-wide text-ink">
          Escolhe a tua Próxima Platina
        </h2>
      </div>

      <div className="mb-4">
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-ink-dim">
          1. Quanto tempo tens?
        </p>
        <div className="flex flex-wrap gap-2">
          {TIME_OPTIONS.map((opt) => (
            <Chip
              key={opt.id}
              active={time === opt.id}
              onClick={() => {
                setTime(opt.id);
                setShowResults(false);
              }}
            >
              {opt.label}
            </Chip>
          ))}
        </div>
      </div>

      <div className="mb-5">
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-ink-dim">
          2. Que tipo de experiência preferes?
        </p>
        <div className="flex flex-wrap gap-2">
          {GENRE_OPTIONS.map((opt) => (
            <Chip
              key={opt.id}
              active={genre === opt.id}
              onClick={() => {
                setGenre(opt.id);
                setShowResults(false);
              }}
            >
              {opt.label}
            </Chip>
          ))}
        </div>
      </div>

      <Button className="w-full" onClick={() => setShowResults(true)}>
        Ver Jogos Recomendados
      </Button>

      {showResults && (
        <div className="mt-5 border-t border-border pt-4">
          {results.length === 0 ? (
            <p className="text-sm text-ink-muted">
              Ninguém sobreviveu a estes critérios. Experimenta outra combinação —
              a NG+ ainda não catalogou esse sofrimento em específico.
            </p>
          ) : (
            <div className="no-scrollbar flex gap-4 overflow-x-auto">
              {results.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          )}
          <Link
            href="/jogos"
            className="mt-3 inline-block text-xs font-medium text-primary hover:text-primary-light"
          >
            Ver mais resultados na pesquisa completa →
          </Link>
        </div>
      )}
    </Card>
  );
}
