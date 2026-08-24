import { History, Compass, ListOrdered } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { QuickFilters } from "@/components/home/QuickFilters";
import { NowPlayingCarousel } from "@/components/home/NowPlayingCarousel";
import { RecentContentGrid, RecentContentItem } from "@/components/home/RecentContentGrid";
import { RecommendationWizard } from "@/components/home/RecommendationWizard";
import { VotingTeaser } from "@/components/home/VotingTeaser";
import { BeforePlatinumCarousel } from "@/components/home/BeforePlatinumCarousel";
import { HourWithFeature } from "@/components/home/HourWithFeature";
import { ArticleTeaserPanel, ArticleTeaserItem } from "@/components/home/ArticleTeaserPanel";
import { RankingsGrid } from "@/components/home/RankingsGrid";
import { CommunityPanel } from "@/components/home/CommunityPanel";
import { StatsBar } from "@/components/home/StatsBar";
import { getGames, getFeaturedGames } from "@/lib/data/games";
import { getLatestBeforePlatinum, getUpcomingVideos } from "@/lib/data/videos";
import { getRankingCategories } from "@/lib/data/rankings";
import { getNowPlaying, resolveNowPlaying } from "@/lib/data/now-playing";
import { getTeamMembers } from "@/lib/data/team";
import { getPlatformStats } from "@/lib/data/stats";
import { getVotingCandidates } from "@/lib/data/voting";
import { getCommunityHighlights } from "@/lib/data/community";
import { getHourWithArticles } from "@/lib/data/hour-with";
import { getRetroArticles } from "@/lib/data/retro";
import { getDiscoveryArticles } from "@/lib/data/discovery";
import { getTopArticles } from "@/lib/data/top";
import { buildHeroSlides } from "@/lib/data/hero";
import { stripHtml } from "@/lib/utils";

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

  const latestBeforePlatinum = await getLatestBeforePlatinum();
  await getUpcomingVideos(); // mantido a carregar para não afetar outras páginas (ex: /antes-da-platina/episodios); não é usado nesta página
  const rankingCategories = await getRankingCategories();
  const teamMembers = await getTeamMembers();
  const nowPlayingRows = await getNowPlaying();
  const playingNow = resolveNowPlaying(nowPlayingRows, teamMembers);
  const votingCandidates = await getVotingCandidates();
  const { posts: communityPosts } = await getCommunityHighlights();

  const hourWithArticles = await getHourWithArticles();
  const retroArticles = await getRetroArticles();
  const discoveryArticles = await getDiscoveryArticles();
  const topArticles = await getTopArticles();

  const heroSlides = buildHeroSlides({
    featuredGames,
    hourWithArticles,
    retroArticles,
    discoveryArticles,
    topArticles,
  });

  if (featuredGames.length === 0) {
    return null;
  }

  // --- "Antes da Platina": prioriza os jogos com episódio publicado mais
  // recente (dados reais da tabela videos). Se ainda não há nenhum vídeo
  // publicado, mostra jogos do catálogo na mesma — a informação de
  // dificuldade/duração/perdíveis/grind já existe em qualquer jogo, não
  // devia depender de haver vídeo.
  const beforePlatinumFromVideos = latestBeforePlatinum
    .map((ep) => games.find((g) => g.id === ep.gameId))
    .filter(
      (g, i, arr): g is NonNullable<typeof g> => Boolean(g) && arr.findIndex((x) => x?.id === g?.id) === i
    );
  const beforePlatinumGames = (
    beforePlatinumFromVideos.length > 0 ? beforePlatinumFromVideos : games
  ).slice(0, 10);

  // --- "Conteúdo Novo": junta os 4 formatos editoriais, ordenados por
  // data, para a homepage deixar de parecer só um site de troféus.
  const recentItems: RecentContentItem[] = [
    ...latestBeforePlatinum.flatMap((ep) => {
      const game = games.find((g) => g.id === ep.gameId);
      if (!game) return [];
      return [
        {
          key: `bp-${ep.id}`,
          category: "Antes da Platina" as const,
          categoryTone: "red" as const,
          title: `${game.title} — Antes da Platina`,
          subtitle: ep.verdict || null,
          imageUrl: game.heroImageUrl ?? game.coverUrl,
          date: ep.publishDate,
          href: `/guias/${game.slug}`,
        },
      ];
    }),
    ...hourWithArticles.map((a) => ({
      key: `hw-${a.id}`,
      category: "Uma Hora Com" as const,
      categoryTone: "blue" as const,
      title: `${a.title} — Vale a pena?`,
      subtitle: stripHtml(a.firstImpression) || null,
      imageUrl: a.heroImageUrl ?? a.coverUrl,
      date: a.createdAt,
      href: `/uma-hora-com/${a.slug}`,
    })),
    ...retroArticles.map((a) => ({
      key: `retro-${a.id}`,
      category: "Retro+" as const,
      categoryTone: "gold" as const,
      title: a.title,
      subtitle: stripHtml(a.veredicto) || null,
      imageUrl: a.heroImageUrl ?? a.coverUrl,
      date: a.createdAt,
      href: `/retro/${a.slug}`,
    })),
    ...discoveryArticles.map((a) => ({
      key: `disc-${a.id}`,
      category: "Descobertas+" as const,
      categoryTone: "green" as const,
      title: a.title,
      subtitle: stripHtml(a.veredicto) || null,
      imageUrl: a.heroImageUrl ?? a.coverUrl,
      date: a.createdAt,
      href: `/descobertas/${a.slug}`,
    })),
    ...topArticles.map((a) => ({
      key: `top-${a.id}`,
      category: "Top+" as const,
      categoryTone: "neutral" as const,
      title: a.title,
      subtitle: a.items.length > 0 ? a.items.map((i) => i.label).join(", ") : null,
      imageUrl: a.heroImageUrl ?? a.coverUrl,
      date: a.createdAt,
      href: `/top/${a.slug}`,
    })),
  ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);

  const retroItems: ArticleTeaserItem[] = retroArticles.slice(0, 3).map((a) => ({
    slug: a.slug,
    title: a.title,
    imageUrl: a.heroImageUrl ?? a.coverUrl,
    meta:
      a.platform && a.releaseYear
        ? `${a.platform} · ${a.releaseYear}`
        : a.platform ?? (a.releaseYear ? `${a.releaseYear}` : null),
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

  const topItems: ArticleTeaserItem[] = topArticles.slice(0, 3).map((a) => ({
    slug: a.slug,
    title: a.title,
    imageUrl: a.heroImageUrl ?? a.coverUrl,
    meta: `${a.items.length} ${a.items.length === 1 ? "entrada" : "entradas"}`,
  }));

  return (
    <>
      <Header />
      <main>
        {/* 1. HERO — carrossel de destaques, já com pesquisa embutida. */}
        <HeroSection slides={heroSlides} />
        <QuickFilters />

        {/* 2. ESTAMOS A JOGAR — carrossel forte (1 das 3 zonas de carrossel da homepage). */}
        <NowPlayingCarousel items={playingNow} games={games} />

        {/* 3. CONTEÚDO NOVO — grelha, propositadamente sem carrossel. */}
        <RecentContentGrid items={recentItems} />

        {/* 4. FERRAMENTAS — Escolhe a tua Próxima Platina + Vota na Próxima Platina lado a lado. */}
        <section className="border-t border-border py-10">
          <div
            className={
              votingCandidates.length > 0
                ? "mx-auto grid max-w-[1440px] gap-4 px-4 lg:grid-cols-2 lg:px-8"
                : "mx-auto max-w-[1440px] px-4 lg:px-8"
            }
          >
            <RecommendationWizard games={games} />
            {votingCandidates.length > 0 && <VotingTeaser candidates={votingCandidates} />}
          </div>
        </section>

        {/* 5. ANTES DA PLATINA — carrossel (2ª e última das 3 zonas de carrossel). */}
        <BeforePlatinumCarousel games={beforePlatinumGames} />

        {/* 6. ZONA EDITORIAL — Uma Hora Com em destaque + Descobre (Retro+/Descobertas+). */}
        <section className="border-t border-border py-10">
          <div className="mx-auto grid max-w-[1440px] gap-4 px-4 lg:grid-cols-2 lg:px-8">
            <HourWithFeature article={hourWithArticles[0] ?? null} />

            <div className="flex flex-col gap-4">
              <div>
                <h2 className="font-display text-lg font-bold uppercase tracking-wide text-ink">
                  Descobre
                </h2>
                <p className="mt-1 text-sm text-ink-muted">
                  Retro+, Descobertas+ e Top+ — o que fica fora do circuito habitual.
                </p>
              </div>
              <div className="grid flex-1 gap-4 sm:grid-cols-3">
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
                <ArticleTeaserPanel
                  title="Top+"
                  icon={ListOrdered}
                  basePath="/top"
                  items={topItems}
                  emptyLabel="Ainda não há listas publicadas."
                />
              </div>
            </div>
          </div>
        </section>

        {/* RANKINGS — mantém-se como grelha própria, a largura total, para não ficar espremida numa coluna. */}
        <div className="border-t border-border">
          <RankingsGrid categories={rankingCategories} />
        </div>

        {/* 7. ESTATÍSTICAS */}
        <StatsBar stats={platformStats} />

        {/* 8. COMUNIDADE — tópicos recentes e newsletter. */}
        <div className="border-t border-border">
          <CommunityPanel posts={communityPosts} />
        </div>
      </main>
      <Footer />
    </>
  );
}
