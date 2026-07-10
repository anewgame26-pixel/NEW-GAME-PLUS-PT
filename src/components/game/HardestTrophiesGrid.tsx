import { Trophy, Lightbulb } from "lucide-react";
import { HardestTrophy } from "@/types";
import { Card } from "@/components/ui/Card";

interface HardestTrophiesGridProps {
  trophies: HardestTrophy[];
}

export function HardestTrophiesGrid({ trophies }: HardestTrophiesGridProps) {
  if (trophies.length === 0) return null;

  return (
    <section className="border-t border-border py-10">
      <div className="mx-auto max-w-[1440px] px-4 lg:px-8">
        <div className="mb-5 flex items-center gap-2">
          <Trophy width={18} height={18} className="text-gold" />
          <h2 className="font-display text-xl font-bold uppercase tracking-wide text-ink">
            Troféus Mais Difíceis
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {trophies.map((trophy) => (
            <Card key={trophy.name} hover className="flex flex-col gap-3 p-5">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-gold/10 text-gold">
                  <Trophy width={15} height={15} />
                </span>
                <p className="font-display text-sm font-bold text-ink">{trophy.name}</p>
              </div>
              <p className="text-sm text-ink-muted">{trophy.description}</p>
              <div className="mt-auto flex gap-2 rounded-sm bg-bg-surface2 p-3 text-xs text-ink-muted">
                <Lightbulb width={14} height={14} className="mt-0.5 shrink-0 text-accent" />
                {trophy.tip}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
