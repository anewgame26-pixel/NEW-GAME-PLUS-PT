import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { GameBreadcrumb } from "@/components/game/GameBreadcrumb";
import { GameHero } from "@/components/game/GameHero";
import { GameOverallRating } from "@/components/game/GameOverallRating";
import { GameQuickInfoCard } from "@/components/game/GameQuickInfoCard";
import { TrophyList } from "@/components/game/TrophyList";
import { ReviewSection } from "@/components/game/ReviewSection";
import { RoadmapChapters } from "@/components/game/RoadmapChapters";
import { DifficultyExplanation } from "@/components/game/DifficultyExplanation";
import { HardestTrophiesGrid } from "@/components/game/HardestTrophiesGrid";
import { PrepTipsChecklist } from "@/components/game/PrepTipsChecklist";
import { ScreenshotsGallery } from "@/components/game/ScreenshotsGallery";
import { GameActionsBar } from "@/components/game/GameActionsBar";

export const dynamic = "force-dynamic";
import { SimilarGamesRow } from "@/components/game/SimilarGamesRow";
import { VideoEmbed } from "@/components/game/VideoEmbed";
import { GameEngagementBar } from "@/components/game/GameEngagementBar";
import { getAllGameSlugs, getGameBySlug, getGamesByIds } from "@/lib/data/games";
import { getGameDetail } from "@/lib/data/game-details";
import { getHourWithArticles } from "@/lib/data/hour-with";
import { getRetroArticles } from "@/lib/data/retro";
import { getDiscoveryArticles } from "@/lib/data/discovery";
import { normalizeTitle } from "@/lib/utils";
import { CrossLinkBanner } from "@/components/game/CrossLinkBanner";

interface GuiaPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllGameSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: GuiaPageProps): Promise<Metadata> {
  const { slug } = await params;
  const game = await getGameBySlug(slug);

  if (!game) {
    return { title: "Guia não encontrada | NewGame+" };
  }

  const title = `${game.title} — Guia Completo e Vale a Pena a Platina?`;
  const description = game.synopsis;
  const image = game.heroImageUrl ?? game.coverUrl;

  return {
    title: `${title} | NewGame+`,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: image }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function GuiaPage({ params }: GuiaPageProps) {
  const { slug } = await params;
  const game = await getGameBySlug(slug);

  if (!game) {
    notFound();
  }

  const detail = await getGameDetail(game.id);

  if (!detail) {
    notFound();
  }

  const similarGames = await getGamesByIds(game.similarGameIds);

  // Se existir um artigo "Uma Hora Com" sobre o mesmo jogo, ligamos as
  // duas páginas uma à outra (comparação por título, ignorando
  // acentos/maiúsculas, já que não há uma referência direta entre as
  // duas tabelas).
  const hourWithArticles = await getHourWithArticles();
  const matchingArticle = hourWithArticles.find(
    (a) => normalizeTitle(a.title) === normalizeTitle(game.title)
  );
  const retroArticles = await getRetroArticles();
  const matchingRetro = retroArticles.find(
    (a) => normalizeTitle(a.title) === normalizeTitle(game.title)
  );
  const discoveryArticles = await getDiscoveryArticles();
  const matchingDiscovery = discoveryArticles.find(
    (a) => normalizeTitle(a.title) === normalizeTitle(game.title)
  );

  // Dados estruturados (JSON-LD) — informação invisível no ecrã que ajuda
  // o Google (e a IA de pesquisa) a perceber que esta página é uma
  // análise, com nota, autor e do que é que trata. Não muda nada visual.
  const reviewSchema = {
    "@context": "https://schema.org",
    "@type": "Review",
    itemReviewed: {
      "@type": "VideoGame",
      name: game.title,
      image: game.coverUrl,
      ...(game.developer ? { author: { "@type": "Organization", name: game.developer } } : {}),
    },
    author: { "@type": "Organization", name: "NewGame+ PT" },
    publisher: { "@type": "Organization", name: "NewGame+ PT" },
    reviewRating: {
      "@type": "Rating",
      ratingValue: detail.overallScore,
      bestRating: 10,
      worstRating: 0,
    },
    reviewBody: detail.review.verdict || detail.review.intro,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }}
      />
      <Header />
      <GameBreadcrumb
        items={[
          { label: "Jogos", href: "/jogos" },
          { label: game.title },
        ]}
      />
      <main>
        <GameHero game={game} roadmapHref={detail.roadmapHref} />

        {matchingArticle && (
          <div className="pt-5">
            <CrossLinkBanner
              href={`/uma-hora-com/${matchingArticle.slug}`}
              icon="clock"
              title="Já jogámos isto durante 1 hora, antes de platinar"
              description="Lê a primeira impressão em Uma Hora Com..."
            />
          </div>
        )}

        {matchingRetro && (
          <div className={matchingArticle ? "pt-2" : "pt-5"}>
            <CrossLinkBanner
              href={`/retro/${matchingRetro.slug}`}
              icon="history"
              title="Também escrevemos sobre isto em Retro+"
              description="Vê se ainda vale a pena jogar hoje"
            />
          </div>
        )}

        {matchingDiscovery && (
          <div className={matchingArticle || matchingRetro ? "pt-2" : "pt-5"}>
            <CrossLinkBanner
              href={`/descobertas/${matchingDiscovery.slug}`}
              icon="compass"
              title="Este jogo também está em Descobertas+"
              description="Lê porque vale a pena conhecer"
            />
          </div>
        )}

        <GameOverallRating score={detail.overallScore} breakdown={detail.ratingBreakdown} />

        <div className="mx-auto max-w-[1440px] px-4 py-5 lg:px-8">
          <GameActionsBar gameId={game.id} />
        </div>

        <section className="border-t border-border py-10">
          <div className="mx-auto flex max-w-[1440px] flex-col gap-6 px-4 lg:flex-row lg:px-8">
            <div className="shrink-0">
              <GameQuickInfoCard game={game} detail={detail} />
            </div>
            <div className="flex-1">
              <TrophyList trophies={detail.trophyList} />
            </div>
          </div>
        </section>

        <div className="border-t border-border">
          <ReviewSection review={detail.review} />
        </div>

        <DifficultyExplanation game={game} explanation={detail.difficultyExplanation} />

        <RoadmapChapters chapters={detail.roadmapChapters} />

        <HardestTrophiesGrid trophies={detail.hardestTrophies} />
        <PrepTipsChecklist tips={detail.prepTips} />
        <ScreenshotsGallery urls={detail.screenshotUrls} gameTitle={game.title} />
        <VideoEmbed videoId={detail.videoId} title={game.title} />
        <SimilarGamesRow games={similarGames} />
        <GameEngagementBar gameId={game.id} gameTitle={game.title} />
      </main>
      <Footer />
    </>
  );
}
