import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Trophy, Clock, History, Compass } from "lucide-react";
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
import { GameContentTabs, type GameContentTabPanel } from "@/components/game/GameContentTabs";
import { HourWithArticleBody } from "@/components/game/HourWithArticleBody";
import { RetroArticleBody } from "@/components/game/RetroArticleBody";
import { DiscoveryArticleBody } from "@/components/game/DiscoveryArticleBody";
import { getAllGameSlugs, getGameBySlug, getGamesByIds } from "@/lib/data/games";
import { getGameDetail } from "@/lib/data/game-details";
import { getTeamMembers } from "@/lib/data/team";
import { getHourWithArticles } from "@/lib/data/hour-with";
import { getRetroArticles } from "@/lib/data/retro";
import { getDiscoveryArticles } from "@/lib/data/discovery";
import { normalizeTitle } from "@/lib/utils";

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
    return { title: "Página não encontrada | NewGame+" };
  }

  const title = `${game.title} — Análises, Guias e Roadmap`;
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

  // Vai buscar o artigo de cada outro pilar ligado a este jogo — pelo
  // campo "Jogo" do editor (game_id), com o antigo método de comparar
  // títulos como recurso, para artigos mais antigos ainda sem essa
  // ligação.
  const [hourWithArticles, retroArticles, discoveryArticles] = await Promise.all([
    getHourWithArticles(),
    getRetroArticles(),
    getDiscoveryArticles(),
  ]);
  const matchingHourWith =
    hourWithArticles.find((a) => a.gameId === game.id) ??
    hourWithArticles.find((a) => normalizeTitle(a.title) === normalizeTitle(game.title)) ??
    null;
  const matchingRetro =
    retroArticles.find((a) => a.gameId === game.id) ??
    retroArticles.find((a) => normalizeTitle(a.title) === normalizeTitle(game.title)) ??
    null;
  const matchingDiscovery =
    discoveryArticles.find((a) => a.gameId === game.id) ??
    discoveryArticles.find((a) => normalizeTitle(a.title) === normalizeTitle(game.title)) ??
    null;

  // Nada para mostrar de todo — nem review, nem nenhum outro pilar.
  if (!detail && !matchingHourWith && !matchingRetro && !matchingDiscovery) {
    notFound();
  }

  const similarGames = detail ? await getGamesByIds(game.similarGameIds) : [];

  const reviewAuthor = detail?.reviewAuthorId
    ? (await getTeamMembers()).find((m) => m.id === detail.reviewAuthorId) ?? null
    : null;

  // Dados estruturados (JSON-LD) — só faz sentido como "Review" quando
  // existe mesmo uma análise Antes da Platina; caso contrário fica como
  // um jogo genérico, para não inventar uma nota que não existe.
  const reviewSchema = detail
    ? {
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
      }
    : {
        "@context": "https://schema.org",
        "@type": "VideoGame",
        name: game.title,
        image: game.coverUrl,
      };

  const panels: GameContentTabPanel[] = [];

  if (detail) {
    panels.push({
      id: "platina",
      label: "Antes da Platina",
      icon: <Trophy width={15} height={15} />,
      content: (
        <>
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
            <ReviewSection review={detail.review} author={reviewAuthor} />
          </div>

          <DifficultyExplanation game={game} explanation={detail.difficultyExplanation} />
          <RoadmapChapters chapters={detail.roadmapChapters} />
          <HardestTrophiesGrid trophies={detail.hardestTrophies} />
          <PrepTipsChecklist tips={detail.prepTips} />
          <ScreenshotsGallery urls={detail.screenshotUrls} gameTitle={game.title} />
          <VideoEmbed videoId={detail.videoId} title={game.title} />
          <SimilarGamesRow games={similarGames} />
        </>
      ),
    });
  }

  if (matchingHourWith) {
    panels.push({
      id: "uma-hora-com",
      label: "Uma Hora Com",
      icon: <Clock width={15} height={15} />,
      content: <HourWithArticleBody article={matchingHourWith} showHeading={false} />,
    });
  }

  if (matchingRetro) {
    panels.push({
      id: "retro",
      label: "Retro+",
      icon: <History width={15} height={15} />,
      content: <RetroArticleBody article={matchingRetro} showHeading={false} />,
    });
  }

  if (matchingDiscovery) {
    panels.push({
      id: "descobertas",
      label: "Descobertas+",
      icon: <Compass width={15} height={15} />,
      content: <DiscoveryArticleBody article={matchingDiscovery} showHeading={false} />,
    });
  }

  // Se não houver "Antes da Platina", entra logo no primeiro outro pilar
  // que exista (Uma Hora Com primeiro, depois Retro+, depois Descobertas+).
  const defaultTabId = panels[0]?.id ?? "platina";

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
        <GameHero game={game} roadmapHref={detail?.roadmapHref} />
        <GameContentTabs panels={panels} defaultTabId={defaultTabId} />
        <GameEngagementBar gameId={game.id} gameTitle={game.title} />
      </main>
      <Footer />
    </>
  );
}
