"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, Wand2 } from "lucide-react";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import { genreLabel, platformLabel } from "@/lib/utils";
import { StringListEditor } from "@/components/admin/StringListEditor";
import { ObjectListEditor } from "@/components/admin/ObjectListEditor";
import { IgdbImportBox, type IgdbImportResult } from "@/components/admin/IgdbImportBox";
import type {
  Genre,
  GrindLevel,
  MissableItem,
  HardestTrophy,
  Platform,
  RatingBreakdownItem,
  TimelineStage,
} from "@/types";

const PLATFORM_OPTIONS: Platform[] = ["ps5", "ps4", "xbox", "switch", "pc"];
const GENRE_OPTIONS: Genre[] = [
  "acao",
  "rpg",
  "terror",
  "soulslike",
  "aventura",
  "coop",
  "plataformas",
  "mundo-aberto",
];
const GRIND_OPTIONS: GrindLevel[] = ["baixo", "medio", "alto"];

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const defaultGameForm = {
  title: "",
  slug: "",
  coverUrl: "",
  heroImageUrl: "",
  platforms: [] as Platform[],
  genres: [] as Genre[],
  releaseYear: new Date().getFullYear(),
  releaseDate: "",
  developer: "",
  difficulty: 5,
  platinumTimeMin: 10,
  platinumTimeMax: 20,
  trophyBreakdown: { bronze: 0, prata: 0, ouro: 0, platina: 1 },
  hasMissables: false,
  hasOnlineTrophies: false,
  grindLevel: "baixo" as GrindLevel,
  worthBuying: 3,
  worthPlatinum: 3,
  guideRequired: false,
  synopsis: "",
  similarGameIds: [] as string[],
  isFeatured: false,
  featuredOrder: null as number | null,
  igdbId: null as number | null,
};

const defaultDetailForm = {
  minPlaythroughs: 1,
  difficultyExplanation: "",
  review: { intro: "", whatToExpect: "", pros: [] as string[], cons: [] as string[], verdict: "" },
  timeline: [
    { stage: "inicio", label: "Início", description: "" },
    { stage: "meio", label: "Meio", description: "" },
    { stage: "final", label: "Final", description: "" },
    { stage: "cleanup", label: "Cleanup", description: "" },
  ] as TimelineStage[],
  missables: [] as MissableItem[],
  hardestTrophies: [] as HardestTrophy[],
  prepTips: [] as string[],
  videoId: "",
  overallScore: 5,
  ratingBreakdown: [] as RatingBreakdownItem[],
  roadmapSummary: [] as string[],
  screenshotUrls: [] as string[],
};

interface GameOption {
  id: string;
  title: string;
}

interface GameEditorFormProps {
  gameId?: string;
}

