import type { Metadata } from "next";
import { Compass } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { GameBreadcrumb } from "@/components/game/GameBreadcrumb";

export const metadata: Metadata = {
  title: "Descobertas+ | NewGame+",
  description: "Jogos que talvez ainda não conheças. Indies, pequenos estúdios e mais.",
};

export default function DescobertasPage() {
  return (
    <>
      <Header />
      <GameBreadcrumb items={[{ label: "Descobertas+" }]} />
      <main className="flex min-h-[50vh] flex-col items-center justify-center px-4 py-20 text-center">
        <Compass width={48} height={48} className="mb-5 text-primary" strokeWidth={1.5} />
        <h1 className="font-display text-2xl font-bold uppercase tracking-wide text-ink">
          Descobertas+
        </h1>
        <p className="mt-2 max-w-md text-sm text-ink-muted">
          Jogos que talvez ainda não conheças. Indies, pequenos estúdios, jogos portugueses e
          tudo o que merece atenção — em breve, aqui no site.
        </p>
      </main>
      <Footer />
    </>
  );
}
