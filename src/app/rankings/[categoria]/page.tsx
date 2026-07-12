import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { GameBreadcrumb } from "@/components/game/GameBreadcrumb";
import { PageHeader } from "@/components/layout/PageHeader";
import { RankingList } from "@/components/game/RankingList";
import { getGames } from "@/lib/data/games";
import { getRankingConfig, rankingConfigs } from "@/data/mock/rankings-config";

interface RankingCategoryPageProps {
  params: Promise<{ categoria: string }>;
}

export function generateStaticParams() {
  return rankingConfigs.map((c) => ({ categoria: c.slug }));
}

export async function generateMetadata({ params }: RankingCategoryPageProps): Promise<Metadata> {
  const { categoria } = await params;
  const config = getRankingConfig(categoria);

  if (!config) {
    return { title: "Ranking não encontrado | NewGame+" };
  }

  return {
    title: `${config.label} | Rankings | NewGame+`,
    description: config.description,
  };
}

export default async function RankingCategoryPage({ params }: RankingCategoryPageProps) {
  const { categoria } = await params;
  const config = getRankingConfig(categoria);

  if (!config) {
    notFound();
  }

  const games = await getGames();
  const sortedGames = config.sort(games);

  return (
    <>
      <Header />
      <GameBreadcrumb
        items={[
          { label: "Rankings", href: "/rankings" },
          { label: config.label },
        ]}
      />
      <main>
        <PageHeader title={config.label} description={config.description} />

        <div className="mx-auto max-w-[1440px] px-4 py-10 lg:px-8">
          <RankingList games={sortedGames} valueLabel={config.valueLabel} />
        </div>
      </main>
      <Footer />
    </>
  );
}
