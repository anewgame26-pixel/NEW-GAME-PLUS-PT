"use client";

import Image from "next/image";

interface HeroFocusSliderProps {
  imageUrl: string;
  value: number;
  onChange: (value: number) => void;
}

/**
 * Deixa o editor escolher que parte horizontal da imagem larga fica
 * visível quando o layout a corta (carrossel do Hero no telemóvel,
 * banner do topo do artigo). 0 = mostra o lado esquerdo, 50 = centro
 * (padrão), 100 = mostra o lado direito.
 */
export function HeroFocusSlider({ imageUrl, value, onChange }: HeroFocusSliderProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-ink-dim">
          Enquadramento da imagem larga
        </span>
        <span className="text-xs text-ink-dim">{value}%</span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full max-w-[220px] accent-primary"
      />
      <div className="flex w-full max-w-[220px] justify-between text-[10px] text-ink-dim">
        <span>Esquerda</span>
        <span>Centro</span>
        <span>Direita</span>
      </div>
      <div className="relative h-28 w-full max-w-[320px] overflow-hidden rounded-sm border border-border">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt="Pré-visualização do enquadramento"
          className="h-full w-full object-cover"
          style={{ objectPosition: `${value}% 50%` }}
        />
      </div>
      <span className="text-xs text-ink-dim">
        Esta imagem aparece cortada em faixas largas (banner do artigo e carrossel da
        homepage) — arrasta para escolher que parte se mantém visível. A pré-visualização
        acima é aproximada.
      </span>
    </div>
  );
}
