import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: "#0A0C11",
          raised: "#12151C",
          surface: "#171B24",
          surface2: "#1E2430",
        },
        border: {
          DEFAULT: "#242B37",
          light: "#323B4A",
        },
        primary: {
          DEFAULT: "#E31B33",
          dim: "#A81327",
          light: "#FF4D63",
        },
        accent: {
          DEFAULT: "#3E7BFA",
          dim: "#2C5BC7",
          light: "#7CA6FF",
        },
        gold: {
          DEFAULT: "#F2B705",
          dim: "#C99A08",
        },
        ink: {
          DEFAULT: "#F3F5F7",
          muted: "#96A0AD",
          dim: "#5C6673",
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
