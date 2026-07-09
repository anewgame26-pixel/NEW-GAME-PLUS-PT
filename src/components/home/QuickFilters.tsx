"use client";

import { useState } from "react";
import { Clock, ShieldCheck, Users, Sparkles, Swords, Skull, Wand2 } from "lucide-react";
import { Chip } from "@/components/ui/Chip";

const FILTERS = [
  { id: "10h", label: "Até 10h", icon: Clock },
  { id: "20h", label: "Até 20h", icon: Clock },
  { id: "40h", label: "Até 40h", icon: Clock },
  { id: "sem-missables", label: "Sem Perdíveis", icon: ShieldCheck },
  { id: "coop", label: "Coop", icon: Users },
  { id: "facil", label: "Fácil", icon: Sparkles },
  { id: "medio", label: "Médio", icon: Swords },
  { id: "dificil", label: "Difícil", icon: Skull },
  { id: "soulslike", label: "Soulslike", icon: Skull },
  { id: "rpg", label: "RPG", icon: Wand2 },
  { id: "terror", label: "Terror", icon: Skull },
];

export function QuickFilters() {
  const [active, setActive] = useState<string[]>([]);

  const toggle = (id: string) => {
    setActive((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]));
  };

  return (
    <section className="border-b border-border bg-bg-raised">
      <div className="mx-auto max-w-[1440px] px-4 py-4 lg:px-8">
        <div className="no-scrollbar flex items-center gap-2 overflow-x-auto">
          <span className="shrink-0 text-xs font-medium uppercase tracking-wide text-ink-dim">
            Filtros rápidos
          </span>
          {FILTERS.map((f) => (
            <Chip
              key={f.id}
              active={active.includes(f.id)}
              onClick={() => toggle(f.id)}
              icon={<f.icon width={13} height={13} />}
            >
              {f.label}
            </Chip>
          ))}
        </div>
      </div>
    </section>
  );
}
