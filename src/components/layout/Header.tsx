"use client";

import Link from "next/link";
import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, X, Youtube, Instagram, User } from "lucide-react";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { cn } from "@/lib/utils";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { HeaderSearch } from "@/components/layout/HeaderSearch";
import { SearchInput } from "@/components/ui/SearchInput";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Antes da Platina", href: "/antes-da-platina" },
  { label: "Uma Hora Com...", href: "/uma-hora-com" },
  { label: "Retro+", href: "/retro" },
  { label: "Descobertas+", href: "/descobertas" },
  { label: "Top+", href: "/top" },
  { label: "Sobre Nós", href: "/covil" },
];

export function Header() {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileQuery, setMobileQuery] = useState("");
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
          <HeaderSearch />
          <ThemeToggle className="hidden h-9 w-9 items-center justify-center rounded-sm border border-border text-ink-muted transition-colors hover:border-border-light hover:text-ink lg:flex" />
          <div className="hidden items-center gap-2 lg:flex">
            <SocialIcon
              icon={<Youtube width={15} height={15} />}
              label="YouTube"
              href="https://www.youtube.com/@NGPLUSPT"
            />
            <SocialIcon
              icon={<Instagram width={15} height={15} />}
              label="Instagram"
              href="https://www.instagram.com/anewgameplus"
            />
            <SocialIcon icon={<TikTokIcon />} label="TikTok" href="https://www.tiktok.com/@ngmaispt" />
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
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const trimmed = mobileQuery.trim();
              if (!trimmed) return;
              router.push(`/jogos?q=${encodeURIComponent(trimmed)}`);
              setMobileOpen(false);
              setMobileQuery("");
            }}
            className="mb-3"
          >
            <SearchInput
              placeholder="Que jogo queres platinar?"
              value={mobileQuery}
              onChange={(e) => setMobileQuery(e.target.value)}
            />
          </form>
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
          <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
            <span className="text-xs font-medium uppercase tracking-wide text-ink-dim">Modo claro</span>
            <ThemeToggle />
          </div>
        </nav>
      )}
    </header>
  );
}

function SocialIcon({ icon, label, href }: { icon: ReactNode; label: string; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-sm border border-border text-ink-muted transition-colors hover:border-border-light hover:text-ink"
    >
      {icon}
    </a>
  );
}

// A lucide-react não tem ícone de TikTok, por isso desenhamos um simples
// à mão, do mesmo tamanho e estilo dos outros (YouTube/Instagram).
function TikTokIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M16.5 2h-3.2v14.1c0 1.5-1.2 2.7-2.7 2.7a2.7 2.7 0 0 1-2.7-2.7 2.7 2.7 0 0 1 2.7-2.7c.3 0 .6.05.9.14V10.3a6 6 0 0 0-.9-.07 5.9 5.9 0 0 0-5.9 5.9A5.9 5.9 0 0 0 10.6 22a5.9 5.9 0 0 0 5.9-5.9V8.4a8.1 8.1 0 0 0 4.7 1.5V6.7a4.8 4.8 0 0 1-4.7-4.7Z" />
    </svg>
  );
}
