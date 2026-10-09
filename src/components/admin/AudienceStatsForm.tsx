"use client";

import { useEffect, useState } from "react";
import { Loader2, Check } from "lucide-react";
import { friendlySaveError } from "@/lib/utils";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import {
  DEFAULT_AUDIENCE_STATS,
  formatMonthYear,
  mapRowToAudienceStats,
} from "@/lib/data/audience-stats";

type Fields = {
  tiktokFollowers: string;
  tiktokViews: string;
  tiktokViewsDays: string;
  youtubeSubscribers: string;
  youtubeViews: string;
  instagramFollowers: string;
  instagramViews: string;
  instagramViewsDays: string;
};

const GROUPS: {
  title: string;
  fields: { key: keyof Fields; label: string; hint?: string }[];
}[] = [
  {
    title: "TikTok",
    fields: [
      { key: "tiktokFollowers", label: "Seguidores" },
      { key: "tiktokViews", label: "Visualizações" },
      { key: "tiktokViewsDays", label: "…nos últimos (dias)", hint: "Ex: 60" },
    ],
  },
  {
    title: "YouTube",
    fields: [
      { key: "youtubeSubscribers", label: "Subscritores" },
      { key: "youtubeViews", label: "Visualizações (total)" },
    ],
  },
  {
    title: "Instagram",
    fields: [
      { key: "instagramFollowers", label: "Seguidores" },
      { key: "instagramViews", label: "Visualizações" },
      { key: "instagramViewsDays", label: "…nos últimos (dias)", hint: "Ex: 30" },
    ],
  },
];

function toFields(row: Record<string, unknown>): Fields {
  const s = mapRowToAudienceStats(row);
  return {
    tiktokFollowers: String(s.tiktokFollowers),
    tiktokViews: String(s.tiktokViews),
    tiktokViewsDays: String(s.tiktokViewsDays),
    youtubeSubscribers: String(s.youtubeSubscribers),
    youtubeViews: String(s.youtubeViews),
    instagramFollowers: String(s.instagramFollowers),
    instagramViews: String(s.instagramViews),
    instagramViewsDays: String(s.instagramViewsDays),
  };
}

/** "12 167", "12.167" ou "12167" -> 12167. Vazio -> 0. */
function parseCount(value: string): number {
  const digits = value.replace(/\D/g, "");
  return digits === "" ? 0 : Number(digits);
}

export function AudienceStatsForm() {
  const [fields, setFields] = useState<Fields>(
    toFields({
      tiktok_followers: DEFAULT_AUDIENCE_STATS.tiktokFollowers,
      tiktok_views: DEFAULT_AUDIENCE_STATS.tiktokViews,
      tiktok_views_days: DEFAULT_AUDIENCE_STATS.tiktokViewsDays,
      youtube_subscribers: DEFAULT_AUDIENCE_STATS.youtubeSubscribers,
      youtube_views: DEFAULT_AUDIENCE_STATS.youtubeViews,
      instagram_followers: DEFAULT_AUDIENCE_STATS.instagramFollowers,
      instagram_views: DEFAULT_AUDIENCE_STATS.instagramViews,
      instagram_views_days: DEFAULT_AUDIENCE_STATS.instagramViewsDays,
    })
  );
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const supabase = createBrowserSupabaseClient();
      const { data } = await supabase
        .from("audience_stats")
        .select("*")
        .eq("id", 1)
        .maybeSingle();
      if (data) {
        setFields(toFields(data));
        setUpdatedAt((data.updated_at as string | null) ?? null);
      }
      setLoading(false);
    }
    load();
  }, []);

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSaved(false);

    const now = new Date().toISOString();
    const supabase = createBrowserSupabaseClient();
    const { error: saveError } = await supabase.from("audience_stats").upsert({
      id: 1,
      tiktok_followers: parseCount(fields.tiktokFollowers),
      tiktok_views: parseCount(fields.tiktokViews),
      tiktok_views_days: parseCount(fields.tiktokViewsDays),
      youtube_subscribers: parseCount(fields.youtubeSubscribers),
      youtube_views: parseCount(fields.youtubeViews),
      instagram_followers: parseCount(fields.instagramFollowers),
      instagram_views: parseCount(fields.instagramViews),
      instagram_views_days: parseCount(fields.instagramViewsDays),
      updated_at: now,
    });

    setSaving(false);
    if (saveError) {
      setError(`Não foi possível guardar: ${friendlySaveError(saveError.message)}`);
      return;
    }
    setUpdatedAt(now);
    setSaved(true);
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
          Estatísticas de audiência
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
          Guardar
        </button>
      </div>

      <p className="mb-6 text-sm text-ink-muted">
        Estes números aparecem na página de Imprensa. A data mostrada no site
        ({formatMonthYear(updatedAt)}) é a do último &quot;Guardar&quot;.
      </p>

      {error && <p className="mb-4 text-sm text-primary">{error}</p>}
      {saved && !error && (
        <p className="mb-4 text-sm text-accent">Guardado. A página de Imprensa já mostra os novos números.</p>
      )}

      <div className="flex flex-col gap-6">
        {GROUPS.map((group) => (
          <section
            key={group.title}
            className="rounded-sm border border-border bg-bg-surface p-4"
          >
            <h2 className="mb-3 font-display text-sm font-bold uppercase tracking-wide text-ink">
              {group.title}
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {group.fields.map((f) => (
                <label key={f.key} className="flex flex-col gap-1.5">
                  <span className={labelClass}>{f.label}</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={fields[f.key]}
                    onChange={(e) => {
                      setSaved(false);
                      setFields((prev) => ({ ...prev, [f.key]: e.target.value }));
                    }}
                    placeholder={f.hint}
                    className={inputClass}
                  />
                </label>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
