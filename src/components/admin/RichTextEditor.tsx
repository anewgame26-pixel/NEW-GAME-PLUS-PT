"use client";

import { useEditor, useEditorState, EditorContent } from "@tiptap/react";
import { Mark } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import BoldExtension from "@tiptap/extension-bold";
import ItalicExtension from "@tiptap/extension-italic";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Versões de Negrito/Itálico sem "atalhos de escrita" automáticos (as
 * chamadas input rules / paste rules do Tiptap). Por omissão, o Tiptap
 * tenta ser "inteligente" e transforma `**palavra**` ou `__palavra__` em
 * negrito automaticamente enquanto escreves ou colas texto — aqui fica
 * desativado: negrito e itálico só acontecem quando o utilizador carrega
 * mesmo no botão (ou Ctrl/Cmd+B e Ctrl/Cmd+I).
 */
const NoAutoBold = BoldExtension.extend({
  addInputRules() {
    return [];
  },
  addPasteRules() {
    return [];
  },
});

const NoAutoItalic = ItalicExtension.extend({
  addInputRules() {
    return [];
  },
  addPasteRules() {
    return [];
  },
});

/**
 * Marca personalizada para o "Tamanho de Destaque". Optámos por não dar
 * acesso a um tamanho de letra livre (pixels arbitrários) — só dois
 * estados, normal e destaque — para que o texto de qualquer editor
 * continue sempre coerente com o resto do site.
 */
const FontSize = Mark.create({
  name: "fontSize",
  addAttributes() {
    return {
      size: {
        default: null,
        parseHTML: (element) => element.style.fontSize || null,
        renderHTML: (attributes) => {
          if (!attributes.size) return {};
          return { style: `font-size: ${attributes.size}` };
        },
      },
    };
  },
  parseHTML() {
    return [{ style: "font-size" }];
  },
  renderHTML({ HTMLAttributes }) {
    return ["span", HTMLAttributes, 0];
  },
});

// Paleta de cores da marca — de propósito, sem seletor de cor livre, para
// que o texto de qualquer editor continue coerente com o resto do site.
const COLOR_OPTIONS = [
  { label: "Normal", value: null, swatchClass: "bg-ink" },
  { label: "Vermelho", value: "#E31B33", swatchClass: "bg-primary" },
  { label: "Dourado", value: "#F2B705", swatchClass: "bg-gold" },
  { label: "Azul", value: "#3E7BFA", swatchClass: "bg-accent" },
  { label: "Cinza", value: "#96A0AD", swatchClass: "bg-ink-muted" },
];

