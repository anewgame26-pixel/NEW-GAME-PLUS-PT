import Image from "next/image";
import { ThumbsUp, ThumbsDown, Check, X } from "lucide-react";
import { RichText } from "@/components/ui/RichText";
import { getYoutubeEmbedUrl } from "@/lib/utils";
import { DISCOVERY_TAGS } from "@/types";
import type { DiscoveryArticle } from "@/types";
import type { ReactNode } from "react";

interface DiscoveryArticleBodyProps {
  article: DiscoveryArticle;
  showHeading?: boolean;
  extraSlot?: ReactNode;
}

export function DiscoveryArticleBody({
  article,
  showHeading = true,
  extraSlot,
}: DiscoveryArticleBodyProps) {
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
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">
              Descobertas+
            </p>
            <h1 className="mt-1 font-display text-3xl font-bold uppercase tracking-wide text-ink">
              {article.title}
            </h1>
          </>
        )}
        <p className={showHeading ? "mt-1 text-sm text-ink-muted" : "text-sm text-ink-muted"}>
          {article.platform}
          {article.releaseYear ? ` · ${article.releaseYear}` : ""}
        </p>

        {article.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {article.tags.map((tag) => {
              const meta = DISCOVERY_TAGS.find((t) => t.value === tag);
              return (
                <span
                  key={tag}
                  className="rounded-full border border-border bg-bg-surface px-2.5 py-0.5 text-[11px] text-ink-muted"
                >
                  {meta?.label ?? tag}
                </span>
              );
            })}
          </div>
        )}

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

        {article.recomendamos !== null && (
          <div
            className={`mt-6 flex items-center gap-3 rounded-sm border p-4 ${
              article.recomendamos ? "border-accent/40 bg-accent/10" : "border-primary/40 bg-primary/10"
            }`}
          >
            {article.recomendamos ? (
              <ThumbsUp width={22} height={22} className="shrink-0 text-accent" />
            ) : (
              <ThumbsDown width={22} height={22} className="shrink-0 text-primary" />
            )}
            <div>
              <p className="text-xs uppercase tracking-wide text-ink-dim">Recomendamos?</p>
              <p
                className={`font-display text-base font-bold uppercase ${
                  article.recomendamos ? "text-accent" : "text-primary-light"
                }`}
              >
                {article.recomendamos ? "Sim, vale a pena." : "Não, passa ao lado."}
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
    </>
  );
}
