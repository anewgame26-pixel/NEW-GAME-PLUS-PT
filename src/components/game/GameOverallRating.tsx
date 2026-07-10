import { RatingBreakdownItem } from "@/types";
import { Card } from "@/components/ui/Card";

interface GameOverallRatingProps {
  score: number;
  breakdown: RatingBreakdownItem[];
}

function scoreTone(score: number) {
  if (score >= 8.5) return "text-gold";
  if (score >= 7) return "text-emerald-400";
  if (score >= 5) return "text-accent-light";
  return "text-primary-light";
}

export function GameOverallRating({ score, breakdown }: GameOverallRatingProps) {
  return (
    <section className="border-t border-border py-10">
      <div className="mx-auto max-w-[1440px] px-4 lg:px-8">
        <h2 className="mb-5 font-display text-xl font-bold uppercase tracking-wide text-ink">
          Classificação Geral
        </h2>

        <Card className="flex flex-col gap-8 p-6 sm:flex-row sm:items-center">
          <div className="flex shrink-0 flex-col items-center justify-center sm:border-r sm:border-border sm:pr-8">
            <span className={`font-display text-5xl font-bold ${scoreTone(score)}`}>
              {score.toFixed(1)}
            </span>
            <span className="mt-1 text-xs uppercase tracking-wide text-ink-dim">de 10</span>
          </div>

          <div className="flex flex-1 flex-col gap-3">
            {breakdown.map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <span className="w-32 shrink-0 text-xs text-ink-muted sm:w-36">{item.label}</span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-bg-surface2">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${(item.value / 10) * 100}%` }}
                  />
                </div>
                <span className="w-8 shrink-0 text-right font-mono text-xs text-ink">
                  {item.value.toFixed(1)}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </section>
  );
}
