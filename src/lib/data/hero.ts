import type { DiscoveryArticle, Game, HeroSlide, HourWithArticle, RetroArticle, TopArticle } from "@/types";
import { difficultyLabel, formatPlatinumTime, grindLabel, stripHtml } from "@/lib/utils";

function gameToSlide(game: Game): HeroSlide {
  return {
    id: `game-${game.id}`,
    category: "Antes da Platina",
    title: game.title,
    subtitle: game.developer || null,
    imageUrl: game.heroImageUrl ?? game.coverUrl,
    heroFocusX: game.heroFocusX ?? null,
    href: `/guias/${game.slug}`,
    game,
  };
}

function hourWithToSlide(article: HourWithArticle): HeroSlide | null {
  const imageUrl = article.heroImageUrl ?? article.coverUrl;
  if (!imageUrl) return null;
  return {
    id: `hour-with-${article.id}`,
    category: "Uma Hora Com",
    title: article.title,
    subtitle: stripHtml(article.firstImpression) || article.platform,
    imageUrl,
    heroFocusX: null,
    href: `/uma-hora-com/${article.slug}`,
    facts: [
      ...(article.platform ? [{ label: "Plataforma", value: article.platform }] : []),
      {
        label: "Continuamos a jogar?",
        value: article.continuarAJogar === null ? "Por decidir" : article.continuarAJogar ? "Sim" : "Não",
        warn: article.continuarAJogar === false,
      },
    ],
  };
}

function retroToSlide(article: RetroArticle): HeroSlide | null {
  const imageUrl = article.heroImageUrl ?? article.coverUrl;
  if (!imageUrl) return null;
  return {
    id: `retro-${article.id}`,
    category: "Retro+",
    title: article.title,
    subtitle: stripHtml(article.veredicto) || article.platform,
    imageUrl,
    heroFocusX: null,
    href: `/retro/${article.slug}`,
    facts: [
      ...(article.platform || article.releaseYear
        ? [
            {
              label: "Plataforma",
              value:
                article.platform && article.releaseYear
                  ? `${article.platform} · ${article.releaseYear}`
                  : (article.platform ?? String(article.releaseYear)),
            },
          ]
        : []),
      {
        label: "Ainda vale a pena?",
        value: article.valeAPenaHoje === null ? "Por decidir" : article.valeAPenaHoje ? "Sim" : "Não",
        warn: article.valeAPenaHoje === false,
      },
    ],
  };
}

function discoveryToSlide(article: DiscoveryArticle): HeroSlide | null {
  const imageUrl = article.heroImageUrl ?? article.coverUrl;
  if (!imageUrl) return null;
  return {
    id: `discovery-${article.id}`,
    category: "Descobertas+",
    title: article.title,
    subtitle: stripHtml(article.veredicto) || article.platform,
    imageUrl,
    heroFocusX: null,
    href: `/descobertas/${article.slug}`,
    facts: [
      ...(article.platform || article.releaseYear
        ? [
            {
              label: "Plataforma",
              value:
                article.platform && article.releaseYear
                  ? `${article.platform} · ${article.releaseYear}`
                  : (article.platform ?? String(article.releaseYear)),
            },
          ]
        : []),
      {
        label: "Recomendamos?",
        value: article.recomendamos === null ? "Por decidir" : article.recomendamos ? "Sim" : "Não",
        warn: article.recomendamos === false,
      },
    ],
  };
}

function topToSlide(article: TopArticle): HeroSlide | null {
  const imageUrl = article.heroImageUrl ?? article.coverUrl;
  if (!imageUrl) return null;
  return {
    id: `top-${article.id}`,
    category: "Top+",
    title: article.title,
    subtitle: stripHtml(article.intro) || null,
    imageUrl,
    heroFocusX: null,
    href: `/top/${article.slug}`,
    facts: [
      { label: "Jogos na lista", value: String(article.items.length) },
      ...(article.items[0] ? [{ label: "Nº 1", value: article.items[0].label }] : []),
    ],
  };
}

/**
 * Junta tudo o que a equipa marcou como "Destacar no Hero" — jogos
 * (Antes da Platina), Uma Hora Com, Retro+ e Top+ — num único carrossel.
 * Se ninguém tiver marcado nada ainda em lado nenhum, cai de volta para
 * os jogos em destaque (o comportamento antigo), para o Hero nunca ficar
 * vazio.
 */
export function buildHeroSlides({
  featuredGames,
  hourWithArticles,
  retroArticles,
  discoveryArticles,
  topArticles,
}: {
  featuredGames: Game[];
  hourWithArticles: HourWithArticle[];
  retroArticles: RetroArticle[];
  discoveryArticles: DiscoveryArticle[];
  topArticles: TopArticle[];
}): HeroSlide[] {
  const gameSlides = featuredGames.map(gameToSlide);
  const hourWithSlides = hourWithArticles
    .filter((a) => a.isHeroFeatured)
    .map(hourWithToSlide)
    .filter((s): s is HeroSlide => Boolean(s));
  const retroSlides = retroArticles
    .filter((a) => a.isHeroFeatured)
    .map(retroToSlide)
    .filter((s): s is HeroSlide => Boolean(s));
  const discoverySlides = discoveryArticles
    .filter((a) => a.isHeroFeatured)
    .map(discoveryToSlide)
    .filter((s): s is HeroSlide => Boolean(s));
  const topSlides = topArticles
    .filter((a) => a.isHeroFeatured)
    .map(topToSlide)
    .filter((s): s is HeroSlide => Boolean(s));

  const editorPicks = [...gameSlides, ...hourWithSlides, ...retroSlides, ...discoverySlides, ...topSlides];

  return editorPicks;
}
