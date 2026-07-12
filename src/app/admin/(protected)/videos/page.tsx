"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Check, Loader2, Clock } from "lucide-react";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

interface GameOption {
  id: string;
  title: string;
}

interface VideoRow {
  id: string;
  game_id: string;
  publish_date: string;
  status: "publicado" | "agendado";
  verdict: string | null;
  type: string | null;
  youtube_id: string | null;
}

const VIDEO_TYPES = ["Antes da Platina", "Review", "Roadmap"];

const emptyForm = {
  game_id: "",
  publish_date: "",
  status: "agendado" as "publicado" | "agendado",
  verdict: "",
  type: "Antes da Platina",
  youtube_id: "",
};

export default function AdminVideosPage() {
  const supabase = createBrowserSupabaseClient();

  const [videos, setVideos] = useState<VideoRow[]>([]);
  const [games, setGames] = useState<GameOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  async function loadAll() {
    setLoading(true);
    setError(null);

    const [videosRes, gamesRes] = await Promise.all([
      supabase
        .from("videos")
        .select("id, game_id, publish_date, status, verdict, type, youtube_id")
        .order("publish_date", { ascending: false }),
      supabase.from("games").select("id, title").order("title", { ascending: true }),
    ]);

    if (videosRes.error || gamesRes.error) {
      setError("Não foi possível carregar os vídeos. Tenta novamente.");
    } else {
      setVideos(videosRes.data ?? []);
      setGames(gamesRes.data ?? []);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function gameTitle(gameId: string) {
    return games.find((g) => g.id === gameId)?.title ?? "Jogo desconhecido";
  }

  function startEdit(row: VideoRow) {
    setShowNewForm(false);
    setEditingId(row.id);
    setForm({
      game_id: row.game_id,
      publish_date: row.publish_date,
      status: row.status,
      verdict: row.verdict ?? "",
      type: row.type ?? "Antes da Platina",
      youtube_id: row.youtube_id ?? "",
    });
  }

  function startNew() {
    setEditingId(null);
    setShowNewForm(true);
    setForm({ ...emptyForm, game_id: games[0]?.id ?? "" });
  }

  function cancelForm() {
    setEditingId(null);
    setShowNewForm(false);
    setForm(emptyForm);
  }

  async function handleSave() {
    if (!form.game_id || !form.publish_date) return;
    setSaving(true);
    setError(null);

    const payload = {
      game_id: form.game_id,
      publish_date: form.publish_date,
      status: form.status,
      verdict: form.status === "publicado" ? form.verdict.trim() : null,
      type: form.status === "agendado" ? form.type : null,
      youtube_id: form.youtube_id.trim() || null,
    };

    if (editingId) {
      const { error } = await supabase.from("videos").update(payload).eq("id", editingId);
      if (error) setError("Não foi possível guardar as alterações.");
    } else {
      const { error } = await supabase.from("videos").insert(payload);
      if (error) setError("Não foi possível criar o vídeo.");
    }

    setSaving(false);
    if (!error) {
      cancelForm();
      await loadAll();
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Apagar este vídeo? Não é possível desfazer.")) return;
    const { error } = await supabase.from("videos").delete().eq("id", id);
    if (error) {
      setError("Não foi possível apagar o vídeo.");
    } else {
      await loadAll();
    }
  }

  const isFormOpen = showNewForm || editingId !== null;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold uppercase tracking-wide text-ink">
            Vídeos
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            Episódios &quot;Antes da Platina&quot;, publicados e agendados.
          </p>
        </div>
        {!isFormOpen && games.length > 0 && (
          <button
            onClick={startNew}
            className="flex items-center gap-1.5 rounded-sm bg-primary px-4 py-2 text-sm font-semibold text-white shadow-glow hover:bg-primary-light"
          >
            <Plus width={15} height={15} />
            Novo Vídeo
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 rounded-sm border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-primary-light">
          {error}
        </div>
      )}

      {!loading && games.length === 0 && (
        <div className="mb-4 rounded-sm border border-gold/30 bg-gold/5 px-4 py-3 text-sm text-ink">
          Ainda não há jogos na base de dados — cria pelo menos um jogo antes de
          adicionares vídeos.
        </div>
      )}

      {isFormOpen && (
        <div className="mb-6 rounded-sm border border-border bg-bg-surface p-5">
          <h2 className="mb-4 font-display text-sm font-bold uppercase tracking-wide text-ink-dim">
            {editingId ? "Editar Vídeo" : "Novo Vídeo"}
          </h2>
          <div className="flex flex-col gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium uppercase tracking-wide text-ink-dim">
                Jogo
              </span>
              <select
                value={form.game_id}
                onChange={(e) => setForm((f) => ({ ...f, game_id: e.target.value }))}
                className="h-11 rounded-sm border border-border bg-bg-surface2 px-3 text-sm text-ink outline-none focus:border-primary"
              >
                {games.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.title}
                  </option>
                ))}
              </select>
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium uppercase tracking-wide text-ink-dim">
                  Data de publicação
                </span>
                <input
                  type="date"
                  value={form.publish_date}
                  onChange={(e) => setForm((f) => ({ ...f, publish_date: e.target.value }))}
                  className="h-11 rounded-sm border border-border bg-bg-surface2 px-3 text-sm text-ink outline-none focus:border-primary"
                />
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium uppercase tracking-wide text-ink-dim">
                  Estado
                </span>
                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, status: e.target.value as "publicado" | "agendado" }))
                  }
                  className="h-11 rounded-sm border border-border bg-bg-surface2 px-3 text-sm text-ink outline-none focus:border-primary"
                >
                  <option value="agendado">Agendado</option>
                  <option value="publicado">Publicado</option>
                </select>
              </label>
            </div>

            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium uppercase tracking-wide text-ink-dim">
                ID do vídeo no YouTube (opcional)
              </span>
              <input
                type="text"
                value={form.youtube_id}
                onChange={(e) => setForm((f) => ({ ...f, youtube_id: e.target.value }))}
                placeholder="Ex: dQw4w9WgXcQ"
                className="h-11 rounded-sm border border-border bg-bg-surface2 px-3 text-sm text-ink placeholder:text-ink-dim outline-none focus:border-primary"
              />
              <span className="text-xs text-ink-dim">
                Faz o upload do vídeo no YouTube primeiro. Depois cola aqui só o
                código que vem a seguir a &quot;v=&quot; no URL — em
                youtube.com/watch?v=<strong>dQw4w9WgXcQ</strong>, o ID é
                dQw4w9WgXcQ. Podes deixar em branco enquanto o vídeo não estiver
                pronto.
              </span>
            </label>

            {form.status === "publicado" ? (
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium uppercase tracking-wide text-ink-dim">
                  Veredito curto (aparece no arquivo do site)
                </span>
                <textarea
                  rows={2}
                  value={form.verdict}
                  onChange={(e) => setForm((f) => ({ ...f, verdict: e.target.value }))}
                  placeholder="Ex: Vale o sofrimento, mas prepara-te mentalmente."
                  className="resize-none rounded-sm border border-border bg-bg-surface2 px-3 py-2.5 text-sm text-ink placeholder:text-ink-dim outline-none focus:border-primary"
                />
              </label>
            ) : (
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium uppercase tracking-wide text-ink-dim">
                  Tipo de vídeo
                </span>
                <select
                  value={form.type}
                  onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                  className="h-11 rounded-sm border border-border bg-bg-surface2 px-3 text-sm text-ink outline-none focus:border-primary"
                >
                  {VIDEO_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </label>
            )}

            <div className="flex items-center gap-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-1.5 rounded-sm bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-light disabled:opacity-50"
              >
                {saving ? <Loader2 width={14} height={14} className="animate-spin" /> : <Check width={14} height={14} />}
                Guardar
              </button>
              <button
                onClick={cancelForm}
                className="flex items-center gap-1.5 rounded-sm border border-border px-4 py-2 text-sm font-medium text-ink-muted hover:text-ink"
              >
                <X width={14} height={14} />
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center gap-2 py-8 text-sm text-ink-muted">
          <Loader2 width={16} height={16} className="animate-spin" />
          A carregar vídeos...
        </div>
      ) : videos.length === 0 ? (
        <p className="py-8 text-sm text-ink-muted">
          Ainda não há vídeos. Cria o primeiro acima.
        </p>
      ) : (
        <div className="flex flex-col divide-y divide-border rounded-sm border border-border bg-bg-surface">
          {videos.map((row) => (
            <div key={row.id} className="flex items-start justify-between gap-4 p-4">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-display text-sm font-bold text-ink">
                    {gameTitle(row.game_id)}
                  </p>
                  <span
                    className={
                      row.status === "publicado"
                        ? "rounded-sm border border-primary/30 bg-primary/10 px-2 py-0.5 text-[11px] font-medium uppercase text-primary-light"
                        : "flex items-center gap-1 rounded-sm border border-accent/30 bg-accent/10 px-2 py-0.5 text-[11px] font-medium uppercase text-accent-light"
                    }
                  >
                    {row.status === "agendado" && <Clock width={10} height={10} />}
                    {row.status}
                  </span>
                </div>
                <p className="mt-1 text-xs text-ink-dim">{row.publish_date}</p>
                <p className="mt-1 text-sm text-ink-muted">
                  {row.status === "publicado" ? row.verdict : row.type}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <button
                  onClick={() => startEdit(row)}
                  aria-label="Editar"
                  className="flex h-8 w-8 items-center justify-center rounded-sm border border-border text-ink-muted hover:border-border-light hover:text-ink"
                >
                  <Pencil width={13} height={13} />
                </button>
                <button
                  onClick={() => handleDelete(row.id)}
                  aria-label="Apagar"
                  className="flex h-8 w-8 items-center justify-center rounded-sm border border-border text-ink-muted hover:border-primary hover:text-primary"
                >
                  <Trash2 width={13} height={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
