import { Card } from "@/components/ui/Card";
import type { HeroSlideFact } from "@/types";

interface HeroFactsCardProps {
  facts: HeroSlideFact[];
}

/**
 * Versão simples de FeaturedGameStats para slides do Hero que não são
 * jogos (Uma Hora Com, Retro+, Top+) — só os factos que fazem sentido
 * para esse tipo de conteúdo, sem inventar estatísticas de jogo que não
 * existem para um artigo.
 */
export function HeroFactsCard({ facts }: HeroFactsCardProps) {
  if (facts.length === 0) return null;

  return (
    <Card cut className="w-full p-5 sm:w-80">
      <div className="flex flex-col gap-3.5">
        {facts.map((fact) => (
          <div key={fact.label} className="flex items-center justify-between gap-3 text-sm">
            <span className="text-ink-muted">{fact.label}</span>
            <span
              className={
                fact.warn ? "font-mono font-medium text-primary-light" : "font-mono font-medium text-ink"
              }
            >
              {fact.value}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
