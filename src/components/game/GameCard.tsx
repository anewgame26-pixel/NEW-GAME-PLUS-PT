import { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { Game } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { PlatformIcons } from "@/components/game/PlatformIcons";
import { cn } from "@/lib/utils";

interface GameCardProps {
  game: Game;
  eyebrow?: string;
  eyebrowTone?: "red" | "blue" | "gold";
  footer?: ReactNode;
  className?: string;
  href?: string;
}

export function GameCard({ game, eyebrow, eyebrowTone = "red", footer, className, href }: GameCardProps) {
  return (
    <Link
      href={href ?? `/guias/${game.slug}`}
      className={cn("group block w-40 shrink-0 sm:w-44", className)}
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-sm border border-border bg-bg-surface transition-colors duration-200 group-hover:border-primary/60">
        <Image
          src={game.coverUrl}
          alt={`Capa de ${game.title}`}
          fill
          sizes="176px"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {eyebrow && (
          <div className="absolute left-2 top-2">
            <Badge tone={eyebrowTone}>{eyebrow}</Badge>
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-2 pt-6">
          <PlatformIcons platforms={game.platforms} />
        </div>
      </div>
      <p className="mt-2 truncate font-display text-sm font-semibold text-ink group-hover:text-primary-light">
        {game.title}
      </p>
      {footer}
    </Link>
  );
}
