import type { MetadataRoute } from "next";

const SITE_URL = "https://newgameplus.pt";

/**
 * robots.txt — diz aos motores de busca (Google, Bing, etc.) que páginas
 * podem visitar e indexar, e onde encontrar o sitemap. As páginas de
 * administração, perfil e autenticação ficam de fora — não fazem
 * sentido nas pesquisas, e a área de admin nem devia ser encontrável.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/perfil", "/entrar", "/registo", "/auth", "/recuperar-password", "/redefinir-password"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
