"use client";

import { Suspense, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function EntrarPage() {
  return (
    <>
      <Header />
      <main>
        <PageHeader title="Entrar" description="Acede à tua conta de visitante." />
        <div className="mx-auto max-w-md px-4 py-10 lg:px-8">
          <Card className="p-6">
            {/* useSearchParams precisa de Suspense em volta em Next.js */}
            <Suspense fallback={null}>
              <LoginForm />
            </Suspense>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/perfil";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createBrowserSupabaseClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);

    if (signInError) {
      setError("Email ou password incorretos.");
      return;
    }

    router.push(next);
    router.refresh();
  };

  return (
    <>
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

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium uppercase tracking-wide text-ink-dim">
            Password
          </span>
          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-11 rounded-sm border border-border bg-bg-surface2 px-3 text-sm text-ink outline-none focus:border-primary"
          />
        </label>

        {error && <p className="text-sm text-primary-light">{error}</p>}

        <Button type="submit" disabled={loading} className="mt-1 w-full">
          {loading ? "A entrar..." : "Entrar"}
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-ink-muted">
        Ainda não tens conta?{" "}
        <Link href="/registo" className="font-medium text-primary hover:text-primary-light">
          Regista-te
        </Link>
      </p>
    </>
  );
}
