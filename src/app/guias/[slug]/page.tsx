import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { GameBreadcrumb } from "@/components/game/GameBreadcrumb";
import { GameHero } from "@/components/game/GameHero";
import { GameOverallRating } from "@/components/game/GameOverallRating";
import { GameQuickInfoCard } from "@/components/game/GameQuickInfoCard";
import { ReviewSection } from "@/components/game/ReviewSection";
import { RoadmapSummaryCard } from "@/components/game/RoadmapSummaryCard";
import { PlatinumTimeline } from "@/components/game/PlatinumTimeline";
import { DifficultyExplanation } from "@/components/game/DifficultyExplanation";
import { MissablesList } from "@/components/game/MissablesList";
import { HardestTrophiesGrid } from "@/components/game/HardestTrophiesGrid";
import { PrepTipsChecklist } from "@/components/game/PrepTipsChecklist";
import { ScreenshotsGallery } from "@/components/game/ScreenshotsGallery";
import { SimilarGamesRow } from "@/components/game/SimilarGamesRow";
import { VideoEmbed } from "@/components/game/VideoEmbed";
import { GameEngagementBar } from "@/components/game/GameEngagementBar";
import { games, getGameById, getGameBySlug } from "@/data/mock/games";
import { getGameDetail } from "@/data/mock/game-details";

interface GuiaPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return games.map((game) => ({ slug: game.slug }));
}

export async function generateMetadata({ params }: GuiaPageProps): Promise<Metadata> {
  const { slug } = await params;
  const game = getGameBySlug(slug);

  if (!game) {
    return { title: "Guia não encontrada | NewGame+" };
  }

  return {
    title: `${game.title} — Guia Completo e Vale a Pena a Platina? | NewGame+`,
    description: game.synopsis,
  };
}

export default async function GuiaPage({ params }: GuiaPageProps) {
  const { slug } = await params;
  const game = getGameBySlug(slug);

  if (!game) {
    notFound();
  }

  const detail = getGameDetail(game.id);

  if (!detail) {
    notFound();
  }

  const similarGames = game.similarGameIds
    .map((id) => getGameById(id))
    .filter((g): g is NonNullable<typeof g> => Boolean(g));

  return (
    <>
      <Header />
      <GameBreadcrumb
        items={[
          { label: "Jogos", href: "/jogos" },
          { label: game.title },
        ]}
      />
      <main>
        <GameHero game={game} roadmapHref={detail.roadmapHref} />

        <GameOverallRating score={detail.overallScore} breakdown={detail.ratingBreakdown} />

        <section className="border-t border-border py-10">
          <div className="mx-auto flex max-w-[1440px] flex-col gap-6 px-4 lg:flex-row lg:px-8">
            <div className="lg:hidden">
              <GameQuickInfoCard game={game} detail={detail} />
            </div>
            <div className="flex-1">
              <p className="text-balance text-ink-muted">{game.synopsis}</p>
            </div>
            <div className="hidden shrink-0 lg:block">
              <GameQuickInfoCard game={game} detail={detail} />
            </div>
          </div>
        </section>

        <div className="border-t border-border">
          <ReviewSection review={detail.review} />
        </div>

        <DifficultyExplanation game={game} explanation={detail.difficultyExplanation} />

        <div id="roadmap" className="scroll-mt-20">
          <RoadmapSummaryCard steps={detail.roadmapSummary} roadmapHref={detail.roadmapHref} hideLink />
        </div>

        <MissablesList missables={detail.missables} />
        <HardestTrophiesGrid trophies={detail.hardestTrophies} />
        <PlatinumTimeline stages={detail.timeline} />
        <PrepTipsChecklist tips={detail.prepTips} />
        <ScreenshotsGallery urls={detail.screenshotUrls} gameTitle={game.title} />
        <VideoEmbed videoId={detail.videoId} title={game.title} />
        <SimilarGamesRow games={similarGames} />
        <GameEngagementBar gameTitle={game.title} />
      </main>
      <Footer />
    </>
  );
}
