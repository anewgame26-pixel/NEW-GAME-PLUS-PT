"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

const STORAGE_KEY = "ngplus-theme";

function applyTheme(theme: "light" | "dark") {
  document.documentElement.classList.toggle("light", theme === "light");
  window.localStorage.setItem(STORAGE_KEY, theme);
}

/**
 * Botão que troca entre o modo escuro (o visual original do site) e um
 * modo claro alternativo. A escolha fica guardada no browser da pessoa,
 * por isso mantém-se entre visitas. O default, para quem nunca escolheu
 * nada, continua a ser o modo escuro.
 */
export function ThemeToggle({ className }: { className?: string }) {
  // Começa como null até sabermos o tema real (evita mostrar o ícone
  // errado por um instante entre o render do servidor e o cliente).
  const [theme, setTheme] = useState<"light" | "dark" | null>(null);

  useEffect(() => {
    const isLight = document.documentElement.classList.contains("light");
    setTheme(isLight ? "light" : "dark");
  }, []);

  const toggle = () => {
    const next = theme === "light" ? "dark" : "light";
    applyTheme(next);
    setTheme(next);
  };

  return (
    <button
      type="button"
      aria-label={theme === "light" ? "Ativar modo escuro" : "Ativar modo claro"}
      onClick={toggle}
      className={
        className ??
        "flex h-9 w-9 items-center justify-center rounded-sm border border-border text-ink-muted transition-colors hover:border-border-light hover:text-ink"
      }
    >
      {theme === "light" ? <Moon width={15} height={15} /> : <Sun width={15} height={15} />}
    </button>
  );
}
