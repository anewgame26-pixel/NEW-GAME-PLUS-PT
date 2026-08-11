import { Clock, History, Compass } from "lucide-react";
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
import { ArticleTeaserPanel, ArticleTeaserItem } from "@/components/home/ArticleTeaserPanel";
import { getGames, getFeaturedGames } from "@/lib/data/games";
import { getLatestBeforePlatinum, getUpcomingVideos } from "@/lib/data/videos";
import { getRankingCategories } from "@/lib/data/rankings";
import { getNowPlaying, resolveNowPlaying } from "@/lib/data/now-playing";
import { getTeamMembers } from "@/lib/data/team";
import { getPlatformStats } from "@/lib/data/stats";
import { getVotingCandidates } from "@/lib/data/voting";
import { getHourWithArticles } from "@/lib/data/hour-with";
import { getRetroArticles } from "@/lib/data/retro";
import { getDiscoveryArticles } from "@/lib/data/discovery";
import { VotingTeaser } from "@/components/home/VotingTeaser";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const games = await getGames();
  const platformStats = await getPlatformStats();
  let featuredGames = await getFeaturedGames();

  // Salvaguarda: se ainda nenhum jogo tiver sido marcado como destaque no
  // admin, mostra os 3 primeiros do catálogo em vez de a secção ficar vazia.
  if (featuredGames.length === 0) {
    featuredGames = games.slice(0, 3);
  }

  const suggestions = games.slice(0, 5);
  const latestBeforePlatinum = await getLatestBeforePlatinum();
  const upcomingVideos = await getUpcomingVideos();
  const rankingCategories = await getRankingCategories();
  const teamMembers = await getTeamMembers();
  const nowPlayingRows = await getNowPlaying();
  const playingNow = resolveNowPlaying(nowPlayingRows, teamMembers);
  const votingCandidates = await getVotingCandidates();

  const hourWithArticles = await getHourWithArticles();
  const retroArticles = await getRetroArticles();
  const discoveryArticles = await getDiscoveryArticles();

  const hourWithItems: ArticleTeaserItem[] = hourWithArticles.slice(0, 3).map((a) => ({
    slug: a.slug,
    title: a.title,
    imageUrl: a.heroImageUrl ?? a.coverUrl,
    meta: a.platform,
    badgeLabel: a.continuarAJogar === null ? undefined : a.continuarAJogar ? "Continuamos" : "Não continuamos",
    badgeTone: a.continuarAJogar ? "green" : "red",
  }));

  const retroItems: ArticleTeaserItem[] = retroArticles.slice(0, 3).map((a) => ({
    slug: a.slug,
    title: a.title,
    imageUrl: a.heroImageUrl ?? a.coverUrl,
    meta: a.platform && a.releaseYear ? `${a.platform} · ${a.releaseYear}` : a.platform ?? (a.releaseYear ? `${a.releaseYear}` : null),
    badgeLabel: a.valeAPenaHoje === null ? undefined : a.valeAPenaHoje ? "Ainda vale a pena" : "Já envelheceu",
    badgeTone: a.valeAPenaHoje ? "green" : "red",
  }));

  const discoveryItems: ArticleTeaserItem[] = discoveryArticles.slice(0, 3).map((a) => ({
    slug: a.slug,
    title: a.title,
    imageUrl: a.heroImageUrl ?? a.coverUrl,
    meta: a.platform,
    badgeLabel: a.recomendamos === null ? undefined : a.recomendamos ? "Recomendamos" : "Não recomendamos",
    badgeTone: a.recomendamos ? "green" : "red",
  }));

  if (featuredGames.length === 0) {
    return null;
  }

  return (
    <>
      <Header />
      <main>
        <HeroSection featuredGames={featuredGames} suggestions={suggestions} />
        <QuickFilters />

        <section className="py-10">
          <div
            className={
              votingCandidates.length > 0
                ? "mx-auto grid max-w-[1440px] gap-4 px-4 lg:grid-cols-3 lg:px-8"
                : "mx-auto grid max-w-[1440px] gap-4 px-4 lg:grid-cols-2 lg:px-8"
            }
          >
            <ContinuePlayingList items={playingNow} games={games} />
            <LatestBeforePlatinum episodes={latestBeforePlatinum} games={games} />
            {votingCandidates.length > 0 && <VotingTeaser candidates={votingCandidates} />}
          </div>
        </section>

        <div className="border-t border-border">
          <UpcomingVideosCarousel videos={upcomingVideos} games={games} />
        </div>

        <section className="border-t border-border py-10">
          <div className="mx-auto grid max-w-[1440px] gap-4 px-4 lg:grid-cols-3 lg:px-8">
            <ArticleTeaserPanel
              title="Uma Hora Com..."
              icon={Clock}
              basePath="/uma-hora-com"
              items={hourWithItems}
              emptyLabel="Ainda não há artigos publicados."
            />
            <ArticleTeaserPanel
              title="Retro+"
              icon={History}
              basePath="/retro"
              items={retroItems}
              emptyLabel="Ainda não há artigos publicados."
            />
            <ArticleTeaserPanel
              title="Descobertas+"
              icon={Compass}
              basePath="/descobertas"
              items={discoveryItems}
              emptyLabel="Ainda não há artigos publicados."
            />
          </div>
        </section>

        <section className="border-t border-border py-10">
          <div className="mx-auto max-w-[1440px] px-4 lg:px-8">
            <RecommendationWizard games={games} />
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
