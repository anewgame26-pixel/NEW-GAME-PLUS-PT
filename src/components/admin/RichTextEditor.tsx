"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import { Mark } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Placeholder from "@tiptap/extension-placeholder";
import { Bold, Italic } from "lucide-react";
import { cn } from "@/lib/utils";

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

// Paleta de cores limitada à marca — de propósito, sem seletor de cor livre.
const COLOR_OPTIONS = [
  { label: "Normal", value: null, swatchClass: "bg-ink" },
  { label: "Vermelho", value: "#E31B33", swatchClass: "bg-primary" },
  { label: "Dourado", value: "#F2B705", swatchClass: "bg-gold" },
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
        heading: false,
        bulletList: false,
        orderedList: false,
        blockquote: false,
        codeBlock: false,
        horizontalRule: false,
      }),
      TextStyle,
      Color,
      FontSize,
      Placeholder.configure({ placeholder: placeholder ?? "" }),
    ],
    content: value,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "min-h-[6rem] rounded-b-sm border border-t-0 border-border bg-bg-surface2 px-3 py-2.5 text-sm text-ink outline-none focus:border-primary [&_p]:mb-2 [&_p:last-child]:mb-0",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  return (
    <div className="flex flex-col">
      <div className="flex flex-wrap items-center gap-1 rounded-t-sm border border-border bg-bg-surface p-1.5">
        <ToolbarButton
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
          label="Negrito"
        >
          <Bold width={14} height={14} />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          label="Itálico"
        >
          <Italic width={14} height={14} />
        </ToolbarButton>

        <span className="mx-1 h-5 w-px bg-border" />

        <ToolbarButton
          active={!editor.isActive("fontSize", { size: "1.2em" })}
          onClick={() => editor.chain().focus().unsetMark("fontSize").run()}
          label="Tamanho normal"
        >
          <span className="text-xs font-semibold">A</span>
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("fontSize", { size: "1.2em" })}
          onClick={() =>
            editor.chain().focus().setMark("fontSize", { size: "1.2em" }).run()
          }
          label="Tamanho de destaque"
        >
          <span className="text-base font-semibold">A</span>
        </ToolbarButton>

        <span className="mx-1 h-5 w-px bg-border" />

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
              editor.isActive("textStyle", { color: c.value })
                ? "border-ink"
                : "border-transparent"
            )}
          />
        ))}
      </div>

      <EditorContent editor={editor} />
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
