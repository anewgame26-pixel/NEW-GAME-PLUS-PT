"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";

/**
 * Mostrada sempre que uma página do site tem um erro inesperado a
 * meio da execução (não confundir com o not-found.tsx, que é para
 * links que não existem). O Next.js usa este ficheiro automaticamente.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Fica no registo do browser (F12 → Console) para conseguirmos
    // diagnosticar, sem mostrar detalhes técnicos à pessoa no ecrã.
    console.error("Erro inesperado numa página:", error);
  }, [error]);

  return (
    <>
      <Header />
      <main className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-20 text-center">
        <AlertTriangle width={56} height={56} className="mb-5 text-primary" strokeWidth={1.5} />
        <h1 className="font-display text-xl font-bold uppercase tracking-wide text-ink">
          Algo correu mal
        </h1>
        <p className="mt-2 max-w-md text-sm text-ink-muted">
          Aconteceu um erro inesperado nesta página. Podes tentar outra vez, ou voltar à
          página inicial. Já ficámos a saber que isto aconteceu.
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <Button onClick={() => reset()} size="md">
            Tentar novamente
          </Button>
          <Button href="/" variant="outline" size="md">
            Voltar à página inicial
          </Button>
        </div>
      </main>
      <Footer />
    </>
  );
}
