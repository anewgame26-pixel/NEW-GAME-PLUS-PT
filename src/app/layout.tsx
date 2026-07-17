import type { Metadata } from "next";
import { Chakra_Petch, Inter, JetBrains_Mono } from "next/font/google";
import { FavoritesProvider } from "@/components/providers/FavoritesProvider";
import "./globals.css";

const display = Chakra_Petch({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "NewGame+ | Vale a pena jogar? Vale a pena platinar?",
  description:
    "A plataforma que te ajuda a decidir onde investir o teu tempo e dinheiro. Reviews, tempos de platina, dificuldade, missables e guias completos — tudo num só lugar.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-PT" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body className="font-body antialiased">
        <FavoritesProvider>{children}</FavoritesProvider>
      </body>
    </html>
  );
}
