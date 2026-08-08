"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function RedefinirPasswordPage() {
  return (
    <>
      <Header />
      <main>
        <PageHeader title="Nova password" description="Escolhe uma password nova para a tua conta." />
        <div className="mx-auto max-w-md px-4 py-10 lg:px-8">
          <Card className="p-6">
            <RedefinirForm />
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
}

function RedefinirForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("A password tem de ter pelo menos 6 caracteres.");
      return;
    }
    if (password !== confirmPassword) {
      setError("As duas passwords não coincidem.");
      return;
    }

    setLoading(true);
    const supabase = createBrowserSupabaseClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (updateError) {
      setError(
        "Não foi possível alterar a password. O link pode ter expirado — pede um novo email de recuperação."
      );
      return;
    }

    setDone(true);
    setTimeout(() => {
      router.push("/perfil");
      router.refresh();
    }, 1800);
  };

  if (done) {
    return (
      <p className="text-center text-sm text-ink">
        Password alterada com sucesso! A entrar na tua conta...
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-medium uppercase tracking-wide text-ink-dim">
          Password nova
        </span>
        <input
          required
          type="password"
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="h-11 rounded-sm border border-border bg-bg-surface2 px-3 text-sm text-ink outline-none focus:border-primary"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-medium uppercase tracking-wide text-ink-dim">
          Confirmar password nova
        </span>
        <input
          required
          type="password"
          minLength={6}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="h-11 rounded-sm border border-border bg-bg-surface2 px-3 text-sm text-ink outline-none focus:border-primary"
        />
      </label>

      {error && <p className="text-sm text-primary-light">{error}</p>}

      <Button type="submit" disabled={loading} className="mt-1 w-full">
        {loading ? "A guardar..." : "Guardar password nova"}
      </Button>
    </form>
  );
}
