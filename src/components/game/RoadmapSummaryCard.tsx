import Link from "next/link";
import { Map as MapIcon, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/Card";

interface RoadmapSummaryCardProps {
  steps: string[];
  roadmapHref: string;
}

export function RoadmapSummaryCard({ steps, roadmapHref }: RoadmapSummaryCardProps) {
  return (
    <section className="border-t border-border py-10">
      <div className="mx-auto max-w-[1440px] px-4 lg:px-8">
        <div className="mb-5 flex items-center gap-2">
          <MapIcon width={18} height={18} className="text-accent" />
          <h2 className="font-display text-xl font-bold uppercase tracking-wide text-ink">
            Roadmap Resumido
          </h2>
        </div>

        <Card className="p-6">
          <ol className="flex flex-col gap-3">
            {steps.map((step, i) => (
              <li key={step} className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/10 font-mono text-xs font-semibold text-accent">
                  {i + 1}
                </span>
                <span className="text-sm text-ink-muted">{step}</span>
              </li>
            ))}
          </ol>

          <Link
            href={roadmapHref}
            className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:text-accent-light"
          >
            Ver roadmap completo
            <ArrowRight width={15} height={15} />
          </Link>
        </Card>
      </div>
    </section>
  );
}
