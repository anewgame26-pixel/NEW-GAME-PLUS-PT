import Image from "next/image";
import Link from "next/link";
import { Game } from "@/types";
import { SearchInput } from "@/components/ui/SearchInput";
import { FeaturedGameCarousel } from "@/components/home/FeaturedGameCarousel";

interface HeroSectionProps {
  featuredGames: Game[];
  suggestions: Game[];
}

export function HeroSection({ featuredGames, suggestions }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="absolute inset-0 bg-radial-fade" aria-hidden />
      <div className="relative mx-auto grid max-w-[1440px] gap-12 px-4 py-12 lg:grid-cols-[1fr_auto] lg:gap-10 lg:px-8 lg:py-16">
        <div className="flex flex-col justify-center">
          <h1 className="w-full max-w-[340px] sm:max-w-[460px] lg:max-w-[560px]">
            <Image
              src="/logo-hero.png"
              alt="NewGame+ PT — Nós sofremos. Tu escolhes melhor."
              width={1254}
              height={1254}
              priority
              className="h-auto w-full"
            />
          </h1>
          <p className="mt-6 max-w-xl text-balance text-base text-ink-muted sm:text-lg">
            Análises completas escritas apenas depois de conquistar a
            Platina. Descobre tudo o que precisas de saber antes de
            começares a tua próxima aventura.
          </p>

          <div className="mt-8 max-w-lg rounded-sm shadow-glow">
            <SearchInput size="lg" placeholder="Que jogo queres platinar?" />
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="text-xs text-ink-dim">Sugestões:</span>
            {suggestions.map((game) => (
              <Link
                key={game.id}
                href={`/guias/${game.slug}`}
                className="rounded-full border border-border bg-bg-surface px-3 py-1 text-xs text-ink-muted transition-colors hover:border-primary hover:text-ink"
              >
                {game.title}
              </Link>
            ))}
          </div>
        </div>

        <FeaturedGameCarousel games={featuredGames} />
      </div>
    </section>
  );
}
