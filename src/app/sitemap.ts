import type { MetadataRoute } from "next";
import { getAllGameSlugs } from "@/lib/data/games";
import { getAllHourWithSlugs } from "@/lib/data/hour-with";
import { getAllRetroSlugs } from "@/lib/data/retro";
import { getAllDiscoverySlugs } from "@/lib/data/discovery";
import { getAllTopSlugs } from "@/lib/data/top";
import { rankingConfigs } from "@/data/mock/rankings-config";

const SITE_URL = "https://newgameplus.pt";

/**
 * Gera o mapa do site (sitemap.xml) automaticamente. O Google e outros
 * motores de busca usam isto para saberem que páginas existem no site e
 * quando foram atualizadas pela última vez — ajuda o site a aparecer
 * mais depressa e de forma mais completa nas pesquisas.
 *
 * As páginas estáticas (Home, Jogos, Glossário, etc.) estão escritas à
 * mão aqui em baixo. As páginas de cada jogo e de cada ranking são
 * geradas automaticamente a partir da base de dados — sempre que
 * publicares um jogo novo, ele aparece aqui sozinho, sem precisares de
 * mexer neste ficheiro.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const gameSlugs = await getAllGameSlugs();
  const hourWithSlugs = await getAllHourWithSlugs();
  const retroSlugs = await getAllRetroSlugs();
  const discoverySlugs = await getAllDiscoverySlugs();
  const topSlugs = await getAllTopSlugs();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/jogos`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/rankings`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/glossario`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/antes-da-platina`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/antes-da-platina/episodios`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE_URL}/uma-hora-com`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE_URL}/retro`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE_URL}/descobertas`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE_URL}/comunidade`, changeFrequency: "daily", priority: 0.6 },
    { url: `${SITE_URL}/covil`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${SITE_URL}/top`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE_URL}/votar`, changeFrequency: "weekly", priority: 0.5 },
    { url: `${SITE_URL}/faq`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${SITE_URL}/ajuda`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${SITE_URL}/contactos`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/termos`, changeFrequency: "yearly", priority: 0.1 },
    { url: `${SITE_URL}/privacidade`, changeFrequency: "yearly", priority: 0.1 },
  ];

  const gamePages: MetadataRoute.Sitemap = gameSlugs.map((slug) => ({
    url: `${SITE_URL}/guias/${slug}`,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const rankingPages: MetadataRoute.Sitemap = rankingConfigs.map((c) => ({
    url: `${SITE_URL}/rankings/${c.slug}`,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const hourWithPages: MetadataRoute.Sitemap = hourWithSlugs.map((slug) => ({
    url: `${SITE_URL}/uma-hora-com/${slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const retroPages: MetadataRoute.Sitemap = retroSlugs.map((slug) => ({
    url: `${SITE_URL}/retro/${slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const discoveryPages: MetadataRoute.Sitemap = discoverySlugs.map((slug) => ({
    url: `${SITE_URL}/descobertas/${slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const topPages: MetadataRoute.Sitemap = topSlugs.map((slug) => ({
    url: `${SITE_URL}/top/${slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [
    ...staticPages,
    ...gamePages,
    ...rankingPages,
    ...hourWithPages,
    ...retroPages,
    ...discoveryPages,
    ...topPages,
  ];
}
