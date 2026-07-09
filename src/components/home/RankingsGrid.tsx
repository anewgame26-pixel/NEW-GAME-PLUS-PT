import Link from "next/link";
import { Trophy, Skull, Clock, Hourglass, Heart, Frown, ArrowRight } from "lucide-react";
import { RankingCategory } from "@/types";
import { Card } from "@/components/ui/Card";

interface RankingsGridProps {
  categories: RankingCategory[];
}

const ICONS = { trophy: Trophy, skull: Skull, clock: Clock, hourglass: Hourglass, heart: Heart, frown: Frown };

export function RankingsGrid({ categories }: RankingsGridProps) {
  return (
    <section className="py-10">
      <div className="mx-auto max-w-[1440px] px-4 lg:px-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold uppercase tracking-wide text-ink">
            Rankings
          </h2>
          <Link href="/rankings" className="text-xs font-medium text-primary hover:text-primary-light">
            Ver todos
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((cat) => {
            const Icon = ICONS[cat.icon];
            return (
              <Link key={cat.id} href={cat.href}>
                <Card hover className="group flex h-full flex-col gap-3 p-4">
                  <Icon width={20} height={20} className="text-primary" />
                  <div>
                    <p className="font-display text-sm font-semibold text-ink">{cat.label}</p>
                    <p className="mt-0.5 text-xs text-ink-dim">{cat.description}</p>
                  </div>
                  <span className="mt-auto flex items-center gap-1 text-xs font-medium text-ink-muted group-hover:text-primary">
                    Ver ranking
                    <ArrowRight width={12} height={12} />
                  </span>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
