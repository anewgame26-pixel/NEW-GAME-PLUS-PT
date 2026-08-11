import type { Metadata } from "next";
import { Compass, Target, ShieldCheck, MessageCircle } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { GameBreadcrumb } from "@/components/game/GameBreadcrumb";
import { StatsBar } from "@/components/home/StatsBar";
import { TeamGrid } from "@/components/about/TeamGrid";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { getTeamMembers } from "@/lib/data/team";
import { getPlatformStats } from "@/lib/data/stats";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "O Covil | NewGame+",
  description:
    "Quem somos, porque existe a NewGame+ e quem está por detrás de cada review, roadmap e platina sofrida.",
};

const PILLARS = [
  {
    icon: Compass,
    title: "Como nasceu",
    description:
      "Começou com uma pergunta simples que ninguém respondia bem: vale a pena o meu tempo? Perguntas do género \"quanto demora isto?\", \"há troféus perdíveis?\", \"vale mesmo o dinheiro?\" andavam espalhadas por fóruns e vídeos de 40 minutos. Decidimos juntar tudo num sítio só.",
  },
  {
    icon: Target,
    title: "O que queremos fazer",
    description:
      "Não somos mais um site de notícias de jogos. Somos o sítio a que voltas antes de decidir: vale a pena jogar, vale a pena platinar, vale a pena hoje, ou nem sabias que existia. Quatro perguntas, quatro pilares.",
  },
  {
    icon: ShieldCheck,
    title: "A nossa filosofia",
    description:
      "Sem patrocínios a fingir de reviews. Sem fingir que uma hora de jogo é uma análise completa quando não é. Cada nota, cada troféu perdível, cada \"vale a pena\" vem de quem jogou e sofreu até ao fim.",
  },
];

export default async function CovilPage() {
  const teamMembers = await getTeamMembers();
  const platformStats = await getPlatformStats();

  return (
    <>
      <Header />
      <GameBreadcrumb items={[{ label: "O Covil" }]} />
      <main>
        <section className="relative overflow-hidden border-b border-border">
          <div className="absolute inset-0 bg-radial-fade" aria-hidden />
          <div className="relative mx-auto max-w-[1440px] px-4 py-14 text-center lg:px-8">
            <h1 className="font-display text-4xl font-bold uppercase tracking-wide text-ink sm:text-5xl">
              O Covil
            </h1>
            <p className="mx-auto mt-4 max-w-xl font-display text-lg font-bold uppercase tracking-wide text-primary">
              Nós sofremos. <span className="text-ink">Tu escolhes melhor.</span>
            </p>
            <p className="mx-auto mt-6 max-w-xl text-balance text-sm text-ink-muted">
              A NewGame+ é uma plataforma portuguesa de reviews, guias e roadmaps de
              troféus. Escrita por jogadores, para jogadores — sem filtros.
            </p>
          </div>
        </section>

        <section className="border-b border-border py-12">
          <div className="mx-auto max-w-[1440px] px-4 lg:px-8">
            <div className="grid gap-4 sm:grid-cols-3">
              {PILLARS.map((pillar) => (
                <Card key={pillar.title} className="flex flex-col gap-3 p-6">
                  <pillar.icon width={22} height={22} className="text-primary" />
                  <h2 className="font-display text-base font-bold uppercase tracking-wide text-ink">
                    {pillar.title}
                  </h2>
                  <p className="text-sm leading-relaxed text-ink-muted">{pillar.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <StatsBar stats={platformStats} />

        <section className="py-12">
          <div className="mx-auto max-w-[1440px] px-4 lg:px-8">
            <div className="mb-6 text-center">
              <h2 className="font-display text-xl font-bold uppercase tracking-wide text-ink">
                Os Caçadores de Platina
              </h2>
              <p className="mt-1 text-sm text-ink-muted">
                A equipa por detrás de cada review, roadmap e vídeo Antes da Platina.
              </p>
            </div>
            <TeamGrid members={teamMembers} />
          </div>
        </section>

        <section className="border-t border-border py-12">
          <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-4 px-4 text-center lg:px-8">
            <MessageCircle width={28} height={28} className="text-accent" />
            <h2 className="font-display text-xl font-bold uppercase tracking-wide text-ink">
              Fala connosco
            </h2>
            <p className="max-w-md text-sm text-ink-muted">
              Sugestões de jogos, parcerias, correções, ou só para dizeres que também
              sofreste com aquela platina — a página de contactos está sempre aberta.
            </p>
            <Button
              href="/contactos"
              variant="secondary"
              className="border-accent/40 text-accent hover:bg-accent/10"
            >
              Ir para Contactos
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
