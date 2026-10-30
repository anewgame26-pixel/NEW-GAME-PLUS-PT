import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { GameBreadcrumb } from "@/components/game/GameBreadcrumb";
import { PageHeader } from "@/components/layout/PageHeader";

export const metadata: Metadata = {
  title: "Escreve connosco | NewGame+",
  description:
    "Queres escrever sobre jogos na NewGame+? Vê que artigos procuramos, as regras e como enviar a tua proposta.",
};

const FORMATS = [
  { name: "Vale a pena?", text: "Impressões de um jogo atual, depois de algumas horas, com um veredito de compra." },
  { name: "Review", text: "A análise completa de um jogo que jogaste até ao fim, com nota final." },
  { name: "Retro+", text: "Revisitar um jogo antigo (ou jogá-lo pela primeira vez) e ver se ainda vale a pena." },
  { name: "Descobertas+", text: "Jogos indie e de estúdios pequenos que merecem mais atenção." },
  { name: "Top+", text: "Rankings e listas com argumentos, não só nomes." },
];

export default function EscreverPage() {
  return (
    <>
      <Header />
      <GameBreadcrumb items={[{ label: "Escreve connosco" }]} />
      <main>
        <PageHeader
          title="Escreve connosco"
          description="Gostas de escrever sobre jogos? Procuramos vozes novas em português."
        />

        <div className="mx-auto max-w-3xl px-4 py-10 lg:px-8">
          <div className="flex flex-col gap-8 text-sm leading-relaxed text-ink-muted">
            <section>
              <h2 className="mb-2 font-display text-base font-bold text-ink">
                O que procuramos
              </h2>
              <p>
                Artigos de quem joga a sério e tem uma opinião própria, sempre a
                responder à nossa pergunta de base: vale a pena o teu tempo e o teu
                dinheiro? Estes são os formatos em que podes escrever:
              </p>
              <ul className="mt-3 flex flex-col gap-2">
                {FORMATS.map((f) => (
                  <li key={f.name}>
                    <span className="font-semibold text-ink">{f.name}</span> — {f.text}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="mb-2 font-display text-base font-bold text-ink">
                As regras
              </h2>
              <ul className="flex list-disc flex-col gap-2 pl-5">
                <li>
                  O texto tem de ser original e escrito por ti, de um jogo que jogaste
                  mesmo.
                </li>
                <li>
                  Se recebeste o jogo, uma chave ou qualquer benefício de uma editora ou
                  estúdio, diz-nos. Indicamo-lo no artigo, tal como na nossa{" "}
                  <Link href="/politica-editorial" className="text-primary underline">
                    Política Editorial
                  </Link>
                  .
                </li>
                <li>
                  A opinião e a nota são tuas. Nenhuma editora ou anunciante influencia o
                  que escreves.
                </li>
                <li>
                  Não publicamos textos copiados, spam nem conteúdo ofensivo.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="mb-2 font-display text-base font-bold text-ink">
                Como funciona
              </h2>
              <ol className="flex list-decimal flex-col gap-2 pl-5">
                <li>Contactas-nos com o jogo e o formato que queres escrever.</li>
                <li>Enviamos-te as indicações e combinamos um prazo.</li>
                <li>
                  Envias o texto e a equipa revê. Podemos pedir alterações ou corrigir
                  erros e estilo.
                </li>
                <li>
                  Publicamos com o teu nome e uma página de autor com a tua foto e bio.
                </li>
              </ol>
            </section>

            <section>
              <h2 className="mb-2 font-display text-base font-bold text-ink">
                Direitos e condições
              </h2>
              <p>
                O texto continua a ser teu e manténs sempre o crédito de autor.
                Autorizas-nos a publicá-lo no site e a partilhá-lo nas nossas redes
                sociais, e podes pedir a remoção quando quiseres. Reservamo-nos o
                direito de não publicar um texto. Por agora, as colaborações não são
                remuneradas.
              </p>
            </section>

            <section className="rounded-sm border border-border bg-bg-surface p-5">
              <h2 className="mb-2 font-display text-base font-bold text-ink">
                Queres propor um artigo?
              </h2>
              <p>
                Diz-nos quem és, o que queres escrever e, se já tiveres, junta um texto
                teu que possamos ler.
              </p>
              <Link
                href="/contactos"
                className="mt-4 inline-flex rounded-sm bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-glow hover:bg-primary-light"
              >
                Contactar a equipa
              </Link>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
