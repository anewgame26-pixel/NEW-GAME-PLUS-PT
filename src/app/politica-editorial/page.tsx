import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { GameBreadcrumb } from "@/components/game/GameBreadcrumb";
import { PageHeader } from "@/components/layout/PageHeader";

export const metadata: Metadata = {
  title: "Política Editorial | NewGame+",
  description:
    "Como avaliamos os jogos, a nossa política sobre códigos de review e a independência da equipa editorial.",
};

export default function PoliticaEditorialPage() {
  return (
    <>
      <Header />
      <GameBreadcrumb items={[{ label: "Política Editorial" }]} />
      <main>
        <PageHeader
          title="Política Editorial"
          description="Última atualização: 27 de agosto de 2026"
        />

        <div className="mx-auto max-w-3xl px-4 py-10 lg:px-8">
          <div className="flex flex-col gap-6 text-sm leading-relaxed text-ink-muted">
            <section>
              <h2 className="mb-2 font-display text-base font-bold text-ink">
                1. Independência editorial
              </h2>
              <p>
                As opiniões, notas e recomendações publicadas na NewGame+ refletem
                exclusivamente a experiência e o critério de quem escreve. Nenhuma
                editora, estúdio, agência de relações públicas ou anunciante tem
                influência sobre o conteúdo, a nota final ou a decisão de publicar (ou
                não) uma análise.
              </p>
            </section>

            <section>
              <h2 className="mb-2 font-display text-base font-bold text-ink">
                2. Códigos de review e acesso antecipado
              </h2>
              <p>
                Aceitamos códigos de review, acesso antecipado e material de imprensa
                fornecido por editoras e estúdios. Isto nunca é condição para publicar
                uma análise nem influencia a nota atribuída — um jogo recebido
                gratuitamente é avaliado exatamente com o mesmo critério de um jogo
                comprado pela equipa. Quando relevante, indicamos na análise que o
                jogo foi fornecido para revisão.
              </p>
            </section>

            <section>
              <h2 className="mb-2 font-display text-base font-bold text-ink">
                3. Como avaliamos (Antes da Platina)
              </h2>
              <p>
                Cada análise &quot;Antes da Platina&quot; inclui uma nota geral, prós e contras
                explícitos, uma explicação da dificuldade de completar o jogo a 100%
                (troféus/conquistas) e, sempre que aplicável, um roadmap capítulo a
                capítulo. Jogamos até à conclusão (ou até um ponto que consideramos
                representativo) antes de publicar a nota final.
              </p>
            </section>

            <section>
              <h2 className="mb-2 font-display text-base font-bold text-ink">
                4. Prazos de publicação
              </h2>
              <p>
                Para jogos com data de lançamento definida, procuramos publicar as
                primeiras impressões (&quot;Uma Hora Com...&quot;) o mais próximo possível do
                lançamento. Análises completas (&quot;Antes da Platina&quot;) podem demorar mais
                tempo, dependendo da duração do jogo e da dificuldade de completar
                todos os troféus/conquistas — preferimos rigor a velocidade.
              </p>
            </section>

            <section>
              <h2 className="mb-2 font-display text-base font-bold text-ink">
                5. Correções
              </h2>
              <p>
                Se identificarmos um erro factual numa análise já publicada,
                corrigimo-lo assim que possível. Alterações relevantes à nota ou ao
                veredicto final são sinalizadas no próprio artigo.
              </p>
            </section>

            <section>
              <h2 className="mb-2 font-display text-base font-bold text-ink">
                6. Publicidade
              </h2>
              <p>
                Podemos exibir publicidade (incluindo Google AdSense) para sustentar o
                funcionamento do site. A publicidade é sempre claramente distinta do
                conteúdo editorial e não influencia as análises. Mais detalhes na{" "}
                <a href="/privacidade" className="text-primary underline">
                  Política de Privacidade
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="mb-2 font-display text-base font-bold text-ink">
                7. Contacto
              </h2>
              <p>
                Para questões sobre esta política, pedidos de correção, ou para
                imprensa, visita a nossa página de{" "}
                <a href="/imprensa" className="text-primary underline">
                  Imprensa
                </a>{" "}
                ou usa a página de{" "}
                <a href="/contactos" className="text-primary underline">
                  Contactos
                </a>
                .
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
