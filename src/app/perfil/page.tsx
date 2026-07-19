import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { LogOut, Heart, Gamepad2, ExternalLink } from "lucide-react";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getGamesByIds } from "@/lib/data/games";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { GameCard } from "@/components/game/GameCard";
import { AvatarUploader } from "@/components/perfil/AvatarUploader";
import { ProfileEditForm } from "@/components/perfil/ProfileEditForm";
import { signOutVisitorAction } from "@/app/perfil/actions";
import type { GameProgressStatus } from "@/types";

export const dynamic = "force-dynamic";

const STATUS_LABELS: Record<GameProgressStatus, string> = {
  a_jogar: "A jogar",
  platinado: "Platinado",
  abandonado: "Abandonado",
};

const STATUS_TONES: Record<GameProgressStatus, string> = {
  a_jogar: "border-accent/40 bg-accent/10 text-accent",
  platinado: "border-gold/40 bg-gold/10 text-gold",
  abandonado: "border-ink-dim/40 bg-ink-dim/10 text-ink-dim",
};

export default async function PerfilPage() {
  // Segunda verificação, mesmo já tendo o middleware — mesma prática já
  // usada no /admin (nunca confiar só na middleware para proteger uma
  // página).
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/entrar");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("username, avatar_url, psn_url, created_at")
    .eq("id", user.id)
    .single();

  const [{ data: favoriteRows }, { data: progressRows }] = await Promise.all([
    supabase.from("favorites").select("game_id").eq("user_id", user.id),
    supabase
      .from("game_progress")
      .select("game_id, status, progress_percent")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false }),
  ]);

  const favoriteGames = await getGamesByIds((favoriteRows ?? []).map((f) => f.game_id as string));

  const progressGames = await getGamesByIds((progressRows ?? []).map((p) => p.game_id as string));
  const progressByGameId = new Map(
    (progressRows ?? []).map((p) => [
      p.game_id as string,
      { status: p.status as GameProgressStatus, percent: p.progress_percent as number },
    ])
  );

  const memberSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString("pt-PT", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <>
      <Header />
      <main>
        <PageHeader title="O Meu Perfil" description="A tua conta de visitante na NewGame+." />
        <div className="mx-auto max-w-3xl px-4 py-10 lg:px-8">
          <Card className="p-6">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
              <AvatarUploader userId={user.id} initialAvatarUrl={profile?.avatar_url ?? null} />

              <div className="flex-1">
                <p className="text-sm text-ink-muted">{user.email}</p>
                {memberSince && (
                  <p className="mt-0.5 text-xs text-ink-dim">Conta criada em {memberSince}.</p>
                )}
                {profile?.psn_url && (
                  <a
                    href={profile.psn_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-accent hover:text-accent/80"
                  >
                    Perfil PSN
                    <ExternalLink width={11} height={11} />
                  </a>
                )}

                <div className="mt-4 border-t border-border pt-4">
                  <ProfileEditForm
                    userId={user.id}
                    initialUsername={profile?.username ?? null}
                    initialPsnUrl={profile?.psn_url ?? null}
                  />
                </div>
              </div>
            </div>

            <form action={signOutVisitorAction} className="mt-6 border-t border-border pt-5">
              <button
                type="submit"
                className="flex items-center gap-1.5 rounded-sm border border-border px-4 py-2 text-sm font-medium text-ink-muted transition-colors hover:border-border-light hover:text-ink"
              >
                <LogOut width={14} height={14} />
                Sair
              </button>
            </form>
          </Card>

          <div className="mt-8">
            <div className="mb-4 flex items-center gap-2">
              <Gamepad2 width={18} height={18} className="text-accent" />
              <h2 className="font-display text-lg font-bold uppercase tracking-wide text-ink">
                O Meu Progresso
              </h2>
            </div>

            {progressGames.length === 0 ? (
              <Card className="p-6">
                <p className="text-sm text-ink-muted">
                  Ainda não estás a acompanhar nenhum jogo. Abre a página de um jogo e clica em
                  &quot;Acompanhar o meu progresso&quot;.
                </p>
              </Card>
            ) : (
              <div className="flex flex-col divide-y divide-border rounded-sm border border-border bg-bg-surface">
                {progressGames.map((game) => {
                  const entry = progressByGameId.get(game.id);
                  if (!entry) return null;
                  return (
                    <Link
                      key={game.id}
                      href={`/guias/${game.slug}`}
                      className="flex items-center gap-4 p-4 transition-colors hover:bg-bg-surface2"
                    >
                      <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded-sm border border-border">
                        <Image
                          src={game.coverUrl}
                          alt={`Capa de ${game.title}`}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-display text-sm font-bold text-ink">
                          {game.title}
                        </p>
                        <div className="mt-1.5 flex items-center gap-2">
                          <span
                            className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${STATUS_TONES[entry.status]}`}
                          >
                            {STATUS_LABELS[entry.status]}
                          </span>
                          <span className="text-xs text-ink-dim">{entry.percent}%</span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          <div className="mt-8">
            <div className="mb-4 flex items-center gap-2">
              <Heart width={18} height={18} className="text-primary" />
              <h2 className="font-display text-lg font-bold uppercase tracking-wide text-ink">
                Os Meus Favoritos
              </h2>
            </div>

            {favoriteGames.length === 0 ? (
              <Card className="p-6">
                <p className="text-sm text-ink-muted">
                  Ainda não guardaste nenhum jogo. Clica no coração num jogo qualquer para o
                  guardares aqui.
                </p>
              </Card>
            ) : (
              <div className="flex flex-wrap gap-4">
                {favoriteGames.map((game) => (
                  <GameCard key={game.id} game={game} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
