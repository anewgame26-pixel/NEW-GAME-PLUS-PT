import Link from "next/link";
import { Ghost } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";

/**
 * Página mostrada sempre que alguém visita um link que não existe no
 * site (link partido, "guias/nome-errado", morada escrita à mão, etc.).
 * O Next.js usa este ficheiro automaticamente — não precisa de ser
 * ligado a nada.
 */
export default function NotFound() {
  return (
    <>
      <Header />
      <main className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-20 text-center">
        <Ghost width={56} height={56} className="mb-5 text-primary" strokeWidth={1.5} />
        <p className="font-display text-6xl font-bold uppercase tracking-wide text-ink">404</p>
        <h1 className="mt-3 font-display text-xl font-bold uppercase tracking-wide text-ink">
          Esta página não existe
        </h1>
        <p className="mt-2 max-w-md text-sm text-ink-muted">
          Ou já foi removida, ou o link está errado. Nós também sofremos com isto — mas ao
          contrário de uma platina difícil, isto resolve-se com um clique.
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <Button href="/" size="md">
            Voltar à página inicial
          </Button>
          <Button href="/jogos" variant="outline" size="md">
            Ver todos os jogos
          </Button>
        </div>
        <Link href="/reportar" className="mt-6 text-xs text-ink-dim hover:text-ink">
          Encontraste um link partido? Avisa-nos.
        </Link>
      </main>
      <Footer />
    </>
  );
}
