import Image from "next/image";
import Link from "next/link";
import { RecentSecondaryCarousel } from "@/components/home/RecentSecondaryCarousel";
import { CATEGORY_BADGE_STYLES, Byline, type RecentContentItem } from "@/components/home/RecentContentShared";

export type { RecentContentItem };

interface RecentContentGridProps {
  items: RecentContentItem[];
}

/**
 * "Conteúdo Novo": os artigos mais recentes de sempre, sejam eles do
 * formato que forem — mais como a manchete de um jornal do que uma
 * grelha de categorias. Os outros formatos já têm o seu próprio destaque
 * (fila do Vale a Pena, painéis do Descobre, carrossel Antes da Platina),
 * por isso esta secção não precisa de tentar mostrar tudo. O primeiro
 * item fica em destaque grande; os restantes rodam num carrossel
 * pequeno ao lado, 2 de cada vez.
 */
export function RecentContentGrid({ items }: RecentContentGridProps) {
  if (items.length === 0) return null;

  const [lead, ...secondary] = items;

  return (
    <section className="border-t border-border py-10">
      <div className="mx-auto max-w-[1440px] px-4 lg:px-8">
        <div className="mb-5">
          <h2 className="font-display text-xl font-bold uppercase tracking-wide text-ink sm:text-2xl">
            Conteúdo Novo
          </h2>
          <p className="mt-1 text-sm text-ink-muted">O mais recente do universo New Game Plus.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          {/* Artigo principal — maior, à esquerda. */}
          <Link href={lead.href} className="group block lg:col-span-7">
            <div className="relative aspect-[16/9] overflow-hidden rounded-sm border border-border bg-bg-surface">
              {lead.imageUrl && (
                <Image
                  src={lead.imageUrl}
                  alt={lead.title}
                  fill
                  sizes="(min-width: 1024px) 60vw, 100vw"
                  priority
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              )}
              <div className="absolute left-3 top-3">
                <span
                  className={`inline-flex items-center rounded-sm px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide shadow-sm ${CATEGORY_BADGE_STYLES[lead.categoryTone]}`}
                >
                  {lead.category}
                </span>
              </div>
            </div>
            <p className="mt-3 font-display text-2xl font-bold text-ink group-hover:text-primary-light sm:text-3xl">
              {lead.title}
            </p>
            {lead.subtitle && (
              <p className="mt-1.5 line-clamp-2 max-w-2xl text-sm text-ink-muted">{lead.subtitle}</p>
            )}
            <Byline item={lead} />
          </Link>

          {/* Artigos secundários — carrossel pequeno, 2 de cada vez. */}
          <div className="lg:col-span-5">
            <RecentSecondaryCarousel items={secondary} />
          </div>
        </div>
      </div>
    </section>
  );
}
