import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { GameBreadcrumb } from "@/components/game/GameBreadcrumb";
import { RankingList } from "@/components/game/RankingList";
import { games } from "@/data/mock/games";
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
        <div className="border-b border-border bg-bg-raised py-8">
          <div className="mx-auto max-w-[1440px] px-4 lg:px-8">
            <h1 className="font-display text-3xl font-bold uppercase tracking-wide text-ink">
              {config.label}
            </h1>
            <p className="mt-1 text-sm text-ink-muted">{config.description}</p>
          </div>
        </div>

        <div className="mx-auto max-w-[1440px] px-4 py-10 lg:px-8">
          <RankingList games={sortedGames} valueLabel={config.valueLabel} />
        </div>
      </main>
      <Footer />
    </>
  );
}
