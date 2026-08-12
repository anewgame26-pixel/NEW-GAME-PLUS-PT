import Image from "next/image";
import Link from "next/link";

export interface RecentContentItem {
  key: string;
  category: "Antes da Platina" | "Uma Hora Com" | "Retro+" | "Descobertas+" | "Top+";
  categoryTone: "red" | "blue" | "gold" | "green" | "neutral";
  title: string;
  subtitle: string | null;
  imageUrl: string | null;
  date: string;
  href: string;
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
  neutral: "bg-ink text-bg",
};

/**
 * "Conteúdo Novo": grelha (não carrossel, de propósito) com o mais recente
 * de todos os formatos editoriais misturados — Antes da Platina, Uma Hora
 * Com, Retro+ e Descobertas+ — para que a homepage não pareça só um site
 * de troféus.
 */
export function RecentContentGrid({ items }: RecentContentGridProps) {
  if (items.length === 0) return null;

  return (
    <section className="border-t border-border py-10">
      <div className="mx-auto max-w-[1440px] px-4 lg:px-8">
        <div className="mb-5">
          <h2 className="font-display text-xl font-bold uppercase tracking-wide text-ink sm:text-2xl">
            Conteúdo Novo
          </h2>
          <p className="mt-1 text-sm text-ink-muted">O mais recente do universo New Game Plus.</p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {items.map((item) => (
            <Link key={item.key} href={item.href} className="group block">
              <div className="relative aspect-[4/3] overflow-hidden rounded-sm border border-border bg-bg-surface">
                {item.imageUrl && (
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                )}
                <div className="absolute left-2 top-2">
                  <span
                    className={`inline-flex items-center rounded-sm px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide shadow-sm ${CATEGORY_BADGE_STYLES[item.categoryTone]}`}
                  >
                    {item.category}
                  </span>
                </div>
              </div>
              <p className="mt-2 line-clamp-2 font-display text-sm font-semibold text-ink group-hover:text-primary-light">
                {item.title}
              </p>
              {item.subtitle && (
                <p className="mt-0.5 line-clamp-1 text-xs text-ink-muted">{item.subtitle}</p>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
