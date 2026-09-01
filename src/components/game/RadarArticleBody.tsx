import Image from "next/image";
import { RichText } from "@/components/ui/RichText";
import { getYoutubeEmbedUrl } from "@/lib/utils";
import { ArticleAuthorBadge, type ArticleAuthor } from "@/components/game/ArticleAuthorBadge";
import { RADAR_TAGS } from "@/types";
import type { RadarArticle } from "@/types";
import type { ReactNode } from "react";

interface RadarArticleBodyProps {
  article: RadarArticle;
  /** Mostra o cabeçalho "Radar+" + título — desliga dentro do hub do jogo, onde o título já aparece no topo da página. */
  showHeading?: boolean;
  extraSlot?: ReactNode;
  /** Membro da equipa que escreveu/editou este artigo, se atribuído. */
  author?: ArticleAuthor | null;
}

function tagLabel(value: string): string {
  return RADAR_TAGS.find((t) => t.value === value)?.label ?? value;
}

export function RadarArticleBody({ article, showHeading = true, extraSlot, author }: RadarArticleBodyProps) {
  const heroImage = article.heroImageUrl ?? article.coverUrl;
  const embedUrl = getYoutubeEmbedUrl(article.youtubeUrl);

  return (
    <>
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
        {showHeading && (
          <>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">Radar+</p>
            <h1 className="mt-1 font-display text-3xl font-bold uppercase tracking-wide text-ink">
              {article.title}
            </h1>
          </>
        )}

        {(article.platform || article.tags.length > 0) && (
          <p className={showHeading ? "mt-1 text-sm text-ink-muted" : "text-sm text-ink-muted"}>
            {article.platform}
            {article.platform && article.tags.length > 0 ? " · " : ""}
            {article.tags.map(tagLabel).join(", ")}
          </p>
        )}

        {author && <ArticleAuthorBadge author={author} className="mt-4" />}

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

        {extraSlot}

        {article.body && (
          <div className="mt-6 text-[15px] leading-relaxed text-ink">
            <RichText html={article.body} />
          </div>
        )}
      </div>
    </>
  );
}
