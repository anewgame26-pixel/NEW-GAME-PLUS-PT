import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { GameBreadcrumb } from "@/components/game/GameBreadcrumb";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";

export const metadata: Metadata = {
  title: "Termos de Utilização | NewGame+",
};

export default function TermosPage() {
  return (
    <>
      <Header />
      <GameBreadcrumb items={[{ label: "Termos de Utilização" }]} />
      <main>
        <PageHeader
          title="Termos de Utilização"
          description="Última atualização: [a definir antes de publicares o site]"
        />

        <div className="mx-auto max-w-3xl px-4 py-10 lg:px-8">
          <Card className="mb-6 border-gold/30 bg-gold/5 p-4">
            <p className="text-sm text-ink">
              ⚠️ Este texto é um modelo genérico de ponto de partida, não aconselhamento
              jurídico. Recomenda-se revisão por um advogado antes de publicares o site,
              especialmente se vieres a ter contas de utilizador, comentários públicos ou
              qualquer forma de monetização.
            </p>
          </Card>

          <div className="flex flex-col gap-6 text-sm leading-relaxed text-ink-muted">
            <section>
              <h2 className="mb-2 font-display text-base font-bold text-ink">
                1. Aceitação dos termos
              </h2>
              <p>
                Ao acederes e utilizares a NewGame+, aceitas estes Termos de Utilização.
                Se não concordares com algum ponto, pedimos que não utilizes a plataforma.
              </p>
            </section>

            <section>
              <h2 className="mb-2 font-display text-base font-bold text-ink">
                2. Natureza do conteúdo
              </h2>
              <p>
                Todo o conteúdo (reviews, notas de dificuldade, tempos de platina,
                roadmaps e guias) reflete a opinião e experiência da nossa equipa e é
                fornecido a título informativo. Não garantimos que os tempos ou
                dificuldades sejam idênticos para todos os jogadores.
              </p>
            </section>

            <section>
              <h2 className="mb-2 font-display text-base font-bold text-ink">
                3. Propriedade intelectual
              </h2>
              <p>
                Capas, nomes e marcas de jogos pertencem aos respetivos criadores e
                editoras, e são usados apenas a título ilustrativo/informativo. O texto
                original (reviews, guias, roadmaps) é propriedade da NewGame+ e não pode
                ser reproduzido sem autorização.
              </p>
            </section>

            <section>
              <h2 className="mb-2 font-display text-base font-bold text-ink">
                4. Conduta da comunidade
              </h2>
              <p>
                Ao comentares ou interagires na plataforma e no Discord, comprometes-te
                a manter uma conduta respeitosa. Reservamo-nos o direito de remover
                conteúdo ou suspender acessos em caso de comportamento abusivo, spam ou
                conteúdo ilegal.
              </p>
            </section>

            <section>
              <h2 className="mb-2 font-display text-base font-bold text-ink">
                5. Limitação de responsabilidade
              </h2>
              <p>
                A NewGame+ é fornecida &quot;tal como está&quot;. Não nos
                responsabilizamos por decisões de compra tomadas com base no nosso
                conteúdo, nem por eventuais imprecisões, ainda que nos esforcemos por
                manter tudo atualizado e correto.
              </p>
            </section>

            <section>
              <h2 className="mb-2 font-display text-base font-bold text-ink">
                6. Alterações aos termos
              </h2>
              <p>
                Podemos atualizar estes termos periodicamente. A utilização continuada
                da plataforma após alterações implica a aceitação dos novos termos.
              </p>
            </section>

            <section>
              <h2 className="mb-2 font-display text-base font-bold text-ink">7. Contacto</h2>
              <p>
                Para qualquer questão sobre estes termos, usa a nossa página de
                Contactos.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
