"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Check, Trash2 } from "lucide-react";
import { slugify, platformLabel } from "@/lib/utils";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import { IgdbImportBox, type IgdbImportResult } from "@/components/admin/IgdbImportBox";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { StringListEditor } from "@/components/admin/StringListEditor";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { DISCOVERY_TAGS } from "@/types";

interface DiscoveryFormProps {
  articleId?: string;
}

const defaultForm = {
  title: "",
  slug: "",
  platform: "",
  releaseYear: "",
  coverUrl: "",
  heroImageUrl: "",
  youtubeUrl: "",
  tags: [] as string[],
  body: "",
  pros: [] as string[],
  contras: [] as string[],
  veredicto: "",
  recomendamos: null as boolean | null,
  isHeroFeatured: false,
  isPublished: false,
};

export function DiscoveryForm({ articleId }: DiscoveryFormProps) {
  const router = useRouter();
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(Boolean(articleId));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [slugTouched, setSlugTouched] = useState(Boolean(articleId));
  const [wasPublished, setWasPublished] = useState(false);

  useEffect(() => {
    if (!articleId) return;
    const supabase = createBrowserSupabaseClient();
    supabase
      .from("discovery_articles")
      .select("*")
      .eq("id", articleId)
      .maybeSingle()
      .then(({ data }) => {
        if (!data) {
          setLoading(false);
          return;
        }
        setForm({
          title: data.title ?? "",
          slug: data.slug ?? "",
          platform: data.platform ?? "",
          releaseYear: data.release_year ? String(data.release_year) : "",
          coverUrl: data.cover_url ?? "",
          heroImageUrl: data.hero_image_url ?? "",
          youtubeUrl: data.youtube_url ?? "",
          tags: data.tags ?? [],
          body: data.body ?? "",
          pros: data.pros ?? [],
          contras: data.contras ?? [],
          veredicto: data.veredicto ?? "",
          recomendamos: data.recomendamos ?? null,
          isHeroFeatured: data.is_hero_featured ?? false,
          isPublished: data.is_published ?? false,
        });
        setWasPublished(data.is_published ?? false);
        setLoading(false);
      });
  }, [articleId]);

  function updateTitle(title: string) {
    setForm((f) => ({ ...f, title, slug: slugTouched ? f.slug : slugify(title) }));
  }

  function toggleTag(tag: string) {
    setForm((f) => ({
      ...f,
      tags: f.tags.includes(tag) ? f.tags.filter((t) => t !== tag) : [...f.tags, tag],
    }));
  }

  function handleIgdbImport(result: IgdbImportResult) {
    setForm((f) => ({
      ...f,
      ...(articleId
        ? {}
        : { title: result.title, slug: slugTouched ? f.slug : slugify(result.title) }),
      coverUrl: result.coverUrl ?? f.coverUrl,
      heroImageUrl: result.heroImageUrl ?? f.heroImageUrl,
      platform: result.platforms.length ? result.platforms.map(platformLabel).join(", ") : f.platform,
      releaseYear: result.releaseYear ? String(result.releaseYear) : f.releaseYear,
    }));
  }

  async function handleSave() {
    if (!form.title.trim() || !form.slug.trim()) {
      setError("Preenche pelo menos o Título e o Slug.");
      return;
    }

    if (form.isPublished && !wasPublished) {
      const confirmed = window.confirm(
        `Tens a certeza que queres publicar "${form.title}"?\n\nVai ficar visível no site imediatamente.`
      );
      if (!confirmed) return;
    }

    setSaving(true);
    setError(null);

    const payload = {
      title: form.title.trim(),
      slug: form.slug.trim(),
      platform: form.platform.trim() || null,
      release_year: form.releaseYear ? Number(form.releaseYear) : null,
      cover_url: form.coverUrl.trim() || null,
      hero_image_url: form.heroImageUrl.trim() || null,
      youtube_url: form.youtubeUrl.trim() || null,
      tags: form.tags,
      body: form.body.trim(),
      pros: form.pros.map((p) => p.trim()).filter(Boolean),
      contras: form.contras.map((c) => c.trim()).filter(Boolean),
      veredicto: form.veredicto.trim(),
      recomendamos: form.recomendamos,
      is_hero_featured: form.isHeroFeatured,
      is_published: form.isPublished,
    };

    const supabase = createBrowserSupabaseClient();

    const result = articleId
      ? await supabase.from("discovery_articles").update(payload).eq("id", articleId).select("id")
      : await supabase.from("discovery_articles").insert(payload).select("id").single();

    setSaving(false);

    if (result.error) {
      setError(`Não foi possível guardar: ${result.error.message}`);
      return;
    }
    if (articleId && (!result.data || (Array.isArray(result.data) && result.data.length === 0))) {
      setError("Não foi possível guardar — a gravação não afetou nenhuma linha (permissões?).");
      return;
    }

    setWasPublished(form.isPublished);

    if (!articleId && result.data && "id" in (result.data as object)) {
      router.push(`/admin/descobertas/${(result.data as { id: string }).id}`);
    } else {
      router.refresh();
    }
  }

  async function handleDelete() {
    if (!articleId) return;
    if (!window.confirm(`Apagar "${form.title}"? Não há forma de desfazer.`)) return;
    const supabase = createBrowserSupabaseClient();
    const { error: delError } = await supabase.from("discovery_articles").delete().eq("id", articleId);
    if (delError) {
      setError("Não foi possível apagar.");
      return;
    }
    router.push("/admin/descobertas");
  }

  if (loading) {
    return <p className="text-sm text-ink-muted">A carregar...</p>;
  }

  const inputClass =
    "h-11 rounded-sm border border-border bg-bg-surface2 px-3 text-sm text-ink placeholder:text-ink-dim outline-none focus:border-primary";
  const labelClass = "text-xs font-medium uppercase tracking-wide text-ink-dim";

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold uppercase tracking-wide text-ink">
          {articleId ? `Editar: ${form.title || "..."}` : "Novo — Descobertas+"}
        </h1>
        <div className="flex items-center gap-2">
          {articleId && (
            <button
              onClick={handleDelete}
              className="flex items-center gap-1.5 rounded-sm border border-border-light px-4 py-2.5 text-sm font-semibold text-ink-muted hover:border-primary hover:text-primary"
            >
              <Trash2 width={15} height={15} />
              Apagar
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 rounded-sm bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-glow hover:bg-primary-light disabled:opacity-50"
          >
            {saving ? <Loader2 width={15} height={15} className="animate-spin" /> : <Check width={15} height={15} />}
            Guardar
          </button>
        </div>
      </div>

      <label
        className={`mb-6 flex items-center gap-3 rounded-sm border px-4 py-3 ${
          form.isPublished ? "border-accent/40 bg-accent/10" : "border-gold/40 bg-gold/10"
        }`}
      >
        <input
          type="checkbox"
          checked={form.isPublished}
          onChange={(e) => setForm((f) => ({ ...f, isPublished: e.target.checked }))}
          className="h-5 w-5 accent-primary"
        />
        <span className="flex-1">
          <span
            className={`block text-sm font-bold uppercase tracking-wide ${
              form.isPublished ? "text-accent" : "text-gold"
            }`}
          >
            {form.isPublished ? "Publicado — visível no site" : "Oculto — só visível aqui no admin"}
          </span>
        </span>
      </label>

      <label className="mb-6 flex items-center gap-3 rounded-sm border border-primary/30 bg-primary/5 px-4 py-3">
        <input
          type="checkbox"
          checked={form.isHeroFeatured}
          onChange={(e) => setForm((f) => ({ ...f, isHeroFeatured: e.target.checked }))}
          className="h-5 w-5 accent-primary"
        />
        <span className="flex-1">
          <span className="block text-sm font-bold uppercase tracking-wide text-primary-light">
            Destacar no Hero da homepage
          </span>
          <span className="block text-xs text-ink-dim">
            Aparece no carrossel principal do topo do site (só se também estiver publicado).
          </span>
        </span>
      </label>

      {error && (
        <p className="mb-4 rounded-sm border border-primary/30 bg-primary/10 px-3 py-2 text-sm text-primary-light">
          {error}
        </p>
      )}

      <div className="flex flex-col gap-5">
        <IgdbImportBox onImport={handleIgdbImport} isExistingGame={Boolean(articleId)} />

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5">
            <span className={labelClass}>Título do jogo</span>
            <input
              type="text"
              value={form.title}
              onChange={(e) => updateTitle(e.target.value)}
              className={inputClass}
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={labelClass}>Slug (link)</span>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => {
                setSlugTouched(true);
                setForm((f) => ({ ...f, slug: e.target.value }));
              }}
              className={inputClass}
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={labelClass}>Plataforma</span>
            <input
              type="text"
              value={form.platform}
              onChange={(e) => setForm((f) => ({ ...f, platform: e.target.value }))}
              placeholder="ex: PC"
              className={inputClass}
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={labelClass}>Ano de lançamento</span>
            <input
              type="number"
              value={form.releaseYear}
              onChange={(e) => setForm((f) => ({ ...f, releaseYear: e.target.value }))}
              className={inputClass}
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={labelClass}>URL da capa</span>
            <input
              type="text"
              value={form.coverUrl}
              onChange={(e) => setForm((f) => ({ ...f, coverUrl: e.target.value }))}
              className={inputClass}
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={labelClass}>URL da imagem larga (topo do artigo)</span>
            <input
              type="text"
              value={form.heroImageUrl}
              onChange={(e) => setForm((f) => ({ ...f, heroImageUrl: e.target.value }))}
              className={inputClass}
            />
          </label>
          <label className="flex flex-col gap-1.5 sm:col-span-2">
            <span className={labelClass}>Link do vídeo (YouTube)</span>
            <input
              type="text"
              value={form.youtubeUrl}
              onChange={(e) => setForm((f) => ({ ...f, youtubeUrl: e.target.value }))}
              placeholder="https://www.youtube.com/watch?v=..."
              className={inputClass}
            />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <ImageUploader
            label="Capa"
            value={form.coverUrl}
            onChange={(url) => setForm((f) => ({ ...f, coverUrl: url }))}
            folder="descobertas"
          />
          <ImageUploader
            label="Imagem larga (topo do artigo)"
            value={form.heroImageUrl}
            onChange={(url) => setForm((f) => ({ ...f, heroImageUrl: url }))}
            folder="descobertas"
          />
        </div>

        <div className="flex flex-col gap-2">
          <span className={labelClass}>Categorias</span>
          <div className="flex flex-wrap gap-2">
            {DISCOVERY_TAGS.map((tag) => (
              <button
                key={tag.value}
                type="button"
                onClick={() => toggleTag(tag.value)}
                className={`rounded-full border px-3 py-1.5 text-sm ${
                  form.tags.includes(tag.value)
                    ? "border-primary bg-primary/10 text-primary-light"
                    : "border-border text-ink-muted hover:text-ink"
                }`}
              >
                {tag.label}
              </button>
            ))}
          </div>
        </div>

        <label className="flex flex-col gap-1.5">
          <span className={labelClass}>Artigo</span>
          <RichTextEditor value={form.body} onChange={(html) => setForm((f) => ({ ...f, body: html }))} />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <StringListEditor
            label="Pontos fortes"
            values={form.pros}
            onChange={(pros) => setForm((f) => ({ ...f, pros }))}
          />
          <StringListEditor
            label="Pontos fracos"
            values={form.contras}
            onChange={(contras) => setForm((f) => ({ ...f, contras }))}
          />
        </div>

        <label className="flex flex-col gap-1.5">
          <span className={labelClass}>Veredicto</span>
          <RichTextEditor
            value={form.veredicto}
            onChange={(html) => setForm((f) => ({ ...f, veredicto: html }))}
          />
        </label>

        <div className="flex flex-col gap-2">
          <span className={labelClass}>Recomendamos?</span>
          <div className="flex gap-2">
            {[
              { label: "Sim", value: true },
              { label: "Não", value: false },
              { label: "Por decidir", value: null },
            ].map((opt) => (
              <button
                key={String(opt.value)}
                type="button"
                onClick={() => setForm((f) => ({ ...f, recomendamos: opt.value }))}
                className={`rounded-sm border px-4 py-2 text-sm ${
                  form.recomendamos === opt.value
                    ? "border-primary bg-primary/10 text-primary-light"
                    : "border-border text-ink-muted hover:text-ink"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
