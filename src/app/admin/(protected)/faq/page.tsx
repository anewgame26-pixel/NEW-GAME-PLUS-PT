"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Check, Loader2 } from "lucide-react";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

interface FAQRow {
  id: string;
  question: string;
  answer: string;
  sort_order: number;
}

const emptyForm = { question: "", answer: "", sort_order: 0 };

export default function AdminFAQPage() {
  const supabase = createBrowserSupabaseClient();

  const [items, setItems] = useState<FAQRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  async function loadItems() {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from("faq_items")
      .select("id, question, answer, sort_order")
      .order("sort_order", { ascending: true });

    if (error) {
      setError("Não foi possível carregar o FAQ. Tenta novamente.");
    } else {
      setItems(data ?? []);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function startEdit(row: FAQRow) {
    setShowNewForm(false);
    setEditingId(row.id);
    setForm({ question: row.question, answer: row.answer, sort_order: row.sort_order });
  }

  function startNew() {
    setEditingId(null);
    setShowNewForm(true);
    const nextOrder = items.length > 0 ? Math.max(...items.map((i) => i.sort_order)) + 1 : 1;
    setForm({ ...emptyForm, sort_order: nextOrder });
  }

  function cancelForm() {
    setEditingId(null);
    setShowNewForm(false);
    setForm(emptyForm);
  }

  async function handleSave() {
    if (!form.question.trim() || !form.answer.trim()) return;
    setSaving(true);
    setError(null);

    if (editingId) {
      const { error } = await supabase
        .from("faq_items")
        .update({
          question: form.question.trim(),
          answer: form.answer.trim(),
          sort_order: form.sort_order,
        })
        .eq("id", editingId);

      if (error) setError("Não foi possível guardar as alterações.");
    } else {
      const { error } = await supabase.from("faq_items").insert({
        question: form.question.trim(),
        answer: form.answer.trim(),
        sort_order: form.sort_order,
      });

      if (error) setError("Não foi possível criar a pergunta.");
    }

    setSaving(false);
    if (!error) {
      cancelForm();
      await loadItems();
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Apagar esta pergunta do FAQ? Não é possível desfazer.")) return;
    const { error } = await supabase.from("faq_items").delete().eq("id", id);
    if (error) {
      setError("Não foi possível apagar a pergunta.");
    } else {
      await loadItems();
    }
  }

  const isFormOpen = showNewForm || editingId !== null;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold uppercase tracking-wide text-ink">
            FAQ
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            Perguntas frequentes visíveis em {'"'}Perguntas Frequentes{'"'} no site público.
          </p>
        </div>
        {!isFormOpen && (
          <button
            onClick={startNew}
            className="flex items-center gap-1.5 rounded-sm bg-primary px-4 py-2 text-sm font-semibold text-white shadow-glow hover:bg-primary-light"
          >
            <Plus width={15} height={15} />
            Nova Pergunta
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
            {editingId ? "Editar Pergunta" : "Nova Pergunta"}
          </h2>
          <div className="flex flex-col gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium uppercase tracking-wide text-ink-dim">
                Pergunta
              </span>
              <input
                type="text"
                value={form.question}
                onChange={(e) => setForm((f) => ({ ...f, question: e.target.value }))}
                placeholder="Ex: Como decidem se uma platina vale a pena?"
                className="h-11 rounded-sm border border-border bg-bg-surface2 px-3 text-sm text-ink placeholder:text-ink-dim outline-none focus:border-primary"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium uppercase tracking-wide text-ink-dim">
                Resposta
              </span>
              <textarea
                rows={4}
                value={form.answer}
                onChange={(e) => setForm((f) => ({ ...f, answer: e.target.value }))}
                placeholder="Escreve a resposta completa..."
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
          A carregar perguntas...
        </div>
      ) : items.length === 0 ? (
        <p className="py-8 text-sm text-ink-muted">
          Ainda não há perguntas no FAQ. Cria a primeira acima.
        </p>
      ) : (
        <div className="flex flex-col divide-y divide-border rounded-sm border border-border bg-bg-surface">
          {items.map((row) => (
            <div key={row.id} className="flex items-start justify-between gap-4 p-4">
              <div className="min-w-0">
                <p className="font-display text-sm font-bold text-ink">{row.question}</p>
                <p className="mt-1 text-sm text-ink-muted">{row.answer}</p>
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
