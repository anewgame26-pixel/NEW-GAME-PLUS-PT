"use client";

import { Suspense, useState, type FormEvent } from "react";
import Link from "next/link";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function RecuperarPasswordPage() {
  return (
    <>
      <Header />
      <main>
        <PageHeader
          title="Recuperar password"
          description="Enviamos-te um email com um link para escolheres uma password nova."
        />
        <div className="mx-auto max-w-md px-4 py-10 lg:px-8">
          <Card className="p-6">
            <Suspense fallback={null}>
              <RecuperarForm />
            </Suspense>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
}

function RecuperarForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createBrowserSupabaseClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(
        "/redefinir-password"
      )}`,
    });

    setLoading(false);

    // Por segurança, mostramos sempre a mesma mensagem de sucesso, quer o
    // email exista ou não na base de dados — assim ninguém consegue usar
    // este formulário para descobrir que emails estão registados no site.
    if (!resetError) {
      setSent(true);
    } else {
      setError("Não foi possível enviar o email. Tenta novamente daqui a pouco.");
    }
  };

  if (sent) {
    return (
      <div className="text-center">
        <p className="text-sm text-ink">
          Se existir uma conta com o email <span className="font-medium text-white">{email}</span>,
          vais receber uma mensagem com um link para escolheres uma password nova.
        </p>
        <p className="mt-3 text-xs text-ink-dim">
          Não te esqueças de verificar a pasta de spam/lixo, se não aparecer em alguns minutos.
        </p>
        <Link
          href="/entrar"
          className="mt-5 inline-block text-sm font-medium text-primary hover:text-primary-light"
        >
          Voltar ao login
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-medium uppercase tracking-wide text-ink-dim">Email</span>
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-11 rounded-sm border border-border bg-bg-surface2 px-3 text-sm text-ink outline-none focus:border-primary"
        />
      </label>

      {error && <p className="text-sm text-primary-light">{error}</p>}

      <Button type="submit" disabled={loading} className="mt-1 w-full">
        {loading ? "A enviar..." : "Enviar email de recuperação"}
      </Button>

      <p className="text-center text-sm text-ink-muted">
        <Link href="/entrar" className="font-medium text-primary hover:text-primary-light">
          Voltar ao login
        </Link>
      </p>
    </form>
  );
}
