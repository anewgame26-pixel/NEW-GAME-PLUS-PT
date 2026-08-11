import Image from "next/image";
import Link from "next/link";
import { Play, Clock } from "lucide-react";
import { HourWithArticle } from "@/types";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface HourWithFeatureProps {
  article: HourWithArticle | null;
}

/**
 * Destaque grande para o episódio "Uma Hora Com" mais recente — parte da
 * zona editorial da homepage (ao lado de "Descobre"), com uma thumbnail
 * grande em vez de mais uma linha de lista.
 */
export function HourWithFeature({ article }: HourWithFeatureProps) {
  if (!article) return null;

  return (
    <Card className="flex h-full flex-col overflow-hidden p-0">
      <div className="flex items-center gap-2 border-b border-border px-5 py-4">
        <Clock width={16} height={16} className="text-primary" />
        <h2 className="font-display text-lg font-bold uppercase tracking-wide text-ink">
          Uma Hora Com...
        </h2>
      </div>

      <Link href={`/uma-hora-com/${article.slug}`} className="group relative block aspect-video">
        <Image
          src={article.heroImageUrl ?? article.coverUrl ?? ""}
          alt={article.title}
          fill
          sizes="(min-width: 1024px) 40vw, 100vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/90">
            <Play width={20} height={20} className="fill-white text-white" />
          </span>
        </div>

        <div className="absolute inset-x-0 bottom-0 p-4">
          {article.continuarAJogar !== null && (
            <Badge tone={article.continuarAJogar ? "green" : "red"} className="mb-2">
              {article.continuarAJogar ? "Continuamos a jogar" : "Não continuamos"}
            </Badge>
          )}
          <p className="font-display text-xl font-bold text-white">{article.title}</p>
          {article.platform && <p className="mt-0.5 text-xs text-white/70">{article.platform}</p>}
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <p className="line-clamp-3 flex-1 text-sm text-ink-muted">{article.firstImpression}</p>
        <Button href={`/uma-hora-com/${article.slug}`} variant="secondary" className="w-full">
          Ver Análise
        </Button>
      </div>
    </Card>
  );
}
