import Link from "next/link";
import { Plus } from "lucide-react";
import { getGames } from "@/lib/data/games";

export default async function AdminJogosPage() {
  const games = await getGames();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold uppercase tracking-wide text-ink">
            Jogos
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            Catálogo e análises. Apagar um jogo só é possível no Supabase Studio.
          </p>
        </div>
        <Link
          href="/admin/jogos/novo"
          className="flex items-center gap-1.5 rounded-sm bg-primary px-4 py-2 text-sm font-semibold text-white shadow-glow hover:bg-primary-light"
        >
          <Plus width={15} height={15} />
          Novo Jogo
        </Link>
      </div>

      {games.length === 0 ? (
        <p className="py-8 text-sm text-ink-muted">
          Ainda não há jogos na base de dados. Cria o primeiro acima.
        </p>
      ) : (
        <div className="flex flex-col divide-y divide-border rounded-sm border border-border bg-bg-surface">
          {games.map((game) => (
            <Link
              key={game.id}
              href={`/admin/jogos/${game.id}`}
              className="flex items-center justify-between gap-4 p-4 transition-colors hover:bg-bg-surface2"
            >
              <div className="min-w-0">
                <p className="font-display text-sm font-bold text-ink">{game.title}</p>
                <p className="text-xs text-ink-dim">{game.developer}</p>
              </div>
              <div className="flex shrink-0 items-center gap-3 text-xs text-ink-muted">
                <span>Dificuldade {game.difficulty}/10</span>
                <span>·</span>
                <span>
                  {game.platinumTimeMin}-{game.platinumTimeMax}h
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
