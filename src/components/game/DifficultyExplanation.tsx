import { Game } from "@/types";
import { Card } from "@/components/ui/Card";
import { DifficultyBadge } from "@/components/game/DifficultyBadge";
import { RichText } from "@/components/ui/RichText";

interface DifficultyExplanationProps {
  game: Game;
  explanation: string;
}

export function DifficultyExplanation({ game, explanation }: DifficultyExplanationProps) {
  return (
    <section className="border-t border-border py-10">
      <div className="mx-auto max-w-[1440px] px-4 lg:px-8">
        <h2 className="mb-5 font-display text-xl font-bold uppercase tracking-wide text-ink">
          Dificuldade Explicada
        </h2>
        <Card className="p-6">
          <div className="mb-4">
            <DifficultyBadge value={game.difficulty} />
          </div>
          <RichText html={explanation} className="text-sm leading-relaxed text-ink-muted" />
        </Card>
      </div>
    </section>
  );
}