// Cores de destaque (fundo) — mesma lógica: um conjunto fixo, coerente
// com a marca, em vez de um seletor de cor livre.
const HIGHLIGHT_OPTIONS = [
  { label: "Amarelo", value: "#F2B70533" },
  { label: "Vermelho", value: "#E31B3333" },
  { label: "Azul", value: "#3E7BFA33" },
];

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bold: false,
        italic: false,
        // Só dois níveis de título dentro do editor (Título e Subtítulo) —
        // suficiente para organizar um texto sem criar títulos gigantes
        // fora de sítio dentro de uma review ou de um capítulo do roadmap.
        heading: { levels: [2, 3] },
        blockquote: false,
        codeBlock: false,
        horizontalRule: false,
      }),
      NoAutoBold,
      NoAutoItalic,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ["paragraph", "heading"] }),
      FontSize,
      Placeholder.configure({ placeholder: placeholder ?? "" }),
    ],
    content: value,
    immediatelyRender: false,
    // Por omissão, o Tiptap re-renderiza TODO o componente React a cada
    // letra escrita (a cada "transação"). Com várias destas caixas
    // abertas ao mesmo tempo numa análise (Introdução, Veredito, etc.),
    // isto sobrecarregava o formulário inteiro e causava instabilidade
    // visível (o cursor a saltar, a caixa a voltar ao topo sozinha).
    // Desligado aqui; o essencial que a barra de ferramentas precisa
    // (que botão está ativo) é lido à parte, de forma mais eficiente,
    // pelo useEditorState logo abaixo.
    shouldRerenderOnTransaction: false,
    editorProps: {
      attributes: {
        class:
          "h-full min-h-[5.5rem] px-3 py-2.5 text-sm text-ink outline-none " +
          "[&_p]:mb-2 [&_p:last-child]:mb-0 " +
          "[&_h2]:mb-2 [&_h2]:mt-3 [&_h2]:font-display [&_h2]:text-base [&_h2]:font-bold [&_h2]:uppercase [&_h2]:tracking-wide [&_h2]:text-ink [&_h2:first-child]:mt-0 " +
          "[&_h3]:mb-2 [&_h3]:mt-3 [&_h3]:font-display [&_h3]:text-sm [&_h3]:font-bold [&_h3]:uppercase [&_h3]:tracking-wide [&_h3]:text-ink-muted [&_h3:first-child]:mt-0 " +
          "[&_ul]:mb-2 [&_ul]:ml-5 [&_ul]:list-disc [&_ul]:space-y-1 " +
          "[&_ol]:mb-2 [&_ol]:ml-5 [&_ol]:list-decimal [&_ol]:space-y-1 " +
          "[&_mark]:rounded-sm [&_mark]:px-0.5 [&_mark]:text-ink",
      },
    },
    onBlur: ({ editor }) => {
      // De propósito, só aqui (quando se sai da caixa) e não a cada
      // letra escrita: este editor vive dentro de um formulário enorme,
      // com vários editores iguais abertos ao mesmo tempo (Introdução,
      // Veredito, cada capítulo do roadmap...). Avisar o formulário a
      // cada letra obrigava-o a refazer-se inteiro constantemente, o
      // que causava instabilidade visível — a caixa a saltar sozinha ao
      // clicares ou ao usares a barra de ferramentas. Como qualquer
      // clique fora da caixa (incluindo nos botões da barra de
      // ferramentas, ou no botão "Guardar") já dispara este evento
      // antes de mais nada acontecer, o texto mais recente chega sempre
      // a tempo ao formulário.
      onChange(editor.getHTML());
    },
  });

  // Lê só o que a barra de ferramentas precisa (que botão mostrar como
  // ativo), em vez de o componente inteiro reagir a cada transação —
  // evita o problema de performance/instabilidade descrito acima,
  // seguindo a recomendação oficial do Tiptap para editores múltiplos
  // na mesma página (como acontece aqui: review + cada capítulo do
  // roadmap têm cada um o seu).
  const toolbarState = useEditorState({
    editor,
    selector: (ctx) => {
      if (!ctx.editor) return null;
      const e = ctx.editor;
      return {
        bold: e.isActive("bold"),
        italic: e.isActive("italic"),
        paragraph: e.isActive("paragraph"),
        heading2: e.isActive("heading", { level: 2 }),
        heading3: e.isActive("heading", { level: 3 }),
        bulletList: e.isActive("bulletList"),
        orderedList: e.isActive("orderedList"),
        fontSizeLarge: e.isActive("fontSize", { size: "1.2em" }),
        color: (e.getAttributes("textStyle").color as string | undefined) ?? null,
        highlight: (e.getAttributes("highlight").color as string | undefined) ?? null,
        alignLeft: e.isActive({ textAlign: "left" }),
        alignCenter: e.isActive({ textAlign: "center" }),
        alignRight: e.isActive({ textAlign: "right" }),
      };
    },
  });

  if (!editor || !toolbarState) return null;

  const headingValue = toolbarState.heading2 ? "h2" : toolbarState.heading3 ? "h3" : "p";

  return (
    <div className="flex flex-col">
      <div className="flex flex-wrap items-center gap-1 rounded-t-sm border border-border bg-bg-surface p-1.5">
        <select
          value={headingValue}
          onChange={(e) => {
            const v = e.target.value;
            if (v === "p") editor.chain().focus().setParagraph().run();
            else if (v === "h2") editor.chain().focus().toggleHeading({ level: 2 }).run();
            else editor.chain().focus().toggleHeading({ level: 3 }).run();
          }}
          title="Estilo do parágrafo/capítulo"
          className="h-7 rounded-sm border border-border bg-bg-surface2 px-1.5 text-xs text-ink outline-none focus:border-primary"
        >
          <option value="p">Parágrafo</option>
          <option value="h2">Título</option>
          <option value="h3">Subtítulo</option>
        </select>

        <span className="mx-1 h-5 w-px bg-border" />

        <ToolbarButton
          active={toolbarState.bold}
          onClick={() => editor.chain().focus().toggleBold().run()}
          label="Negrito"
        >
          <Bold width={14} height={14} />
        </ToolbarButton>
        <ToolbarButton
          active={toolbarState.italic}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          label="Itálico"
        >
          <Italic width={14} height={14} />
        </ToolbarButton>

        <span className="mx-1 h-5 w-px bg-border" />

        <ToolbarButton
          active={toolbarState.bulletList}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          label="Lista com pontos"
        >
          <List width={14} height={14} />
        </ToolbarButton>
        <ToolbarButton
          active={toolbarState.orderedList}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          label="Lista numerada"
        >
          <ListOrdered width={14} height={14} />
        </ToolbarButton>

        <span className="mx-1 h-5 w-px bg-border" />

        <ToolbarButton
          active={toolbarState.alignLeft}
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          label="Alinhar à esquerda"
        >
          <AlignLeft width={14} height={14} />
        </ToolbarButton>
        <ToolbarButton
          active={toolbarState.alignCenter}
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          label="Centrar"
        >
          <AlignCenter width={14} height={14} />
        </ToolbarButton>
        <ToolbarButton
          active={toolbarState.alignRight}
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          label="Alinhar à direita"
        >
          <AlignRight width={14} height={14} />
        </ToolbarButton>

        <span className="mx-1 h-5 w-px bg-border" />

        <ToolbarButton
          active={!toolbarState.fontSizeLarge}
          onClick={() => editor.chain().focus().unsetMark("fontSize").run()}
          label="Tamanho normal"
        >
          <span className="text-xs font-semibold">A</span>
        </ToolbarButton>
        <ToolbarButton
          active={toolbarState.fontSizeLarge}
          onClick={() => editor.chain().focus().setMark("fontSize", { size: "1.2em" }).run()}
          label="Tamanho de destaque"
        >
          <span className="text-base font-semibold">A</span>
        </ToolbarButton>

        <span className="mx-1 h-5 w-px bg-border" />

        <span className="mr-0.5 text-[10px] uppercase tracking-wide text-ink-dim">Texto</span>
        {COLOR_OPTIONS.map((c) => (
          <button
            key={c.label}
            type="button"
            title={c.label}
            onClick={() =>
              c.value
                ? editor.chain().focus().setColor(c.value).run()
                : editor.chain().focus().unsetColor().run()
            }
            className={cn(
              "h-6 w-6 shrink-0 rounded-full border-2 transition-transform hover:scale-110",
              c.swatchClass,
              toolbarState.color === c.value ? "border-ink" : "border-transparent"
            )}
          />
        ))}

        <span className="mx-1 h-5 w-px bg-border" />

        <span className="mr-0.5 text-[10px] uppercase tracking-wide text-ink-dim">Destaque</span>
        <button
          type="button"
          title="Sem destaque"
          onClick={() => editor.chain().focus().unsetHighlight().run()}
          className={cn(
            "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 bg-bg-surface2 text-[10px] text-ink-dim transition-transform hover:scale-110",
            !toolbarState.highlight ? "border-ink" : "border-transparent"
          )}
        >
          ×
        </button>
        {HIGHLIGHT_OPTIONS.map((h) => (
          <button
            key={h.label}
            type="button"
            title={h.label}
            onClick={() => editor.chain().focus().setHighlight({ color: h.value }).run()}
            style={{ backgroundColor: h.value }}
            className={cn(
              "h-6 w-6 shrink-0 rounded-full border-2 transition-transform hover:scale-110",
              toolbarState.highlight === h.value ? "border-ink" : "border-transparent"
            )}
          />
        ))}
      </div>

      <div className="resize-y overflow-auto rounded-b-sm border border-t-0 border-border bg-bg-surface2 focus-within:border-primary">
        <EditorContent editor={editor} className="h-full" />
      </div>
    </div>
  );
}

function ToolbarButton({
  active,
  onClick,
  label,
  children,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className={cn(
        "flex h-7 w-7 items-center justify-center rounded-sm border transition-colors",
        active
          ? "border-primary bg-primary/10 text-primary-light"
          : "border-transparent text-ink-muted hover:border-border hover:text-ink"
      )}
    >
      {children}
    </button>
  );
}
