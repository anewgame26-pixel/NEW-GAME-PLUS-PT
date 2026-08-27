"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Check, Loader2, Wand2 } from "lucide-react";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import { revalidatePaths } from "@/lib/admin/revalidate";
import { rankingConfigs } from "@/data/mock/rankings-config";
import { cn, genreLabel, platformLabel, slugify, extractYoutubeId, friendlySaveError } from "@/lib/utils";
import { StringListEditor } from "@/components/admin/StringListEditor";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { BulkTrophyImport } from "@/components/admin/BulkTrophyImport";
import { ObjectListEditor } from "@/components/admin/ObjectListEditor";
import { RoadmapChapterEditor } from "@/components/admin/RoadmapChapterEditor";
import { IgdbImportBox, type IgdbImportResult } from "@/components/admin/IgdbImportBox";
import { HeroFocusSlider } from "@/components/admin/HeroFocusSlider";
import type {
  Genre,
  GrindLevel,
  HardestTrophy,
  Platform,
  RatingBreakdownItem,
  RoadmapChapter,
  SufferingBadge,
  TrophyListItem,
} from "@/types";
import { SUFFERING_BADGES } from "@/lib/suffering-badges";

const TROPHY_TIERS = ["bronze", "prata", "ouro", "platina"] as const;

const PLATFORM_OPTIONS: Platform[] = [
  "ps5",
  "ps4",
  "ps3",
  "ps2",
  "ps1",
  "xbox",
  "switch",
  "switch2",
  "pc",
  "gamecube",
  "snes",
  "nes",
  "mega-drive",
  "dreamcast",
  "saturn",
];
const GENRE_OPTIONS: Genre[] = [
  "acao",
  "rpg",
  "terror",
  "soulslike",
  "aventura",
  "coop",
  "plataformas",
  "mundo-aberto",
  "estrategia",
  "puzzle",
  "corrida",
  "luta",
  "simulacao",
  "musical",
  "desporto",
  "visual-novel",
  "metroidvania",
  "tatico",
  "sobrevivencia",
  "party",
];
const GRIND_OPTIONS: GrindLevel[] = ["baixo", "medio", "alto"];

const defaultGameForm = {
  title: "",
  slug: "",
  coverUrl: "",
  heroImageUrl: "",
  heroFocusX: 50,
  heroFocusY: 50,
  heroZoom: 100,
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
  hasRng: false,
  grindLevel: "baixo" as GrindLevel,
  worthBuying: 3,
  worthPlatinum: 3,
  guideRequired: false,
  synopsis: "",
  similarGameIds: [] as string[],
  isFeatured: false,
  featuredOrder: null as number | null,
  igdbId: null as number | null,
  isPublished: false,
};

const defaultDetailForm = {
  minPlaythroughs: 1,
  difficultyExplanation: "",
  review: {
    intro: "",
    whatToExpect: "",
    pros: [] as string[],
    cons: [] as string[],
    verdict: "",
    sufferingBadge: null as SufferingBadge | null,
  },
  reviewAuthorId: null as string | null,
  roadmapChapters: [] as RoadmapChapter[],
  hardestTrophies: [] as HardestTrophy[],
  trophyList: [] as TrophyListItem[],
  prepTips: [] as string[],
  videoId: "",
  overallScore: 5,
  ratingBreakdown: [] as RatingBreakdownItem[],
  screenshotUrls: [] as string[],
};

interface GameOption {
  id: string;
  title: string;
}

interface GameEditorFormProps {
  gameId?: string;
}

/**
 * Compara um texto ANTES de ser editado (tal como veio da base de
 * dados) com o texto ATUAL, prestes a ser gravado — e diz se parece
 * ter perdido listas de forma suspeita (o texto continua lá, mas as
 * tags <ul>/<ol> desapareceram). Não impede edições genuínas (apagar a
 * lista de propósito, reescrever o texto todo) — só apanha o caso
 * muito específico de "o texto é essencialmente o mesmo, mas perdeu
 * `<ul>`/`<ol>` que lá estavam".
 */
