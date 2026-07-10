import Image from "next/image";
import Link from "next/link";
import { Game } from "@/types";
import { SearchInput } from "@/components/ui/SearchInput";
import { FeaturedGameStats } from "@/components/home/FeaturedGameStats";

interface HeroSectionProps {
  featuredGame: Game;
  suggestions: Game[];
}

export function HeroSection({ featuredGame, suggestions }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="absolute inset-0 bg-radial-fade" aria-hidden />
      <div className="relative mx-auto grid max-w-[1440px] gap-12 px-4 py-12 lg:grid-cols-[1fr_auto] lg:gap-10 lg:px-8 lg:py-16">
        <div className="flex flex-col justify-center">
          <h1 className="text-balance font-display text-5xl font-bold leading-[1.05] tracking-tight text-ink sm:text-6xl lg:text-[4rem]">
            <span className="text-primary">Antes</span> da Platina
          </h1>
          <p className="mt-6 max-w-lg text-balance text-base text-ink-muted sm:text-lg">
            Descobre tudo o que precisas de saber antes de começares a tua
            próxima platina.
          </p>

          <div className="mt-8 max-w-lg rounded-sm shadow-glow">
            <SearchInput size="lg" placeholder="Que jogo queres platinar?" />
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="text-xs text-ink-dim">Sugestões:</span>
            {suggestions.map((game) => (
              <Link
                key={game.id}
                href={`/jogos/${game.slug}`}
                className="rounded-full border border-border bg-bg-surface px-3 py-1 text-xs text-ink-muted transition-colors hover:border-primary hover:text-ink"
              >
                {game.title}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
          <div className="relative order-2 h-64 w-full overflow-hidden rounded-sm border border-border sm:h-80 lg:order-1 lg:h-[26rem] lg:w-72">
            <Image
              src={featuredGame.coverUrl}
              alt={`Capa de ${featuredGame.title}`}
              fill
              sizes="(min-width: 1024px) 288px, 100vw"
              className="object-cover"
              priority
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent p-5">
              <p className="font-display text-xl font-bold uppercase tracking-wide text-ink">
                {featuredGame.title}
              </p>
              <p className="text-xs text-ink-muted">{featuredGame.developer}</p>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <FeaturedGameStats game={featuredGame} />
          </div>
        </div>
      </div>
    </section>
  );
}
