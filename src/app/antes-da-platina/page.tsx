import type { Metadata } from "next";
import Link from "next/link";
import { Trophy, ListOrdered, BookOpen, Video, ArrowRight } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { GameBreadcrumb } from "@/components/game/GameBreadcrumb";
import { Card } from "@/components/ui/Card";
import { rankingConfigs } from "@/data/mock/rankings-config";

export const metadata: Metadata = {
  title: "Antes da Platina | NewGame+",
  description:
    "Tudo o que precisas de saber antes de começares uma platina: dificuldade, tempo, troféus perdíveis, rankings e guias completos.",
};

const PILLARS = [
  {
    icon: Trophy,
    title: "Todos os Jogos",
    description:
      "O catálogo completo, com filtros por dificuldade, tempo para a platina, género e plataforma.",
    href: "/jogos",
  },
  {
    icon: ListOrdered,
    title: "Rankings",
    description: "Os jogos mais fáceis, mais difíceis, mais rápidos, mais longos e mais frustrantes de platinar.",
    href: "/rankings",
  },
  {
    icon: BookOpen,
    title: "Guias de Troféus",
    description: "Roadmap completo, troféus perdíveis, número de playthroughs e tudo o que precisas de saber.",
    href: "/jogos",
  },
  {
    icon: Video,
    title: "Episódios Antes da Platina",
    description: "A nossa série em vídeo — jogamos, sofremos, e contamos-te tudo antes de começares.",
    href: "/antes-da-platina/episodios",
  },
];

export default function AntesDaPlatinaPage() {
  return (
    <>
      <Header />
      <GameBreadcrumb items={[{ label: "Antes da Platina" }]} />
      <main>
        <div className="border-b border-border bg-bg-raised py-10">
          <div className="mx-auto max-w-[1440px] px-4 lg:px-8">
            <h1 className="font-display text-3xl font-bold uppercase tracking-wide text-ink">
              Antes da Platina
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-ink-muted">
              Antes de começares, sabe no que te estás a meter. Dificuldade, tempo, troféus
              perdíveis, grind, quantos playthroughs precisas — e se vale mesmo a pena.
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-[1440px] px-4 py-10 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-2">
            {PILLARS.map((pillar) => (
              <Link key={pillar.href + pillar.title} href={pillar.href}>
                <Card
                  hover
                  className="flex h-full flex-col gap-3 p-6 transition-colors hover:border-primary/60"
                >
                  <pillar.icon width={22} height={22} className="text-primary" />
                  <div>
                    <h2 className="font-display text-base font-bold uppercase tracking-wide text-ink">
                      {pillar.title}
                    </h2>
                    <p className="mt-1.5 text-sm text-ink-muted">{pillar.description}</p>
                  </div>
                  <span className="mt-auto flex items-center gap-1 text-xs font-medium text-primary">
                    Ver mais <ArrowRight width={12} height={12} />
                  </span>
                </Card>
              </Link>
            ))}
          </div>

          <h2 className="mt-12 mb-4 font-display text-lg font-bold uppercase tracking-wide text-ink">
            Rankings rápidos
          </h2>
          <div className="flex flex-wrap gap-2">
            {rankingConfigs.map((c) => (
              <Link
                key={c.slug}
                href={`/rankings/${c.slug}`}
                className="rounded-full border border-border bg-bg-surface px-4 py-2 text-sm text-ink-muted transition-colors hover:border-primary hover:text-ink"
              >
                {c.label}
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
