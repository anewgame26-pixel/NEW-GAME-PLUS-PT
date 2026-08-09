import type { Metadata } from "next";
import { Clock } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { GameBreadcrumb } from "@/components/game/GameBreadcrumb";

export const metadata: Metadata = {
  title: "Uma Hora Com... | NewGame+",
  description: "60 minutos. Uma primeira impressão. Este jogo merece o teu tempo?",
};

export default function UmaHoraComPage() {
  return (
    <>
      <Header />
      <GameBreadcrumb items={[{ label: "Uma Hora Com..." }]} />
      <main className="flex min-h-[50vh] flex-col items-center justify-center px-4 py-20 text-center">
        <Clock width={48} height={48} className="mb-5 text-primary" strokeWidth={1.5} />
        <h1 className="font-display text-2xl font-bold uppercase tracking-wide text-ink">
          Uma Hora Com...
        </h1>
        <p className="mt-2 max-w-md text-sm text-ink-muted">
          60 minutos. Uma primeira impressão. Jogamos um jogo durante uma hora e contamos-te se
          merece o teu tempo — em breve, aqui no site.
        </p>
      </main>
      <Footer />
    </>
  );
}
