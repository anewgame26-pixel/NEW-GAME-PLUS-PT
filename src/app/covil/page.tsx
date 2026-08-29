import type { Metadata } from "next";
import { Compass, Target, ShieldCheck, MessageCircle, Star } from "lucide-react";
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
  title: "Sobre Nós | NewGame+",
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

// Escala de referência para as notas de 1-10. É um ponto de partida —
// ajusta o texto de cada faixa ao critério real da equipa.
const SCORE_SCALE = [
  { range: "9 – 10", label: "Imprescindível", tone: "text-gold" },
  { range: "7 – 8.9", label: "Vale muito a pena", tone: "text-emerald-400" },
  { range: "5 – 6.9", label: "Correto, com ressalvas", tone: "text-accent-light" },
  { range: "1 – 4.9", label: "Não recomendamos", tone: "text-primary-light" },
];

export default async function CovilPage() {
  const teamMembers = await getTeamMembers();
  const platformStats = await getPlatformStats();

  return (
    <>
      <Header />
      <GameBreadcrumb items={[{ label: "Sobre Nós" }]} />
      <main>
        <section className="relative overflow-hidden border-b border-border">
          <div className="absolute inset-0 bg-radial-fade" aria-hidden />
          <div className="relative mx-auto max-w-[1440px] px-4 py-14 text-center lg:px-8">
            <h1 className="font-display text-4xl font-bold uppercase tracking-wide text-ink sm:text-5xl">
              Sobre Nós
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

        <section className="border-b border-border py-12">
          <div className="mx-auto max-w-[1440px] px-4 lg:px-8">
            <div className="mb-6 flex flex-col items-center gap-2 text-center">
              <Star width={22} height={22} className="text-gold" />
              <h2 className="font-display text-xl font-bold uppercase tracking-wide text-ink">
                Como atribuímos as notas
              </h2>
              <p className="max-w-xl text-sm text-ink-muted">
                A nota de 1 a 10 não é uma média automática de números — é o resumo honesto de quem
                jogou até ao fim. Olhamos para o que o jogo se propõe a ser (jogabilidade, história,
                técnica, e o tempo/esforço que pede) e perguntamos: valeu a pena? A escala serve de
                referência para leres as notas sempre da mesma forma:
              </p>
            </div>

            <div className="mx-auto grid max-w-3xl gap-3 sm:grid-cols-2">
              {SCORE_SCALE.map((tier) => (
                <Card key={tier.range} className="flex items-center gap-4 p-4">
                  <span className={`font-display text-2xl font-bold ${tier.tone}`}>{tier.range}</span>
                  <span className="text-sm font-medium text-ink">{tier.label}</span>
                </Card>
              ))}
            </div>

            <p className="mx-auto mt-6 max-w-xl text-center text-xs text-ink-dim">
              À parte da nota, cada review tem sempre prós, contras e um veredicto em texto — a nota
              é só o atalho para quem tem pressa.
            </p>
          </div>
        </section>

        <section className="py-12">
          <div className="mx-auto max-w-[1440px] px-4 lg:px-8">
            <div className="mb-6 text-center">
              <h2 className="font-display text-xl font-bold uppercase tracking-wide text-ink">
                A Equipa
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
              Se és de uma editora ou agência de imprensa, visita a nossa{" "}
              <a href="/imprensa" className="text-primary underline">
                página de Imprensa
              </a>
              .
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
