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
    ALLOWED_TAGS: ["p", "strong", "em", "span", "br", "h2", "h3", "ul", "ol", "li"],
    ALLOWED_ATTR: ["style"],
  });

  return (
    <div
      className={cn(
        "whitespace-pre-line",
        "[&_h2]:mb-2 [&_h2]:mt-4 [&_h2]:font-display [&_h2]:text-base [&_h2]:font-bold [&_h2]:uppercase [&_h2]:tracking-wide [&_h2]:text-ink [&_h2:first-child]:mt-0",
        "[&_h3]:mb-2 [&_h3]:mt-3 [&_h3]:font-display [&_h3]:text-sm [&_h3]:font-bold [&_h3]:uppercase [&_h3]:tracking-wide [&_h3]:text-ink-muted [&_h3:first-child]:mt-0",
        "[&_ul]:mb-2 [&_ul]:ml-5 [&_ul]:list-disc [&_ul]:space-y-1",
        "[&_ol]:mb-2 [&_ol]:ml-5 [&_ol]:list-decimal [&_ol]:space-y-1",
        className
      )}
      dangerouslySetInnerHTML={{ __html: safeHtml }}
    />
  );
}
