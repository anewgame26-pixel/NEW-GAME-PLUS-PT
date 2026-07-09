"use client";

import { InputHTMLAttributes } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  size?: "md" | "lg";
}

export function SearchInput({ className, size = "md", ...props }: SearchInputProps) {
  return (
    <div className={cn("relative flex w-full items-center", className)}>
      <Search
        className="pointer-events-none absolute left-4 text-ink-dim"
        width={size === "lg" ? 20 : 16}
        height={size === "lg" ? 20 : 16}
      />
      <input
        type="text"
        className={cn(
          "w-full rounded-sm border border-border bg-bg-surface pl-11 pr-4 text-ink placeholder:text-ink-dim outline-none transition-colors focus:border-primary",
          size === "lg" ? "h-14 text-base" : "h-11 text-sm"
        )}
        {...props}
      />
    </div>
  );
}
