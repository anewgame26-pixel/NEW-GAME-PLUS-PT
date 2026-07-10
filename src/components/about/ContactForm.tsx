"use client";

import { FormEvent, useState } from "react";
import { Check, Mail } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <Card className="flex flex-col items-center gap-3 p-8 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
          <Check width={22} height={22} />
        </span>
        <p className="font-display text-base font-bold text-ink">Mensagem enviada!</p>
        <p className="max-w-sm text-sm text-ink-muted">
          Obrigado pelo contacto — a equipa da NewGame+ responde normalmente em 2 a 3 dias úteis.
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium uppercase tracking-wide text-ink-dim">Nome</span>
            <input
              required
              type="text"
              placeholder="O teu nome"
              className="h-11 rounded-sm border border-border bg-bg-surface2 px-3 text-sm text-ink placeholder:text-ink-dim outline-none focus:border-primary"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium uppercase tracking-wide text-ink-dim">Email</span>
            <input
              required
              type="email"
              placeholder="o-teu-email@exemplo.com"
              className="h-11 rounded-sm border border-border bg-bg-surface2 px-3 text-sm text-ink placeholder:text-ink-dim outline-none focus:border-primary"
            />
          </label>
        </div>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium uppercase tracking-wide text-ink-dim">Assunto</span>
          <input
            required
            type="text"
            placeholder="Sobre o que é o teu contacto?"
            className="h-11 rounded-sm border border-border bg-bg-surface2 px-3 text-sm text-ink placeholder:text-ink-dim outline-none focus:border-primary"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium uppercase tracking-wide text-ink-dim">Mensagem</span>
          <textarea
            required
            rows={5}
            placeholder="Escreve a tua mensagem..."
            className="resize-none rounded-sm border border-border bg-bg-surface2 px-3 py-2.5 text-sm text-ink placeholder:text-ink-dim outline-none focus:border-primary"
          />
        </label>

        <Button type="submit" className="self-start">
          <Mail width={15} height={15} />
          Enviar Mensagem
        </Button>
      </form>
    </Card>
  );
}
