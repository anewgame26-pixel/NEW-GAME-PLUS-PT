import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { GameBreadcrumb } from "@/components/game/GameBreadcrumb";
import { PageHeader } from "@/components/layout/PageHeader";
import { FAQAccordion } from "@/components/about/FAQAccordion";
import { getFaqItems } from "@/lib/data/faq";

export const metadata: Metadata = {
  title: "Perguntas Frequentes | NewGame+",
  description: "Respostas às perguntas mais comuns sobre a NewGame+.",
};

export default async function FAQPage() {
  const faqItems = await getFaqItems();

  return (
    <>
      <Header />
      <GameBreadcrumb items={[{ label: "FAQ" }]} />
      <main>
        <PageHeader
          title="Perguntas Frequentes"
          description="Tudo o que precisas de saber sobre a NewGame+."
        />
        <div className="mx-auto max-w-2xl px-4 py-10 lg:px-8">
          <FAQAccordion items={faqItems} />
        </div>
      </main>
      <Footer />
    </>
  );
}
