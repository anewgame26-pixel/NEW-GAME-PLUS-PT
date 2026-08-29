import type { Metadata } from "next";
import Link from "next/link";
import { Mail, Download, Newspaper, Users, ShieldCheck, BadgeCheck } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { GameBreadcrumb } from "@/components/game/GameBreadcrumb";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { getPlatformStats } from "@/lib/data/stats";
import { getTeamMembers } from "@/lib/data/team";

export const metadata: Metadata = {
  title: "Imprensa | NewGame+",
  description:
    "Informação para editoras, estúdios e agências de relações públicas — quem somos, o que cobrimos e como entrar em contacto.",
};

export const dynamic = "force-dynamic";

export default async function ImprensaPage() {
  const [stats, team] = await Promise.all([getPlatformStats(), getTeamMembers()]);

  return (
    <>
      <Header />
      <GameBreadcrumb items={[{ label: "Imprensa" }]} />
      <main>
        <PageHeader
          title="Imprensa"
          description="Informação para editoras, estúdios e agências de relações públicas."
        />

        <div className="mx-auto max-w-3xl px-4 py-10 lg:px-8">
          <section className="mb-10">
            <h2 className="mb-3 font-display text-lg font-bold uppercase tracking-wide text-ink">
              Quem somos
            </h2>
            <p className="text-sm leading-relaxed text-ink-muted">
              A NewGame+ é uma publicação portuguesa dedicada a análises aprofundadas,
              caça de troféus/conquistas e cobertura de jogos, antigos e recentes. A
              nossa equipa escreve reviews completas (Antes da Platina), primeiras
              impressões (Uma Hora Com...), revisitas a clássicos (Retro+) e
              recomendações de jogos menos conhecidos (Descobertas+).
            </p>
          </section>

          <section className="mb-10">
            <h2 className="mb-3 font-display text-lg font-bold uppercase tracking-wide text-ink">
              O que cobrimos
            </h2>
            <ul className="flex flex-col gap-2 text-sm leading-relaxed text-ink-muted">
              <li>
                <strong className="text-ink">Antes da Platina</strong> — reviews
                completas com nota, prós/contras, dificuldade de platina/conquista 100%
                e roadmap capítulo a capítulo.
              </li>
              <li>
                <strong className="text-ink">Uma Hora Com...</strong> — primeiras
                impressões, publicadas rapidamente após o lançamento ou acesso
                antecipado.
              </li>
              <li>
                <strong className="text-ink">Retro+</strong> — se um clássico ainda
                vale a pena ser jogado hoje.
              </li>
              <li>
                <strong className="text-ink">Descobertas+</strong> — destaque a jogos
                fora do radar habitual.
              </li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="mb-3 font-display text-lg font-bold uppercase tracking-wide text-ink">
              Em números
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {stats.slice(0, 6).map((stat) => (
                <Card key={stat.label} className="p-4 text-center">
                  <p className="font-display text-2xl font-bold text-primary">{stat.value}</p>
                  <p className="mt-1 text-xs text-ink-dim">{stat.label}</p>
                </Card>
              ))}
            </div>
            <p className="mt-3 text-xs text-ink-dim">
              Números atualizados automaticamente a partir do conteúdo publicado no
              site.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-bold uppercase tracking-wide text-ink">
              <BadgeCheck width={18} height={18} className="text-primary" />
              Reconhecidos como imprensa por
            </h2>
            <div className="flex flex-wrap gap-3">
              <span className="rounded-sm border border-border bg-bg-surface px-4 py-2 text-sm font-semibold text-ink">
                Capcom
              </span>
              <span className="rounded-sm border border-border bg-bg-surface px-4 py-2 text-sm font-semibold text-ink">
                Sega
              </span>
            </div>
            <p className="mt-3 text-xs text-ink-dim">
              Acreditados nos respetivos portais de imprensa, com acesso a material de
              divulgação e códigos de review.
            </p>
          </section>

          {team.length > 0 && (
            <section className="mb-10">
              <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-bold uppercase tracking-wide text-ink">
                <Users width={18} height={18} className="text-primary" />A equipa
              </h2>
              <p className="text-sm leading-relaxed text-ink-muted">
                Todas as reviews são assinadas por um membro identificado da equipa —
                conhece quem escreve na nossa{" "}
                <Link href="/covil" className="text-primary underline">
                  página Sobre Nós
                </Link>
                .
              </p>
            </section>
          )}

          <section className="mb-10">
            <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-bold uppercase tracking-wide text-ink">
              <ShieldCheck width={18} height={18} className="text-primary" />
              Independência editorial
            </h2>
            <p className="text-sm leading-relaxed text-ink-muted">
              Aceitamos códigos de review e acesso antecipado, mas isso nunca
              influencia a nota final de uma análise. Detalhes completos na nossa{" "}
              <Link href="/politica-editorial" className="text-primary underline">
                Política Editorial
              </Link>
              .
            </p>
          </section>

          <section className="mb-10">
            <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-bold uppercase tracking-wide text-ink">
              <Download width={18} height={18} className="text-primary" />
              Kit de imprensa
            </h2>
            <p className="mb-3 text-sm leading-relaxed text-ink-muted">
              Logótipos em alta resolução para uso em comunicados ou parcerias:
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="/logo-ngplus.png"
                download
                className="flex items-center gap-2 rounded-sm border border-border px-3 py-2 text-xs text-ink-muted hover:border-primary hover:text-primary"
              >
                <Download width={13} height={13} />
                Logótipo (PNG)
              </a>
              <a
                href="/logo-icon.png"
                download
                className="flex items-center gap-2 rounded-sm border border-border px-3 py-2 text-xs text-ink-muted hover:border-primary hover:text-primary"
              >
                <Download width={13} height={13} />
                Ícone (PNG)
              </a>
            </div>
          </section>

          <section className="rounded-sm border border-primary/30 bg-primary/5 p-6">
            <h2 className="mb-2 flex items-center gap-2 font-display text-lg font-bold uppercase tracking-wide text-ink">
              <Newspaper width={18} height={18} className="text-primary" />
              Contacto de imprensa
            </h2>
            <p className="mb-4 text-sm leading-relaxed text-ink-muted">
              Para pedidos de código de review, acesso antecipado, entrevistas ou
              parcerias, contacta-nos diretamente — respondemos normalmente em 2 a 3
              dias úteis.
            </p>
            <Button href="/contactos?assunto=Imprensa" className="inline-flex">
              <Mail width={15} height={15} />
              Falar com a equipa
            </Button>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
