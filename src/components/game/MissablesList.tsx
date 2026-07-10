import { AlertTriangle } from "lucide-react";
import { MissableItem } from "@/types";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

interface MissablesListProps {
  missables: MissableItem[];
}

export function MissablesList({ missables }: MissablesListProps) {
  return (
    <section className="border-t border-border py-10">
      <div className="mx-auto max-w-[1440px] px-4 lg:px-8">
        <div className="mb-5 flex items-center gap-2">
          <AlertTriangle width={18} height={18} className="text-primary" />
          <h2 className="font-display text-xl font-bold uppercase tracking-wide text-ink">
            Missables
          </h2>
        </div>

        {missables.length === 0 ? (
          <Card className="p-6">
            <p className="text-sm text-ink-muted">
              Este jogo não tem troféus perdíveis — podes jogar à vontade sem medo de fechar
              nada permanentemente.
            </p>
          </Card>
        ) : (
          <div className="flex flex-col divide-y divide-border rounded-sm border border-border bg-bg-surface">
            {missables.map((item) => (
              <div key={item.title} className="flex flex-col gap-2 p-5 sm:flex-row sm:items-start sm:gap-4">
                <Badge tone="red" className="shrink-0 sm:mt-0.5">
                  {item.chapter}
                </Badge>
                <div>
                  <p className="font-display text-sm font-semibold text-ink">{item.title}</p>
                  <p className="mt-1 text-sm text-ink-muted">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
