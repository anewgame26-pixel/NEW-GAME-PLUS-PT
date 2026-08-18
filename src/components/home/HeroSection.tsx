import Image from "next/image";
import Link from "next/link";
import { HeroSlide } from "@/types";
import { HeroSearchForm } from "@/components/home/HeroSearchForm";
import { FeaturedGameCarousel } from "@/components/home/FeaturedGameCarousel";

interface HeroSectionProps {
  slides: HeroSlide[];
}

export function HeroSection({ slides }: HeroSectionProps) {
  return (
    <FeaturedGameCarousel slides={slides} search={<HeroSearchForm />}>
      <Link
        href="/"
        className="relative block w-full max-w-[220px] overflow-hidden sm:max-w-[260px]"
        style={{ aspectRatio: "1254 / 614" }}
        aria-label="NewGame+ PT"
      >
        <Image
          src="/logo-hero.png"
          alt="NewGame+ PT"
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
