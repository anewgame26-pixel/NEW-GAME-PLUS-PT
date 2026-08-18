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
        className="relative block w-full max-w-[210px] overflow-hidden sm:max-w-[250px]"
        style={{ aspectRatio: "514 / 406" }}
        aria-label="NewGame+ PT"
      >
        <Image
          src="/logo-hero.png"
          alt="NewGame+ PT"
          fill
          priority
          sizes="250px"
          className="object-contain"
        />
      </Link>
    </FeaturedGameCarousel>
  );
}
