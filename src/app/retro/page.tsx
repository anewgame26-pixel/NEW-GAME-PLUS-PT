import type { Metadata } from "next";
import { History } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { GameBreadcrumb } from "@/components/game/GameBreadcrumb";

export const metadata: Metadata = {
  title: "Retro+ | NewGame+",
  description: "Alguns jogos merecem ser jogados outra vez. Este ainda vale a pena hoje?",
};

export default function RetroPage() {
  return (
    <>
      <Header />
      <GameBreadcrumb items={[{ label: "Retro+" }]} />
      <main className="flex min-h-[50vh] flex-col items-center justify-center px-4 py-20 text-center">
        <History width={48} height={48} className="mb-5 text-primary" strokeWidth={1.5} />
        <h1 className="font-display text-2xl font-bold uppercase tracking-wide text-ink">
          Retro+
        </h1>
        <p className="mt-2 max-w-md text-sm text-ink-muted">
          Alguns jogos merecem ser jogados outra vez. Clássicos e nem tão clássicos que ainda
          valem a pena hoje — em breve, aqui no site.
        </p>
      </main>
      <Footer />
    </>
  );
}
