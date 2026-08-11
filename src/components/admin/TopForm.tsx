"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Check, Trash2 } from "lucide-react";
import { slugify } from "@/lib/utils";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { ObjectListEditor } from "@/components/admin/ObjectListEditor";
import type { TopArticleItem } from "@/types";

interface TopFormProps {
  articleId?: string;
}

const defaultForm = {
  title: "",
  slug: "",
  coverUrl: "",
  heroImageUrl: "",
  youtubeUrl: "",
  intro: "",
  items: [] as TopArticleItem[],
  isPublished: false,
};

export function TopForm({ articleId }: TopFormProps) {
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
      .from("top_articles")
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
          coverUrl: data.cover_url ?? "",
          heroImageUrl: data.hero_image_url ?? "",
          youtubeUrl: data.youtube_url ?? "",
          intro: data.intro ?? "",
          items: data.items ?? [],
          isPublished: data.is_published ?? false,
        });
        setWasPublished(data.is_published ?? false);
        setLoading(false);
      });
  }, [articleId]);

  function updateTitle(title: string) {
    setForm((f) => ({ ...f, title, slug: slugTouched ? f.slug : slugify(title) }));
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
      cover_url: form.coverUrl.trim() || null,
      hero_image_url: form.heroImageUrl.trim() || null,
      youtube_url: form.youtubeUrl.trim() || null,
      intro: form.intro.trim(),
      items: form.items
        .map((item) => ({ label: item.label.trim(), note: (item.note ?? "").trim() }))
        .filter((item) => item.label),
      is_published: form.isPublished,
    };

    const supabase = createBrowserSupabaseClient();

    const result = articleId
      ? await supabase.from("top_articles").update(payload).eq("id", articleId).select("id")
      : await supabase.from("top_articles").insert(payload).select("id").single();

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
      router.push(`/admin/top/${(result.data as { id: string }).id}`);
    } else {
      router.refresh();
    }
  }

  async function handleDelete() {
    if (!articleId) return;
    if (!window.confirm(`Apagar "${form.title}"? Não há forma de desfazer.`)) return;
    const supabase = createBrowserSupabaseClient();
    const { error: delError } = await supabase.from("top_articles").delete().eq("id", articleId);
    if (delError) {
      setError("Não foi possível apagar.");
      return;
    }
    router.push("/admin/top");
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
          {articleId ? `Editar: ${form.title || "..."}` : "Novo — Top+"}
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

      {error && (
        <p className="mb-4 rounded-sm border border-primary/30 bg-primary/10 px-3 py-2 text-sm text-primary-light">
          {error}
        </p>
      )}

      <div className="flex flex-col gap-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5 sm:col-span-2">
            <span className={labelClass}>Título da lista</span>
            <input
              type="text"
              value={form.title}
              onChange={(e) => updateTitle(e.target.value)}
              placeholder="ex: 5 Jogos Mais Difíceis de Platinar"
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
            <span className={labelClass}>Link do vídeo (YouTube)</span>
            <input
              type="text"
              value={form.youtubeUrl}
              onChange={(e) => setForm((f) => ({ ...f, youtubeUrl: e.target.value }))}
              placeholder="https://www.youtube.com/watch?v=..."
              className={inputClass}
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={labelClass}>URL da capa (miniatura)</span>
            <input
              type="text"
              value={form.coverUrl}
              onChange={(e) => setForm((f) => ({ ...f, coverUrl: e.target.value }))}
              className={inputClass}
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={labelClass}>URL da imagem larga (topo da página)</span>
            <input
              type="text"
              value={form.heroImageUrl}
              onChange={(e) => setForm((f) => ({ ...f, heroImageUrl: e.target.value }))}
              className={inputClass}
            />
          </label>
        </div>

        <label className="flex flex-col gap-1.5">
          <span className={labelClass}>Introdução</span>
          <RichTextEditor value={form.intro} onChange={(html) => setForm((f) => ({ ...f, intro: html }))} />
        </label>

        <ObjectListEditor<TopArticleItem & Record<string, unknown>>
          label="Jogos da lista, por ordem"
          items={form.items as (TopArticleItem & Record<string, unknown>)[]}
          fields={[
            { key: "label", label: "Jogo", type: "text", placeholder: "ex: Elden Ring" },
            {
              key: "note",
              label: "Nota / razão",
              type: "textarea",
              placeholder: "ex: O chefe final é uma aula de paciência",
            },
          ]}
          emptyItem={{ label: "", note: "" }}
          onChange={(items) => setForm((f) => ({ ...f, items: items as TopArticleItem[] }))}
        />
      </div>
    </div>
  );
}
