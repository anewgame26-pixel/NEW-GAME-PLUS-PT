"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Check, Loader2 } from "lucide-react";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import { revalidatePaths } from "@/lib/admin/revalidate";

interface TeamRow {
  id: string;
  name: string;
  role: string;
  avatar_initials: string;
  bio: string;
  favorite_game: string;
  sort_order: number;
}

const emptyForm = {
  name: "",
  role: "",
  avatar_initials: "",
  bio: "",
  favorite_game: "",
  sort_order: 0,
};

export default function AdminEquipaPage() {
  const supabase = createBrowserSupabaseClient();

  const [members, setMembers] = useState<TeamRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  async function loadMembers() {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from("team_members")
      .select("id, name, role, avatar_initials, bio, favorite_game, sort_order")
      .order("sort_order", { ascending: true });

    if (error) {
      setError("Não foi possível carregar a equipa. Tenta novamente.");
    } else {
      setMembers(data ?? []);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadMembers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function startEdit(row: TeamRow) {
    setShowNewForm(false);
    setEditingId(row.id);
    setForm({
      name: row.name,
      role: row.role,
      avatar_initials: row.avatar_initials,
      bio: row.bio,
      favorite_game: row.favorite_game,
      sort_order: row.sort_order,
    });
  }

  function startNew() {
    setEditingId(null);
    setShowNewForm(true);
    const nextOrder = members.length > 0 ? Math.max(...members.map((m) => m.sort_order)) + 1 : 1;
    setForm({ ...emptyForm, sort_order: nextOrder });
  }

  function cancelForm() {
    setEditingId(null);
    setShowNewForm(false);
    setForm(emptyForm);
  }

  async function handleSave() {
    if (!form.name.trim() || !form.role.trim()) return;
    setSaving(true);
    setError(null);

    const payload = {
      name: form.name.trim(),
      role: form.role.trim(),
      avatar_initials: form.avatar_initials.trim().toUpperCase().slice(0, 2),
      bio: form.bio.trim(),
      favorite_game: form.favorite_game.trim(),
      sort_order: form.sort_order,
    };

    const result = editingId
      ? await supabase.from("team_members").update(payload).eq("id", editingId)
      : await supabase.from("team_members").insert(payload);

    setSaving(false);

    if (result.error) {
      setError(
        editingId ? "Não foi possível guardar as alterações." : "Não foi possível criar o membro."
      );
      return;
    }

    cancelForm();
    await loadMembers();
    await revalidatePaths(["/covil"]);
  }

  async function handleDelete(id: string) {
    if (!confirm("Remover este membro da equipa? Não é possível desfazer.")) return;
    const { error } = await supabase.from("team_members").delete().eq("id", id);
    if (error) {
      setError("Não foi possível remover o membro.");
    } else {
      await loadMembers();
      await revalidatePaths(["/covil"]);
    }
  }

  const isFormOpen = showNewForm || editingId !== null;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold uppercase tracking-wide text-ink">
            Equipa
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            Membros visíveis em {'"'}Os Caçadores de Platina{'"'} na página O Covil.
          </p>
        </div>
        {!isFormOpen && (
          <button
            onClick={startNew}
            className="flex items-center gap-1.5 rounded-sm bg-primary px-4 py-2 text-sm font-semibold text-white shadow-glow hover:bg-primary-light"
          >
            <Plus width={15} height={15} />
            Novo Membro
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 rounded-sm border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-primary-light">
          {error}
        </div>
      )}

      {isFormOpen && (
        <div className="mb-6 rounded-sm border border-border bg-bg-surface p-5">
          <h2 className="mb-4 font-display text-sm font-bold uppercase tracking-wide text-ink-dim">
            {editingId ? "Editar Membro" : "Novo Membro"}
          </h2>
          <div className="flex flex-col gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium uppercase tracking-wide text-ink-dim">
                  Nome
                </span>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Ex: Tiago Ferreira"
                  className="h-11 rounded-sm border border-border bg-bg-surface2 px-3 text-sm text-ink placeholder:text-ink-dim outline-none focus:border-primary"
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium uppercase tracking-wide text-ink-dim">
                  Cargo
                </span>
                <input
                  type="text"
                  value={form.role}
                  onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                  placeholder="Ex: Fundador & Caçador-Chefe"
                  className="h-11 rounded-sm border border-border bg-bg-surface2 px-3 text-sm text-ink placeholder:text-ink-dim outline-none focus:border-primary"
                />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium uppercase tracking-wide text-ink-dim">
                  Iniciais do avatar (máx. 2 letras)
                </span>
                <input
                  type="text"
                  maxLength={2}
                  value={form.avatar_initials}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, avatar_initials: e.target.value.toUpperCase() }))
                  }
                  placeholder="Ex: TF"
                  className="h-11 rounded-sm border border-border bg-bg-surface2 px-3 text-sm uppercase text-ink placeholder:text-ink-dim outline-none focus:border-primary"
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium uppercase tracking-wide text-ink-dim">
                  Platina favorita
                </span>
                <input
                  type="text"
                  value={form.favorite_game}
                  onChange={(e) => setForm((f) => ({ ...f, favorite_game: e.target.value }))}
                  placeholder="Ex: Wraithbound"
                  className="h-11 rounded-sm border border-border bg-bg-surface2 px-3 text-sm text-ink placeholder:text-ink-dim outline-none focus:border-primary"
                />
              </label>
            </div>

            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium uppercase tracking-wide text-ink-dim">
                Bio
              </span>
              <textarea
                rows={3}
                value={form.bio}
                onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
                placeholder="Uma ou duas frases sobre esta pessoa..."
                className="resize-none rounded-sm border border-border bg-bg-surface2 px-3 py-2.5 text-sm text-ink placeholder:text-ink-dim outline-none focus:border-primary"
              />
            </label>

            <label className="flex max-w-[160px] flex-col gap-1.5">
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
          A carregar equipa...
        </div>
      ) : members.length === 0 ? (
        <p className="py-8 text-sm text-ink-muted">
          Ainda não há membros na equipa. Cria o primeiro acima.
        </p>
      ) : (
        <div className="flex flex-col divide-y divide-border rounded-sm border border-border bg-bg-surface">
          {members.map((row) => (
            <div key={row.id} className="flex items-start justify-between gap-4 p-4">
              <div className="flex min-w-0 gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-primary/10 font-display text-sm font-bold text-primary">
                  {row.avatar_initials}
                </span>
                <div className="min-w-0">
                  <p className="font-display text-sm font-bold text-ink">{row.name}</p>
                  <p className="text-xs uppercase tracking-wide text-ink-dim">{row.role}</p>
                  <p className="mt-1 text-sm text-ink-muted">{row.bio}</p>
                </div>
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
