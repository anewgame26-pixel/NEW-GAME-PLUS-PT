import { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  icon?: ReactNode;
}

export function Chip({ className, active = false, icon, children, ...props }: ChipProps) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors duration-150",
        active
          ? "border-primary bg-primary text-white"
          : "border-border bg-bg-surface text-ink-muted hover:border-border-light hover:text-ink",
        className
      )}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
