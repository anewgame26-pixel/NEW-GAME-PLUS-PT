import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageHeader } from "@/components/layout/PageHeader";

/**
 * Mostrado automaticamente pelo Next.js enquanto a lista de jogos está a
 * ser carregada do Supabase — evita que a pessoa fique a olhar para um
 * ecrã parado antes do conteúdo aparecer todo de uma vez.
 */
export default function Loading() {
  return (
    <>
      <Header />
      <main>
        <PageHeader
          title="Todos os Jogos"
          description="Pesquisa e filtra por género, plataforma, dificuldade e tempo para a platina."
        />
        <div className="mx-auto max-w-[1440px] px-4 py-8 lg:px-8">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] rounded-sm border border-border bg-bg-surface" />
                <div className="mt-2 h-3.5 w-4/5 rounded bg-bg-surface" />
                <div className="mt-1.5 h-3 w-1/2 rounded bg-bg-surface" />
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
