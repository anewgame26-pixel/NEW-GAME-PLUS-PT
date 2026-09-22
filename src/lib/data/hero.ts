import type {
  DiscoveryArticle,
  Game,
  HeroSlide,
  HourWithArticle,
  RadarArticle,
  RetroArticle,
  ReviewArticle,
  TopArticle,
} from "@/types";
import { difficultyLabel, formatPlatinumTime, grindLabel, stripHtml } from "@/lib/utils";

function gameToSlide(game: Game): HeroSlide {
  return {
    id: `game-${game.id}`,
    category: "Antes da Platina",
    title: game.title,
    subtitle: game.developer || null,
    imageUrl: game.heroImageUrl ?? game.coverUrl,
    heroFocusX: game.heroFocusX ?? null,
    heroFocusY: game.heroFocusY ?? null,
    heroZoom: game.heroZoom ?? null,
    href: `/guias/${game.slug}`,
    game,
  };
}

function hourWithToSlide(article: HourWithArticle): HeroSlide | null {
  const imageUrl = article.heroImageUrl ?? article.coverUrl;
  if (!imageUrl) return null;
  return {
    id: `hour-with-${article.id}`,
    category: "Vale a pena?",
    title: article.title,
    subtitle: stripHtml(article.firstImpression) || article.platform,
    imageUrl,
    heroFocusX: article.heroFocusX,
    heroFocusY: article.heroFocusY,
    heroZoom: article.heroZoom,
    href: `/vale-a-pena/${article.slug}`,
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

function reviewToSlide(article: ReviewArticle): HeroSlide | null {
  const imageUrl = article.heroImageUrl ?? article.coverUrl;
  if (!imageUrl) return null;
  return {
    id: `review-${article.id}`,
    category: "Review",
    title: article.title,
    subtitle: stripHtml(article.intro) || article.platform,
    imageUrl,
    heroFocusX: article.heroFocusX,
    heroFocusY: article.heroFocusY,
    heroZoom: article.heroZoom,
    href: `/review/${article.slug}`,
    facts: [
      ...(article.platform ? [{ label: "Plataforma", value: article.platform }] : []),
      ...(article.nota !== null ? [{ label: "Nota", value: `${article.nota}/10` }] : []),
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
    heroFocusX: article.heroFocusX,
    heroFocusY: article.heroFocusY,
    heroZoom: article.heroZoom,
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
    heroFocusX: article.heroFocusX,
    heroFocusY: article.heroFocusY,
    heroZoom: article.heroZoom,
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
    heroFocusX: article.heroFocusX,
    heroFocusY: article.heroFocusY,
    heroZoom: article.heroZoom,
    href: `/top/${article.slug}`,
    facts: [
      { label: "Jogos na lista", value: String(article.items.length) },
      ...(article.items[0] ? [{ label: "Nº 1", value: article.items[0].label }] : []),
    ],
  };
}

function radarToSlide(article: RadarArticle): HeroSlide | null {
  const imageUrl = article.heroImageUrl ?? article.coverUrl;
  if (!imageUrl) return null;
  return {
    id: `radar-${article.id}`,
    category: "Radar+",
    title: article.title,
    subtitle: stripHtml(article.body) || article.platform,
    imageUrl,
    heroFocusX: article.heroFocusX,
    heroFocusY: article.heroFocusY,
    heroZoom: article.heroZoom,
    href: `/radar/${article.slug}`,
    facts: [
      ...(article.platform ? [{ label: "Plataforma", value: article.platform }] : []),
      ...(article.tags[0] ? [{ label: "Categoria", value: article.tags[0] }] : []),
    ],
  };
}

/**
 * Junta tudo o que a equipa marcou como "Destacar no Hero" — jogos
 * (Antes da Platina), Vale a pena?, Retro+ e Top+ — num único carrossel.
 *
 * Só cai de volta para os primeiros jogos do catálogo (o comportamento
 * antigo) se NADA, em lado nenhum, estiver marcado como destaque — ou
 * seja, se o carrossel combinado ficaria mesmo vazio. Antes isto era
 * decidido só a olhar para os jogos, por isso um jogo antigo (ex: o
 * "AI LIMIT") continuava a aparecer mesmo depois de o desmarcares,
 * sempre que havia destaques marcados só através de outros formatos
 * (Vale a Pena, Retro+, etc.) e não através de jogos.
 */
export function buildHeroSlides({
  featuredGames,
  allGames,
  reviewArticles,
  hourWithArticles,
  retroArticles,
  discoveryArticles,
  topArticles,
  radarArticles,
}: {
  featuredGames: Game[];
  allGames: Game[];
  reviewArticles: ReviewArticle[];
  hourWithArticles: HourWithArticle[];
  retroArticles: RetroArticle[];
  discoveryArticles: DiscoveryArticle[];
  topArticles: TopArticle[];
  radarArticles: RadarArticle[];
}): HeroSlide[] {
  const gameSlides = featuredGames.map(gameToSlide);
  const reviewSlides = reviewArticles
    .filter((a) => a.isHeroFeatured)
    .sort((a, b) => (a.heroOrder ?? Infinity) - (b.heroOrder ?? Infinity))
    .map(reviewToSlide)
    .filter((s): s is HeroSlide => Boolean(s));
  const hourWithSlides = hourWithArticles
    .filter((a) => a.isHeroFeatured)
    .sort((a, b) => (a.heroOrder ?? Infinity) - (b.heroOrder ?? Infinity))
    .map(hourWithToSlide)
    .filter((s): s is HeroSlide => Boolean(s));
  const retroSlides = retroArticles
    .filter((a) => a.isHeroFeatured)
    .sort((a, b) => (a.heroOrder ?? Infinity) - (b.heroOrder ?? Infinity))
    .map(retroToSlide)
    .filter((s): s is HeroSlide => Boolean(s));
  const discoverySlides = discoveryArticles
    .filter((a) => a.isHeroFeatured)
    .sort((a, b) => (a.heroOrder ?? Infinity) - (b.heroOrder ?? Infinity))
    .map(discoveryToSlide)
    .filter((s): s is HeroSlide => Boolean(s));
  const topSlides = topArticles
    .filter((a) => a.isHeroFeatured)
    .sort((a, b) => (a.heroOrder ?? Infinity) - (b.heroOrder ?? Infinity))
    .map(topToSlide)
    .filter((s): s is HeroSlide => Boolean(s));
  const radarSlides = radarArticles
    .filter((a) => a.isHeroFeatured)
    .sort((a, b) => (a.heroOrder ?? Infinity) - (b.heroOrder ?? Infinity))
    .map(radarToSlide)
    .filter((s): s is HeroSlide => Boolean(s));

  const editorPicks = [
    ...gameSlides,
    ...reviewSlides,
    ...hourWithSlides,
    ...retroSlides,
    ...discoverySlides,
    ...topSlides,
    ...radarSlides,
  ];

  // Só usa este plano B se não houver mesmo nada marcado como destaque
  // em lado nenhum (jogos, Vale a Pena, Retro+, Descobertas+, Top+, Radar+).
  if (editorPicks.length === 0) {
    return allGames.slice(0, 3).map(gameToSlide);
  }

  return editorPicks;
}
