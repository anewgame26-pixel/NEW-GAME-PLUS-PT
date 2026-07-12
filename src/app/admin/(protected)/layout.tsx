import { redirect } from "next/navigation";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { signOutAction } from "@/app/admin/actions";

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Segunda verificação, mesmo já tendo o middleware — mantemos as duas
  // por segurança (boa prática recomendada para apps Next.js: nunca
  // confiar só na middleware para proteger uma página).
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-bg">
      <header className="border-b border-border bg-bg-surface">
        <div className="mx-auto flex h-14 max-w-[1440px] items-center justify-between px-4 lg:px-8">
          <Link href="/admin" className="font-display text-sm font-bold uppercase tracking-wide text-ink">
            Painel NewGame+
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-xs text-ink-muted">{user.email}</span>
            <form action={signOutAction}>
              <button
                type="submit"
                className="flex items-center gap-1.5 rounded-sm border border-border px-3 py-1.5 text-xs font-medium text-ink-muted transition-colors hover:border-border-light hover:text-ink"
              >
                <LogOut width={13} height={13} />
                Sair
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-[1440px] px-4 py-8 lg:px-8">{children}</main>
    </div>
  );
}
