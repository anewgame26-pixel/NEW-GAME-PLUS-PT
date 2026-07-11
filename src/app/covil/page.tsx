import type { Metadata } from "next";
import Image from "next/image";
import { MessageCircle } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { GameBreadcrumb } from "@/components/game/GameBreadcrumb";
import { StatsBar } from "@/components/home/StatsBar";
import { TeamGrid } from "@/components/about/TeamGrid";
import { Button } from "@/components/ui/Button";
import { platformStats } from "@/data/mock/homepage";
import { getTeamMembers } from "@/lib/data/team";

export const metadata: Metadata = {
  title: "O Covil | NewGame+",
  description:
    "Quem somos, porque existe a NewGame+ e quem está por detrás de cada review, roadmap e platina sofrida.",
};

export default async function CovilPage() {
  const teamMembers = await getTeamMembers();

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
            <div className="mx-auto mt-8 max-w-4xl overflow-hidden rounded-sm border border-border">
              <Image
                src="/equipa-covil.jpg"
                alt="A equipa da NewGame+ reunida no Covil"
                width={1536}
                height={1024}
                className="h-auto w-full"
                priority
              />
            </div>
            <p className="mx-auto mt-8 max-w-xl text-balance text-ink-muted">
              Este é o sítio onde os Caçadores de Platina da NewGame+ se juntam para
              decidir, testar e sofrer antes de ti — para que a tua próxima platina
              valha mesmo a pena.
            </p>
          </div>
        </section>

        <section className="border-b border-border py-10">
          <div className="mx-auto max-w-[1440px] px-4 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-display text-xl font-bold uppercase tracking-wide text-ink">
                Porque existe a NewGame+
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-ink-muted">
                A maioria dos sites de jogos faz reviews. Outros mostram troféus.
                Outros ainda dizem-te quanto tempo demora um jogo. A NewGame+ nasceu
                para juntar tudo isso num só lugar e responder a duas perguntas que,
                sinceramente, ninguém respondia bem: vale a pena comprar este jogo? E
                vale a pena investir o teu tempo a platiná-lo? Somos jogadores a
                escrever para jogadores — sem filtros, sem patrocínios a fingir de
                reviews, só a experiência real de quem já sofreu (e gostou) cada
                platina daqui.
              </p>
            </div>
          </div>
        </section>

        <StatsBar stats={platformStats} />

        <section className="py-10">
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

        <section className="border-t border-border py-10">
          <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-4 px-4 text-center lg:px-8">
            <MessageCircle width={28} height={28} className="text-accent" />
            <h2 className="font-display text-xl font-bold uppercase tracking-wide text-ink">
              Junta-te ao Covil
            </h2>
            <p className="max-w-md text-sm text-ink-muted">
              Entra no Discord para partilhar dicas, encontrar parceiros para
              troféus online e discutir qual é mesmo a platina mais sofrida.
            </p>
            <Button
              variant="secondary"
              className="border-accent/40 text-accent hover:bg-accent/10"
            >
              Entrar no Discord
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
