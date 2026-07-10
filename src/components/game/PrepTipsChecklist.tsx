"use client";

import { useState } from "react";
import { CheckSquare, Square, ListChecks } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

interface PrepTipsChecklistProps {
  tips: string[];
}

export function PrepTipsChecklist({ tips }: PrepTipsChecklistProps) {
  const [checked, setChecked] = useState<boolean[]>(() => tips.map(() => false));

  const toggle = (index: number) => {
    setChecked((prev) => prev.map((v, i) => (i === index ? !v : v)));
  };

  return (
    <section className="border-t border-border py-10">
      <div className="mx-auto max-w-[1440px] px-4 lg:px-8">
        <div className="mb-5 flex items-center gap-2">
          <ListChecks width={18} height={18} className="text-primary" />
          <h2 className="font-display text-xl font-bold uppercase tracking-wide text-ink">
            Dicas Antes de Começar
          </h2>
        </div>

        <Card className="p-5">
          <ul className="flex flex-col divide-y divide-border">
            {tips.map((tip, i) => (
              <li key={tip}>
                <button
                  type="button"
                  onClick={() => toggle(i)}
                  className="flex w-full items-start gap-3 py-3 text-left first:pt-0 last:pb-0"
                >
                  {checked[i] ? (
                    <CheckSquare width={18} height={18} className="mt-0.5 shrink-0 text-primary" />
                  ) : (
                    <Square width={18} height={18} className="mt-0.5 shrink-0 text-ink-dim" />
                  )}
                  <span
                    className={cn(
                      "text-sm",
                      checked[i] ? "text-ink-dim line-through" : "text-ink-muted"
                    )}
                  >
                    {tip}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </section>
  );
}
