import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

/**
 * Mostrado automaticamente pelo Next.js enquanto os dados de uma análise
 * (jogo + review + roadmap) estão a ser carregados do Supabase.
 */
export default function Loading() {
  return (
    <>
      <Header />
      <main>
        <div className="animate-pulse">
          {/* Imitação da imagem larga do topo da página do jogo */}
          <div className="h-[280px] w-full bg-bg-surface sm:h-[340px]" />

          <div className="mx-auto max-w-[1100px] px-4 py-8 lg:px-8">
            <div className="h-8 w-2/3 rounded bg-bg-surface" />
            <div className="mt-3 h-4 w-1/3 rounded bg-bg-surface" />

            <div className="mt-8 flex flex-col gap-3">
              <div className="h-3.5 w-full rounded bg-bg-surface" />
              <div className="h-3.5 w-full rounded bg-bg-surface" />
              <div className="h-3.5 w-5/6 rounded bg-bg-surface" />
              <div className="h-3.5 w-full rounded bg-bg-surface" />
              <div className="h-3.5 w-3/4 rounded bg-bg-surface" />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
