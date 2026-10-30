import { slugify } from "@/lib/utils";
import { getTeamMembers, type TeamMember } from "@/lib/data/team";
import { getReviews } from "@/lib/data/reviews";
import { getHourWithArticles } from "@/lib/data/hour-with";
import { getRetroArticles } from "@/lib/data/retro";
import { getDiscoveryArticles } from "@/lib/data/discovery";
import { getTopArticles } from "@/lib/data/top";
import { getRadarArticles } from "@/lib/data/radar";

export interface AuthorArticle {
  key: string;
  category: string;
  title: string;
  imageUrl: string | null;
  date: string;
  href: string;
}

/** O endereço da página de um autor (ex: "João Ramos" -> /autores/joao-ramos). */
export function authorPath(name: string): string {
  return `/autores/${slugify(name)}`;
}

/** Procura um membro da equipa pelo slug do nome. */
export async function getAuthorBySlug(slug: string): Promise<TeamMember | null> {
  const members = await getTeamMembers();
  return members.find((m) => slugify(m.name) === slug) ?? null;
}

/** Todos os artigos publicados em que esta pessoa está como autora, mais recentes primeiro. */
export async function getArticlesByAuthor(memberId: string): Promise<AuthorArticle[]> {
  const [reviews, hourWith, retro, discoveries, tops, radars] = await Promise.all([
    getReviews(),
    getHourWithArticles(),
    getRetroArticles(),
    getDiscoveryArticles(),
    getTopArticles(),
    getRadarArticles(),
  ]);

  const items: AuthorArticle[] = [
    ...reviews
      .filter((a) => a.authorId === memberId)
      .map((a) => ({
        key: `review-${a.id}`,
        category: "Review",
        title: a.title,
        imageUrl: a.heroImageUrl ?? a.coverUrl,
        date: a.createdAt,
        href: `/review/${a.slug}`,
      })),
    ...hourWith
      .filter((a) => a.authorId === memberId)
      .map((a) => ({
        key: `hw-${a.id}`,
        category: "Vale a pena?",
        title: a.title,
        imageUrl: a.heroImageUrl ?? a.coverUrl,
        date: a.createdAt,
        href: `/vale-a-pena/${a.slug}`,
      })),
    ...retro
      .filter((a) => a.authorId === memberId)
      .map((a) => ({
        key: `retro-${a.id}`,
        category: "Retro+",
        title: a.title,
        imageUrl: a.heroImageUrl ?? a.coverUrl,
        date: a.createdAt,
        href: `/retro/${a.slug}`,
      })),
    ...discoveries
      .filter((a) => a.authorId === memberId)
      .map((a) => ({
        key: `disc-${a.id}`,
        category: "Descobertas+",
        title: a.title,
        imageUrl: a.heroImageUrl ?? a.coverUrl,
        date: a.createdAt,
        href: `/descobertas/${a.slug}`,
      })),
    ...tops
      .filter((a) => a.authorId === memberId)
      .map((a) => ({
        key: `top-${a.id}`,
        category: "Top+",
        title: a.title,
        imageUrl: a.heroImageUrl ?? a.coverUrl,
        date: a.createdAt,
        href: `/top/${a.slug}`,
      })),
    ...radars
      .filter((a) => a.authorId === memberId)
      .map((a) => ({
        key: `radar-${a.id}`,
        category: "Radar+",
        title: a.title,
        imageUrl: a.heroImageUrl ?? a.coverUrl,
        date: a.createdAt,
        href: `/radar/${a.slug}`,
      })),
  ];

  return items.sort((a, b) => (a.date < b.date ? 1 : -1));
}
