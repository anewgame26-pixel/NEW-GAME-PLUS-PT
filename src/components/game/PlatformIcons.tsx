import { Gamepad2, Monitor } from "lucide-react";
import { Platform } from "@/types";
import { platformLabel } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface PlatformIconsProps {
  platforms: Platform[];
  className?: string;
  showLabel?: boolean;
}

const icon = (p: Platform) => {
  if (p === "pc") return Monitor;
  return Gamepad2;
};

export function PlatformIcons({ platforms, className, showLabel = false }: PlatformIconsProps) {
  return (
    <div className={cn("flex items-center gap-2 text-ink-muted", className)}>
      {platforms.map((p) => {
        const Icon = icon(p);
        return (
          <span key={p} className="flex items-center gap-1" title={platformLabel(p)}>
            <Icon width={14} height={14} />
            {showLabel && <span className="text-xs">{platformLabel(p)}</span>}
          </span>
        );
      })}
    </div>
  );
}
