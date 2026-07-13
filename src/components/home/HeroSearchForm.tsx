"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SearchInput } from "@/components/ui/SearchInput";

/**
 * A caixa de pesquisa em si (SearchInput) é só visual — é partilhada com
 * outras páginas (Jogos, Glossário), por isso não lhe metemos lógica
 * própria. Este componente à volta é que trata da parte "search realmente
 * faz alguma coisa": ao escrever e premir Enter (ou clicar), leva para
 * /jogos já com essa pesquisa aplicada.
 */
export function HeroSearchForm() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    router.push(trimmed ? `/jogos?q=${encodeURIComponent(trimmed)}` : "/jogos");
  }

  return (
    <form onSubmit={handleSubmit}>
      <SearchInput
        size="lg"
        placeholder="Que jogo queres platinar?"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </form>
  );
}
