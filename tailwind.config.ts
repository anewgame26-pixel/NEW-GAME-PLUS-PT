import type { Config } from "tailwindcss";

// Cada cor é definida como "rgb(var(--x) / <alpha-value>)" em vez de um hex
// fixo. Isto permite que classes como bg-primary/10 continuem a funcionar
// (o Tailwind injeta a opacidade), e ao mesmo tempo os valores por trás de
// cada variável podem mudar consoante o tema (claro/escuro) — ver
// globals.css, onde --color-bg, --color-ink, etc. têm um valor para :root
// (escuro, default) e outro para :root.light.
function withOpacity(variable: string) {
  return `rgb(var(${variable}) / <alpha-value>)`;
}

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: withOpacity("--color-bg"),
          raised: withOpacity("--color-bg-raised"),
          surface: withOpacity("--color-bg-surface"),
          surface2: withOpacity("--color-bg-surface2"),
        },
        border: {
          DEFAULT: withOpacity("--color-border"),
          light: withOpacity("--color-border-light"),
        },
        primary: {
          DEFAULT: withOpacity("--color-primary"),
          dim: withOpacity("--color-primary-dim"),
          light: withOpacity("--color-primary-light"),
        },
        accent: {
          DEFAULT: withOpacity("--color-accent"),
          dim: withOpacity("--color-accent-dim"),
          light: withOpacity("--color-accent-light"),
        },
        gold: {
          DEFAULT: withOpacity("--color-gold"),
          dim: withOpacity("--color-gold-dim"),
        },
        ink: {
          DEFAULT: withOpacity("--color-ink"),
          muted: withOpacity("--color-ink-muted"),
          dim: withOpacity("--color-ink-dim"),
          soft: withOpacity("--color-ink-soft"),
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      backgroundImage: {
        "radial-fade":
          "radial-gradient(circle at 50% 0%, rgba(62,123,250,0.12), transparent 60%)",
        "noise-line":
          "linear-gradient(180deg, rgba(255,255,255,0.03), transparent)",
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(227,27,51,0.4), 0 0 24px rgba(227,27,51,0.25)",
        "glow-blue": "0 0 0 1px rgba(62,123,250,0.4), 0 0 24px rgba(62,123,250,0.25)",
      },
    },
  },
  plugins: [],
};

export default config;

