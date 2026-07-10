import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { GameBreadcrumb } from "@/components/game/GameBreadcrumb";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";

export const metadata: Metadata = {
  title: "Política de Privacidade | NewGame+",
};

export default function PrivacidadePage() {
  return (
    <>
      <Header />
      <GameBreadcrumb items={[{ label: "Política de Privacidade" }]} />
      <main>
        <PageHeader
          title="Política de Privacidade"
          description="Última atualização: [a definir antes de publicares o site]"
        />

        <div className="mx-auto max-w-3xl px-4 py-10 lg:px-8">
          <Card className="mb-6 border-gold/30 bg-gold/5 p-4">
            <p className="text-sm text-ink">
              ⚠️ Este texto é um modelo genérico de ponto de partida, não aconselhamento
              jurídico. Antes de publicares o site, recomenda-se que um advogado ou
              especialista em proteção de dados reveja este documento e o adapte à tua
              situação real (que dados recolhes, que ferramentas/analytics usas, onde
              estão alojados os servidores, etc.).
            </p>
          </Card>

          <div className="flex flex-col gap-6 text-sm leading-relaxed text-ink-muted">
            <section>
              <h2 className="mb-2 font-display text-base font-bold text-ink">1. Quem somos</h2>
              <p>
                A NewGame+ (&quot;nós&quot;, &quot;a plataforma&quot;) é uma plataforma
                portuguesa de reviews, guias e roadmaps de troféus para videojogos.
                Esta política explica que informação recolhemos, para que fins, e quais
                são os teus direitos enquanto utilizador.
              </p>
            </section>

            <section>
              <h2 className="mb-2 font-display text-base font-bold text-ink">
                2. Que dados recolhemos
              </h2>
              <p>
                Podemos recolher: (a) dados que forneces voluntariamente, como nome e
                email ao subscreveres a newsletter, contactares-nos ou comentares; (b)
                dados de utilização recolhidos automaticamente, como páginas visitadas,
                tipo de dispositivo e origem do tráfego, tipicamente através de
                ferramentas de analítica; (c) cookies e tecnologias semelhantes,
                detalhadas na secção 5.
              </p>
            </section>

            <section>
              <h2 className="mb-2 font-display text-base font-bold text-ink">
                3. Para que usamos os teus dados
              </h2>
              <p>
                Usamos os dados para: operar e melhorar a plataforma; enviar a
                newsletter a quem subscreve; responder a contactos e reportes de erro;
                perceber que conteúdo é mais útil para a comunidade. Não vendemos os
                teus dados pessoais a terceiros.
              </p>
            </section>

            <section>
              <h2 className="mb-2 font-display text-base font-bold text-ink">
                4. Partilha de dados
              </h2>
              <p>
                Podemos partilhar dados com fornecedores de serviços que nos ajudam a
                operar a plataforma (ex: alojamento, envio de newsletter, analítica),
                sempre limitado ao necessário para prestarem esse serviço.
              </p>
            </section>

            <section>
              <h2 className="mb-2 font-display text-base font-bold text-ink">
                5. Cookies
              </h2>
              <p>
                Podemos usar cookies essenciais ao funcionamento do site e cookies
                opcionais de analítica. Podes gerir as tuas preferências de cookies nas
                definições do teu navegador.
              </p>
            </section>

            <section>
              <h2 className="mb-2 font-display text-base font-bold text-ink">
                6. Os teus direitos
              </h2>
              <p>
                Nos termos do RGPD, tens direito a aceder, corrigir, apagar ou limitar o
                tratamento dos teus dados pessoais, bem como a retirar consentimento a
                qualquer momento. Para exercer estes direitos, contacta-nos através da
                página de Contactos.
              </p>
            </section>

            <section>
              <h2 className="mb-2 font-display text-base font-bold text-ink">
                7. Alterações a esta política
              </h2>
              <p>
                Podemos atualizar esta política periodicamente. A data da última
                atualização estará sempre indicada no topo desta página.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
