import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { VoteButton } from "@/components/game/VoteButton";
import { PlatformIcons } from "@/components/game/PlatformIcons";
import { getVotingCandidates } from "@/lib/data/voting";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Vota na Próxima Platina | NewGame+",
  description: "A equipa escolheu os candidatos — vota no jogo que queres ver analisado a seguir.",
};

export default async function VotarPage() {
  const candidates = await getVotingCandidates();

  return (
    <>
      <Header />
      <main>
        <PageHeader
          title="Vota na Próxima Platina"
          description="A equipa escolheu estes candidatos — vota no jogo que mais queres ver analisado a seguir."
        />
        <div className="mx-auto max-w-3xl px-4 py-10 lg:px-8">
          {candidates.length === 0 ? (
            <Card className="p-6">
              <p className="text-sm text-ink-muted">
                Ainda não há candidatos em votação. Volta mais tarde!
              </p>
            </Card>
          ) : (
            <div className="flex flex-col divide-y divide-border rounded-sm border border-border bg-bg-surface">
              {candidates.map((candidate, i) => (
                <div key={candidate.id} className="flex items-center gap-4 p-4">
                  <span className="w-5 shrink-0 text-center font-display text-sm font-bold text-ink-dim">
                    {i + 1}
                  </span>

                  <Link
                    href={`/guias/${candidate.game.slug}`}
                    className="relative h-16 w-12 shrink-0 overflow-hidden rounded-sm border border-border"
                  >
                    <Image
                      src={candidate.game.coverUrl}
                      alt={`Capa de ${candidate.game.title}`}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </Link>

                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/guias/${candidate.game.slug}`}
                      className="block truncate font-display text-sm font-bold text-ink hover:text-primary-light"
                    >
                      {candidate.game.title}
                    </Link>
                    <div className="mt-1">
                      <PlatformIcons platforms={candidate.game.platforms} />
                    </div>
                  </div>

                  <VoteButton candidateId={candidate.id} initialVotesCount={candidate.votesCount} />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
