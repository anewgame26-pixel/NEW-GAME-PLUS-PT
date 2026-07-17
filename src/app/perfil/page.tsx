import { redirect } from "next/navigation";
import { LogOut, User, Heart } from "lucide-react";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getGamesByIds } from "@/lib/data/games";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { GameCard } from "@/components/game/GameCard";
import { signOutVisitorAction } from "@/app/perfil/actions";

export const dynamic = "force-dynamic";

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
    .select("username, created_at")
    .eq("id", user.id)
    .single();

  const { data: favoriteRows } = await supabase
    .from("favorites")
    .select("game_id")
    .eq("user_id", user.id);

  const favoriteGames = await getGamesByIds((favoriteRows ?? []).map((f) => f.game_id as string));

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
            <div className="mb-5 flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
                <User width={22} height={22} />
              </span>
              <div>
                <p className="font-display text-base font-bold text-ink">
                  {profile?.username || "Sem nome definido"}
                </p>
                <p className="text-sm text-ink-muted">{user.email}</p>
              </div>
            </div>

            {memberSince && (
              <p className="mb-5 text-xs text-ink-dim">Conta criada em {memberSince}.</p>
            )}

            <p className="mb-5 text-sm text-ink-muted">
              Votos e progresso pessoal ainda estão a caminho — os favoritos abaixo já são reais.
            </p>

            <form action={signOutVisitorAction}>
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
