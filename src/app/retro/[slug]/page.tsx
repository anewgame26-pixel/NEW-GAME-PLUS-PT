import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ThumbsUp, ThumbsDown, Check, X } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { GameBreadcrumb } from "@/components/game/GameBreadcrumb";
import { CrossLinkBanner } from "@/components/game/CrossLinkBanner";
import { RichText } from "@/components/ui/RichText";
import { getRetroArticleBySlug } from "@/lib/data/retro";
import { getHourWithArticles } from "@/lib/data/hour-with";
import { getGames } from "@/lib/data/games";
import { getDiscoveryArticles } from "@/lib/data/discovery";
import { normalizeTitle, getYoutubeEmbedUrl } from "@/lib/utils";

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
  const embedUrl = getYoutubeEmbedUrl(article.youtubeUrl);

  // Liga automaticamente a artigos "Uma Hora Com" e a jogos de "Antes da
  // Platina" sobre o mesmo título, tal como já acontece nesses dois.
  const [hourWithArticles, games] = await Promise.all([getHourWithArticles(), getGames()]);
  const matchingHourWith = hourWithArticles.find(
    (a) => normalizeTitle(a.title) === normalizeTitle(article.title)
  );
  const matchingGame = games.find((g) => normalizeTitle(g.title) === normalizeTitle(article.title));
  const discoveryArticles = await getDiscoveryArticles();
  const matchingDiscovery = discoveryArticles.find(
    (a) => normalizeTitle(a.title) === normalizeTitle(article.title)
  );

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: stripHtml(article.body).slice(0, 200),
    ...(heroImage ? { image: [heroImage] } : {}),
    author: { "@type": "Organization", name: "NewGame+ PT" },
    publisher: { "@type": "Organization", name: "NewGame+ PT" },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <Header />
      <GameBreadcrumb items={[{ label: "Retro+", href: "/retro" }, { label: article.title }]} />
      <main>
        {heroImage && (
          <div className="relative h-[260px] w-full overflow-hidden sm:h-[360px]">
            <Image
              src={heroImage}
              alt={article.title}
              fill
              priority
              className="object-cover"
              style={{
                objectPosition: `${article.heroFocusX}% ${article.heroFocusY}%`,
                transform: `scale(${article.heroZoom / 100})`,
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/40 to-transparent" />
          </div>
        )}

        <div className="mx-auto max-w-3xl px-4 py-8 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">Retro+</p>
          <h1 className="mt-1 font-display text-3xl font-bold uppercase tracking-wide text-ink">
            {article.title}
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            {article.platform}
            {article.releaseYear ? ` · ${article.releaseYear}` : ""}
          </p>

          {embedUrl && (
            <div className="relative mt-6 aspect-video overflow-hidden rounded-sm border border-border">
              <iframe
                src={embedUrl}
                title={`Vídeo: ${article.title}`}
                className="absolute inset-0 h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}

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

          {article.valeAPenaHoje !== null && (
            <div
              className={`mt-6 flex items-center gap-3 rounded-sm border p-4 ${
                article.valeAPenaHoje ? "border-accent/40 bg-accent/10" : "border-primary/40 bg-primary/10"
              }`}
            >
              {article.valeAPenaHoje ? (
                <ThumbsUp width={22} height={22} className="shrink-0 text-accent" />
              ) : (
                <ThumbsDown width={22} height={22} className="shrink-0 text-primary" />
              )}
              <div>
                <p className="text-xs uppercase tracking-wide text-ink-dim">
                  Ainda vale a pena jogar isto hoje?
                </p>
                <p
                  className={`font-display text-base font-bold uppercase ${
                    article.valeAPenaHoje ? "text-accent" : "text-primary-light"
                  }`}
                >
                  {article.valeAPenaHoje ? "Sim, continua a valer." : "Não, já envelheceu."}
                </p>
              </div>
            </div>
          )}

          {article.body && (
            <div className="mt-6 text-[15px] leading-relaxed text-ink">
              <RichText html={article.body} />
            </div>
          )}

          {(article.pros.length > 0 || article.contras.length > 0) && (
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {article.pros.length > 0 && (
                <div className="rounded-sm border border-accent/30 bg-accent/5 p-4">
                  <p className="mb-2 text-xs font-bold uppercase tracking-wide text-accent">
                    Porque ainda vale a pena
                  </p>
                  <ul className="flex flex-col gap-1.5">
                    {article.pros.map((p, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-ink-muted">
                        <Check width={14} height={14} className="mt-0.5 shrink-0 text-accent" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {article.contras.length > 0 && (
                <div className="rounded-sm border border-primary/30 bg-primary/5 p-4">
                  <p className="mb-2 text-xs font-bold uppercase tracking-wide text-primary-light">
                    Onde já envelheceu
                  </p>
                  <ul className="flex flex-col gap-1.5">
                    {article.contras.map((c, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-ink-muted">
                        <X width={14} height={14} className="mt-0.5 shrink-0 text-primary" />
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {article.veredicto && (
            <div className="mt-8 border-t border-border pt-6">
              <h2 className="mb-2 font-display text-base font-bold uppercase tracking-wide text-ink">
                Veredicto
              </h2>
              <RichText html={article.veredicto} className="text-sm leading-relaxed text-ink-muted" />
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
