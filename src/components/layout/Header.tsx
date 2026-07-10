"use client";

import Link from "next/link";
import Image from "next/image";
import { ReactNode, useState } from "react";
import { Search, Menu, X, Youtube, Instagram } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Antes da Platina", href: "/antes-da-platina" },
  { label: "Guias", href: "/guias" },
  { label: "Jogos", href: "/jogos" },
  { label: "Rankings", href: "/rankings" },
  { label: "Comparar", href: "/comparar" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center gap-6 px-4 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/logo-ngplus.png"
            alt="NewGame+"
            width={42}
            height={42}
            className="shrink-0"
          />
          <span className="hidden flex-col leading-none sm:flex">
            <span className="font-display text-lg font-bold tracking-wide text-ink">
              NEWGAME<span className="text-primary">+</span>
            </span>
            <span className="text-[9px] uppercase tracking-[0.2em] text-ink-dim">
              Tudo sobre platinas
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-sm px-3 py-2 text-sm font-medium text-ink-muted transition-colors hover:text-ink",
                link.href === "/" && "text-ink"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <button
            aria-label="Pesquisar"
            className="hidden h-9 w-9 items-center justify-center rounded-sm border border-border text-ink-muted transition-colors hover:border-border-light hover:text-ink sm:flex"
          >
            <Search width={16} height={16} />
          </button>
          <div className="hidden items-center gap-2 md:flex">
            <SocialIcon icon={<Youtube width={15} height={15} />} label="YouTube" />
            <SocialIcon icon={<Instagram width={15} height={15} />} label="Instagram" />
          </div>
          <button
            aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
            onClick={() => setMobileOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-sm border border-border text-ink lg:hidden"
          >
            {mobileOpen ? <X width={18} height={18} /> : <Menu width={18} height={18} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="border-t border-border bg-bg px-4 py-3 lg:hidden">
          <div className="mb-3">
            <div className="relative flex items-center">
              <Search className="absolute left-3 text-ink-dim" width={16} height={16} />
              <input
                type="text"
                placeholder="Que jogo queres platinar?"
                className="h-10 w-full rounded-sm border border-border bg-bg-surface pl-9 pr-3 text-sm text-ink outline-none focus:border-primary"
              />
            </div>
          </div>
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-sm px-3 py-2.5 text-sm font-medium text-ink-muted hover:bg-bg-surface hover:text-ink"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}

function SocialIcon({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <a
      href="#"
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-sm border border-border text-ink-muted transition-colors hover:border-border-light hover:text-ink"
    >
      {icon}
    </a>
  );
}
