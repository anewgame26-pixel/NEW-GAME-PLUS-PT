import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { GameBreadcrumb } from "@/components/game/GameBreadcrumb";
import { PageHeader } from "@/components/layout/PageHeader";
import { ContactForm } from "@/components/about/ContactForm";

export const metadata: Metadata = {
  title: "Contactos | NewGame+",
  description: "Fala com a equipa da NewGame+ — sugestões, parcerias ou dúvidas.",
};

interface ContactosPageProps {
  searchParams: Promise<{ assunto?: string }>;
}

export default async function ContactosPage({ searchParams }: ContactosPageProps) {
  const { assunto } = await searchParams;

  return (
    <>
      <Header />
      <GameBreadcrumb items={[{ label: "Contactos" }]} />
      <main>
        <PageHeader
          title="Contactos"
          description="Sugestões de jogos, parcerias ou apenas uma dúvida — fala connosco."
        />
        <div className="mx-auto max-w-2xl px-4 py-10 lg:px-8">
          <ContactForm defaultSubject={assunto} />
        </div>
      </main>
      <Footer />
    </>
  );
}
