import {
  CommunityPost,
  LatestBeforePlatinumEpisode,
  PlatformStat,
  PlayingNow,
  RankingCategory,
  UpcomingVideo,
} from "@/types";

export const playingNow: PlayingNow[] = [
  {
    gameId: "g10",
    progressPercent: 80,
    activePlayers: [
      { id: "u1", name: "Pedro", avatarInitials: "PD" },
      { id: "u2", name: "Miguel", avatarInitials: "MG" },
      { id: "u3", name: "João", avatarInitials: "JS" },
    ],
  },
  {
    gameId: "g5",
    progressPercent: 60,
    activePlayers: [
      { id: "u4", name: "Ana", avatarInitials: "AN" },
      { id: "u5", name: "Rita", avatarInitials: "RT" },
    ],
  },
  {
    gameId: "g1",
    progressPercent: 30,
    activePlayers: [{ id: "u6", name: "André", avatarInitials: "AD" }],
  },
  {
    gameId: "g4",
    progressPercent: 10,
    activePlayers: [
      { id: "u7", name: "Carla", avatarInitials: "CR" },
      { id: "u8", name: "Bruno", avatarInitials: "BR" },
    ],
  },
];

export const latestBeforePlatinum: LatestBeforePlatinumEpisode[] = [
  {
    id: "bp1",
    gameId: "g6",
    publishDate: "2026-07-01",
    verdict: "Vale o sofrimento, mas prepara-te mentalmente.",
  },
  {
    id: "bp2",
    gameId: "g9",
    publishDate: "2026-06-24",
    verdict: "Perfeito para jogar em grupo, platina tranquila.",
  },
  {
    id: "bp3",
    gameId: "g2",
    publishDate: "2026-06-17",
    verdict: "Curto, intenso, e com finais que valem a pena repetir.",
  },
  {
    id: "bp4",
    gameId: "g4",
    publishDate: "2026-06-10",
    verdict: "Só para quem tem tempo — mas o mundo compensa.",
  },
];

export const upcomingVideos: UpcomingVideo[] = [
  { id: "v1", gameId: "g1", publishDate: "2026-07-15", type: "Antes da Platina" },
  { id: "v2", gameId: "g6", publishDate: "2026-07-22", type: "Antes da Platina" },
  { id: "v3", gameId: "g9", publishDate: "2026-07-29", type: "Roadmap" },
  { id: "v4", gameId: "g10", publishDate: "2026-08-05", type: "Review" },
];

export const rankingCategories: RankingCategory[] = [
  {
    id: "faceis",
    label: "Mais Fáceis",
    description: "Platinas tranquilas para relaxar",
    icon: "trophy",
    href: "/rankings/mais-faceis",
  },
  {
    id: "dificeis",
    label: "Mais Difíceis",
    description: "Só para quem gosta de sofrer",
    icon: "skull",
    href: "/rankings/mais-dificeis",
  },
  {
    id: "rapidas",
    label: "Mais Rápidas",
    description: "Platina em menos de 15 horas",
    icon: "clock",
    href: "/rankings/mais-rapidas",
  },
  {
    id: "longas",
    label: "Mais Longas",
    description: "Preparado para uma maratona",
    icon: "hourglass",
    href: "/rankings/mais-longas",
  },
  {
    id: "favoritas",
    label: "Favoritas da Comunidade",
    description: "As melhor avaliadas por quem jogou",
    icon: "heart",
    href: "/rankings/favoritas",
  },
  {
    id: "frustrantes",
    label: "Mais Frustrantes",
    description: "Missables e RNG ao máximo",
    icon: "frown",
    href: "/rankings/mais-frustrantes",
  },
];

export const platformStats: PlatformStat[] = [
  { label: "Jogos Analisados", value: "653", icon: "gamepad" },
  { label: "Guias Completos", value: "641", icon: "book" },
  { label: "Roadmaps Criados", value: "525", icon: "map" },
  { label: "Vídeos Publicados", value: "390", icon: "video" },
  { label: "Troféus Catalogados", value: "18 000+", icon: "trophy" },
  { label: "Horas de Gameplay", value: "12 000+", icon: "clock" },
];

export const communityPosts: CommunityPost[] = [
  {
    id: "p1",
    author: "André Silva",
    title: "Qual a platina mais difícil que já fizeram?",
    repliesCount: 24,
    timeAgo: "há 2 horas",
  },
  {
    id: "p2",
    author: "Lucas PT",
    title: "Troféus perdíveis em Nightfall Ledger — lista atualizada",
    repliesCount: 12,
    timeAgo: "há 4 horas",
  },
  {
    id: "p3",
    author: "Mário",
    title: "Dividido: Route 9 vale mesmo o jogo perfeito?",
    repliesCount: 18,
    timeAgo: "há 6 horas",
  },
  {
    id: "p4",
    author: "Mariana Gamer",
    title: "Alguém para um grupo de 4 em Last Convoy?",
    repliesCount: 9,
    timeAgo: "há 8 horas",
  },
];

export const discordOnlineCount = 342;
export const discordMemberSample = ["PD", "MG", "JS", "AN"];

export interface ArchiveEpisode {
  id: string;
  gameId: string;
  publishDate: string;
  status: "publicado" | "agendado";
  /** Tipo (para agendados) ou veredito curto (para publicados) */
  label: string;
}

export function getEpisodeArchive(): ArchiveEpisode[] {
  const published: ArchiveEpisode[] = latestBeforePlatinum.map((ep) => ({
    id: ep.id,
    gameId: ep.gameId,
    publishDate: ep.publishDate,
    status: "publicado",
    label: ep.verdict,
  }));

  const scheduled: ArchiveEpisode[] = upcomingVideos.map((v) => ({
    id: v.id,
    gameId: v.gameId,
    publishDate: v.publishDate,
    status: "agendado",
    label: v.type,
  }));

  return [...scheduled, ...published].sort(
    (a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
  );
}
