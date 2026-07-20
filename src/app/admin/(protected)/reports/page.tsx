"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, Trash2, Loader2, Mail } from "lucide-react";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

interface ReportRow {
  id: string;
  game_id: string | null;
  location: string;
  description: string;
  reporter_email: string | null;
  status: "pendente" | "resolvido";
  created_at: string;
}

interface GameOption {
  id: string;
  title: string;
  slug: string;
}

export default function AdminReportsPage() {
  const supabase = createBrowserSupabaseClient();

  const [reports, setReports] = useState<ReportRow[]>([]);
  const [games, setGames] = useState<GameOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [showResolved, setShowResolved] = useState(false);

  async function loadAll() {
    setLoading(true);
    const [reportsRes, gamesRes] = await Promise.all([
      supabase.from("reports").select("*").order("created_at", { ascending: false }),
      supabase.from("games").select("id, title, slug"),
    ]);
    setReports(reportsRes.data ?? []);
    setGames(gamesRes.data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function gameFor(gameId: string | null) {
    return games.find((g) => g.id === gameId) ?? null;
  }

  async function handleToggleResolved(id: string, currentStatus: string) {
    const nextStatus = currentStatus === "pendente" ? "resolvido" : "pendente";
    setReports((prev) => prev.map((r) => (r.id === id ? { ...r, status: nextStatus } : r)));
    await supabase.from("reports").update({ status: nextStatus }).eq("id", id);
  }

  async function handleDelete(id: string) {
    if (!confirm("Apagar este report?")) return;
    setReports((prev) => prev.filter((r) => r.id !== id));
    await supabase.from("reports").delete().eq("id", id);
  }

  const visibleReports = reports.filter((r) => showResolved || r.status === "pendente");
  const pendingCount = reports.filter((r) => r.status === "pendente").length;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold uppercase tracking-wide text-ink">
            Reports
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            Erros reportados pelos visitantes através de /reportar.{" "}
            {pendingCount > 0 && (
              <span className="font-semibold text-primary-light">
                {pendingCount} por rever.
              </span>
            )}
          </p>
        </div>
        <label className="flex items-center gap-2 text-sm text-ink-muted">
          <input
            type="checkbox"
            checked={showResolved}
            onChange={(e) => setShowResolved(e.target.checked)}
            className="h-4 w-4 accent-primary"
          />
          Mostrar resolvidos
        </label>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 py-8 text-sm text-ink-muted">
          <Loader2 width={16} height={16} className="animate-spin" />
          A carregar...
        </div>
      ) : visibleReports.length === 0 ? (
        <p className="py-8 text-sm text-ink-muted">
          {reports.length === 0 ? "Ainda não há reports." : "Nenhum report pendente. 🎉"}
        </p>
      ) : (
        <div className="flex flex-col divide-y divide-border rounded-sm border border-border bg-bg-surface">
          {visibleReports.map((report) => {
            const game = gameFor(report.game_id);
            return (
              <div key={report.id} className="flex items-start justify-between gap-4 p-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                        report.status === "pendente"
                          ? "border-primary/40 bg-primary/10 text-primary-light"
                          : "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                      }`}
                    >
                      {report.status === "pendente" ? "Pendente" : "Resolvido"}
                    </span>
                    {game && (
                      <Link
                        href={`/admin/jogos/${game.id}`}
                        className="text-xs font-medium text-accent hover:text-accent/80"
                      >
                        {game.title}
                      </Link>
                    )}
                    <span className="text-xs text-ink-dim">
                      {new Date(report.created_at).toLocaleDateString("pt-PT", {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="mt-1.5 font-display text-sm font-bold text-ink">{report.location}</p>
                  <p className="mt-1 text-sm text-ink-muted">{report.description}</p>
                  {report.reporter_email && (
                    <a
                      href={`mailto:${report.reporter_email}`}
                      className="mt-1.5 inline-flex items-center gap-1 text-xs text-ink-dim hover:text-ink"
                    >
                      <Mail width={11} height={11} />
                      {report.reporter_email}
                    </a>
                  )}
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <button
                    onClick={() => handleToggleResolved(report.id, report.status)}
                    title={report.status === "pendente" ? "Marcar como resolvido" : "Reabrir"}
                    className="flex h-8 w-8 items-center justify-center rounded-sm border border-border text-ink-muted hover:border-emerald-500/50 hover:text-emerald-400"
                  >
                    <Check width={14} height={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(report.id)}
                    title="Apagar"
                    className="flex h-8 w-8 items-center justify-center rounded-sm border border-border text-ink-muted hover:border-primary hover:text-primary"
                  >
                    <Trash2 width={14} height={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
