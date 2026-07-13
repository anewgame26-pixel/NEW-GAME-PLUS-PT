import { getIgdbAccessToken } from "@/lib/igdb/token";
import type { Genre, Platform } from "@/types";

export interface IgdbSearchResult {
  igdbId: number;
  title: string;
  coverUrl: string | null;
  releaseYear: number | null;
  releaseDate: string | null;
  developer: string | null;
  platforms: Platform[];
  genres: Genre[];
}

// A IGDB tem MUITAS variações de plataforma (ex: "PlayStation 5",
// "Xbox Series X|S", "PC (Microsoft Windows)"). Traduzimos só as que
// interessam ao site; o que não bater com nada aqui fica simplesmente
// de fora (o editor pode sempre acrescentar à mão no formulário).
const PLATFORM_MAP: Record<string, Platform> = {
  "PlayStation 5": "ps5",
  "PlayStation 4": "ps4",
  "Xbox Series X|S": "xbox",
  "Xbox One": "xbox",
  "Nintendo Switch": "switch",
  "Nintendo Switch 2": "switch",
  "PC (Microsoft Windows)": "pc",
  Mac: "pc",
  Linux: "pc",
};

// O mesmo princípio para géneros — a lista de géneros da IGDB é genérica
// (não pensada para caça aos troféus), por isso esta tradução é só uma
// aproximação. Vale sempre a pena o editor confirmar/ajustar depois de
// importar.
const GENRE_MAP: Record<string, Genre> = {
  "Role-playing (RPG)": "rpg",
  Adventure: "aventura",
  "Hack and slash/Beat 'em up": "acao",
  Shooter: "acao",
  Platform: "plataformas",
  "Survival horror": "terror",
  Horror: "terror",
};

function mapPlatforms(igdbPlatforms: { name: string }[] | undefined): Platform[] {
  if (!igdbPlatforms) return [];
  const mapped = igdbPlatforms.map((p) => PLATFORM_MAP[p.name]).filter(Boolean) as Platform[];
  return Array.from(new Set(mapped));
}

function mapGenres(igdbGenres: { name: string }[] | undefined): Genre[] {
  if (!igdbGenres) return [];
  const mapped = igdbGenres.map((g) => GENRE_MAP[g.name]).filter(Boolean) as Genre[];
  return Array.from(new Set(mapped));
}

interface IgdbRawGame {
  id: number;
  name: string;
  cover?: { image_id: string };
  first_release_date?: number;
  platforms?: { name: string }[];
  genres?: { name: string }[];
  involved_companies?: { company: { name: string }; developer: boolean }[];
}

/** Pesquisa jogos na IGDB pelo nome, devolve já traduzido para o nosso formato. */
export async function searchIgdbGames(query: string): Promise<IgdbSearchResult[]> {
  const token = await getIgdbAccessToken();
  const clientId = process.env.IGDB_CLIENT_ID!;

  const body = `
    search "${query.replace(/"/g, '\\"')}";
    fields name, cover.image_id, first_release_date, platforms.name, genres.name,
           involved_companies.company.name, involved_companies.developer;
    limit 10;
  `;

  const response = await fetch("https://api.igdb.com/v4/games", {
    method: "POST",
    headers: {
      "Client-ID": clientId,
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    body,
  });

  if (!response.ok) {
    throw new Error("Pedido à IGDB falhou.");
  }

  const games = (await response.json()) as IgdbRawGame[];

  return games.map((g) => {
    const developer = g.involved_companies?.find((c) => c.developer)?.company.name ?? null;
    const releaseDate = g.first_release_date
      ? new Date(g.first_release_date * 1000).toISOString().slice(0, 10)
      : null;

    return {
      igdbId: g.id,
      title: g.name,
      coverUrl: g.cover
        ? `https://images.igdb.com/igdb/image/upload/t_cover_big/${g.cover.image_id}.jpg`
        : null,
      releaseYear: releaseDate ? Number(releaseDate.slice(0, 4)) : null,
      releaseDate,
      developer,
      platforms: mapPlatforms(g.platforms),
      genres: mapGenres(g.genres),
    };
  });
}
