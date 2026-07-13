"use client";

import { Plus, Trash2 } from "lucide-react";

interface StringListEditorProps {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  multiline?: boolean;
}

export function StringListEditor({
  label,
  values,
  onChange,
  placeholder,
  multiline = false,
}: StringListEditorProps) {
  const updateAt = (index: number, value: string) => {
    onChange(values.map((v, i) => (i === index ? value : v)));
  };

  const removeAt = (index: number) => {
    onChange(values.filter((_, i) => i !== index));
  };

  const add = () => {
    onChange([...values, ""]);
  };

  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-medium uppercase tracking-wide text-ink-dim">{label}</span>

      {values.map((value, i) => (
        <div key={i} className="flex gap-2">
          {multiline ? (
            <textarea
              rows={2}
              value={value}
              onChange={(e) => updateAt(i, e.target.value)}
              placeholder={placeholder}
              className="min-h-[4.5rem] resize-y flex-1 rounded-sm border border-border bg-bg-surface2 px-3 py-2 text-sm text-ink placeholder:text-ink-dim outline-none focus:border-primary"
            />
          ) : (
            <input
              type="text"
              value={value}
              onChange={(e) => updateAt(i, e.target.value)}
              placeholder={placeholder}
              className="h-10 flex-1 rounded-sm border border-border bg-bg-surface2 px-3 text-sm text-ink placeholder:text-ink-dim outline-none focus:border-primary"
            />
          )}
          <button
            type="button"
            onClick={() => removeAt(i)}
            aria-label="Remover"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm border border-border text-ink-muted hover:border-primary hover:text-primary"
          >
            <Trash2 width={14} height={14} />
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={add}
        className="flex items-center gap-1.5 self-start text-xs font-medium text-accent hover:text-accent-light"
      >
        <Plus width={13} height={13} />
        Adicionar
      </button>
    </div>
  );
}
