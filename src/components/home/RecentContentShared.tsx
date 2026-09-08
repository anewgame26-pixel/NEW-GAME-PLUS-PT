import Image from "next/image";

export interface RecentContentItem {
  key: string;
  category: "Antes da Platina" | "Vale a pena?" | "Retro+" | "Descobertas+" | "Radar+" | "Top+";
  categoryTone: "red" | "blue" | "gold" | "green" | "purple" | "neutral";
  title: string;
  subtitle: string | null;
  imageUrl: string | null;
  date: string;
  href: string;
  /** Nome de quem escreveu/editou, se atribuído (null = não mostra autor). */
  authorName?: string | null;
  authorPhotoUrl?: string | null;
  authorInitials?: string | null;
}

// Versão sólida/opaca, própria para cima de capas de jogos (o Badge
// normal do site é translúcido, pensado para fundos escuros lisos — em
// cima de uma imagem colorida fica ilegível).
export const CATEGORY_BADGE_STYLES: Record<RecentContentItem["categoryTone"], string> = {
  red: "bg-primary text-white",
  blue: "bg-accent text-white",
  gold: "bg-gold text-black",
  green: "bg-emerald-500 text-white",
  purple: "bg-fuchsia-500 text-white",
  neutral: "bg-ink text-bg",
};

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-PT", { day: "numeric", month: "short" });
}

export function Byline({ item }: { item: RecentContentItem }) {
  return (
    <div className="mt-2 flex items-center gap-2 text-xs text-ink-dim">
      {item.authorName && (
        <>
          {item.authorPhotoUrl ? (
            <span className="relative h-5 w-5 shrink-0 overflow-hidden rounded-full">
              <Image src={item.authorPhotoUrl} alt={item.authorName} fill className="object-cover" />
            </span>
          ) : (
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[9px] font-bold text-primary">
              {item.authorInitials}
            </span>
          )}
          <span className="font-medium text-ink-muted">{item.authorName}</span>
          <span aria-hidden>·</span>
        </>
      )}
      <time dateTime={item.date}>{formatDate(item.date)}</time>
    </div>
  );
}
