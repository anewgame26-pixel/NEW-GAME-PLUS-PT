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

export const dynamic = "force-dynamic";
import { SimilarGamesRow } from "@/components/game/SimilarGamesRow";
import { VideoEmbed } from "@/components/game/VideoEmbed";
import { GameEngagementBar } from "@/components/game/GameEngagementBar";
import { getAllGameSlugs, getGameBySlug, getGamesByIds } from "@/lib/data/games";
import { getGameDetail } from "@/lib/data/game-details";

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

  return {
    title: `${game.title} — Guia Completo e Vale a Pena a Platina? | NewGame+`,
    description: game.synopsis,
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
              <TrophyList trophies={detail.trophyList} />
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

        <RoadmapChapters chapters={detail.roadmapChapters} />

        <HardestTrophiesGrid trophies={detail.hardestTrophies} />
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
