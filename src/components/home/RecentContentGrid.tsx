import Image from "next/image";
import Link from "next/link";

export interface RecentContentItem {
  key: string;
  category: "Antes da Platina" | "Vale a pena?" | "Retro+" | "Descobertas+" | "Radar+" | "Top+";
  categoryTone: "red" | "blue" | "gold" | "green" | "purple" | "neutral";
  title: string;
  subtitle: string | null;
  imageUrl: string | null;
  date: string;
  href: string;
  /** Nome de quem escreveu/editou, se atribuído (null = não mostra autor). */
  authorName?: string | null;
  authorPhotoUrl?: string | null;
  authorInitials?: string | null;
}

interface RecentContentGridProps {
  items: RecentContentItem[];
}

// Versão sólida/opaca, própria para cima de capas de jogos (o Badge
// normal do site é translúcido, pensado para fundos escuros lisos — em
// cima de uma imagem colorida fica ilegível).
const CATEGORY_BADGE_STYLES: Record<RecentContentItem["categoryTone"], string> = {
  red: "bg-primary text-white",
  blue: "bg-accent text-white",
  gold: "bg-gold text-black",
  green: "bg-emerald-500 text-white",
  purple: "bg-fuchsia-500 text-white",
  neutral: "bg-ink text-bg",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-PT", { day: "numeric", month: "short" });
}

function Byline({ item }: { item: RecentContentItem }) {
  return (
    <div className="mt-2 flex items-center gap-2 text-xs text-ink-dim">
      {item.authorName && (
        <>
          {item.authorPhotoUrl ? (
            <span className="relative h-5 w-5 shrink-0 overflow-hidden rounded-full">
              <Image src={item.authorPhotoUrl} alt={item.authorName} fill className="object-cover" />
            </span>
          ) : (
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[9px] font-bold text-primary">
              {item.authorInitials}
            </span>
          )}
          <span className="font-medium text-ink-muted">{item.authorName}</span>
          <span aria-hidden>·</span>
        </>
      )}
      <time dateTime={item.date}>{formatDate(item.date)}</time>
    </div>
  );
}

/**
 * "Conteúdo Novo": só os 3 artigos mais recentes de sempre, sejam eles do
 * formato que forem — mais como a manchete de um jornal do que uma
 * grelha de categorias. Os outros formatos já têm o seu próprio destaque
 * (fila do Vale a Pena, painéis do Descobre, carrossel Antes da Platina),
 * por isso esta secção não precisa de tentar mostrar tudo.
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

          {/* Artigos secundários — mais pequenos, à direita. */}
          <div className="flex flex-col gap-6 lg:col-span-5">
            {secondary.map((item) => (
              <Link key={item.key} href={item.href} className="group flex gap-4">
                <div className="relative aspect-[4/3] w-[120px] shrink-0 overflow-hidden rounded-sm border border-border bg-bg-surface sm:w-[150px]">
                  {item.imageUrl && (
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      sizes="150px"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  )}
                  <div className="absolute left-1.5 top-1.5">
                    <span
                      className={`inline-flex items-center rounded-sm px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide shadow-sm ${CATEGORY_BADGE_STYLES[item.categoryTone]}`}
                    >
                      {item.category}
                    </span>
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 font-display text-base font-bold text-ink group-hover:text-primary-light">
                    {item.title}
                  </p>
                  {item.subtitle && (
                    <p className="mt-1 line-clamp-2 text-xs text-ink-muted">{item.subtitle}</p>
                  )}
                  <Byline item={item} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
