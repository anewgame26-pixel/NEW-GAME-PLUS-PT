import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Game } from "@/types";
import { PlatformIcons } from "@/components/game/PlatformIcons";

interface GuideHeroProps {
  game: Game;
}

const SECTIONS = [
  { id: "dificuldade", label: "Dificuldade" },
  { id: "timeline", label: "Timeline" },
  { id: "missables", label: "Missables" },
  { id: "trofeus", label: "Troféus Difíceis" },
  { id: "roadmap", label: "Roadmap" },
  { id: "dicas", label: "Dicas" },
];

export function GuideHero({ game }: GuideHeroProps) {
  return (
    <section className="border-b border-border bg-bg-raised">
      <div className="mx-auto max-w-[1440px] px-4 py-8 lg:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="relative h-24 w-18 shrink-0 overflow-hidden rounded-sm border border-border sm:h-28 sm:w-20">
            <Image
              src={game.coverUrl}
              alt={`Capa de ${game.title}`}
              fill
              sizes="80px"
              className="object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs uppercase tracking-wide text-ink-dim">Guia Completo</p>
            <h1 className="mt-1 truncate font-display text-2xl font-bold text-ink sm:text-3xl">
              {game.title}
            </h1>
            <PlatformIcons platforms={game.platforms} showLabel className="mt-2" />
          </div>
          <Link
            href={`/jogos/${game.slug}`}
            className="flex shrink-0 items-center gap-1.5 self-start rounded-sm border border-border-light px-4 py-2 text-xs font-semibold uppercase tracking-wide text-ink transition-colors hover:border-primary hover:text-primary sm:self-center"
          >
            Ver Página do Jogo
            <ArrowRight width={13} height={13} />
          </Link>
        </div>

        <nav className="no-scrollbar mt-6 flex gap-2 overflow-x-auto border-t border-border pt-4">
          {SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="shrink-0 rounded-full border border-border bg-bg-surface px-3.5 py-1.5 text-xs font-medium text-ink-muted transition-colors hover:border-primary hover:text-ink"
            >
              {s.label}
            </a>
          ))}
        </nav>
      </div>
    </section>
  );
}
