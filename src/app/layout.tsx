import type { Metadata } from "next";
import { Chakra_Petch, Inter, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
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
  metadataBase: new URL("https://newgameplus.pt"),
  title: "NewGame+ | Vale a pena jogar? Vale a pena platinar?",
  description:
    "A plataforma que te ajuda a decidir onde investir o teu tempo e dinheiro. Reviews, tempos de platina, dificuldade, missables e guias completos — tudo num só lugar.",
  other: {
    "google-adsense-account": "ca-pub-3168082452712504",
  },
  openGraph: {
    type: "website",
    locale: "pt_PT",
    siteName: "NewGame+ PT",
    title: "NewGame+ | Vale a pena jogar? Vale a pena platinar?",
    description:
      "A plataforma que te ajuda a decidir onde investir o teu tempo e dinheiro. Reviews, tempos de platina, dificuldade, missables e guias completos — tudo num só lugar.",
    images: [{ url: "/logo-ngplus.png", width: 1024, height: 1024, alt: "NewGame+ PT" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "NewGame+ | Vale a pena jogar? Vale a pena platinar?",
    description:
      "A plataforma que te ajuda a decidir onde investir o teu tempo e dinheiro. Reviews, tempos de platina, dificuldade, missables e guias completos — tudo num só lugar.",
    images: ["/logo-ngplus.png"],
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "NewGame+ PT",
  url: "https://newgameplus.pt",
  logo: "https://newgameplus.pt/logo-icon.png",
  description:
    "Plataforma portuguesa de reviews, guias e roadmaps de troféus para videojogos.",
  sameAs: [
    "https://www.youtube.com/@NGPLUSPT",
    "https://www.instagram.com/anewgameplus",
    "https://www.tiktok.com/@ngmaispt",
  ],
};

// Permite que o Google mostre uma caixa de pesquisa diretamente por
// baixo do link do site nos resultados de pesquisa ("sitelinks search
// box"), em vez da pessoa ter de entrar no site primeiro para procurar.
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "NewGame+ PT",
  url: "https://newgameplus.pt",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://newgameplus.pt/jogos?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

const THEME_INIT_SCRIPT = `
(function () {
  try {
    var saved = window.localStorage.getItem("ngplus-theme");
    if (saved === "light") {
      document.documentElement.classList.add("light");
    }
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-PT" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3168082452712504"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className="font-body antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <FavoritesProvider>{children}</FavoritesProvider>
        <Analytics />
      </body>
    </html>
  );
}
