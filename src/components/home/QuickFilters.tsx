import Link from "next/link";
import { Clock, ShieldCheck, Users, Sparkles, Swords, Skull, Wand2 } from "lucide-react";
import { Chip } from "@/components/ui/Chip";

const FILTERS = [
  { id: "10h", label: "Até 10h", icon: Clock, href: "/jogos?time=10h" },
  { id: "20h", label: "Até 20h", icon: Clock, href: "/jogos?time=20h" },
  { id: "40h", label: "Até 40h", icon: Clock, href: "/jogos?time=40h" },
  { id: "sem-missables", label: "Sem Perdíveis", icon: ShieldCheck, href: "/jogos?noMissables=1" },
  { id: "coop", label: "Coop", icon: Users, href: "/jogos?genre=coop" },
  { id: "facil", label: "Fácil", icon: Sparkles, href: "/jogos?difficulty=facil" },
  { id: "medio", label: "Médio", icon: Swords, href: "/jogos?difficulty=medio" },
  { id: "dificil", label: "Difícil", icon: Skull, href: "/jogos?difficulty=dificil" },
  { id: "soulslike", label: "Soulslike", icon: Skull, href: "/jogos?genre=soulslike" },
  { id: "rpg", label: "RPG", icon: Wand2, href: "/jogos?genre=rpg" },
  { id: "terror", label: "Terror", icon: Skull, href: "/jogos?genre=terror" },
];

export function QuickFilters() {
  return (
    <section className="border-b border-border bg-bg-raised">
      <div className="mx-auto max-w-[1440px] px-4 py-4 lg:px-8">
        <div className="no-scrollbar flex items-center gap-2 overflow-x-auto">
          <span className="shrink-0 text-xs font-medium uppercase tracking-wide text-ink-dim">
            Filtros rápidos
          </span>
          {FILTERS.map((f) => (
            <Link key={f.id} href={f.href}>
              <Chip icon={<f.icon width={13} height={13} />}>{f.label}</Chip>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
