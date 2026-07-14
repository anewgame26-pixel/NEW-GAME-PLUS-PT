import DOMPurify from "isomorphic-dompurify";
import { cn } from "@/lib/utils";

interface RichTextProps {
  html: string;
  className?: string;
}

/**
 * Mostra conteúdo escrito no editor de texto rico do admin. Sanitiza sempre
 * o HTML antes de o injetar na página — mesmo só a equipa a escrever,
 * nunca se deve confiar cegamente em HTML guardado na base de dados.
 *
 * `whitespace-pre-line` mantém a compatibilidade com análises antigas,
 * escritas antes de existir o editor rico (texto simples, sem tags),
 * preservando as quebras de linha originais.
 */
export function RichText({ html, className }: RichTextProps) {
  const safeHtml = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ["p", "strong", "em", "span", "br"],
    ALLOWED_ATTR: ["style"],
  });

  return (
    <div
      className={cn("whitespace-pre-line", className)}
      dangerouslySetInnerHTML={{ __html: safeHtml }}
    />
  );
}
