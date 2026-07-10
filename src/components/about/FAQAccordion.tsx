"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { FAQItem } from "@/data/mock/faq";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

interface FAQAccordionProps {
  items: FAQItem[];
}

export function FAQAccordion({ items }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="flex flex-col gap-3">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <Card key={item.question} className="overflow-hidden">
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-4 p-5 text-left"
              aria-expanded={isOpen}
            >
              <span className="font-display text-sm font-semibold text-ink">
                {item.question}
              </span>
              <ChevronDown
                width={16}
                height={16}
                className={cn(
                  "shrink-0 text-ink-dim transition-transform duration-200",
                  isOpen && "rotate-180 text-primary"
                )}
              />
            </button>
            {isOpen && (
              <div className="px-5 pb-5 text-sm text-ink-muted">{item.answer}</div>
            )}
          </Card>
        );
      })}
    </div>
  );
}
