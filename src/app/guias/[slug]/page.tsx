import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { GameBreadcrumb } from "@/components/game/GameBreadcrumb";
import { GuideHero } from "@/components/game/GuideHero";
import { DifficultyExplanation } from "@/components/game/DifficultyExplanation";
import { PlatinumTimeline } from "@/components/game/PlatinumTimeline";
import { MissablesList } from "@/components/game/MissablesList";
import { HardestTrophiesGrid } from "@/components/game/HardestTrophiesGrid";
import { RoadmapSummaryCard } from "@/components/game/RoadmapSummaryCard";
import { PrepTipsChecklist } from "@/components/game/PrepTipsChecklist";
import { games, getGameBySlug } from "@/data/mock/games";
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
    title: `Guia Completo — ${game.title} | NewGame+`,
    description: `Guia passo a passo para platinares ${game.title}: dificuldade, missables, troféus difíceis e roadmap.`,
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

  return (
    <>
      <Header />
      <GameBreadcrumb
        items={[
          { label: "Guias", href: "/guias" },
          { label: game.title },
        ]}
      />
      <main>
        <GuideHero game={game} />

        <div id="dificuldade" className="scroll-mt-20">
          <DifficultyExplanation game={game} explanation={detail.difficultyExplanation} />
        </div>

        <div id="timeline" className="scroll-mt-20">
          <PlatinumTimeline stages={detail.timeline} />
        </div>

        <div id="missables" className="scroll-mt-20">
          <MissablesList missables={detail.missables} />
        </div>

        <div id="trofeus" className="scroll-mt-20">
          <HardestTrophiesGrid trophies={detail.hardestTrophies} />
        </div>

        <div id="roadmap" className="scroll-mt-20">
          <RoadmapSummaryCard
            steps={detail.roadmapSummary}
            roadmapHref={detail.roadmapHref}
            hideLink
          />
        </div>

        <div id="dicas" className="scroll-mt-20">
          <PrepTipsChecklist tips={detail.prepTips} />
        </div>
      </main>
      <Footer />
    </>
  );
}
