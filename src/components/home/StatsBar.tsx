import { Gamepad2, BookOpen, Map as MapIcon, Video, Zap, Trophy, Clock } from "lucide-react";
import { PlatformStat } from "@/types";

interface StatsBarProps {
  stats: PlatformStat[];
}

const ICONS = { gamepad: Gamepad2, book: BookOpen, map: MapIcon, video: Video, zap: Zap, trophy: Trophy, clock: Clock };

export function StatsBar({ stats }: StatsBarProps) {
  return (
    <section className="border-y border-border bg-bg-raised">
      <div className="mx-auto grid max-w-[1440px] grid-cols-2 gap-px bg-border sm:grid-cols-3 lg:grid-cols-6">
        {stats.map((stat) => {
          const Icon = ICONS[stat.icon];
          return (
            <div key={stat.label} className="flex flex-col items-center gap-1.5 bg-bg-raised px-4 py-6 text-center">
              <Icon width={18} height={18} className="text-primary" />
              <span className="font-display text-xl font-bold text-ink">{stat.value}</span>
              <span className="text-[11px] uppercase tracking-wide text-ink-dim">{stat.label}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
