import Image from "next/image";
import { PenLine } from "lucide-react";

export interface ArticleAuthor {
  name: string;
  role: string;
  avatarInitials: string;
  photoUrl: string | null;
}

interface ArticleAuthorBadgeProps {
  author?: ArticleAuthor | null;
  className?: string;
}

/**
 * Mostra "Escrito por [foto] Nome — Cargo", tal como aparece no início
 * dos artigos em sites como a IGN. Reutilizado no topo dos artigos de
 * opinião (Uma Hora Com, Retro+, Descobertas+, Top+). Se a pessoa não
 * tiver foto no perfil (Sobre Nós), mostra as iniciais em vez disso —
 * nunca fica "partido" por falta de foto.
 */
export function ArticleAuthorBadge({ author, className = "" }: ArticleAuthorBadgeProps) {
  if (!author) return null;

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {author.photoUrl ? (
        <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full">
          <Image src={author.photoUrl} alt={author.name} fill className="object-cover" />
        </div>
      ) : (
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
          {author.avatarInitials}
        </span>
      )}
      <div className="min-w-0 leading-tight">
        <p className="flex items-center gap-1 text-[11px] uppercase tracking-wide text-ink-dim">
          <PenLine width={10} height={10} />
          Escrito por
        </p>
        <p className="truncate text-sm font-semibold text-ink">
          {author.name} <span className="font-normal text-ink-dim">— {author.role}</span>
        </p>
      </div>
    </div>
  );
}
