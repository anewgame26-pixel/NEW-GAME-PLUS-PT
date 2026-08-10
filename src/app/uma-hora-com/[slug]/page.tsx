import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ThumbsUp, ThumbsDown, Check, X } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { GameBreadcrumb } from "@/components/game/GameBreadcrumb";
import { getHourWithArticleBySlug } from "@/lib/data/hour-with";
import { getGames } from "@/lib/data/games";
import { getYoutubeEmbedUrl, normalizeTitle } from "@/lib/utils";
import { RichText } from "@/components/ui/RichText";
import { CrossLinkBanner } from "@/components/game/CrossLinkBanner";
import type { HourWithArticle } from "@/types";

interface ArtigoPageProps {
  params: Promise<{ slug: string }>;
}

/** Tira as etiquetas HTML do texto rico, para usar em descrições/schema
 * (títulos de pesquisa do Google não devem ter <p>, <strong>, etc.). */
function stripHtml(html: string) {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export async function generateMetadata({ params }: ArtigoPageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getHourWithArticleBySlug(slug);

  if (!article) {
    return { title: "Artigo não encontrado | NewGame+" };
  }

  const title = `Uma Hora Com: ${article.title} — Vale a Pena?`;
  const description = stripHtml(article.firstImpression).slice(0, 155);
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

const SECTIONS: { field: keyof HourWithArticle & string; label: string }[] = [
  { field: "gameplay", label: "Gameplay" },
  { field: "historia", label: "História" },
  { field: "graficos", label: "Gráficos" },
  { field: "somMusica", label: "Som / Música" },
  { field: "performance", label: "Performance" },
];

export default async function UmaHoraComArtigoPage({ params }: ArtigoPageProps) {
  const { slug } = await params;
  const article = await getHourWithArticleBySlug(slug);

  if (!article) notFound();

  const embedUrl = getYoutubeEmbedUrl(article.youtubeUrl);
  const heroImage = article.heroImageUrl ?? article.coverUrl;

  // Se o mesmo jogo já tiver um perfil completo em "Antes da Platina",
  // ligamos as duas páginas uma à outra.
  const games = await getGames();
  const matchingGame = games.find((g) => normalizeTitle(g.title) === normalizeTitle(article.title));

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `Uma Hora Com: ${article.title}`,
    description: stripHtml(article.firstImpression).slice(0, 200),
    ...(heroImage ? { image: [heroImage] } : {}),
    author: { "@type": "Organization", name: "NewGame+ PT" },
    publisher: { "@type": "Organization", name: "NewGame+ PT" },
    ...(article.datePlayed ? { datePublished: article.datePlayed } : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <Header />
      <GameBreadcrumb
        items={[
          { label: "Uma Hora Com...", href: "/uma-hora-com" },
          { label: article.title },
        ]}
      />
      <main>
        {heroImage && (
          <div className="relative h-[260px] w-full sm:h-[360px]">
            <Image src={heroImage} alt={article.title} fill priority className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/40 to-transparent" />
          </div>
        )}

        <div className="mx-auto max-w-3xl px-4 py-8 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">
            Uma Hora Com...
          </p>
          <h1 className="mt-1 font-display text-3xl font-bold uppercase tracking-wide text-ink">
            {article.title}
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            {article.platform}
            {article.datePlayed ? ` · ${new Date(article.datePlayed).toLocaleDateString("pt-PT")}` : ""}
          </p>

          {matchingGame && (
            <div className="mt-4">
              <CrossLinkBanner
                bare
                href={`/guias/${matchingGame.slug}`}
                icon="trophy"
                title="Também já platinámos este jogo"
                description="Lê a análise completa em Antes da Platina"
              />
            </div>
          )}

          {embedUrl && (
            <div className="relative mt-6 aspect-video overflow-hidden rounded-sm border border-border">
              <iframe
                src={embedUrl}
                title={`Vídeo: Uma Hora Com ${article.title}`}
                className="absolute inset-0 h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}

          {article.continuarAJogar !== null && (
            <div
              className={`mt-6 flex items-center gap-3 rounded-sm border p-4 ${
                article.continuarAJogar ? "border-accent/40 bg-accent/10" : "border-primary/40 bg-primary/10"
              }`}
            >
              {article.continuarAJogar ? (
                <ThumbsUp width={22} height={22} className="shrink-0 text-accent" />
              ) : (
                <ThumbsDown width={22} height={22} className="shrink-0 text-primary" />
              )}
              <div>
                <p className="text-xs uppercase tracking-wide text-ink-dim">
                  Depois de uma hora, queremos continuar a jogar?
                </p>
                <p
                  className={`font-display text-base font-bold uppercase ${
                    article.continuarAJogar ? "text-accent" : "text-primary-light"
                  }`}
                >
                  {article.continuarAJogar ? "Sim, continuamos." : "Não, ficámos por aqui."}
                </p>
              </div>
            </div>
          )}

          {article.firstImpression && (
            <div className="mt-6 text-[15px] leading-relaxed text-ink">
              <RichText html={article.firstImpression} />
            </div>
          )}

          {SECTIONS.map(
            (section) =>
              article[section.field] && (
                <div key={section.field} className="mt-6">
                  <h2 className="mb-2 font-display text-base font-bold uppercase tracking-wide text-ink">
                    {section.label}
                  </h2>
                  <RichText
                    html={article[section.field] as string}
                    className="text-sm leading-relaxed text-ink-muted"
                  />
                </div>
              )
          )}

          {(article.pros.length > 0 || article.contras.length > 0) && (
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {article.pros.length > 0 && (
                <div className="rounded-sm border border-accent/30 bg-accent/5 p-4">
                  <p className="mb-2 text-xs font-bold uppercase tracking-wide text-accent">
                    Pontos fortes
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
                    Pontos fracos
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
