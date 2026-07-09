import { difficultyLabel } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";

interface DifficultyBadgeProps {
  value: number;
}

export function DifficultyBadge({ value }: DifficultyBadgeProps) {
  const tone = value <= 3 ? "green" : value <= 6 ? "blue" : value <= 8 ? "gold" : "red";

  return (
    <Badge tone={tone}>
      {difficultyLabel(value)} · {value}/10
    </Badge>
  );
}
