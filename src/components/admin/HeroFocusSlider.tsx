"use client";

interface HeroFocusSliderProps {
  imageUrl: string;
  /** Posição horizontal do enquadramento (0 = esquerda, 50 = centro, 100 = direita). */
  focusX: number;
  onFocusXChange: (value: number) => void;
  /** Nível de zoom (100 = tamanho normal, até 200 = ampliada 2x). */
  zoom: number;
  onZoomChange: (value: number) => void;
}

/**
 * Deixa o editor escolher como a imagem larga fica enquadrada quando o
 * layout a corta (carrossel do Hero, banner do topo do artigo):
 * - Enquadramento: que parte horizontal fica visível.
 * - Zoom: aproxima a imagem, útil quando o assunto principal é pequeno
 *   ou está longe do centro.
 */
export function HeroFocusSlider({
  imageUrl,
  focusX,
  onFocusXChange,
  zoom,
  onZoomChange,
}: HeroFocusSliderProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-wide text-ink-dim">
            Enquadramento (esquerda / direita)
          </span>
          <span className="text-xs text-ink-dim">{focusX}%</span>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={focusX}
          onChange={(e) => onFocusXChange(Number(e.target.value))}
          className="w-full max-w-[280px] accent-primary"
        />
        <div className="flex w-full max-w-[280px] justify-between text-[10px] text-ink-dim">
          <span>Esquerda</span>
          <span>Centro</span>
          <span>Direita</span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-wide text-ink-dim">Zoom</span>
          <span className="text-xs text-ink-dim">{zoom}%</span>
        </div>
        <input
          type="range"
          min={100}
          max={200}
          step={1}
          value={zoom}
          onChange={(e) => onZoomChange(Number(e.target.value))}
          className="w-full max-w-[280px] accent-primary"
        />
        <div className="flex w-full max-w-[280px] justify-between text-[10px] text-ink-dim">
          <span>Normal</span>
          <span>Ampliada 2x</span>
        </div>
      </div>

      <div className="relative h-28 w-full max-w-[320px] overflow-hidden rounded-sm border border-border">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt="Pré-visualização do enquadramento"
          className="h-full w-full object-cover"
          style={{ objectPosition: `${focusX}% 50%`, transform: `scale(${zoom / 100})` }}
        />
      </div>
      <span className="text-xs text-ink-dim">
        Esta imagem aparece cortada em faixas largas (banner do artigo e carrossel da
        homepage) — ajusta o enquadramento e o zoom até ficares satisfeito. A
        pré-visualização acima é aproximada.
      </span>
    </div>
  );
}
