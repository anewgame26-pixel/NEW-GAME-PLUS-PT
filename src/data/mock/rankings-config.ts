import { Game } from "@/types";

export interface RankingConfig {
  slug: string;
  label: string;
  description: string;
  sort: (games: Game[]) => Game[];
  valueLabel: (game: Game) => string;
}

const byDifficultyAsc = (games: Game[]) => [...games].sort((a, b) => a.difficulty - b.difficulty);
const byDifficultyDesc = (games: Game[]) => [...games].sort((a, b) => b.difficulty - a.difficulty);
const byTimeAsc = (games: Game[]) => [...games].sort((a, b) => a.platinumTimeMax - b.platinumTimeMax);
const byTimeDesc = (games: Game[]) => [...games].sort((a, b) => b.platinumTimeMax - a.platinumTimeMax);

export const rankingConfigs: RankingConfig[] = [
  {
    slug: "mais-faceis",
    label: "Mais Fáceis",
    description: "Platinas tranquilas para relaxar, sem grande curva de dificuldade.",
    sort: byDifficultyAsc,
    valueLabel: (g) => `${g.difficulty}/10`,
  },
  {
    slug: "mais-dificeis",
    label: "Mais Difíceis",
    description: "Só para quem gosta de sofrer — as platinas mais exigentes do catálogo.",
    sort: byDifficultyDesc,
    valueLabel: (g) => `${g.difficulty}/10`,
  },
  {
    slug: "mais-rapidas",
    label: "Mais Rápidas",
    description: "Platina em poucas horas, ideais para quem tem pouco tempo livre.",
    sort: byTimeAsc,
    valueLabel: (g) => `${g.platinumTimeMin}-${g.platinumTimeMax}h`,
  },
  {
    slug: "mais-longas",
    label: "Mais Longas",
    description: "Preparado para uma maratona — estes jogos exigem dezenas de horas.",
    sort: byTimeDesc,
    valueLabel: (g) => `${g.platinumTimeMin}-${g.platinumTimeMax}h`,
  },
  {
    slug: "favoritas",
    label: "Favoritas da Comunidade",
    description: "As platinas melhor avaliadas por quem já as conquistou.",
    sort: (games) => [...games].sort((a, b) => b.worthPlatinum - a.worthPlatinum || b.worthBuying - a.worthBuying),
    valueLabel: (g) => `${g.worthPlatinum}/5`,
  },
  {
    slug: "mais-frustrantes",
    label: "Mais Frustrantes",
    description: "Missables cruzados, RNG e décadas de grind — foge se puderes.",
    sort: (games) =>
      [...games].sort((a, b) => {
        if (a.hasMissables !== b.hasMissables) return a.hasMissables ? -1 : 1;
        return b.difficulty - a.difficulty;
      }),
    valueLabel: (g) => (g.hasMissables ? `Perdíveis · ${g.difficulty}/10` : `Sem Perdíveis · ${g.difficulty}/10`),
  },
];

export function getRankingConfig(slug: string) {
  return rankingConfigs.find((c) => c.slug === slug);
}
