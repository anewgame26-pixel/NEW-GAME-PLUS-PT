import Link from "next/link";
import { ArrowRight, Clock, Trophy } from "lucide-react";

interface CrossLinkBannerProps {
  href: string;
  title: string;
  description: string;
  icon: "clock" | "trophy";
  /** Quando true, não aplica o próprio contentor de largura/padding —
   * usar dentro de sítios que já têm o seu próprio (ex.: dentro de um
   * artigo estreito). Por defeito aplica, para uso direto dentro de <main>. */
  bare?: boolean;
}

/**
 * Chamada de atenção mostrada quando o mesmo jogo tem tanto um perfil em
 * "Antes da Platina" como um artigo "Uma Hora Com" — para as duas
 * páginas se ligarem uma à outra, em vez de ficarem ilhas separadas.
 */
export function CrossLinkBanner({ href, title, description, icon, bare = false }: CrossLinkBannerProps) {
  const Icon = icon === "clock" ? Clock : Trophy;

  const link = (
    <Link
      href={href}
      className="group flex items-center gap-3 rounded-sm border border-primary/30 bg-primary/5 px-4 py-3 transition-colors hover:border-primary/60"
    >
      <Icon width={18} height={18} className="shrink-0 text-primary" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-ink">{title}</p>
        <p className="text-xs text-ink-muted">{description}</p>
      </div>
      <ArrowRight
        width={16}
        height={16}
        className="shrink-0 text-primary transition-transform group-hover:translate-x-0.5"
      />
    </Link>
  );

  if (bare) return link;

  return <div className="mx-auto max-w-[1440px] px-4 lg:px-8">{link}</div>;
}
