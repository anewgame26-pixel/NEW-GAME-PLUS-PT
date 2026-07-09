import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Tone = "neutral" | "red" | "blue" | "gold" | "green";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
}

const toneStyles: Record<Tone, string> = {
  neutral: "bg-bg-surface2 text-ink-muted border-border-light",
  red: "bg-primary/10 text-primary-light border-primary/30",
  blue: "bg-accent/10 text-accent-light border-accent/30",
  gold: "bg-gold/10 text-gold border-gold/30",
  green: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
};

export function Badge({ className, tone = "neutral", children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-sm border px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide",
        toneStyles[tone],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
