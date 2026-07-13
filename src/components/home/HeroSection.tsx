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
    <section className="relative overflow-hidden border-b border-border">
      <div className="absolute inset-0 bg-radial-fade" aria-hidden />
      <div className="relative mx-auto grid max-w-[1440px] gap-12 px-4 pb-12 pt-6 lg:grid-cols-[1fr_auto] lg:items-start lg:gap-10 lg:px-8 lg:pb-16 lg:pt-8">
        <div className="flex flex-col justify-start">
          <h1
            className="relative w-full max-w-[340px] overflow-hidden sm:max-w-[460px] lg:max-w-[560px]"
            style={{ aspectRatio: "1254 / 614" }}
          >
            <Image
              src="/logo-hero.png"
              alt="NewGame+ PT — Nós sofremos. Tu escolhes melhor."
              fill
              priority
              sizes="(min-width: 1024px) 560px, (min-width: 640px) 460px, 340px"
              className="object-cover"
              style={{ objectPosition: "50% 51.1%" }}
            />
          </h1>
          <p className="mt-6 max-w-xl text-balance text-base text-ink-muted sm:text-lg">
            Análises completas escritas apenas depois de conquistar a
            Platina. Descobre tudo o que precisas de saber antes de
            começares a tua próxima aventura.
          </p>

          <div className="mt-8 max-w-lg rounded-sm shadow-glow">
            <HeroSearchForm />
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