export function GameEditorForm({ gameId }: GameEditorFormProps) {
  const supabase = createBrowserSupabaseClient();
  const router = useRouter();

  const [tab, setTab] = useState<"geral" | "analise">("geral");
  const [loading, setLoading] = useState(Boolean(gameId));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [game, setGame] = useState(defaultGameForm);
  const [detail, setDetail] = useState(defaultDetailForm);
  const [otherGames, setOtherGames] = useState<GameOption[]>([]);

  useEffect(() => {
    async function load() {
      const gamesRes = await supabase
        .from("games")
        .select("id, title")
        .order("title", { ascending: true });
      setOtherGames((gamesRes.data ?? []).filter((g) => g.id !== gameId));

      if (!gameId) {
        setLoading(false);
        return;
      }

      const [gameRes, detailRes] = await Promise.all([
        supabase.from("games").select("*").eq("id", gameId).maybeSingle(),
        supabase.from("game_details").select("*").eq("game_id", gameId).maybeSingle(),
      ]);

      if (gameRes.error || !gameRes.data) {
        setError("Não foi possível carregar este jogo.");
        setLoading(false);
        return;
      }

      const g = gameRes.data;
      setGame({
        title: g.title ?? "",
        slug: g.slug ?? "",
        coverUrl: g.cover_url ?? "",
        heroImageUrl: g.hero_image_url ?? "",
        platforms: g.platforms ?? [],
        genres: g.genres ?? [],
        releaseYear: g.release_year ?? new Date().getFullYear(),
        releaseDate: g.release_date ?? "",
        developer: g.developer ?? "",
        difficulty: g.difficulty ?? 5,
        platinumTimeMin: g.platinum_time_min ?? 10,
        platinumTimeMax: g.platinum_time_max ?? 20,
        trophyBreakdown: g.trophy_breakdown ?? { bronze: 0, prata: 0, ouro: 0, platina: 1 },
        hasMissables: g.has_missables ?? false,
        hasOnlineTrophies: g.has_online_trophies ?? false,
        grindLevel: g.grind_level ?? "baixo",
        worthBuying: g.worth_buying ?? 3,
        worthPlatinum: g.worth_platinum ?? 3,
        guideRequired: g.guide_required ?? false,
        synopsis: g.synopsis ?? "",
        similarGameIds: g.similar_game_ids ?? [],
        isFeatured: g.is_featured ?? false,
        featuredOrder: g.featured_order ?? null,
        igdbId: g.igdb_id ?? null,
      });

      if (detailRes.data) {
        const d = detailRes.data;
        setDetail({
          minPlaythroughs: d.min_playthroughs ?? 1,
          difficultyExplanation: d.difficulty_explanation ?? "",
          review: {
            intro: d.review_intro ?? "",
            whatToExpect: d.review_what_to_expect ?? "",
            pros: d.review_pros ?? [],
            cons: d.review_cons ?? [],
            verdict: d.review_verdict ?? "",
          },
          timeline: d.timeline?.length ? d.timeline : defaultDetailForm.timeline,
          missables: d.missables ?? [],
          hardestTrophies: d.hardest_trophies ?? [],
          prepTips: d.prep_tips ?? [],
          videoId: d.video_id ?? "",
          overallScore: d.overall_score ?? 5,
          ratingBreakdown: d.rating_breakdown ?? [],
          roadmapSummary: d.roadmap_summary ?? [],
          screenshotUrls: d.screenshot_urls ?? [],
        });
      }

      setLoading(false);
    }

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameId]);

  function togglePlatform(p: Platform) {
    setGame((f) => ({
      ...f,
      platforms: f.platforms.includes(p)
        ? f.platforms.filter((x) => x !== p)
        : [...f.platforms, p],
    }));
  }

  function toggleGenre(g: Genre) {
    setGame((f) => ({
      ...f,
      genres: f.genres.includes(g) ? f.genres.filter((x) => x !== g) : [...f.genres, g],
    }));
  }

  function toggleSimilar(id: string) {
    setGame((f) => ({
      ...f,
      similarGameIds: f.similarGameIds.includes(id)
        ? f.similarGameIds.filter((x) => x !== id)
        : [...f.similarGameIds, id],
    }));
  }

  function handleIgdbImport(result: IgdbImportResult) {
    setGame((f) => ({
      ...f,
      title: result.title,
      slug: slugify(result.title),
      coverUrl: result.coverUrl ?? f.coverUrl,
      developer: result.developer ?? f.developer,
      releaseYear: result.releaseYear ?? f.releaseYear,
      releaseDate: result.releaseDate ?? f.releaseDate,
      // Só substitui plataformas/géneros se a IGDB tiver devolvido algo —
      // caso contrário mantém o que o editor já tinha escolhido.
      platforms: result.platforms.length ? result.platforms : f.platforms,
      genres: result.genres.length ? result.genres : f.genres,
      igdbId: result.igdbId,
    }));
  }

  async function handleSave() {
    if (!game.title.trim() || !game.slug.trim()) {
      setError("Preenche pelo menos o Título e o Slug antes de guardar.");
      setTab("geral");
      return;
    }

    setSaving(true);
    setError(null);

    const gamePayload = {
      title: game.title.trim(),
      slug: game.slug.trim(),
      cover_url: game.coverUrl.trim(),
      hero_image_url: game.heroImageUrl.trim() || null,
      platforms: game.platforms,
      genres: game.genres,
      release_year: game.releaseYear,
      release_date: game.releaseDate || null,
      developer: game.developer.trim(),
      difficulty: game.difficulty,
      platinum_time_min: game.platinumTimeMin,
      platinum_time_max: game.platinumTimeMax,
      trophy_breakdown: game.trophyBreakdown,
      has_missables: game.hasMissables,
      has_online_trophies: game.hasOnlineTrophies,
      grind_level: game.grindLevel,
      worth_buying: game.worthBuying,
      worth_platinum: game.worthPlatinum,
      guide_required: game.guideRequired,
      synopsis: game.synopsis.trim(),
      similar_game_ids: game.similarGameIds,
      is_featured: game.isFeatured,
      featured_order: game.featuredOrder,
      igdb_id: game.igdbId,
    };

    let resolvedGameId = gameId;

    if (gameId) {
      const { error } = await supabase.from("games").update(gamePayload).eq("id", gameId);
      if (error) {
        setError("Não foi possível guardar a informação geral do jogo.");
        setSaving(false);
        return;
      }
    } else {
      const { data, error } = await supabase
        .from("games")
        .insert(gamePayload)
        .select("id")
        .single();
      if (error || !data) {
        setError("Não foi possível criar o jogo.");
        setSaving(false);
        return;
      }
      resolvedGameId = data.id;
    }

    const detailPayload = {
      game_id: resolvedGameId,
      min_playthroughs: detail.minPlaythroughs,
      difficulty_explanation: detail.difficultyExplanation.trim(),
      review_intro: detail.review.intro.trim(),
      review_what_to_expect: detail.review.whatToExpect.trim(),
      review_pros: detail.review.pros.filter((p) => p.trim() !== ""),
      review_cons: detail.review.cons.filter((c) => c.trim() !== ""),
      review_verdict: detail.review.verdict.trim(),
      timeline: detail.timeline,
      missables: detail.missables,
      hardest_trophies: detail.hardestTrophies,
      prep_tips: detail.prepTips.filter((t) => t.trim() !== ""),
      video_id: detail.videoId.trim() || null,
      guide_href: `/guias/${game.slug.trim()}`,
      roadmap_href: `/guias/${game.slug.trim()}#roadmap`,
      overall_score: detail.overallScore,
      rating_breakdown: detail.ratingBreakdown,
      roadmap_summary: detail.roadmapSummary.filter((s) => s.trim() !== ""),
      screenshot_urls: detail.screenshotUrls.filter((s) => s.trim() !== ""),
    };

    const { error: detailError } = await supabase
      .from("game_details")
      .upsert(detailPayload, { onConflict: "game_id" });

    setSaving(false);

    if (detailError) {
      setError(
        "O jogo foi guardado, mas houve um erro a guardar a Análise. Tenta guardar novamente."
      );
      return;
    }

    router.push("/admin/jogos");
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 py-8 text-sm text-ink-muted">
        <Loader2 width={16} height={16} className="animate-spin" />
        A carregar jogo...
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold uppercase tracking-wide text-ink">
          {gameId ? `Editar: ${game.title || "..."}` : "Novo Jogo"}
        </h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-1.5 rounded-sm bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-glow hover:bg-primary-light disabled:opacity-50"
        >
          {saving ? (
            <Loader2 width={15} height={15} className="animate-spin" />
          ) : (
            <Check width={15} height={15} />
          )}
          Guardar Tudo
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-sm border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-primary-light">
          {error}
        </div>
      )}

      <div className="mb-6 flex gap-1 border-b border-border">
        <button
          onClick={() => setTab("geral")}
          className={`border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
            tab === "geral"
              ? "border-primary text-ink"
              : "border-transparent text-ink-muted hover:text-ink"
          }`}
        >
          Informação Geral
        </button>
        <button
          onClick={() => setTab("analise")}
          className={`border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
            tab === "analise"
              ? "border-primary text-ink"
              : "border-transparent text-ink-muted hover:text-ink"
          }`}
        >
          Análise
        </button>
      </div>

      {tab === "geral" ? (
        <div className="flex flex-col gap-5">
          {!gameId && <IgdbImportBox onImport={handleIgdbImport} />}

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium uppercase tracking-wide text-ink-dim">
                Título
              </span>
              <input
                type="text"
                value={game.title}
                onChange={(e) => setGame((f) => ({ ...f, title: e.target.value }))}
                className="h-11 rounded-sm border border-border bg-bg-surface2 px-3 text-sm text-ink outline-none focus:border-primary"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium uppercase tracking-wide text-ink-dim">
                Slug (usado no URL)
              </span>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={game.slug}
                  onChange={(e) => setGame((f) => ({ ...f, slug: e.target.value }))}
                  className="h-11 flex-1 rounded-sm border border-border bg-bg-surface2 px-3 text-sm text-ink outline-none focus:border-primary"
                />
                <button
                  type="button"
                  onClick={() => setGame((f) => ({ ...f, slug: slugify(f.title) }))}
                  title="Gerar a partir do título"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-sm border border-border text-ink-muted hover:border-accent hover:text-accent"
                >
                  <Wand2 width={15} height={15} />
                </button>
              </div>
            </label>
          </div>

          <div className="flex flex-wrap items-end gap-4 rounded-sm border border-gold/30 bg-gold/5 p-4">
            <label className="flex items-center gap-2 text-sm text-ink">
              <input
                type="checkbox"
                checked={game.isFeatured}
                onChange={(e) => setGame((f) => ({ ...f, isFeatured: e.target.checked }))}
                className="h-4 w-4 accent-primary"
              />
              Jogo em Destaque (aparece no carousel da homepage)
            </label>
            {game.isFeatured && (
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium uppercase tracking-wide text-ink-dim">
                  Ordem no carousel (opcional)
                </span>
                <input
                  type="number"
                  value={game.featuredOrder ?? ""}
                  onChange={(e) =>
                    setGame((f) => ({
                      ...f,
                      featuredOrder: e.target.value === "" ? null : Number(e.target.value),
                    }))
                  }
                  placeholder="Ex: 1"
                  className="h-10 w-28 rounded-sm border border-border bg-bg-surface2 px-3 text-sm text-ink placeholder:text-ink-dim outline-none focus:border-primary"
                />
              </label>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium uppercase tracking-wide text-ink-dim">
                URL da capa
              </span>
              <input
                type="text"
                value={game.coverUrl}
                onChange={(e) => setGame((f) => ({ ...f, coverUrl: e.target.value }))}
                placeholder="https://..."
                className="h-11 rounded-sm border border-border bg-bg-surface2 px-3 text-sm text-ink placeholder:text-ink-dim outline-none focus:border-primary"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium uppercase tracking-wide text-ink-dim">
                Estúdio
              </span>
              <input
                type="text"
                value={game.developer}
                onChange={(e) => setGame((f) => ({ ...f, developer: e.target.value }))}
                className="h-11 rounded-sm border border-border bg-bg-surface2 px-3 text-sm text-ink outline-none focus:border-primary"
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium uppercase tracking-wide text-ink-dim">
                Ano de lançamento
              </span>
              <input
                type="number"
                value={game.releaseYear}
                onChange={(e) =>
                  setGame((f) => ({ ...f, releaseYear: Number(e.target.value) }))
                }
                className="h-11 rounded-sm border border-border bg-bg-surface2 px-3 text-sm text-ink outline-none focus:border-primary"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium uppercase tracking-wide text-ink-dim">
                Data de lançamento (opcional)
              </span>
              <input
                type="date"
                value={game.releaseDate}
                onChange={(e) => setGame((f) => ({ ...f, releaseDate: e.target.value }))}
                className="h-11 rounded-sm border border-border bg-bg-surface2 px-3 text-sm text-ink outline-none focus:border-primary"
              />
            </label>
          </div>

          <div>
            <span className="mb-2 block text-xs font-medium uppercase tracking-wide text-ink-dim">
              Plataformas
            </span>
            <div className="flex flex-wrap gap-2">
              {PLATFORM_OPTIONS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => togglePlatform(p)}
                  className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                    game.platforms.includes(p)
                      ? "border-primary bg-primary text-white"
                      : "border-border bg-bg-surface2 text-ink-muted hover:text-ink"
                  }`}
                >
                  {platformLabel(p)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="mb-2 block text-xs font-medium uppercase tracking-wide text-ink-dim">
              Géneros
            </span>
            <div className="flex flex-wrap gap-2">
              {GENRE_OPTIONS.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => toggleGenre(g)}
                  className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                    game.genres.includes(g)
                      ? "border-primary bg-primary text-white"
                      : "border-border bg-bg-surface2 text-ink-muted hover:text-ink"
                  }`}
                >
                  {genreLabel(g)}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium uppercase tracking-wide text-ink-dim">
                Dificuldade (1-10)
              </span>
              <input
                type="number"
                min={1}
                max={10}
                value={game.difficulty}
                onChange={(e) => setGame((f) => ({ ...f, difficulty: Number(e.target.value) }))}
                className="h-11 rounded-sm border border-border bg-bg-surface2 px-3 text-sm text-ink outline-none focus:border-primary"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium uppercase tracking-wide text-ink-dim">
                Platina — horas mín.
              </span>
              <input
                type="number"
                value={game.platinumTimeMin}
                onChange={(e) =>
                  setGame((f) => ({ ...f, platinumTimeMin: Number(e.target.value) }))
                }
                className="h-11 rounded-sm border border-border bg-bg-surface2 px-3 text-sm text-ink outline-none focus:border-primary"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium uppercase tracking-wide text-ink-dim">
                Platina — horas máx.
              </span>
              <input
                type="number"
                value={game.platinumTimeMax}
                onChange={(e) =>
                  setGame((f) => ({ ...f, platinumTimeMax: Number(e.target.value) }))
                }
                className="h-11 rounded-sm border border-border bg-bg-surface2 px-3 text-sm text-ink outline-none focus:border-primary"
              />
            </label>
          </div>

          <div>
            <span className="mb-2 block text-xs font-medium uppercase tracking-wide text-ink-dim">
              Troféus (contagem)
            </span>
            <div className="grid grid-cols-4 gap-3">
              {(["bronze", "prata", "ouro", "platina"] as const).map((key) => (
                <label key={key} className="flex flex-col gap-1">
                  <span className="text-[11px] capitalize text-ink-dim">{key}</span>
                  <input
                    type="number"
                    min={0}
                    value={game.trophyBreakdown[key]}
                    onChange={(e) =>
                      setGame((f) => ({
                        ...f,
                        trophyBreakdown: { ...f.trophyBreakdown, [key]: Number(e.target.value) },
                      }))
                    }
                    className="h-10 rounded-sm border border-border bg-bg-surface2 px-2.5 text-sm text-ink outline-none focus:border-primary"
                  />
                </label>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium uppercase tracking-wide text-ink-dim">
                Nível de Grind
              </span>
              <select
                value={game.grindLevel}
                onChange={(e) =>
                  setGame((f) => ({ ...f, grindLevel: e.target.value as GrindLevel }))
                }
                className="h-11 rounded-sm border border-border bg-bg-surface2 px-3 text-sm text-ink outline-none focus:border-primary"
              >
                {GRIND_OPTIONS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium uppercase tracking-wide text-ink-dim">
                  Vale o dinheiro (1-5)
                </span>
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={game.worthBuying}
                  onChange={(e) =>
                    setGame((f) => ({ ...f, worthBuying: Number(e.target.value) }))
                  }
                  className="h-11 rounded-sm border border-border bg-bg-surface2 px-3 text-sm text-ink outline-none focus:border-primary"
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium uppercase tracking-wide text-ink-dim">
                  Vale a platina (1-5)
                </span>
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={game.worthPlatinum}
                  onChange={(e) =>
                    setGame((f) => ({ ...f, worthPlatinum: Number(e.target.value) }))
                  }
                  className="h-11 rounded-sm border border-border bg-bg-surface2 px-3 text-sm text-ink outline-none focus:border-primary"
                />
              </label>
            </div>
          </div>

          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 text-sm text-ink">
              <input
                type="checkbox"
                checked={game.hasMissables}
                onChange={(e) => setGame((f) => ({ ...f, hasMissables: e.target.checked }))}
                className="h-4 w-4 accent-primary"
              />
              Tem missables
            </label>
            <label className="flex items-center gap-2 text-sm text-ink">
              <input
                type="checkbox"
                checked={game.hasOnlineTrophies}
                onChange={(e) =>
                  setGame((f) => ({ ...f, hasOnlineTrophies: e.target.checked }))
                }
                className="h-4 w-4 accent-primary"
              />
              Tem troféus online
            </label>
            <label className="flex items-center gap-2 text-sm text-ink">
              <input
                type="checkbox"
                checked={game.guideRequired}
                onChange={(e) => setGame((f) => ({ ...f, guideRequired: e.target.checked }))}
                className="h-4 w-4 accent-primary"
              />
              Guia recomendado
            </label>
          </div>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium uppercase tracking-wide text-ink-dim">
              Sinopse
            </span>
            <textarea
              rows={3}
              value={game.synopsis}
              onChange={(e) => setGame((f) => ({ ...f, synopsis: e.target.value }))}
              className="resize-none rounded-sm border border-border bg-bg-surface2 px-3 py-2.5 text-sm text-ink outline-none focus:border-primary"
            />
          </label>

          {otherGames.length > 0 && (
            <div>
              <span className="mb-2 block text-xs font-medium uppercase tracking-wide text-ink-dim">
                Jogos semelhantes
              </span>
              <div className="flex max-h-48 flex-col gap-1.5 overflow-y-auto rounded-sm border border-border bg-bg-surface2 p-3">
                {otherGames.map((g) => (
                  <label key={g.id} className="flex items-center gap-2 text-sm text-ink-muted">
                    <input
                      type="checkbox"
                      checked={game.similarGameIds.includes(g.id)}
                      onChange={() => toggleSimilar(g.id)}
                      className="h-4 w-4 accent-primary"
                    />
                    {g.title}
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <label className="flex max-w-[200px] flex-col gap-1.5">
            <span className="text-xs font-medium uppercase tracking-wide text-ink-dim">
              Playthroughs mínimos
            </span>
            <input
              type="number"
              min={1}
              value={detail.minPlaythroughs}
              onChange={(e) =>
                setDetail((f) => ({ ...f, minPlaythroughs: Number(e.target.value) }))
              }
              className="h-11 rounded-sm border border-border bg-bg-surface2 px-3 text-sm text-ink outline-none focus:border-primary"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium uppercase tracking-wide text-ink-dim">
              Dificuldade explicada
            </span>
            <textarea
              rows={3}
              value={detail.difficultyExplanation}
              onChange={(e) =>
                setDetail((f) => ({ ...f, difficultyExplanation: e.target.value }))
              }
              className="resize-none rounded-sm border border-border bg-bg-surface2 px-3 py-2.5 text-sm text-ink outline-none focus:border-primary"
            />
          </label>

          <div className="rounded-sm border border-border bg-bg-surface p-4">
            <h3 className="mb-3 font-display text-sm font-bold uppercase tracking-wide text-ink-dim">
              Review — Antes da Platina
            </h3>
            <div className="flex flex-col gap-4">
              <label className="flex flex-col gap-1.5">
                <span className="text-xs text-ink-dim">Introdução</span>
                <textarea
                  rows={2}
                  value={detail.review.intro}
                  onChange={(e) =>
                    setDetail((f) => ({ ...f, review: { ...f.review, intro: e.target.value } }))
                  }
                  className="resize-none rounded-sm border border-border bg-bg-surface2 px-3 py-2 text-sm text-ink outline-none focus:border-primary"
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-xs text-ink-dim">O que esperar</span>
                <textarea
                  rows={2}
                  value={detail.review.whatToExpect}
                  onChange={(e) =>
                    setDetail((f) => ({
                      ...f,
                      review: { ...f.review, whatToExpect: e.target.value },
                    }))
                  }
                  className="resize-none rounded-sm border border-border bg-bg-surface2 px-3 py-2 text-sm text-ink outline-none focus:border-primary"
                />
              </label>

              <StringListEditor
                label="Pontos positivos"
                values={detail.review.pros}
                onChange={(pros) => setDetail((f) => ({ ...f, review: { ...f.review, pros } }))}
              />
              <StringListEditor
                label="Pontos negativos"
                values={detail.review.cons}
                onChange={(cons) => setDetail((f) => ({ ...f, review: { ...f.review, cons } }))}
              />

              <label className="flex flex-col gap-1.5">
                <span className="text-xs text-ink-dim">Vale a pena? (veredito)</span>
                <textarea
                  rows={2}
                  value={detail.review.verdict}
                  onChange={(e) =>
                    setDetail((f) => ({
                      ...f,
                      review: { ...f.review, verdict: e.target.value },
                    }))
                  }
                  className="resize-none rounded-sm border border-border bg-bg-surface2 px-3 py-2 text-sm text-ink outline-none focus:border-primary"
                />
              </label>
            </div>
          </div>

          <div className="rounded-sm border border-border bg-bg-surface p-4">
            <h3 className="mb-3 font-display text-sm font-bold uppercase tracking-wide text-ink-dim">
              Timeline da Platina
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {detail.timeline.map((stage, i) => (
                <div key={stage.stage} className="rounded-sm border border-border bg-bg-surface2 p-3">
                  <p className="mb-2 text-xs font-semibold uppercase text-ink-dim">
                    {stage.stage}
                  </p>
                  <input
                    type="text"
                    value={stage.label}
                    onChange={(e) =>
                      setDetail((f) => ({
                        ...f,
                        timeline: f.timeline.map((s, si) =>
                          si === i ? { ...s, label: e.target.value } : s
                        ),
                      }))
                    }
                    placeholder="Rótulo (ex: Início)"
                    className="mb-2 h-9 w-full rounded-sm border border-border bg-bg-surface px-2.5 text-sm text-ink outline-none focus:border-primary"
                  />
                  <textarea
                    rows={2}
                    value={stage.description}
                    onChange={(e) =>
                      setDetail((f) => ({
                        ...f,
                        timeline: f.timeline.map((s, si) =>
                          si === i ? { ...s, description: e.target.value } : s
                        ),
                      }))
                    }
                    placeholder="Descrição desta fase..."
                    className="resize-none w-full rounded-sm border border-border bg-bg-surface px-2.5 py-2 text-sm text-ink outline-none focus:border-primary"
                  />
                </div>
              ))}
            </div>
          </div>

          <ObjectListEditor<MissableItem & Record<string, unknown>>
            label="Missables"
            items={detail.missables as (MissableItem & Record<string, unknown>)[]}
            onChange={(missables) => setDetail((f) => ({ ...f, missables }))}
            emptyItem={{ title: "", chapter: "", description: "" }}
            fields={[
              { key: "title", label: "Título" },
              { key: "chapter", label: "Capítulo" },
              { key: "description", label: "Descrição", type: "textarea" },
            ]}
          />

          <ObjectListEditor<HardestTrophy & Record<string, unknown>>
            label="Troféus mais difíceis"
            items={detail.hardestTrophies as (HardestTrophy & Record<string, unknown>)[]}
            onChange={(hardestTrophies) => setDetail((f) => ({ ...f, hardestTrophies }))}
            emptyItem={{ name: "", description: "", tip: "" }}
            fields={[
              { key: "name", label: "Nome do troféu" },
              { key: "description", label: "Descrição", type: "textarea" },
              { key: "tip", label: "Dica", type: "textarea" },
            ]}
          />

          <StringListEditor
            label="Dicas antes de começar"
            values={detail.prepTips}
            onChange={(prepTips) => setDetail((f) => ({ ...f, prepTips }))}
          />

          <StringListEditor
            label="Roadmap resumido (passos numerados)"
            values={detail.roadmapSummary}
            onChange={(roadmapSummary) => setDetail((f) => ({ ...f, roadmapSummary }))}
            multiline
          />

          <ObjectListEditor<RatingBreakdownItem & Record<string, unknown>>
            label="Classificação geral — categorias"
            items={detail.ratingBreakdown as (RatingBreakdownItem & Record<string, unknown>)[]}
            onChange={(ratingBreakdown) => setDetail((f) => ({ ...f, ratingBreakdown }))}
            emptyItem={{ label: "", value: 5 }}
            fields={[
              { key: "label", label: "Categoria (ex: Gameplay)" },
              { key: "value", label: "Nota (0-10)", type: "number" },
            ]}
          />

          <label className="flex max-w-[200px] flex-col gap-1.5">
            <span className="text-xs font-medium uppercase tracking-wide text-ink-dim">
              Nota geral (0-10)
            </span>
            <input
              type="number"
              min={0}
              max={10}
              step={0.1}
              value={detail.overallScore}
              onChange={(e) =>
                setDetail((f) => ({ ...f, overallScore: Number(e.target.value) }))
              }
              className="h-11 rounded-sm border border-border bg-bg-surface2 px-3 text-sm text-ink outline-none focus:border-primary"
            />
          </label>

          <StringListEditor
            label="URLs das screenshots"
            values={detail.screenshotUrls}
            onChange={(screenshotUrls) => setDetail((f) => ({ ...f, screenshotUrls }))}
            placeholder="https://..."
          />

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium uppercase tracking-wide text-ink-dim">
              ID do vídeo no YouTube (opcional)
            </span>
            <input
              type="text"
              value={detail.videoId}
              onChange={(e) => setDetail((f) => ({ ...f, videoId: e.target.value }))}
              placeholder="Ex: dQw4w9WgXcQ"
              className="h-11 rounded-sm border border-border bg-bg-surface2 px-3 text-sm text-ink placeholder:text-ink-dim outline-none focus:border-primary"
            />
            <span className="text-xs text-ink-dim">
              É este vídeo que aparece embutido na página do jogo. Cola só o código
              que vem a seguir a &quot;v=&quot; no URL do YouTube.
            </span>
          </label>
        </div>
      )}
    </div>
  );
}
