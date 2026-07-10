import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { GameBreadcrumb } from "@/components/game/GameBreadcrumb";
import { GameHero } from "@/components/game/GameHero";
import { GameQuickInfoCard } from "@/components/game/GameQuickInfoCard";
import { ReviewSection } from "@/components/game/ReviewSection";
import { PlatinumTimeline } from "@/components/game/PlatinumTimeline";
import { DifficultyExplanation } from "@/components/game/DifficultyExplanation";
import { MissablesList } from "@/components/game/MissablesList";
import { HardestTrophiesGrid } from "@/components/game/HardestTrophiesGrid";
import { PrepTipsChecklist } from "@/components/game/PrepTipsChecklist";
import { SimilarGamesRow } from "@/components/game/SimilarGamesRow";
import { VideoEmbed } from "@/components/game/VideoEmbed";
import { GameFinalCTASection } from "@/components/game/GameFinalCTASection";
import { games, getGameById, getGameBySlug } from "@/data/mock/games";
import { getGameDetail } from "@/data/mock/game-details";

interface GamePageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return games.map((game) => ({ slug: game.slug }));
}

export async function generateMetadata({ params }: GamePageProps): Promise<Metadata> {
  const { slug } = await params;
  const game = getGameBySlug(slug);

  if (!game) {
    return { title: "Jogo não encontrado | NewGame+" };
  }

  return {
    title: `${game.title} — Vale a pena a Platina? | NewGame+`,
    description: game.synopsis,
  };
}

export default async function GamePage({ params }: GamePageProps) {
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
        <GameHero game={game} guideHref={detail.guideHref} roadmapHref={detail.roadmapHref} />

        <section className="py-10">
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

        <PlatinumTimeline stages={detail.timeline} />
        <DifficultyExplanation game={game} explanation={detail.difficultyExplanation} />
        <MissablesList missables={detail.missables} />
        <HardestTrophiesGrid trophies={detail.hardestTrophies} />
        <PrepTipsChecklist tips={detail.prepTips} />
        <SimilarGamesRow games={similarGames} />
        <VideoEmbed videoId={detail.videoId} title={game.title} />
        <GameFinalCTASection
          guideHref={detail.guideHref}
          roadmapHref={detail.roadmapHref}
          gameTitle={game.title}
        />
      </main>
      <Footer />
    </>
  );
}
