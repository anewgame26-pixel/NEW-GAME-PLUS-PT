"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Check, Loader2 } from "lucide-react";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

interface GameOption {
  id: string;
  title: string;
}

interface MemberOption {
  id: string;
  name: string;
  avatar_initials: string;
}

interface NowPlayingRow {
  id: string;
  game_id: string;
  progress_percent: number;
  team_member_ids: string[];
  sort_order: number;
}

const emptyForm = {
  game_id: "",
  progress_percent: 0,
  team_member_ids: [] as string[],
  sort_order: 0,
};

export default function AdminEstamosAJogarPage() {
  const supabase = createBrowserSupabaseClient();

  const [rows, setRows] = useState<NowPlayingRow[]>([]);
  const [games, setGames] = useState<GameOption[]>([]);
  const [members, setMembers] = useState<MemberOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  async function loadAll() {
    setLoading(true);
    setError(null);

    const [rowsRes, gamesRes, membersRes] = await Promise.all([
      supabase
        .from("now_playing")
        .select("id, game_id, progress_percent, team_member_ids, sort_order")
        .order("sort_order", { ascending: true }),
      supabase.from("games").select("id, title").order("title", { ascending: true }),
      supabase
        .from("team_members")
        .select("id, name, avatar_initials")
        .order("sort_order", { ascending: true }),
    ]);

    if (rowsRes.error || gamesRes.error || membersRes.error) {
      setError("Não foi possível carregar os dados. Tenta novamente.");
    } else {
      setRows(rowsRes.data ?? []);
      setGames(gamesRes.data ?? []);
      setMembers(membersRes.data ?? []);
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

  function memberNames(ids: string[]) {
    if (ids.length === 0) return "Ninguém associado ainda";
    return ids
      .map((id) => members.find((m) => m.id === id)?.name)
      .filter(Boolean)
      .join(", ");
  }

  function startEdit(row: NowPlayingRow) {
    setShowNewForm(false);
    setEditingId(row.id);
    setForm({
      game_id: row.game_id,
      progress_percent: row.progress_percent,
      team_member_ids: row.team_member_ids,
      sort_order: row.sort_order,
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

  function toggleMember(id: string) {
    setForm((f) => ({
      ...f,
      team_member_ids: f.team_member_ids.includes(id)
        ? f.team_member_ids.filter((x) => x !== id)
        : [...f.team_member_ids, id],
    }));
  }

  async function handleSave() {
    if (!form.game_id) return;
    setSaving(true);
    setError(null);

    const payload = {
      game_id: form.game_id,
      progress_percent: form.progress_percent,
      team_member_ids: form.team_member_ids,
      sort_order: form.sort_order,
    };

    const { error } = editingId
      ? await supabase.from("now_playing").update(payload).eq("id", editingId)
      : await supabase.from("now_playing").insert(payload);

    if (error) setError("Não foi possível guardar. Tenta novamente.");

    setSaving(false);
    if (!error) {
      cancelForm();
      await loadAll();
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Remover este jogo de \"Estamos a Jogar\"?")) return;
    const { error } = await supabase.from("now_playing").delete().eq("id", id);
    if (error) {
      setError("Não foi possível remover.");
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
            Estamos a Jogar
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            Jogos que a equipa está atualmente a jogar/preparar — aparece na homepage
            para os leitores saberem o que podem esperar em breve.
          </p>
        </div>
        {!isFormOpen && games.length > 0 && (
          <button
            onClick={startNew}
            className="flex items-center gap-1.5 rounded-sm bg-primary px-4 py-2 text-sm font-semibold text-white shadow-glow hover:bg-primary-light"
          >
            <Plus width={15} height={15} />
            Adicionar
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
          Ainda não há jogos na base de dados — cria pelo menos um jogo primeiro.
        </div>
      )}

      {isFormOpen && (
        <div className="mb-6 rounded-sm border border-border bg-bg-surface p-5">
          <h2 className="mb-4 font-display text-sm font-bold uppercase tracking-wide text-ink-dim">
            {editingId ? "Editar" : "Adicionar"}
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

            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium uppercase tracking-wide text-ink-dim">
                Progresso: {form.progress_percent}%
              </span>
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={form.progress_percent}
                onChange={(e) =>
                  setForm((f) => ({ ...f, progress_percent: Number(e.target.value) }))
                }
                className="accent-primary"
              />
            </label>

            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-medium uppercase tracking-wide text-ink-dim">
                Quem da equipa está a jogar
              </span>
              {members.length === 0 ? (
                <p className="text-sm text-ink-dim">
                  Ainda não há membros de equipa — adiciona-os primeiro em
                  &quot;Equipa&quot;.
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {members.map((m) => {
                    const active = form.team_member_ids.includes(m.id);
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => toggleMember(m.id)}
                        className={
                          active
                            ? "flex items-center gap-1.5 rounded-full border border-primary bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary-light"
                            : "flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-ink-muted hover:border-border-light hover:text-ink"
                        }
                      >
                        {m.name}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <label className="flex flex-col gap-1.5 sm:w-40">
              <span className="text-xs font-medium uppercase tracking-wide text-ink-dim">
                Ordem
              </span>
              <input
                type="number"
                value={form.sort_order}
                onChange={(e) =>
                  setForm((f) => ({ ...f, sort_order: Number(e.target.value) }))
                }
                className="h-11 rounded-sm border border-border bg-bg-surface2 px-3 text-sm text-ink outline-none focus:border-primary"
              />
            </label>

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
          A carregar...
        </div>
      ) : rows.length === 0 ? (
        <p className="py-8 text-sm text-ink-muted">
          Ainda não há nenhum jogo aqui. Adiciona o primeiro acima.
        </p>
      ) : (
        <div className="flex flex-col divide-y divide-border rounded-sm border border-border bg-bg-surface">
          {rows.map((row) => (
            <div key={row.id} className="flex items-start justify-between gap-4 p-4">
              <div className="min-w-0">
                <p className="font-display text-sm font-bold text-ink">
                  {gameTitle(row.game_id)}
                </p>
                <p className="mt-1 text-xs text-ink-dim">{row.progress_percent}% concluído</p>
                <p className="mt-1 text-sm text-ink-muted">{memberNames(row.team_member_ids)}</p>
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
                  aria-label="Remover"
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
