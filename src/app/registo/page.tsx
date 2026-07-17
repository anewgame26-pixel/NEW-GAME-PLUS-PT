"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function RegistoPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);

    const supabase = createBrowserSupabaseClient();
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username: username.trim() || null } },
    });

    setLoading(false);

    if (signUpError) {
      const msg = signUpError.message.toLowerCase();
      if (msg.includes("already registered") || msg.includes("already exists")) {
        setError("Já existe uma conta com este email — experimenta entrar em vez de te registares.");
      } else if (msg.includes("password")) {
        setError("A password precisa de pelo menos 6 caracteres.");
      } else {
        setError("Não foi possível criar a conta. Tenta novamente.");
      }
      return;
    }

    if (data.session) {
      // Confirmação de email desativada neste projeto — sessão já ativa.
      router.push("/perfil");
      router.refresh();
    } else {
      // Confirmação de email ativa — falta confirmar antes de entrar.
      setInfo("Falta um passo: enviámos um email de confirmação. Confirma a conta e depois entra normalmente.");
    }
  };

  return (
    <>
      <Header />
      <main>
        <PageHeader
          title="Criar Conta"
          description="Regista-te para guardares favoritos, votares nas próximas platinas e acompanhares o teu progresso (em breve)."
        />
        <div className="mx-auto max-w-md px-4 py-10 lg:px-8">
          <Card className="p-6">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium uppercase tracking-wide text-ink-dim">
                  Nome (opcional)
                </span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Como queres ser identificado"
                  className="h-11 rounded-sm border border-border bg-bg-surface2 px-3 text-sm text-ink placeholder:text-ink-dim outline-none focus:border-primary"
                />
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium uppercase tracking-wide text-ink-dim">
                  Email
                </span>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 rounded-sm border border-border bg-bg-surface2 px-3 text-sm text-ink outline-none focus:border-primary"
                />
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium uppercase tracking-wide text-ink-dim">
                  Password
                </span>
                <input
                  required
                  minLength={6}
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 rounded-sm border border-border bg-bg-surface2 px-3 text-sm text-ink outline-none focus:border-primary"
                />
              </label>

              {error && <p className="text-sm text-primary-light">{error}</p>}
              {info && <p className="text-sm text-accent">{info}</p>}

              <Button type="submit" disabled={loading} className="mt-1 w-full">
                {loading ? "A criar conta..." : "Criar Conta"}
              </Button>
            </form>

            <p className="mt-5 text-center text-sm text-ink-muted">
              Já tens conta?{" "}
              <Link href="/entrar" className="font-medium text-primary hover:text-primary-light">
                Entra aqui
              </Link>
            </p>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
}
