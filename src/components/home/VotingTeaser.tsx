import Image from "next/image";
import Link from "next/link";
import { ArrowBigUp } from "lucide-react";
import type { VotingCandidate } from "@/types";
import { Card } from "@/components/ui/Card";
import { PlatformIcons } from "@/components/game/PlatformIcons";

interface VotingTeaserProps {
  candidates: VotingCandidate[];
}

export function VotingTeaser({ candidates }: VotingTeaserProps) {
  if (candidates.length === 0) return null;

  // Só o top 3 aqui — a lista completa (e o botão de votar) fica em /votar.
  const top3 = candidates.slice(0, 3);

  return (
    <Card className="p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-lg font-bold uppercase tracking-wide text-ink">
          Vota na Próxima Platina
        </h2>
        <Link href="/votar" className="text-xs font-medium text-primary hover:text-primary-light">
          Votar
        </Link>
      </div>

      <div className="flex flex-col divide-y divide-border">
        {top3.map((candidate, i) => {
          const coverUrl =
            candidate.game.coverUrl.trim() ||
            "https://placehold.co/300x400/1a1a1a/666666?text=Sem+Capa";

          return (
            <Link
              key={candidate.id}
              href="/votar"
              className="group flex items-center gap-3 py-3.5 first:pt-0 last:pb-0"
            >
              <span className="w-4 shrink-0 text-center font-display text-sm font-bold text-ink-dim">
                {i + 1}
              </span>

              <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded-sm border border-border">
                <Image
                  src={coverUrl}
                  alt={`Capa de ${candidate.game.title}`}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate font-display text-sm font-semibold text-ink group-hover:text-primary-light">
                  {candidate.game.title}
                </p>
                <PlatformIcons platforms={candidate.game.platforms} className="mt-1" />
              </div>

              <div className="flex shrink-0 items-center gap-1 text-ink-dim">
                <ArrowBigUp width={15} height={15} />
                <span className="font-display text-sm font-bold text-ink">
                  {candidate.votesCount}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </Card>
  );
}
