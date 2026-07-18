"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Loader2, ArrowUp, ArrowDown } from "lucide-react";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

interface GameOption {
  id: string;
  title: string;
}

interface CandidateRow {
  id: string;
  game_id: string;
  sort_order: number;
  votes_count: number;
}

export default function AdminVotacaoPage() {
  const supabase = createBrowserSupabaseClient();

  const [rows, setRows] = useState<CandidateRow[]>([]);
  const [games, setGames] = useState<GameOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addingGameId, setAddingGameId] = useState("");
  const [saving, setSaving] = useState(false);

  async function loadAll() {
    setLoading(true);
    setError(null);

    const [candidatesRes, gamesRes, countsRes] = await Promise.all([
      supabase
        .from("voting_candidates")
        .select("id, game_id, sort_order")
        .order("sort_order", { ascending: true }),
      supabase.from("games").select("id, title").order("title", { ascending: true }),
      supabase.rpc("get_vote_counts"),
    ]);

    if (candidatesRes.error || gamesRes.error) {
      setError("Não foi possível carregar os dados. Tenta novamente.");
    } else {
      const countsByCandidateId = new Map<string, number>(
        (countsRes.data ?? []).map((r: { candidate_id: string; votes_count: number }) => [
          r.candidate_id,
          Number(r.votes_count),
        ])
      );
      setRows(
        (candidatesRes.data ?? []).map((c) => ({
          ...c,
          votes_count: countsByCandidateId.get(c.id) ?? 0,
        }))
      );
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

  // Jogos que ainda não estão na lista de candidatos.
  const availableGames = games.filter((g) => !rows.some((r) => r.game_id === g.id));

  async function handleAdd() {
    if (!addingGameId) return;
    setSaving(true);
    setError(null);

    const nextOrder = rows.length > 0 ? Math.max(...rows.map((r) => r.sort_order)) + 1 : 0;
    const { error } = await supabase
      .from("voting_candidates")
      .insert({ game_id: addingGameId, sort_order: nextOrder });

    if (error) setError("Não foi possível adicionar. Tenta novamente.");

    setSaving(false);
    setAddingGameId("");
    if (!error) await loadAll();
  }

  async function handleRemove(id: string) {
    if (!confirm("Remover este jogo da votação? Os votos já dados também são apagados.")) return;
    const { error } = await supabase.from("voting_candidates").delete().eq("id", id);
    if (error) {
      setError("Não foi possível remover.");
    } else {
      await loadAll();
    }
  }

  async function handleMove(id: string, direction: "up" | "down") {
    const index = rows.findIndex((r) => r.id === id);
    const swapWith = direction === "up" ? index - 1 : index + 1;
    if (index === -1 || swapWith < 0 || swapWith >= rows.length) return;

    const a = rows[index];
    const b = rows[swapWith];

    setSaving(true);
    const [resA, resB] = await Promise.all([
      supabase.from("voting_candidates").update({ sort_order: b.sort_order }).eq("id", a.id),
      supabase.from("voting_candidates").update({ sort_order: a.sort_order }).eq("id", b.id),
    ]);
    setSaving(false);

    if (resA.error || resB.error) {
      setError("Não foi possível reordenar.");
    } else {
      await loadAll();
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold uppercase tracking-wide text-ink">
          Votação — Próxima Platina
        </h1>
        <p className="mt-1 text-sm text-ink-muted">
          Escolhe a lista curta de candidatos — os visitantes só podem votar dentro desta lista,
          não sugerir jogos novos. A ordem aqui é só para o painel; a página pública ordena
          sempre pelo mais votado.
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-sm border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-primary-light">
          {error}
        </div>
      )}

      <div className="mb-6 flex items-end gap-2 rounded-sm border border-border bg-bg-surface p-4">
        <label className="flex flex-1 flex-col gap-1.5">
          <span className="text-xs font-medium uppercase tracking-wide text-ink-dim">
            Adicionar candidato
          </span>
          <select
            value={addingGameId}
            onChange={(e) => setAddingGameId(e.target.value)}
            className="h-11 rounded-sm border border-border bg-bg-surface2 px-3 text-sm text-ink outline-none focus:border-primary"
          >
            <option value="">— escolhe um jogo —</option>
            {availableGames.map((g) => (
              <option key={g.id} value={g.id}>
                {g.title}
              </option>
            ))}
          </select>
        </label>
        <button
          onClick={handleAdd}
          disabled={!addingGameId || saving}
          className="flex h-11 items-center gap-1.5 rounded-sm bg-primary px-4 text-sm font-semibold text-white shadow-glow hover:bg-primary-light disabled:opacity-50"
        >
          <Plus width={15} height={15} />
          Adicionar
        </button>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 py-8 text-sm text-ink-muted">
          <Loader2 width={16} height={16} className="animate-spin" />
          A carregar...
        </div>
      ) : rows.length === 0 ? (
        <p className="py-8 text-sm text-ink-muted">
          Ainda não há candidatos. Adiciona o primeiro acima.
        </p>
      ) : (
        <div className="flex flex-col divide-y divide-border rounded-sm border border-border bg-bg-surface">
          {rows.map((row, i) => (
            <div key={row.id} className="flex items-center justify-between gap-4 p-4">
              <div className="min-w-0">
                <p className="font-display text-sm font-bold text-ink">{gameTitle(row.game_id)}</p>
                <p className="mt-1 text-xs text-ink-dim">{row.votes_count} votos</p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <button
                  onClick={() => handleMove(row.id, "up")}
                  disabled={i === 0 || saving}
                  aria-label="Mover para cima"
                  className="flex h-8 w-8 items-center justify-center rounded-sm border border-border text-ink-muted hover:border-border-light hover:text-ink disabled:opacity-30"
                >
                  <ArrowUp width={13} height={13} />
                </button>
                <button
                  onClick={() => handleMove(row.id, "down")}
                  disabled={i === rows.length - 1 || saving}
                  aria-label="Mover para baixo"
                  className="flex h-8 w-8 items-center justify-center rounded-sm border border-border text-ink-muted hover:border-border-light hover:text-ink disabled:opacity-30"
                >
                  <ArrowDown width={13} height={13} />
                </button>
                <button
                  onClick={() => handleRemove(row.id)}
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
