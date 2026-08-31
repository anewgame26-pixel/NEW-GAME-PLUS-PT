import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { GameBreadcrumb } from "@/components/game/GameBreadcrumb";
import { CrossLinkBanner } from "@/components/game/CrossLinkBanner";
import { getRetroArticleBySlug } from "@/lib/data/retro";
import { getHourWithArticles } from "@/lib/data/hour-with";
import { getGames } from "@/lib/data/games";
import { getDiscoveryArticles } from "@/lib/data/discovery";
import { getTeamMembers } from "@/lib/data/team";
import { normalizeTitle } from "@/lib/utils";
import { RetroArticleBody } from "@/components/game/RetroArticleBody";

interface ArtigoPageProps {
  params: Promise<{ slug: string }>;
}

function stripHtml(html: string) {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export async function generateMetadata({ params }: ArtigoPageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getRetroArticleBySlug(slug);

  if (!article) {
    return { title: "Artigo não encontrado | NewGame+" };
  }

  const title = `${article.title} — Ainda Vale a Pena em ${new Date().getFullYear()}?`;
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

export default async function RetroArtigoPage({ params }: ArtigoPageProps) {
  const { slug } = await params;
  const article = await getRetroArticleBySlug(slug);

  if (!article) notFound();

  const heroImage = article.heroImageUrl ?? article.coverUrl;

  const [hourWithArticles, games] = await Promise.all([getHourWithArticles(), getGames()]);
  const matchingHourWith = hourWithArticles.find(
    (a) => normalizeTitle(a.title) === normalizeTitle(article.title)
  );
  const matchingGame = article.gameId
    ? games.find((g) => g.id === article.gameId) ?? null
    : games.find((g) => normalizeTitle(g.title) === normalizeTitle(article.title)) ?? null;
  const discoveryArticles = await getDiscoveryArticles();
  const matchingDiscovery = discoveryArticles.find(
    (a) => normalizeTitle(a.title) === normalizeTitle(article.title)
  );
  const author = article.authorId
    ? (await getTeamMembers()).find((m) => m.id === article.authorId) ?? null
    : null;

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
      {matchingDiscovery && (
        <CrossLinkBanner
          bare
          href={`/descobertas/${matchingDiscovery.slug}`}
          icon="compass"
          title="Este jogo também está em Descobertas+"
          description="Lê porque vale a pena conhecer"
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
      <GameBreadcrumb items={[{ label: "Retro+", href: "/retro" }, { label: article.title }]} />
      <main>
        <RetroArticleBody article={article} extraSlot={crossLinks} author={author} />
      </main>
      <Footer />
    </>
  );
}
