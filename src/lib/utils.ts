import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { GrindLevel } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Transforma um título em slug (ex.: "Elden Ring: Nightreign" ->
 * "elden-ring-nightreign") — usado sempre que um jogo é criado, seja
 * pelo formulário completo ou pela importação rápida via IGDB.
 */
export function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
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

/**
 * Normaliza um título para comparação (usado para ligar automaticamente
 * um jogo de "Antes da Platina" a um artigo de "Uma Hora Com" com o
 * mesmo nome, mesmo que a acentuação ou maiúsculas não batam certo).
 */
export function normalizeTitle(title: string) {
  return title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

/**
 * Extrai o ID de um vídeo do YouTube a partir de vários formatos de link
 * possíveis (youtube.com/watch?v=..., youtu.be/..., youtube.com/embed/...)
 * e devolve o link pronto a usar num <iframe>. Devolve null se o link não
 * for reconhecido, para nunca partir a página por causa de um link mal
 * colado no admin.
 */
export function getYoutubeEmbedUrl(url: string | null): string | null {
  if (!url) return null;
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
}
