import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { QuickFilters } from "@/components/home/QuickFilters";
import { ContinuePlayingList } from "@/components/home/ContinuePlayingList";
import { LatestBeforePlatinum } from "@/components/home/LatestBeforePlatinum";
import { UpcomingVideosCarousel } from "@/components/home/UpcomingVideosCarousel";
import { RecommendationWizard } from "@/components/home/RecommendationWizard";
import { RankingsGrid } from "@/components/home/RankingsGrid";
import { StatsBar } from "@/components/home/StatsBar";
import { games, getGameById } from "@/data/mock/games";
import {
  latestBeforePlatinum,
  platformStats,
  playingNow,
  rankingCategories,
  upcomingVideos,
} from "@/data/mock/homepage";

export default function HomePage() {
  const featuredGame = getGameById("g10")!;
  const suggestions = games.slice(0, 5);

  return (
    <>
      <Header />
      <main>
        <HeroSection featuredGame={featuredGame} suggestions={suggestions} />
        <QuickFilters />

        <section className="py-10">
          <div className="mx-auto grid max-w-[1440px] gap-4 px-4 lg:grid-cols-2 lg:px-8">
            <ContinuePlayingList items={playingNow} />
            <LatestBeforePlatinum episodes={latestBeforePlatinum} />
          </div>
        </section>

        <div className="border-t border-border">
          <UpcomingVideosCarousel videos={upcomingVideos} />
        </div>

        <section className="border-t border-border py-10">
          <div className="mx-auto max-w-[1440px] px-4 lg:px-8">
            <RecommendationWizard />
          </div>
        </section>

        <div className="border-t border-border">
          <RankingsGrid categories={rankingCategories} />
        </div>

        <StatsBar stats={platformStats} />
      </main>
      <Footer />
    </>
  );
}