function looksLikeSuspiciousListLoss(original: string, current: string): boolean {
  if (!original) return false; // campo novo, nada a comparar

  const countTags = (html: string, tag: string) =>
    (html.match(new RegExp(`<${tag}[ >]`, "g")) ?? []).length;

  // Importante: contamos ITENS de lista (<li>), não blocos <ul>/<ol> —
  // quando um item é "arrancado" de uma lista, o número de <ul> pode
  // até AUMENTAR (a lista parte-se em duas à volta do item arrancado),
  // mas o número de <li> diminui sempre exatamente 1 por cada item
  // perdido. É esse o sinal certo a vigiar.
  const originalItems = countTags(original, "li");
  const currentItems = countTags(current, "li");

  if (originalItems === 0 || currentItems >= originalItems) return false;

  // Só alertamos se o TEXTO em si (sem tags) continuar muito parecido
  // — ou seja, ninguém reescreveu o parágrafo de propósito, só a
  // estrutura da lista é que desapareceu sozinha.
  const stripTags = (html: string) => html.replace(/<[^>]+>/g, "").trim();
  const originalText = stripTags(original);
  const currentText = stripTags(current);
  if (originalText.length === 0) return false;

  const similarity = currentText.length / originalText.length;
  return similarity > 0.85 && similarity < 1.15;
}

