import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ListOrdered } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { GameBreadcrumb } from "@/components/game/GameBreadcrumb";
import { RichText } from "@/components/ui/RichText";
import { getTopArticleBySlug } from "@/lib/data/top";
import { getYoutubeEmbedUrl } from "@/lib/utils";

interface TopArtigoPageProps {
  params: Promise<{ slug: string }>;
}

function stripHtml(html: string) {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export async function generateMetadata({ params }: TopArtigoPageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getTopArticleBySlug(slug);

  if (!article) {
    return { title: "Lista não encontrada | NewGame+" };
  }

  const description = article.intro ? stripHtml(article.intro).slice(0, 155) : article.title;
  const image = article.heroImageUrl ?? article.coverUrl ?? undefined;

  return {
    title: `${article.title} | Top+ | NewGame+`,
    description,
    openGraph: {
      title: article.title,
      description,
      ...(image ? { images: [{ url: image }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description,
      ...(image ? { images: [image] } : {}),
    },
  };
}

export default async function TopArtigoPage({ params }: TopArtigoPageProps) {
  const { slug } = await params;
  const article = await getTopArticleBySlug(slug);

  if (!article) notFound();

  const embedUrl = getYoutubeEmbedUrl(article.youtubeUrl);
  const heroImage = article.heroImageUrl ?? article.coverUrl;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": article.youtubeUrl ? "VideoObject" : "Article",
    name: article.title,
    headline: article.title,
    description: article.intro ? stripHtml(article.intro).slice(0, 200) : article.title,
    ...(heroImage ? { thumbnailUrl: [heroImage], image: [heroImage] } : {}),
    ...(article.youtubeUrl ? { embedUrl } : {}),
    uploadDate: article.createdAt,
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
      <GameBreadcrumb items={[{ label: "Top+", href: "/top" }, { label: article.title }]} />
      <main>
        {heroImage && (
          <div className="relative h-[260px] w-full sm:h-[360px]">
            <Image src={heroImage} alt={article.title} fill priority className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/40 to-transparent" />
          </div>
        )}

        <div className="mx-auto max-w-3xl px-4 py-8 lg:px-8">
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-primary">
            <ListOrdered width={13} height={13} />
            Top+
          </p>
          <h1 className="mt-1 font-display text-3xl font-bold uppercase tracking-wide text-ink">
            {article.title}
          </h1>

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

          {article.intro && (
            <div className="mt-6 text-[15px] leading-relaxed text-ink">
              <RichText html={article.intro} />
            </div>
          )}

          {article.items.length > 0 && (
            <ol className="mt-8 flex flex-col gap-3 border-t border-border pt-6">
              {article.items.map((item, i) => (
                <li
                  key={`${item.label}-${i}`}
                  className="flex gap-4 rounded-sm border border-border bg-bg-surface p-4"
                >
                  <span className="font-display text-2xl font-bold text-primary-light">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0">
                    <p className="font-display text-base font-bold uppercase tracking-wide text-ink">
                      {item.label}
                    </p>
                    {item.note && <p className="mt-1 text-sm text-ink-muted">{item.note}</p>}
                  </div>
                </li>
              ))}
            </ol>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
