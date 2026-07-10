import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Crumb {
  label: string;
  href?: string;
}

interface GameBreadcrumbProps {
  items: Crumb[];
}

export function GameBreadcrumb({ items }: GameBreadcrumbProps) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border bg-bg-raised">
      <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between px-4 py-3 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-1 text-xs font-medium text-ink-muted transition-colors hover:text-ink"
        >
          <ChevronLeft width={14} height={14} />
          Voltar
        </Link>

        <nav aria-label="Breadcrumb" className="hidden items-center gap-1.5 text-xs text-ink-dim sm:flex">
          {items.map((item, i) => (
            <span key={item.label} className="flex items-center gap-1.5">
              {i > 0 && <ChevronRight width={11} height={11} />}
              {item.href ? (
                <Link href={item.href} className="transition-colors hover:text-ink">
                  {item.label}
                </Link>
              ) : (
                <span className="text-ink-muted">{item.label}</span>
              )}
            </span>
          ))}
        </nav>
      </div>
    </div>
  );
}
