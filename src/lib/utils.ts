import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { GrindLevel } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPlatinumTime(min: number, max: number) {
  return `${min}-${max}h`;
}

export function formatDate(iso: string) {
  return new Intl.DateTimeFormat("pt-PT", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}

export function formatTrophyCount(breakdown: {
  bronze: number;
  prata: number;
  ouro: number;
  platina: number;
}) {
  return breakdown.bronze + breakdown.prata + breakdown.ouro + breakdown.platina;
}

export function difficultyLabel(value: number) {
  if (value <= 3) return "Fácil";
  if (value <= 6) return "Médio";
  if (value <= 8) return "Difícil";
  return "Extrema";
}

export function grindLabel(level: GrindLevel) {
  return { baixo: "Baixo", medio: "Médio", alto: "Alto" }[level];
}

export function genreLabel(genre: string) {
  const map: Record<string, string> = {
    acao: "Ação",
    rpg: "RPG",
    terror: "Terror",
    soulslike: "Soulslike",
    aventura: "Aventura",
    coop: "Coop",
    plataformas: "Plataformas",
    "mundo-aberto": "Mundo Aberto",
  };
  return map[genre] ?? genre;
}

export function platformLabel(platform: string) {
  const map: Record<string, string> = {
    ps5: "PS5",
    ps4: "PS4",
    xbox: "Xbox",
    switch: "Switch",
    pc: "PC",
  };
  return map[platform] ?? platform.toUpperCase();
}
