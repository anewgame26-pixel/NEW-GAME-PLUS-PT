import { supabase } from "@/lib/supabase/client";

export interface FAQItem {
  question: string;
  answer: string;
}

/**
 * Vai buscar as perguntas frequentes à base de dados (tabela faq_items),
 * ordenadas pela mesma ordem definida no painel/editor (sort_order).
 */
export async function getFaqItems(): Promise<FAQItem[]> {
  const { data, error } = await supabase
    .from("faq_items")
    .select("question, answer")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Erro ao carregar o FAQ do Supabase:", error);
    return [];
  }

  return data ?? [];
}
