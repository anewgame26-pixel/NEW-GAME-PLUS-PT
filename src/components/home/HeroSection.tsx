import { HeroSlide } from "@/types";
import { HeroSearchForm } from "@/components/home/HeroSearchForm";
import { FeaturedGameCarousel } from "@/components/home/FeaturedGameCarousel";

interface HeroSectionProps {
  slides: HeroSlide[];
}

export function HeroSection({ slides }: HeroSectionProps) {
  // O logo já aparece sempre fixo no cabeçalho (Header.tsx), por isso
  // deixou de ser preciso repeti-lo aqui em cima do carrossel.
  return <FeaturedGameCarousel slides={slides} search={<HeroSearchForm />} />;
}
