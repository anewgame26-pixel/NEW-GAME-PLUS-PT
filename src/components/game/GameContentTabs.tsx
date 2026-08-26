"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface GameContentTabPanel {
  id: string;
  label: string;
  icon: ReactNode;
  content: ReactNode;
}

interface GameContentTabsProps {
  panels: GameContentTabPanel[];
  defaultTabId: string;
}

export function GameContentTabs({ panels, defaultTabId }: GameContentTabsProps) {
  const [active, setActive] = useState(defaultTabId);

  // Só um pilar existe — não faz sentido mostrar separadores para escolher
  // entre um único item.
  if (panels.length <= 1) {
    return <>{panels[0]?.content}</>;
  }

  return (
    <div>
      <div className="sticky top-20 z-20 border-b border-border bg-bg/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1440px] gap-1 overflow-x-auto px-4 lg:px-8">
          {panels.map((panel) => (
            <button
              key={panel.id}
              type="button"
              onClick={() => setActive(panel.id)}
              aria-current={active === panel.id}
              className={cn(
                "flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-semibold uppercase tracking-wide transition-colors",
                active === panel.id
                  ? "border-primary text-ink"
                  : "border-transparent text-ink-dim hover:text-ink"
              )}
            >
              {panel.icon}
              {panel.label}
            </button>
          ))}
        </div>
      </div>

      {panels.map((panel) => (
        <div key={panel.id} className={active === panel.id ? "" : "hidden"}>
          {panel.content}
        </div>
      ))}
    </div>
  );
}
