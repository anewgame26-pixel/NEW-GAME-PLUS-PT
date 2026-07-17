import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { GameBreadcrumb } from "@/components/game/GameBreadcrumb";
import { PageHeader } from "@/components/layout/PageHeader";
import { GlossaryList } from "@/components/about/GlossaryList";
import { getGlossaryTerms } from "@/lib/data/glossary";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Glossário de Troféus | NewGame+",
  description: "Termos comuns do mundo da caça aos troféus, explicados.",
};

export default async function GlossarioPage() {
  const glossaryTerms = await getGlossaryTerms();

  return (
    <>
      <Header />
      <GameBreadcrumb items={[{ label: "Glossário" }]} />
      <main>
        <PageHeader
          title="Glossário de Troféus"
          description="Novo em caça aos troféus? Aqui explicamos os termos que vais encontrar nas nossas guias."
        />
        <div className="mx-auto max-w-4xl px-4 py-10 lg:px-8">
          <GlossaryList terms={glossaryTerms} />
        </div>
      </main>
      <Footer />
    </>
  );
}
