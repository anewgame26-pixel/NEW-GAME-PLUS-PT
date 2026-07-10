import Image from "next/image";
import Link from "next/link";
import { Youtube, Instagram, MessageCircle } from "lucide-react";

const COLUMNS = [
  {
    title: "Navegação",
    links: [
      { label: "Sobre nós", href: "/covil" },
      { label: "Contactos", href: "/contactos" },
      { label: "Política de Privacidade", href: "/privacidade" },
      { label: "Termos de Utilização", href: "/termos" },
    ],
  },
  {
    title: "Ajuda",
    links: [
      { label: "Como usar o site", href: "/ajuda" },
      { label: "Glossário de troféus", href: "/glossario" },
      { label: "Perguntas Frequentes", href: "/faq" },
      { label: "Reportar erro", href: "/reportar" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-bg-raised">
      <div className="mx-auto max-w-[1440px] px-4 py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <Image src="/logo-ngplus.png" alt="NewGame+" width={32} height={32} />
              <span className="font-display text-base font-bold text-ink">
                NEWGAME<span className="text-primary">+</span>
              </span>
            </Link>
            <p className="mt-3 max-w-xs text-sm text-ink-dim">
              A plataforma de referência para quem quer conquistar todas as platinas.
            </p>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="font-display text-xs font-semibold uppercase tracking-widest text-ink-muted">
                {col.title}
              </h3>
              <ul className="mt-4 flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-ink-dim transition-colors hover:text-ink"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="font-display text-xs font-semibold uppercase tracking-widest text-ink-muted">
              Segue-nos
            </h3>
            <div className="mt-4 flex items-center gap-2.5">
              <a
                href="#"
                aria-label="YouTube"
                className="flex h-9 w-9 items-center justify-center rounded-sm border border-border text-ink-muted hover:border-primary hover:text-primary"
              >
                <Youtube width={16} height={16} />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-sm border border-border text-ink-muted hover:border-primary hover:text-primary"
              >
                <Instagram width={16} height={16} />
              </a>
              <a
                href="#"
                aria-label="Discord"
                className="flex h-9 w-9 items-center justify-center rounded-sm border border-border text-ink-muted hover:border-accent hover:text-accent"
              >
                <MessageCircle width={16} height={16} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 text-xs text-ink-dim">
          © 2026 NewGame+. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}
