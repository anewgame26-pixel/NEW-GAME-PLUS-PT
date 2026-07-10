import { Flag, Swords, Trophy, Sparkles } from "lucide-react";
import { TimelineStage, TimelineStageKey } from "@/types";
import { Card } from "@/components/ui/Card";

interface PlatinumTimelineProps {
  stages: TimelineStage[];
}

const ICONS: Record<TimelineStageKey, typeof Flag> = {
  inicio: Flag,
  meio: Swords,
  final: Trophy,
  cleanup: Sparkles,
};

export function PlatinumTimeline({ stages }: PlatinumTimelineProps) {
  return (
    <section className="border-t border-border py-10">
      <div className="mx-auto max-w-[1440px] px-4 lg:px-8">
        <h2 className="mb-5 font-display text-xl font-bold uppercase tracking-wide text-ink">
          Timeline da Platina
        </h2>

        <div className="grid gap-3 lg:grid-cols-4">
          {stages.map((stage, i) => {
            const Icon = ICONS[stage.stage];
            return (
              <div key={stage.stage} className="relative flex items-stretch gap-3">
                <Card cut className="flex flex-1 flex-col gap-2 p-4">
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-primary/10 text-primary">
                      <Icon width={16} height={16} />
                    </span>
                    <p className="font-display text-sm font-bold uppercase tracking-wide text-ink">
                      {stage.label}
                    </p>
                  </div>
                  <p className="text-xs text-ink-muted">{stage.description}</p>
                </Card>

                {i < stages.length - 1 && (
                  <div className="absolute -right-2 top-1/2 z-10 hidden -translate-y-1/2 lg:flex">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full border border-border bg-bg text-ink-dim">
                      →
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
