import { StarRating } from "@/components/ui/StarRating";

interface WorthItBadgeProps {
  label: string;
  value: number;
}

export function WorthItBadge({ label, value }: WorthItBadgeProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-xs text-ink-muted">{label}</span>
      <StarRating value={value} />
    </div>
  );
}
