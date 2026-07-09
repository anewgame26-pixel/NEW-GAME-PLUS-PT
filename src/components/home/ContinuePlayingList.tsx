import Image from "next/image";
import Link from "next/link";
import { BookOpen, Play, Map as MapIcon, Video } from "lucide-react";
import { PlayingNow } from "@/types";
import { getGameById } from "@/data/mock/games";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { PlatformIcons } from "@/components/game/PlatformIcons";

interface ContinuePlayingListProps {
  items: PlayingNow[];
}

const QUICK_LINKS = [
  { label: "Guia", icon: BookOpen },
  { label: "Antes da Platina", icon: Play },
  { label: "Roadmap", icon: MapIcon },
  { label: "Vídeo", icon: Video },
];

export function ContinuePlayingList({ items }: ContinuePlayingListProps) {
  return (
    <Card className="p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-lg font-bold uppercase tracking-wide text-ink">
          Estamos a Jogar
        </h2>
        <Link href="/jogos" className="text-xs font-medium text-primary hover:text-primary-light">
          Ver todos
        </Link>
      </div>

      <div className="flex flex-col divide-y divide-border">
        {items.map((item) => {
          const game = getGameById(item.gameId);
          if (!game) return null;

          return (
            <div key={item.gameId} className="flex gap-3 py-3.5 first:pt-0 last:pb-0">
              <Link href={`/jogos/${game.slug}`} className="relative h-16 w-12 shrink-0 overflow-hidden rounded-sm border border-border">
                <Image src={game.coverUrl} alt={`Capa de ${game.title}`} fill sizes="48px" className="object-cover" />
              </Link>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <Link href={`/jogos/${game.slug}`} className="min-w-0">
                    <p className="truncate font-display text-sm font-semibold text-ink hover:text-primary-light">
                      {game.title}
                    </p>
                  </Link>
                  <span className="shrink-0 font-mono text-xs text-ink-muted">
                    {item.progressPercent}%
                  </span>
                </div>

                <PlatformIcons platforms={game.platforms} className="mt-1" />
                <ProgressBar value={item.progressPercent} className="mt-2" />

                <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
                  {QUICK_LINKS.map((link) => (
                    <Link
                      key={link.label}
                      href={`/jogos/${game.slug}`}
                      className="flex items-center gap-1 text-[11px] text-ink-dim hover:text-primary-light"
                    >
                      <link.icon width={11} height={11} />
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex items-center gap-1.5 border-t border-border pt-4 text-xs text-ink-dim">
        A jogar agora:
        <div className="flex -space-x-1.5">
          {items
            .flatMap((i) => i.activePlayers)
            .slice(0, 4)
            .map((p) => (
              <span
                key={p.id}
                className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-bg-surface bg-bg-surface2 text-[9px] font-semibold text-ink-muted"
                title={p.name}
              >
                {p.avatarInitials}
              </span>
            ))}
        </div>
      </div>
    </Card>
  );
}
