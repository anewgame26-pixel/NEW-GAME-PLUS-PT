import { RecentContentCarousel } from "@/components/home/RecentContentCarousel";
import type { RecentContentItem } from "@/components/home/RecentContentShared";

export type { RecentContentItem };

interface RecentContentGridProps {
  items: RecentContentItem[];
}

/**
 * "Conteúdo Novo": os artigos mais recentes de sempre, sejam eles do
 * formato que forem — mais como a manchete de um jornal do que uma
 * grelha de categorias. Os outros formatos já têm o seu próprio destaque
 * (fila do Vale a Pena, painéis do Descobre, carrossel Antes da Platina),
 * por isso esta secção não precisa de tentar mostrar tudo.
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

        <RecentContentCarousel items={items} />
      </div>
    </section>
  );
}
