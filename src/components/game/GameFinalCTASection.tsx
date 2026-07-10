import Link from "next/link";
import { BookOpen, Map as MapIcon, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/Card";

interface GameFinalCTASectionProps {
  guideHref: string;
  roadmapHref: string;
  gameTitle: string;
}

export function GameFinalCTASection({ guideHref, roadmapHref, gameTitle }: GameFinalCTASectionProps) {
  return (
    <section className="border-t border-border py-10">
      <div className="mx-auto grid max-w-[1440px] gap-4 px-4 sm:grid-cols-2 lg:px-8">
        <Card cut hover className="group flex flex-col gap-3 p-6">
          <span className="flex h-10 w-10 items-center justify-center rounded-sm bg-primary/10 text-primary">
            <BookOpen width={19} height={19} />
          </span>
          <div>
            <h3 className="font-display text-lg font-bold uppercase tracking-wide text-ink">
              Guia Completo
            </h3>
            <p className="mt-1 text-sm text-ink-muted">
              Todos os passos, capítulo a capítulo, para platinares {gameTitle} sem surpresas.
            </p>
          </div>
          <Link
            href={guideHref}
            className="mt-auto flex items-center gap-1.5 text-sm font-semibold text-primary group-hover:text-primary-light"
          >
            Abrir Guia
            <ArrowRight width={15} height={15} />
          </Link>
        </Card>

        <Card cut hover className="group flex flex-col gap-3 p-6">
          <span className="flex h-10 w-10 items-center justify-center rounded-sm bg-accent/10 text-accent">
            <MapIcon width={19} height={19} />
          </span>
          <div>
            <h3 className="font-display text-lg font-bold uppercase tracking-wide text-ink">
              Roadmap
            </h3>
            <p className="mt-1 text-sm text-ink-muted">
              A ordem mais eficiente para fazeres tudo, sem desperdiçar tempo nem playthroughs.
            </p>
          </div>
          <Link
            href={roadmapHref}
            className="mt-auto flex items-center gap-1.5 text-sm font-semibold text-accent group-hover:text-accent-light"
          >
            Abrir Roadmap
            <ArrowRight width={15} height={15} />
          </Link>
        </Card>
      </div>
    </section>
  );
}
