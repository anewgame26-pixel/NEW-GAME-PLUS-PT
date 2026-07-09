import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  cut?: boolean;
  hover?: boolean;
}

export function Card({ className, cut = false, hover = false, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "bg-bg-surface border border-border",
        cut && "panel-cut",
        hover &&
          "transition-colors duration-200 hover:border-border-light hover:bg-bg-surface2",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
