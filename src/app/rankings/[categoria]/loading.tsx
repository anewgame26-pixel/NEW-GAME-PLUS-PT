import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageHeader } from "@/components/layout/PageHeader";

/**
 * Mostrado automaticamente pelo Next.js enquanto uma lista de ranking
 * está a ser calculada a partir dos dados dos jogos.
 */
export default function Loading() {
  return (
    <>
      <Header />
      <main>
        <PageHeader title="Rankings" />
        <div className="mx-auto max-w-3xl px-4 py-8 lg:px-8">
          <div className="flex flex-col gap-3">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="flex animate-pulse items-center gap-4 rounded-sm border border-border bg-bg-surface p-4"
              >
                <div className="h-6 w-6 shrink-0 rounded bg-bg-surface2" />
                <div className="h-14 w-11 shrink-0 rounded bg-bg-surface2" />
                <div className="flex-1">
                  <div className="h-3.5 w-1/2 rounded bg-bg-surface2" />
                  <div className="mt-2 h-3 w-1/3 rounded bg-bg-surface2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
