import Image from "next/image";
import Link from "next/link";
import { Game } from "@/types";
import { HeroSearchForm } from "@/components/home/HeroSearchForm";
import { FeaturedGameCarousel } from "@/components/home/FeaturedGameCarousel";

interface HeroSectionProps {
  featuredGames: Game[];
  /** Já não é usado no hero (as sugestões foram removidas), mas mantém-se
   * aqui para não obrigar a mexer em quem chama este componente. */
  suggestions?: Game[];
}

export function HeroSection({ featuredGames }: HeroSectionProps) {
  return (
    <FeaturedGameCarousel games={featuredGames} search={<HeroSearchForm />}>
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
    </FeaturedGameCarousel>
  );
}
