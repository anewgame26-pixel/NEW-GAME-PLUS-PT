import Image from "next/image";
import Link from "next/link";
import { Game } from "@/types";
import { HeroSearchForm } from "@/components/home/HeroSearchForm";
import { FeaturedGameCarousel } from "@/components/home/FeaturedGameCarousel";

interface HeroSectionProps {
  featuredGames: Game[];
  suggestions: Game[];
}

export function HeroSection({ featuredGames, suggestions }: HeroSectionProps) {
  return (
    <FeaturedGameCarousel games={featuredGames}>
      <div className="flex flex-col items-start">
        <Link
          href="/"
          className="relative block w-full max-w-[220px] overflow-hidden sm:max-w-[260px]"
          style={{ aspectRatio: "1254 / 614" }}
          aria-label="NewGame+ PT"
        >
          <Image
            src="/logo-hero.png"
            alt="NewGame+ PT — Nós sofremos. Tu escolhes melhor."
            fill
            priority
            sizes="260px"
            className="object-cover"
            style={{ objectPosition: "50% 51.1%" }}
          />
        </Link>

        <div className="mt-5 w-full max-w-md rounded-sm shadow-glow">
          <HeroSearchForm />
        </div>

        <div className="mt-4 flex max-w-lg flex-wrap items-center gap-2">
          <span className="text-xs text-ink-dim">Sugestões:</span>
          {suggestions.map((game) => (
            <Link
              key={game.id}
              href={`/guias/${game.slug}`}
              className="rounded-full border border-white/20 bg-black/30 px-3 py-1 text-xs text-ink-muted backdrop-blur-sm transition-colors hover:border-primary hover:text-ink"
            >
              {game.title}
            </Link>
          ))}
        </div>
      </div>
    </FeaturedGameCarousel>
  );
}
