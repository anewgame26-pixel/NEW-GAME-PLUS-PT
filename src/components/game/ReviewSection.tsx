import { Check, X, Play } from "lucide-react";
import { ReviewContent } from "@/types";
import { Card } from "@/components/ui/Card";
import { RichText } from "@/components/ui/RichText";

interface ReviewSectionProps {
  review: ReviewContent;
}

export function ReviewSection({ review }: ReviewSectionProps) {
  return (
    <section className="py-10">
      <div className="mx-auto max-w-[1440px] px-4 lg:px-8">
        <div className="mb-5 flex items-center gap-2">
          <Play width={18} height={18} className="text-primary" />
          <h2 className="font-display text-xl font-bold uppercase tracking-wide text-ink">
            Antes da Platina
          </h2>
        </div>

        <Card className="p-6">
          <RichText html={review.intro} className="text-ink" />

          <h3 className="mb-2 mt-6 font-display text-sm font-bold uppercase tracking-wide text-ink-dim">
            O que esperar
          </h3>
          <RichText html={review.whatToExpect} className="text-sm text-ink-muted" />

          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div>
              <h3 className="mb-3 flex items-center gap-1.5 font-display text-sm font-bold uppercase tracking-wide text-emerald-400">
                <Check width={15} height={15} />
                Pontos Positivos
              </h3>
              <ul className="flex flex-col gap-2">
                {review.pros.map((pro) => (
                  <li key={pro} className="flex gap-2 text-sm text-ink-muted">
                    <Check width={14} height={14} className="mt-0.5 shrink-0 text-emerald-500" />
                    {pro}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-3 flex items-center gap-1.5 font-display text-sm font-bold uppercase tracking-wide text-primary-light">
                <X width={15} height={15} />
                Pontos Negativos
              </h3>
              <ul className="flex flex-col gap-2">
                {review.cons.map((con) => (
                  <li key={con} className="flex gap-2 text-sm text-ink-muted">
                    <X width={14} height={14} className="mt-0.5 shrink-0 text-primary" />
                    {con}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-6 rounded-sm border border-gold/30 bg-gold/5 p-4">
            <h3 className="mb-1.5 font-display text-sm font-bold uppercase tracking-wide text-gold">
              Vale a Pena?
            </h3>
            <RichText html={review.verdict} className="text-sm text-ink" />
          </div>
        </Card>
      </div>
    </section>
  );
}
