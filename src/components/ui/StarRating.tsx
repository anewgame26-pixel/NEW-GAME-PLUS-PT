import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  value: number;
  max?: number;
  size?: number;
  className?: string;
}

export function StarRating({ value, max = 5, size = 14, className }: StarRatingProps) {
  return (
    <div className={cn("flex items-center gap-0.5", className)} role="img" aria-label={`${value} de ${max} estrelas`}>
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          width={size}
          height={size}
          className={i < value ? "fill-gold text-gold" : "fill-transparent text-border-light"}
          strokeWidth={1.5}
        />
      ))}
    </div>
  );
}
