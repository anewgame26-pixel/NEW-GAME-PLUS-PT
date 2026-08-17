"use client";

import { useEffect, useState } from "react";
import { Check, Trash2, Loader2, Mail } from "lucide-react";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

interface ContactMessageRow {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export default function AdminContactosPage() {
  const supabase = createBrowserSupabaseClient();

  const [messages, setMessages] = useState<ContactMessageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRead, setShowRead] = useState(false);

  async function loadAll() {
    setLoading(true);
    const { data } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });
    setMessages(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleToggleRead(id: string, currentlyRead: boolean) {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, is_read: !currentlyRead } : m)));

    const { data, error } = await supabase
      .from("contact_messages")
      .update({ is_read: !currentlyRead })
      .eq("id", id)
      .select("id");

    if (error || !data || data.length === 0) {
      setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, is_read: currentlyRead } : m)));
      alert("Não foi possível atualizar esta mensagem. Tenta novamente.");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Apagar esta mensagem?")) return;
    setMessages((prev) => prev.filter((m) => m.id !== id));
    await supabase.from("contact_messages").delete().eq("id", id);
  }

  const visibleMessages = messages.filter((m) => showRead || !m.is_read);
  const unreadCount = messages.filter((m) => !m.is_read).length;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold uppercase tracking-wide text-ink">
            Contactos
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            Mensagens enviadas através do formulário em /contactos.{" "}
            {unreadCount > 0 && (
              <span className="font-semibold text-primary-light">
                {unreadCount} por ler.
              </span>
            )}
          </p>
        </div>
        <label className="flex items-center gap-2 text-sm text-ink-muted">
          <input
            type="checkbox"
            checked={showRead}
            onChange={(e) => setShowRead(e.target.checked)}
            className="h-4 w-4 accent-primary"
          />
          Mostrar já lidas
        </label>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 py-8 text-sm text-ink-muted">
          <Loader2 width={16} height={16} className="animate-spin" />
          A carregar...
        </div>
      ) : visibleMessages.length === 0 ? (
        <p className="py-8 text-sm text-ink-muted">
          {messages.length === 0 ? "Ainda não há mensagens." : "Nenhuma mensagem por ler. 🎉"}
        </p>
      ) : (
        <div className="flex flex-col divide-y divide-border rounded-sm border border-border bg-bg-surface">
          {visibleMessages.map((msg) => (
            <div key={msg.id} className="flex items-start justify-between gap-4 p-4">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                      !msg.is_read
                        ? "border-primary/40 bg-primary/10 text-primary-light"
                        : "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                    }`}
                  >
                    {!msg.is_read ? "Por ler" : "Lida"}
                  </span>
                  <span className="text-xs text-ink-dim">
                    {new Date(msg.created_at).toLocaleDateString("pt-PT", {
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <p className="mt-1.5 font-display text-sm font-bold text-ink">{msg.subject}</p>
                <p className="mt-1 text-sm text-ink-muted">{msg.message}</p>
                <a
                  href={`mailto:${msg.email}`}
                  className="mt-1.5 inline-flex items-center gap-1 text-xs text-ink-dim hover:text-ink"
                >
                  <Mail width={11} height={11} />
                  {msg.name} — {msg.email}
                </a>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <button
                  onClick={() => handleToggleRead(msg.id, msg.is_read)}
                  title={!msg.is_read ? "Marcar como lida" : "Marcar como por ler"}
                  className="flex h-8 w-8 items-center justify-center rounded-sm border border-border text-ink-muted hover:border-emerald-500/50 hover:text-emerald-400"
                >
                  <Check width={14} height={14} />
                </button>
                <button
                  onClick={() => handleDelete(msg.id)}
                  title="Apagar"
                  className="flex h-8 w-8 items-center justify-center rounded-sm border border-border text-ink-muted hover:border-primary hover:text-primary"
                >
                  <Trash2 width={14} height={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
