import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { GameBreadcrumb } from "@/components/game/GameBreadcrumb";
import { CrossLinkBanner } from "@/components/game/CrossLinkBanner";
import { getDiscoveryArticleBySlug } from "@/lib/data/discovery";
import { getHourWithArticles } from "@/lib/data/hour-with";
import { getRetroArticles } from "@/lib/data/retro";
import { getGames } from "@/lib/data/games";
import { normalizeTitle } from "@/lib/utils";
import { DiscoveryArticleBody } from "@/components/game/DiscoveryArticleBody";

interface ArtigoPageProps {
  params: Promise<{ slug: string }>;
}

function stripHtml(html: string) {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export async function generateMetadata({ params }: ArtigoPageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getDiscoveryArticleBySlug(slug);

  if (!article) {
    return { title: "Artigo não encontrado | NewGame+" };
  }

  const title = `${article.title} | Descobertas+`;
  const description = stripHtml(article.body).slice(0, 155);
  const image = article.heroImageUrl ?? article.coverUrl ?? undefined;

  return {
    title: `${title} | NewGame+`,
    description,
    openGraph: {
      title,
      description,
      ...(image ? { images: [{ url: image }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(image ? { images: [image] } : {}),
    },
  };
}

export default async function DescobertaArtigoPage({ params }: ArtigoPageProps) {
  const { slug } = await params;
  const article = await getDiscoveryArticleBySlug(slug);

  if (!article) notFound();

  const heroImage = article.heroImageUrl ?? article.coverUrl;

  const [hourWithArticles, retroArticles, games] = await Promise.all([
    getHourWithArticles(),
    getRetroArticles(),
    getGames(),
  ]);
  const matchingHourWith = hourWithArticles.find(
    (a) => normalizeTitle(a.title) === normalizeTitle(article.title)
  );
  const matchingRetro = retroArticles.find(
    (a) => normalizeTitle(a.title) === normalizeTitle(article.title)
  );
  const matchingGame = article.gameId
    ? games.find((g) => g.id === article.gameId) ?? null
    : games.find((g) => normalizeTitle(g.title) === normalizeTitle(article.title)) ?? null;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: stripHtml(article.body).slice(0, 200),
    ...(heroImage ? { image: [heroImage] } : {}),
    author: { "@type": "Organization", name: "NewGame+ PT" },
    publisher: { "@type": "Organization", name: "NewGame+ PT" },
  };

  const crossLinks = (
    <div className="mt-4 flex flex-col gap-2">
      {matchingGame && (
        <CrossLinkBanner
          bare
          href={`/guias/${matchingGame.slug}`}
          icon="trophy"
          title="Já platinámos este jogo"
          description="Lê a análise completa em Antes da Platina"
        />
      )}
      {matchingHourWith && (
        <CrossLinkBanner
          bare
          href={`/uma-hora-com/${matchingHourWith.slug}`}
          icon="clock"
          title="Também já jogámos isto durante 1 hora"
          description="Lê a primeira impressão em Uma Hora Com..."
        />
      )}
      {matchingRetro && (
        <CrossLinkBanner
          bare
          href={`/retro/${matchingRetro.slug}`}
          icon="history"
          title="Também escrevemos sobre isto em Retro+"
          description="Vê se ainda vale a pena jogar hoje"
        />
      )}
    </div>
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <Header />
      <GameBreadcrumb items={[{ label: "Descobertas+", href: "/descobertas" }, { label: article.title }]} />
      <main>
        <DiscoveryArticleBody article={article} extraSlot={crossLinks} />
      </main>
      <Footer />
    </>
  );
}
