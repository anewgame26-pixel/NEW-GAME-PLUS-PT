"use client";

import Link from "next/link";
import { ReactNode, useEffect, useState } from "react";
import { Search, Menu, X, Youtube, Instagram, User } from "lucide-react";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { cn } from "@/lib/utils";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Antes da Platina", href: "/antes-da-platina" },
  { label: "Jogos", href: "/jogos" },
  { label: "Rankings", href: "/rankings" },
  { label: "O Covil", href: "/covil" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  // null = ainda não sabemos (primeira renderização); undefined nunca
  // acontece — ou há utilizador, ou sabemos que não há.
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const supabase = createBrowserSupabaseClient();

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setAuthChecked(true);
    });

    // Mantém o link atualizado sem recarregar a página, ex.: depois de
    // entrar em /entrar ou sair em /perfil.
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.subscription.unsubscribe();
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center px-4 lg:px-8">
        <div className="hidden flex-1 lg:block" aria-hidden />

        <nav className="hidden items-center gap-9 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-semibold tracking-[0.14em] text-ink-muted transition-colors hover:text-ink",
                link.href === "/" && "text-ink"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-1 items-center justify-end gap-3">
          <button
            aria-label="Pesquisar"
            className="hidden h-9 w-9 items-center justify-center rounded-sm border border-border text-ink-muted transition-colors hover:border-border-light hover:text-ink lg:flex"
          >
            <Search width={16} height={16} />
          </button>
          <div className="hidden items-center gap-2 lg:flex">
            <SocialIcon icon={<Youtube width={15} height={15} />} label="YouTube" />
            <SocialIcon icon={<Instagram width={15} height={15} />} label="Instagram" />
          </div>
          {authChecked && (
            <Link
              href={user ? "/perfil" : "/entrar"}
              className="hidden items-center gap-1.5 rounded-sm border border-border px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-ink-muted transition-colors hover:border-border-light hover:text-ink lg:flex"
            >
              <User width={14} height={14} />
              {user ? "Perfil" : "Entrar"}
            </Link>
          )}
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
            {authChecked && (
              <li>
                <Link
                  href={user ? "/perfil" : "/entrar"}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-sm px-3 py-2.5 text-sm font-medium text-ink-muted hover:bg-bg-surface hover:text-ink"
                >
                  {user ? "O Meu Perfil" : "Entrar / Registar"}
                </Link>
              </li>
            )}
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
