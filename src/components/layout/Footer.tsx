import Image from "next/image";
import Link from "next/link";
import { Youtube, Instagram } from "lucide-react";

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
              <Image src="/logo-icon.png" alt="NewGame+" width={32} height={32} />
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
                href="https://www.youtube.com/@NGPLUSPT"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="flex h-9 w-9 items-center justify-center rounded-sm border border-border text-ink-muted hover:border-primary hover:text-primary"
              >
                <Youtube width={16} height={16} />
              </a>
              <a
                href="https://www.instagram.com/anewgameplus"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-sm border border-border text-ink-muted hover:border-primary hover:text-primary"
              >
                <Instagram width={16} height={16} />
              </a>
              <a
                href="https://www.tiktok.com/@ngmaispt"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="flex h-9 w-9 items-center justify-center rounded-sm border border-border text-ink-muted hover:border-primary hover:text-primary"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M16.5 2h-3.2v14.1c0 1.5-1.2 2.7-2.7 2.7a2.7 2.7 0 0 1-2.7-2.7 2.7 2.7 0 0 1 2.7-2.7c.3 0 .6.05.9.14V10.3a6 6 0 0 0-.9-.07 5.9 5.9 0 0 0-5.9 5.9A5.9 5.9 0 0 0 10.6 22a5.9 5.9 0 0 0 5.9-5.9V8.4a8.1 8.1 0 0 0 4.7 1.5V6.7a4.8 4.8 0 0 1-4.7-4.7Z" />
                </svg>
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
