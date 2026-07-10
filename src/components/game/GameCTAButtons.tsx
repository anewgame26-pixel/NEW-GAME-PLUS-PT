import Link from "next/link";
import { BookOpen, Map as MapIcon, Play } from "lucide-react";
import { cn } from "@/lib/utils";

interface GameCTAButtonsProps {
  guideHref: string;
  roadmapHref: string;
  videoHref?: string;
  size?: "sm" | "lg";
  className?: string;
}

export function GameCTAButtons({
  guideHref,
  roadmapHref,
  videoHref = "#video",
  size = "sm",
  className,
}: GameCTAButtonsProps) {
  const isLg = size === "lg";

  const base = cn(
    "inline-flex items-center justify-center gap-2 rounded-sm border font-display font-semibold uppercase tracking-wide transition-all duration-200",
    isLg ? "px-6 py-3.5 text-sm" : "px-4 py-2 text-xs"
  );

  return (
    <div className={cn("flex flex-wrap items-center gap-2.5", className)}>
      <Link
        href={guideHref}
        className={cn(base, "border-primary bg-primary text-white shadow-glow hover:bg-primary-light")}
      >
        <BookOpen width={isLg ? 16 : 14} height={isLg ? 16 : 14} />
        Ver Guia
      </Link>
      <Link
        href={roadmapHref}
        className={cn(base, "border-border-light bg-bg-surface2 text-ink hover:border-accent hover:text-accent")}
      >
        <MapIcon width={isLg ? 16 : 14} height={isLg ? 16 : 14} />
        Roadmap
      </Link>
      <Link
        href={videoHref}
        className={cn(base, "border-border bg-transparent text-ink-muted hover:border-border-light hover:text-ink")}
      >
        <Play width={isLg ? 16 : 14} height={isLg ? 16 : 14} />
        Vídeo
      </Link>
    </div>
  );
}
