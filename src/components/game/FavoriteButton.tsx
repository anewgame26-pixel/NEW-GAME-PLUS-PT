"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Heart } from "lucide-react";
import { useFavorites } from "@/components/providers/FavoritesProvider";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  gameId: string;
  /** "icon" = só o coração, redondo (para cima da capa do GameCard).
   *  "full" = com texto, para a barra de interação da página do jogo. */
  variant?: "icon" | "full";
  className?: string;
}

export function FavoriteButton({ gameId, variant = "icon", className }: FavoriteButtonProps) {
  const { ready, user, isFavorite, toggleFavorite } = useFavorites();
  const router = useRouter();
  const pathname = usePathname();
  const [busy, setBusy] = useState(false);

  const favorited = isFavorite(gameId);

  const handleClick = async (e: React.MouseEvent) => {
    // Impede que o clique também acione o <Link> do GameCard por baixo.
    e.preventDefault();
    e.stopPropagation();

    if (!ready || busy) return;

    if (!user) {
      router.push(`/entrar?next=${encodeURIComponent(pathname)}`);
      return;
    }

    setBusy(true);
    await toggleFavorite(gameId);
    setBusy(false);
  };

  if (variant === "full") {
    return (
      <button
        type="button"
        onClick={handleClick}
        disabled={!ready || busy}
        className={cn(
          "inline-flex shrink-0 items-center justify-center gap-2 rounded-sm px-5 py-2.5 font-display text-sm font-semibold uppercase tracking-wide transition-all duration-200 disabled:opacity-50",
          favorited
            ? "bg-primary text-white shadow-glow hover:bg-primary-light"
            : "border border-border bg-bg-surface2 text-ink hover:border-border-light",
          className
        )}
      >
        <Heart width={16} height={16} className={favorited ? "fill-white" : ""} />
        {favorited ? "Nos Favoritos" : "Guardar nos Favoritos"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={!ready || busy}
      aria-label={favorited ? "Remover dos favoritos" : "Adicionar aos favoritos"}
      title={favorited ? "Remover dos favoritos" : "Adicionar aos favoritos"}
      className={cn(
        "flex h-7 w-7 items-center justify-center rounded-full bg-black/60 backdrop-blur-sm transition-colors hover:bg-black/80 disabled:opacity-50",
        className
      )}
    >
      <Heart
        width={14}
        height={14}
        className={favorited ? "fill-primary text-primary" : "text-white"}
      />
    </button>
  );
}
