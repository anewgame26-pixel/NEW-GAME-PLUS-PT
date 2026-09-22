import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { GameBreadcrumb } from "@/components/game/GameBreadcrumb";
import { getReviewBySlug } from "@/lib/data/reviews";
import { getGames } from "@/lib/data/games";
import { getHourWithArticles } from "@/lib/data/hour-with";
import { getRetroArticles } from "@/lib/data/retro";
import { getDiscoveryArticles } from "@/lib/data/discovery";
import { getTeamMembers } from "@/lib/data/team";
import { normalizeTitle } from "@/lib/utils";
import { CrossLinkBanner } from "@/components/game/CrossLinkBanner";
import { ReviewArticleBody } from "@/components/game/ReviewArticleBody";

interface ArtigoPageProps {
  params: Promise<{ slug: string }>;
}

function stripHtml(html: string) {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export async function generateMetadata({ params }: ArtigoPageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getReviewBySlug(slug);

  if (!article) {
    return { title: "Review não encontrada | NewGame+" };
  }

  const title = `${article.title} — Review`;
  const description = stripHtml(article.intro).slice(0, 155);
  const image = article.heroImageUrl ?? article.coverUrl ?? undefined;

  return {
    title: `${title} | NewGame+`,
    description,
    openGraph: {
      title,
      description,
      ...(image ? { images: [{ url: image }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(image ? { images: [image] } : {}),
    },
  };
}

export default async function ReviewArtigoPage({ params }: ArtigoPageProps) {
  const { slug } = await params;
  const article = await getReviewBySlug(slug);

  if (!article) notFound();

  const heroImage = article.heroImageUrl ?? article.coverUrl;

  const games = await getGames();
  const matchingGame = article.gameId
    ? games.find((g) => g.id === article.gameId) ?? null
    : games.find((g) => normalizeTitle(g.title) === normalizeTitle(article.title)) ?? null;
  const hourWithArticles = await getHourWithArticles();
  const matchingHourWith = hourWithArticles.find(
    (a) => normalizeTitle(a.title) === normalizeTitle(article.title)
  );
  const retroArticles = await getRetroArticles();
  const matchingRetro = retroArticles.find(
    (a) => normalizeTitle(a.title) === normalizeTitle(article.title)
  );
  const discoveryArticles = await getDiscoveryArticles();
  const matchingDiscovery = discoveryArticles.find(
    (a) => normalizeTitle(a.title) === normalizeTitle(article.title)
  );
  const author = article.authorId
    ? (await getTeamMembers()).find((m) => m.id === article.authorId) ?? null
    : null;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Review",
    itemReviewed: { "@type": "VideoGame", name: article.title },
    headline: `${article.title} — Review`,
    description: stripHtml(article.intro).slice(0, 200),
    ...(heroImage ? { image: [heroImage] } : {}),
    author: { "@type": "Organization", name: "NewGame+ PT" },
    publisher: { "@type": "Organization", name: "NewGame+ PT" },
    ...(article.datePlayed ? { datePublished: article.datePlayed } : {}),
    ...(article.nota !== null
      ? {
          reviewRating: {
            "@type": "Rating",
            ratingValue: article.nota,
            bestRating: 10,
            worstRating: 0,
          },
        }
      : {}),
  };

  const crossLinks = (
    <div className="mt-4 flex flex-col gap-2">
      {matchingGame?.isPublished && (
        <CrossLinkBanner
          bare
          href={`/guias/${matchingGame.slug}`}
          icon="trophy"
          title="Também já platinámos este jogo"
          description="Lê a análise completa em Antes da Platina"
        />
      )}
      {matchingHourWith && (
        <CrossLinkBanner
          bare
          href={`/vale-a-pena/${matchingHourWith.slug}`}
          icon="trophy"
          title="Já tínhamos jogado a primeira hora"
          description="Vê a primeira impressão em Vale a Pena?"
        />
      )}
      {matchingRetro && (
        <CrossLinkBanner
          bare
          href={`/retro/${matchingRetro.slug}`}
          icon="history"
          title="Também escrevemos sobre isto em Retro+"
          description="Vê se ainda vale a pena jogar hoje"
        />
      )}
      {matchingDiscovery && (
        <CrossLinkBanner
          bare
          href={`/descobertas/${matchingDiscovery.slug}`}
          icon="compass"
          title="Este jogo também está em Descobertas+"
          description="Lê porque vale a pena conhecer"
        />
      )}
    </div>
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <Header />
      <GameBreadcrumb
        items={[
          { label: "Review", href: "/review" },
          { label: article.title },
        ]}
      />
      <main>
        <ReviewArticleBody article={article} extraSlot={crossLinks} author={author} />
      </main>
      <Footer />
    </>
  );
}
