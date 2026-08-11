import type { Metadata } from "next";
import { ListOrdered } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { GameBreadcrumb } from "@/components/game/GameBreadcrumb";

export const metadata: Metadata = {
  title: "Top+ | NewGame+",
  description:
    "Listas, rankings e curiosidades sobre videojogos — brevemente na NewGame+.",
};

export default function TopPage() {
  return (
    <>
      <Header />
      <GameBreadcrumb items={[{ label: "Top+" }]} />
      <main>
        <section className="relative overflow-hidden border-b border-border">
          <div className="absolute inset-0 bg-radial-fade" aria-hidden />
          <div className="relative mx-auto flex max-w-[1440px] flex-col items-center gap-4 px-4 py-20 text-center lg:px-8">
            <ListOrdered width={28} height={28} className="text-primary" />
            <h1 className="font-display text-4xl font-bold uppercase tracking-wide text-ink sm:text-5xl">
              Top+
            </h1>
            <p className="max-w-lg text-sm text-ink-muted">
              Listas em formato NG+: "5 melhores Platinas", "jogos que já não podes jogar",
              "Platinas que vão destruir a tua sanidade" — e por aí fora. Estamos a preparar o
              primeiro. Volta em breve.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
