import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { GameBreadcrumb } from "@/components/game/GameBreadcrumb";
import { PageHeader } from "@/components/layout/PageHeader";

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
          description="Última atualização: 30 de agosto de 2026"
        />

        <div className="mx-auto max-w-3xl px-4 py-10 lg:px-8">
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
                Recolhemos: (a) dados de conta, como email e nome, quando te registas por
                email/password ou através do Google; (b) conteúdo que publicas
                voluntariamente, como comentários, pedidos à comunidade e reportes de
                erros; (c) as tuas listas de favoritos e progresso, se estiveres com
                sessão iniciada; (d) nome, email e mensagem, se usares o formulário de
                contacto ou pedires para receber a newsletter; (e) dados de utilização
                recolhidos de forma anónima e agregada através do Vercel Analytics
                (páginas visitadas, tipo de dispositivo, país de origem) — esta
                ferramenta não usa cookies nem identifica visitantes individualmente.
              </p>
            </section>

            <section>
              <h2 className="mb-2 font-display text-base font-bold text-ink">
                3. Para que usamos os teus dados
              </h2>
              <p>
                Usamos os dados para: criar e gerir a tua conta; mostrar os teus
                favoritos e comentários; responder a contactos e reportes de erro;
                moderar a comunidade; perceber, de forma agregada, que conteúdo é mais
                útil para melhorarmos o site. Não vendemos nem partilhamos os teus dados
                pessoais para fins publicitários.
              </p>
            </section>

            <section>
              <h2 className="mb-2 font-display text-base font-bold text-ink">
                4. Com quem partilhamos dados
              </h2>
              <p>
                Usamos os seguintes fornecedores para operar o site, cada um só com
                acesso ao que precisa para prestar o seu serviço:
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>
                  <span className="font-medium text-ink">Supabase</span> — base de dados
                  e autenticação de contas.
                </li>
                <li>
                  <span className="font-medium text-ink">Vercel</span> — alojamento do
                  site e estatísticas de utilização anónimas.
                </li>
                <li>
                  <span className="font-medium text-ink">Resend</span> — envio de emails
                  transacionais (confirmação de conta, recuperação de password).
                </li>
                <li>
                  <span className="font-medium text-ink">Google</span> — apenas se
                  escolheres entrar através de &quot;Entrar com Google&quot;.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="mb-2 font-display text-base font-bold text-ink">
                5. Cookies e publicidade
              </h2>
              <p>
                Usamos cookies essenciais, necessários para manteres a sessão iniciada em
                segurança. Se ativarmos publicidade no site através do Google AdSense,
                a Google e os seus parceiros de publicidade poderão usar cookies e
                identificadores semelhantes para mostrar anúncios, incluindo anúncios
                personalizados com base nos teus interesses. Se és visitante no Espaço
                Económico Europeu, Reino Unido ou Suíça, vamos pedir-te o teu
                consentimento antes de qualquer cookie de publicidade ser colocado,
                através de um aviso próprio para esse efeito. Podes alterar essa escolha
                a qualquer momento nas definições de privacidade que esse aviso
                disponibiliza. Para saber mais sobre como a Google usa dados neste
                contexto, consulta a{" "}
                <a
                  href="https://policies.google.com/technologies/partner-sites"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline"
                >
                  página da Google sobre publicidade e parceiros
                </a>
                . As estatísticas de visitas (Vercel Analytics) continuam a não usar
                cookies.
              </p>
            </section>

            <section>
              <h2 className="mb-2 font-display text-base font-bold text-ink">
                6. Os teus direitos
              </h2>
              <p>
                Nos termos do RGPD, tens direito a aceder, corrigir, apagar ou limitar o
                tratamento dos teus dados pessoais, bem como a retirar consentimento a
                qualquer momento. Podes apagar comentários e favoritos diretamente no
                teu perfil, ou contactar-nos através da página de Contactos para
                qualquer outro pedido, incluindo a eliminação total da tua conta.
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
