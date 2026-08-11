import Image from "next/image";
import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export interface ArticleTeaserItem {
  slug: string;
  title: string;
  imageUrl: string | null;
  meta: string | null;
  badgeLabel?: string;
  badgeTone?: "neutral" | "red" | "blue" | "gold" | "green";
}

interface ArticleTeaserPanelProps {
  title: string;
  icon: LucideIcon;
  basePath: string;
  items: ArticleTeaserItem[];
  emptyLabel: string;
}

/**
 * Painel compacto para a homepage que mostra os artigos mais recentes de uma
 * secção (Uma Hora Com..., Retro+, Descobertas+), no mesmo estilo visual do
 * "Últimos Antes da Platina" e "Estamos a Jogar".
 */
export function ArticleTeaserPanel({ title, icon: Icon, basePath, items, emptyLabel }: ArticleTeaserPanelProps) {
  return (
    <Card className="p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-display text-lg font-bold uppercase tracking-wide text-ink">
          <Icon width={16} height={16} className="text-primary" />
          {title}
        </h2>
        <Link href={basePath} className="text-xs font-medium text-primary hover:text-primary-light">
          Ver todos
        </Link>
      </div>

      {items.length === 0 ? (
        <p className="py-6 text-center text-xs text-ink-muted">{emptyLabel}</p>
      ) : (
        <div className="flex flex-col divide-y divide-border">
          {items.map((item) => (
            <Link
              key={item.slug}
              href={`${basePath}/${item.slug}`}
              className="group flex gap-3 py-3.5 first:pt-0 last:pb-0"
            >
              <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded-sm border border-border bg-bg-surface2">
                {item.imageUrl && (
                  <Image src={item.imageUrl} alt={item.title} fill sizes="48px" className="object-cover" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="truncate font-display text-sm font-semibold text-ink group-hover:text-primary-light">
                    {item.title}
                  </p>
                  {item.badgeLabel && (
                    <Badge tone={item.badgeTone ?? "neutral"} className="shrink-0">
                      {item.badgeLabel}
                    </Badge>
                  )}
                </div>
                {item.meta && <p className="mt-1 text-xs text-ink-dim">{item.meta}</p>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </Card>
  );
}
