export type Platform = "ps5" | "ps4" | "xbox" | "switch" | "pc";

export type Genre =
  | "acao"
  | "rpg"
  | "terror"
  | "soulslike"
  | "aventura"
  | "coop"
  | "plataformas"
  | "mundo-aberto";

export type GrindLevel = "baixo" | "medio" | "alto";

export interface TrophyBreakdown {
  bronze: number;
  prata: number;
  ouro: number;
  platina: number;
}

export interface Game {
  id: string;
  slug: string;
  title: string;
  coverUrl: string;
  heroImageUrl?: string;
  platforms: Platform[];
  genres: Genre[];
  releaseYear: number;
  /** Data completa de lançamento (ISO). Opcional para não obrigar todos os mocks a tê-la. */
  releaseDate?: string;
  developer: string;
  /** Dificuldade geral para platinar, de 1 (fácil) a 10 (extrema) */
  difficulty: number;
  platinumTimeMin: number;
  platinumTimeMax: number;
  trophyBreakdown: TrophyBreakdown;
  hasMissables: boolean;
  hasOnlineTrophies: boolean;
  grindLevel: GrindLevel;
  /** Vale a pena comprar, de 1 a 5 */
  worthBuying: number;
  /** Vale a pena platinar, de 1 a 5 */
  worthPlatinum: number;
  guideRequired: boolean;
  synopsis: string;
  similarGameIds: string[];
}

export interface CommunityMember {
  id: string;
  name: string;
  avatarInitials: string;
}

export interface PlayingNow {
  gameId: string;
  progressPercent: number;
  activePlayers: CommunityMember[];
}

export interface UpcomingVideo {
  id: string;
  gameId: string;
  publishDate: string;
  type: "Antes da Platina" | "Review" | "Roadmap";
}

export interface LatestBeforePlatinumEpisode {
  id: string;
  gameId: string;
  publishDate: string;
  /** Frase curta de veredito, tipo "legenda" do episódio */
  verdict: string;
}

export type TimelineStageKey = "inicio" | "meio" | "final" | "cleanup";

export interface TimelineStage {
  stage: TimelineStageKey;
  label: string;
  description: string;
}

export interface ReviewContent {
  intro: string;
  whatToExpect: string;
  pros: string[];
  cons: string[];
  verdict: string;
}

export interface MissableItem {
  title: string;
  chapter: string;
  description: string;
}

export interface HardestTrophy {
  name: string;
  description: string;
  tip: string;
}

export interface RatingBreakdownItem {
  label: string;
  value: number;
}

export interface RoadmapChapterMissable {
  title: string;
  description: string;
}

export interface RoadmapChapter {
  title: string;
  description: string;
  /** ID de vídeo do YouTube deste capítulo (opcional) */
  youtubeId?: string;
  /** Missables específicos deste capítulo (opcional) */
  missables?: RoadmapChapterMissable[];
}

export interface GameDetail {
  gameId: string;
  minPlaythroughs: number;
  difficultyExplanation: string;
  review: ReviewContent;
  roadmapChapters: RoadmapChapter[];
  hardestTrophies: HardestTrophy[];
  prepTips: string[];
  /** ID de vídeo do YouTube (mock/placeholder por agora) */
  videoId?: string;
  guideHref: string;
  roadmapHref: string;
  /** Classificação geral de 0 a 10 */
  overallScore: number;
  ratingBreakdown: RatingBreakdownItem[];
  screenshotUrls: string[];
}

export interface RankingCategory {
  id: string;
  label: string;
  description: string;
  icon: "trophy" | "skull" | "clock" | "hourglass" | "heart" | "frown";
  href: string;
}

export interface PlatformStat {
  label: string;
  value: string;
  icon: "gamepad" | "book" | "map" | "video" | "zap" | "trophy" | "clock";
}

export interface CommunityPost {
  id: string;
  author: string;
  title: string;
  repliesCount: number;
  timeAgo: string;
}
