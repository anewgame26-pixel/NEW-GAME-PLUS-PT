import type { Metadata } from "next";
import { Search, SlidersHorizontal, BookOpen, Trophy, Heart } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { GameBreadcrumb } from "@/components/game/GameBreadcrumb";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";

export const metadata: Metadata = {
  title: "Como Usar o Site | NewGame+",
  description: "Um guia rápido para tirares o máximo partido da NewGame+.",
};

const STEPS = [
  {
    icon: Search,
    title: "Pesquisa o jogo que queres analisar",
    description:
      "Usa a barra de pesquisa na homepage ou vai a 'Jogos' para veres o catálogo completo.",
  },
  {
    icon: SlidersHorizontal,
    title: "Filtra pelo que importa para ti",
    description:
      "Em 'Jogos', filtra por género, plataforma, tempo disponível e dificuldade — ou usa os Filtros Rápidos na homepage.",
  },
  {
    icon: BookOpen,
    title: "Abre a página do jogo",
    description:
      "Aí encontras tudo: se vale a pena comprar, se vale a pena platinar, dificuldade explicada, missables, troféus difíceis, roadmap e timeline da platina.",
  },
  {
    icon: Trophy,
    title: "Consulta os Rankings",
    description:
      "Queres a platina mais fácil ou mais rápida do catálogo? Os Rankings ordenam todos os jogos pelo critério que escolheres.",
  },
  {
    icon: Heart,
    title: "Guarda os teus favoritos e comenta",
    description:
      "Em cada página de jogo podes guardar nos favoritos e deixar a tua opinião à comunidade.",
  },
];

export default function AjudaPage() {
  return (
    <>
      <Header />
      <GameBreadcrumb items={[{ label: "Como usar o site" }]} />
      <main>
        <PageHeader
          title="Como Usar o Site"
          description="Um guia rápido para tirares o máximo partido da NewGame+."
        />
        <div className="mx-auto max-w-2xl px-4 py-10 lg:px-8">
          <div className="flex flex-col gap-4">
            {STEPS.map((step, i) => (
              <Card key={step.title} className="flex gap-4 p-5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-primary/10 font-display text-sm font-bold text-primary">
                  {i + 1}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <step.icon width={16} height={16} className="text-ink-dim" />
                    <p className="font-display text-sm font-bold text-ink">{step.title}</p>
                  </div>
                  <p className="mt-1 text-sm text-ink-muted">{step.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
