import { supabase } from "@/lib/supabase/client";

export interface GlossaryTerm {
  term: string;
  definition: string;
}

/**
 * Vai buscar os termos do glossário à base de dados (tabela glossary_terms),
 * ordenados pela mesma ordem definida no painel/editor (sort_order).
 *
 * Antes, esta função era só o array `glossaryTerms` importado de
 * src/data/mock/glossary.ts — agora os dados vêm do Supabase, mas a forma
 * (shape) devolvida é exatamente a mesma, por isso nenhum componente que
 * consome isto precisa de mudar.
 */
export async function getGlossaryTerms(): Promise<GlossaryTerm[]> {
  const { data, error } = await supabase
    .from("glossary_terms")
    .select("term, definition")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Erro ao carregar o glossário do Supabase:", error);
    return [];
  }

  return data ?? [];
}