export function GameEditorForm({ gameId }: GameEditorFormProps) {
  const supabase = createBrowserSupabaseClient();
  const router = useRouter();

  const [tab, setTab] = useState<"geral" | "analise">("geral");
  const [loading, setLoading] = useState(Boolean(gameId));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  const [game, setGame] = useState(defaultGameForm);
  const [detail, setDetail] = useState(defaultDetailForm);
  const [otherGames, setOtherGames] = useState<GameOption[]>([]);
  const [teamMembers, setTeamMembers] = useState<{ id: string; name: string; role: string }[]>([]);

  // REDE DE SEGURANÇA PARA OS DADOS — guarda o texto exato tal como
  // veio da Supabase, logo que a página abre, para o podermos comparar
  // no momento de gravar. Isto protege contra QUALQUER bug do editor
  // de texto (encontrado ou não) que possa alguma vez apagar
  // formatação sem ninguém pedir: se o texto a gravar tiver menos
  // listas do que tinha originalmente mas ainda tiver a maior parte do
  // texto, algo correu mal — bloqueamos essa gravação específica em
  // vez de arriscar destruir trabalho.
  const originalRichTextRef = useRef<Record<string, string>>({});
  // Guarda se o jogo já estava PUBLICADO no momento em que a página abriu.
  // Serve para sabermos se esta gravação vai TORNAR o jogo visível pela
  // primeira vez (transição oculto → publicado) — só nesse caso
  // mostramos uma confirmação, para nunca mais acontecer "por engano".
  const wasPublishedRef = useRef(false);

  useEffect(() => {
    async function load() {
      const gamesRes = await supabase
        .from("games")
        .select("id, title")
        .order("title", { ascending: true });
      setOtherGames((gamesRes.data ?? []).filter((g) => g.id !== gameId));

      const teamRes = await supabase
        .from("team_members")
        .select("id, name, role")
        .order("sort_order", { ascending: true });
      setTeamMembers(teamRes.data ?? []);

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
        heroFocusX: typeof g.hero_focus_x === "number" ? g.hero_focus_x : 50,
        heroFocusY: typeof g.hero_focus_y === "number" ? g.hero_focus_y : 50,
        heroZoom: typeof g.hero_zoom === "number" ? g.hero_zoom : 100,
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
        hasRng: g.has_rng ?? false,
        grindLevel: g.grind_level ?? "baixo",
        worthBuying: g.worth_buying ?? 3,
        worthPlatinum: g.worth_platinum ?? 3,
        guideRequired: g.guide_required ?? false,
        synopsis: g.synopsis ?? "",
        similarGameIds: g.similar_game_ids ?? [],
        isFeatured: g.is_featured ?? false,
        featuredOrder: g.featured_order ?? null,
        igdbId: g.igdb_id ?? null,
        isPublished: g.is_published ?? true,
      });
      wasPublishedRef.current = g.is_published ?? true;

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
            sufferingBadge: d.suffering_badge ?? null,
          },
          reviewAuthorId: d.review_author_id ?? null,
          roadmapChapters: d.roadmap_chapters?.length ? d.roadmap_chapters : [],
          hardestTrophies: d.hardest_trophies ?? [],
          trophyList: d.trophy_list ?? [],
          prepTips: d.prep_tips ?? [],
          videoId: d.video_id ?? "",
          overallScore: d.overall_score ?? 5,
          ratingBreakdown: d.rating_breakdown ?? [],
          screenshotUrls: d.screenshot_urls ?? [],
        });

        // Guarda o "retrato" original de cada campo de texto rico, tal
        // como veio da base de dados, para a comparação de segurança
        // no momento de gravar (ver handleSave).
        originalRichTextRef.current = {
          difficultyExplanation: d.difficulty_explanation ?? "",
          "review.intro": d.review_intro ?? "",
          "review.whatToExpect": d.review_what_to_expect ?? "",
          "review.verdict": d.review_verdict ?? "",
          ...Object.fromEntries(
            (d.roadmap_chapters ?? []).map(
              (c: { description?: string }, i: number) =>
                [`roadmapChapters.${i}.description`, c.description ?? ""] as const
            )
          ),
        };
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
      // Num jogo já criado, não tocamos no título/slug — mudar o slug
      // partiria os links que já foram partilhados. Só atualizamos isso
      // ao criar um jogo novo (gameId ainda não existe).
      ...(gameId ? {} : { title: result.title, slug: slugify(result.title) }),
      coverUrl: result.coverUrl ?? f.coverUrl,
      heroImageUrl: result.heroImageUrl ?? f.heroImageUrl,
      heroFocusX: result.heroImageUrl ? 50 : f.heroFocusX,
      heroFocusY: result.heroImageUrl ? 50 : f.heroFocusY,
      heroZoom: result.heroImageUrl ? 100 : f.heroZoom,
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

  async function handleSave(shouldPublish: boolean) {
    if (!game.title.trim() || !game.slug.trim()) {
      setError("Preenche pelo menos o Título e o Slug antes de guardar.");
      setTab("geral");
      return;
    }

    // Se esta gravação vai tornar o jogo visível pela PRIMEIRA vez
    // (estava oculto, ou é um jogo novo, e a caixa "Publicado" está
    // marcada), pedimos confirmação explícita. É a rede de segurança
    // contra cliques acidentais no botão errado.
    if (game.isPublished && !wasPublishedRef.current) {
      const confirmed = window.confirm(
        `Tens a certeza que queres publicar "${game.title.trim() || "este jogo"}"?\n\nVai ficar visível no site (catálogo, homepage, etc.) imediatamente.`
      );
      if (!confirmed) {
        return;
      }
    }

    // REDE DE SEGURANÇA — confirma que nenhum campo perdeu listas de
    // forma suspeita antes de gravarmos seja o que for. Ver a função
    // looksLikeSuspiciousListLoss() e o comentário junto do
    // originalRichTextRef para o porquê disto existir.
    const fieldsToCheck: { key: string; label: string; current: string }[] = [
      { key: "difficultyExplanation", label: "Dificuldade explicada", current: detail.difficultyExplanation },
      { key: "review.intro", label: "Introdução da Review", current: detail.review.intro },
      { key: "review.whatToExpect", label: "O que Esperar", current: detail.review.whatToExpect },
      { key: "review.verdict", label: "Vale a pena? (veredito)", current: detail.review.verdict },
      ...detail.roadmapChapters.map((c, i) => ({
        key: `roadmapChapters.${i}.description`,
        label: `Roadmap — capítulo ${i + 1} (${c.title.trim() || "sem título"})`,
        current: c.description,
      })),
    ];

    const suspiciousFields = fieldsToCheck.filter((f) => {
      const original = originalRichTextRef.current[f.key];
      return original !== undefined && looksLikeSuspiciousListLoss(original, f.current);
    });

    if (suspiciousFields.length > 0) {
      setError(
        `Gravação impedida por segurança: o campo "${suspiciousFields[0].label}" parece ter perdido uma lista com pontos/números sem ninguém pedir (bug conhecido do editor, ainda em investigação). Nada foi gravado. Por favor recarrega a página (F5) sem guardar — o texto bom continua guardado na base de dados — e tenta editar de novo, evitando clicar repetidamente dentro de listas. Se o texto que tens agora no ecrã é mesmo o que queres (removeste a lista de propósito), avisa-nos para desligarmos esta proteção só para este campo.`
      );
      setTab(suspiciousFields[0].key.startsWith("roadmapChapters") || suspiciousFields[0].key.startsWith("review") ? "analise" : "geral");
      return;
    }

    setSaving(true);
    setError(null);
    setSavedMessage(null);

    const gamePayload = {
      title: game.title.trim(),
      slug: game.slug.trim(),
      cover_url: game.coverUrl.trim(),
      hero_image_url: game.heroImageUrl.trim() || null,
      hero_focus_x: game.heroFocusX,
      hero_focus_y: game.heroFocusY,
      hero_zoom: game.heroZoom,
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
      has_rng: game.hasRng,
      grind_level: game.grindLevel,
      worth_buying: game.worthBuying,
      worth_platinum: game.worthPlatinum,
      guide_required: game.guideRequired,
      synopsis: game.synopsis.trim(),
      similar_game_ids: game.similarGameIds,
      is_featured: game.isFeatured,
      featured_order: game.featuredOrder,
      igdb_id: game.igdbId,
      is_published: game.isPublished,
    };

    let resolvedGameId = gameId;

    if (gameId) {
      const { error, data } = await supabase
        .from("games")
        .update(gamePayload)
        .eq("id", gameId)
        .select("id");
      // Sem o .select() acima, uma gravação bloqueada por falta de
      // permissão não dá erro nenhum — só não muda nada na base de
      // dados, e o formulário diz "guardado" na mesma. Isto apanha esse
      // caso (foi o que aconteceu com o erro da Análise há uns dias).
      if (error || !data || data.length === 0) {
        setError(
          error
            ? `Não foi possível guardar a informação geral do jogo: ${friendlySaveError(error.message)}`
            : "Não foi possível guardar a informação geral do jogo — a gravação não afetou nenhuma linha (verifica as permissões no Supabase)."
        );
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
      suffering_badge: detail.review.sufferingBadge,
      review_author_id: detail.reviewAuthorId,
      roadmap_chapters: detail.roadmapChapters
        .filter((c) => c.title.trim() !== "" || c.description.trim() !== "")
        .map((c) => ({
          title: c.title.trim(),
          description: c.description.trim(),
          youtubeId: extractYoutubeId(c.youtubeId ?? "") || undefined,
          missables: (c.missables ?? []).filter(
            (m) => m.title.trim() !== "" || m.description.trim() !== ""
          ),
        })),
      hardest_trophies: detail.hardestTrophies,
      trophy_list: detail.trophyList,
      prep_tips: detail.prepTips.filter((t) => t.trim() !== ""),
      video_id: extractYoutubeId(detail.videoId) || null,
      guide_href: `/guias/${game.slug.trim()}`,
      roadmap_href: `/guias/${game.slug.trim()}#roadmap`,
      overall_score: detail.overallScore,
      rating_breakdown: detail.ratingBreakdown,
      screenshot_urls: detail.screenshotUrls.filter((s) => s.trim() !== ""),
    };

    const { error: detailError } = await supabase
      .from("game_details")
      .upsert(detailPayload, { onConflict: "game_id" });

    setSaving(false);

    if (detailError) {
      console.error("Erro ao guardar game_details:", detailError);
      setError(
        `O jogo foi guardado, mas houve um erro a guardar a Análise: ${friendlySaveError(detailError.message)}`
      );
      return;
    }

    // Gravação bem-sucedida: atualiza o "retrato" de referência para
    // os valores que acabaram de ser gravados, para a próxima
    // comparação de segurança ser feita a partir daqui, não do valor
    // antigo (permite editar/remover listas de propósito outra vez a
    // seguir, sem ficar bloqueado para sempre).
    originalRichTextRef.current = {
      difficultyExplanation: detail.difficultyExplanation.trim(),
      "review.intro": detail.review.intro.trim(),
      "review.whatToExpect": detail.review.whatToExpect.trim(),
      "review.verdict": detail.review.verdict.trim(),
      ...Object.fromEntries(
        detail.roadmapChapters.map((c, i) => [`roadmapChapters.${i}.description`, c.description.trim()] as const)
      ),
    };
    wasPublishedRef.current = game.isPublished;

    if (!shouldPublish) {
      // Rascunho: fica guardado no Supabase, mas o site público não é
      // avisado para se atualizar — continua a mostrar a última versão
      // publicada até alguém carregar em "Publicar".
      setSavedMessage(
        "Rascunho guardado. O site público ainda mostra a última versão publicada."
      );
      return;
    }

    // Um jogo/análise pode afetar a homepage, o catálogo, todos os
    // rankings (a ordenação pode mudar) e a própria página do jogo.
    // Importante aguardar (await) antes de navegar — caso contrário o
    // browser cancela o pedido a meio ao mudar de página.
    await revalidatePaths([
      "/",
      "/jogos",
      `/guias/${game.slug.trim()}`,
      "/rankings",
      ...rankingConfigs.map((c) => `/rankings/${c.slug}`),
    ]);

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
      <div className="mb-3 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold uppercase tracking-wide text-ink">
          {gameId ? `Editar: ${game.title || "..."}` : "Novo Jogo"}
        </h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleSave(false)}
            disabled={saving}
            title="Guarda no Supabase, mas o site público só atualiza quando publicares"
            className="flex items-center gap-1.5 rounded-sm border border-border-light px-5 py-2.5 text-sm font-semibold text-ink hover:border-primary hover:text-primary disabled:opacity-50"
          >
            {saving ? <Loader2 width={15} height={15} className="animate-spin" /> : <Check width={15} height={15} />}
            Guardar Rascunho
          </button>
          <button
            onClick={() => handleSave(true)}
            disabled={saving}
            title="Guarda e atualiza o site público imediatamente"
            className="flex items-center gap-1.5 rounded-sm bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-glow hover:bg-primary-light disabled:opacity-50"
          >
            {saving ? (
              <Loader2 width={15} height={15} className="animate-spin" />
            ) : (
              <Check width={15} height={15} />
            )}
            Guardar e Publicar
          </button>
        </div>
      </div>

      <label
        className={cn(
          "mb-6 flex items-center gap-3 rounded-sm border px-4 py-3",
          game.isPublished
            ? "border-accent/40 bg-accent/10"
            : "border-gold/40 bg-gold/10"
        )}
      >
        <input
          type="checkbox"
          checked={game.isPublished}
          onChange={(e) => setGame((f) => ({ ...f, isPublished: e.target.checked }))}
          className="h-5 w-5 accent-primary"
        />
        <span className="flex-1">
          <span className={cn("block text-sm font-bold uppercase tracking-wide", game.isPublished ? "text-accent" : "text-gold")}>
            {game.isPublished ? "Publicado — visível no site" : "Oculto — só visível aqui no admin"}
          </span>
          <span className="block text-xs text-ink-dim">
            {game.isPublished
              ? "Qualquer pessoa consegue ver este jogo no catálogo e aceder à sua página."
              : "Podes trabalhar à vontade neste jogo. Ninguém fora do admin o consegue ver ou aceder à sua página até marcares esta caixa."}
          </span>
        </span>
      </label>

      {savedMessage && (
        <div className="mb-4 rounded-sm border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-accent-light">
          {savedMessage}
        </div>
      )}

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
          <IgdbImportBox onImport={handleIgdbImport} isExistingGame={Boolean(gameId)} />

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
                URL da capa (vertical)
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

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium uppercase tracking-wide text-ink-dim">
              URL da imagem larga (para o carrossel da homepage)
            </span>
            <input
              type="text"
              value={game.heroImageUrl}
              onChange={(e) => setGame((f) => ({ ...f, heroImageUrl: e.target.value }))}
              placeholder="https://... (deixa em branco para usar a capa normal)"
              className="h-11 rounded-sm border border-border bg-bg-surface2 px-3 text-sm text-ink placeholder:text-ink-dim outline-none focus:border-primary"
            />
            <span className="text-xs text-ink-dim">
              A capa normal é vertical (como a caixa de um jogo) — esticá-la para um banner
              largo fica cortada. Ao importar da IGDB isto preenche-se sozinho; também podes
              colar aqui o link de qualquer imagem larga (1920×1080 ou semelhante).
            </span>
          </label>

          {game.heroImageUrl && (
            <HeroFocusSlider
              imageUrl={game.heroImageUrl}
              focusX={game.heroFocusX}
              onFocusXChange={(heroFocusX) => setGame((f) => ({ ...f, heroFocusX }))}
              focusY={game.heroFocusY}
              onFocusYChange={(heroFocusY) => setGame((f) => ({ ...f, heroFocusY }))}
              zoom={game.heroZoom}
              onZoomChange={(heroZoom) => setGame((f) => ({ ...f, heroZoom }))}
            />
          )}

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
                checked={game.hasRng}
                onChange={(e) => setGame((f) => ({ ...f, hasRng: e.target.checked }))}
                className="h-4 w-4 accent-primary"
              />
              Tem RNG (sorte/drops)
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
              Sinopse (usada para SEO e partilhas — já não aparece na página)
            </span>
            <textarea
              rows={3}
              value={game.synopsis}
              onChange={(e) => setGame((f) => ({ ...f, synopsis: e.target.value }))}
              className="min-h-[4.5rem] resize-y rounded-sm border border-border bg-bg-surface2 px-3 py-2.5 text-sm text-ink outline-none focus:border-primary"
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
            <RichTextEditor
              value={detail.difficultyExplanation}
              onChange={(html) =>
                setDetail((f) => ({ ...f, difficultyExplanation: html }))
              }
            />
          </label>

          <div className="rounded-sm border border-border bg-bg-surface p-4">
            <h3 className="mb-3 font-display text-sm font-bold uppercase tracking-wide text-ink-dim">
              Review — Antes da Platina
            </h3>
            <div className="flex flex-col gap-4">
              <label className="flex flex-col gap-1.5">
                <span className="text-xs text-ink-dim">Introdução</span>
                <RichTextEditor
                  value={detail.review.intro}
                  onChange={(html) =>
                    setDetail((f) => ({ ...f, review: { ...f.review, intro: html } }))
                  }
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-xs text-ink-dim">O que esperar</span>
                <RichTextEditor
                  value={detail.review.whatToExpect}
                  onChange={(html) =>
                    setDetail((f) => ({
                      ...f,
                      review: { ...f.review, whatToExpect: html },
                    }))
                  }
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
                <RichTextEditor
                  value={detail.review.verdict}
                  onChange={(html) =>
                    setDetail((f) => ({
                      ...f,
                      review: { ...f.review, verdict: html },
                    }))
                  }
                />
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium uppercase tracking-wide text-ink-dim">
                  Escrito por (opcional)
                </span>
                <select
                  value={detail.reviewAuthorId ?? ""}
                  onChange={(e) =>
                    setDetail((f) => ({ ...f, reviewAuthorId: e.target.value || null }))
                  }
                  className="h-11 rounded-sm border border-border bg-bg-surface2 px-3 text-sm text-ink outline-none focus:border-primary"
                >
                  <option value="">— Sem autor definido —</option>
                  {teamMembers.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.name} — {member.role}
                    </option>
                  ))}
                </select>
                <span className="text-xs text-ink-dim">
                  Aparece junto à review, na página do jogo. A lista vem da equipa em{" "}
                  /admin/equipa.
                </span>
              </label>

              <div>
                <span className="text-xs text-ink-dim">Selo &quot;Nós sofremos&quot; (opcional)</span>
                <div className="mt-2 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setDetail((f) => ({
                        ...f,
                        review: { ...f.review, sufferingBadge: null },
                      }))
                    }
                    className={cn(
                      "flex h-20 w-20 shrink-0 items-center justify-center rounded-sm border-2 text-xs text-ink-dim",
                      detail.review.sufferingBadge === null
                        ? "border-primary bg-primary/10"
                        : "border-border bg-bg-surface2 hover:border-border-light"
                    )}
                  >
                    Nenhum
                  </button>
                  {SUFFERING_BADGES.map((badge) => (
                    <button
                      key={badge.value}
                      type="button"
                      title={badge.label}
                      onClick={() =>
                        setDetail((f) => ({
                          ...f,
                          review: { ...f.review, sufferingBadge: badge.value as SufferingBadge },
                        }))
                      }
                      className={cn(
                        "h-20 w-20 shrink-0 overflow-hidden rounded-sm border-2",
                        detail.review.sufferingBadge === badge.value
                          ? "border-primary"
                          : "border-transparent hover:border-border-light"
                      )}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={badge.imageUrl}
                        alt={badge.label}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-sm border border-accent/30 bg-bg-surface p-4">
            <h3 className="mb-1 font-display text-sm font-bold uppercase tracking-wide text-ink-dim">
              Roadmap
            </h3>
            <p className="mb-4 text-xs text-ink-dim">
              Divide o roadmap em capítulos. Cada capítulo pode ter um vídeo do
              YouTube e os seus próprios missables — ambos opcionais. Clica no
              título de um capítulo para o abrir/fechar.
            </p>
            <RoadmapChapterEditor
              chapters={detail.roadmapChapters}
              onChange={(roadmapChapters) => setDetail((f) => ({ ...f, roadmapChapters }))}
            />
          </div>

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

          <div>
            <p className="mb-2 text-xs text-ink-dim">
              A lista completa aparece na página do jogo, no sítio onde antes
              estava a sinopse. Se ligares um troféu a um capítulo do roadmap
              (abaixo, em &quot;Roadmap&quot;), o visitante consegue clicar no troféu e
              saltar diretamente para esse capítulo. Se não ligares nenhum, o
              site também tenta encontrar sozinho o nome do troféu escrito no
              roadmap ou na review.
            </p>
            <div className="mb-3">
              <BulkTrophyImport
                onImport={(items) =>
                  setDetail((f) => ({ ...f, trophyList: [...f.trophyList, ...items] }))
                }
              />
            </div>
            <ObjectListEditor<TrophyListItem & Record<string, unknown>>
              label="Lista de Troféus"
              items={detail.trophyList as (TrophyListItem & Record<string, unknown>)[]}
              onChange={(trophyList) => setDetail((f) => ({ ...f, trophyList }))}
              emptyItem={{ name: "", tier: "bronze", description: "" }}
              fields={[
                { key: "name", label: "Nome do troféu" },
                { key: "tier", label: "Tier", type: "select", options: [...TROPHY_TIERS] },
                { key: "description", label: "Descrição", type: "textarea" },
                {
                  key: "roadmapChapterIndex",
                  label: "Capítulo do roadmap onde se obtém (opcional)",
                  type: "select",
                  numeric: true,
                  options: [
                    { value: "", label: "— não ligar a um capítulo —" },
                    ...detail.roadmapChapters.map((chapter, i) => ({
                      value: String(i),
                      label: `Capítulo ${i + 1} — ${chapter.title.trim() || "sem título"}`,
                    })),
                  ],
                },
              ]}
            />
          </div>

          <StringListEditor
            label="Dicas antes de começar"
            values={detail.prepTips}
            onChange={(prepTips) => setDetail((f) => ({ ...f, prepTips }))}
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
              onChange={(e) => setDetail((f) => ({ ...f, videoId: extractYoutubeId(e.target.value) }))}
              placeholder="Cola o link do YouTube ou o código do vídeo"
              className="h-11 rounded-sm border border-border bg-bg-surface2 px-3 text-sm text-ink placeholder:text-ink-dim outline-none focus:border-primary"
            />
            <span className="text-xs text-ink-dim">
              É este vídeo que aparece embutido na página do jogo. Podes colar o
              link inteiro do YouTube — o código é extraído automaticamente.
            </span>
          </label>
        </div>
      )}
    </div>
  );
}
