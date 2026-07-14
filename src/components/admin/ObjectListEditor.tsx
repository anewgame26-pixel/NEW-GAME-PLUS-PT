"use client";

import { Plus, Trash2 } from "lucide-react";

interface FieldDef {
  key: string;
  label: string;
  type?: "text" | "textarea" | "number" | "select";
  placeholder?: string;
  /** Necessário quando type="select" */
  options?: string[];
}

interface ObjectListEditorProps<T extends Record<string, unknown>> {
  label: string;
  items: T[];
  fields: FieldDef[];
  emptyItem: T;
  onChange: (items: T[]) => void;
}

export function ObjectListEditor<T extends Record<string, unknown>>({
  label,
  items,
  fields,
  emptyItem,
  onChange,
}: ObjectListEditorProps<T>) {
  const updateField = (index: number, key: string, value: string | number) => {
    onChange(items.map((item, i) => (i === index ? { ...item, [key]: value } : item)));
  };

  const removeAt = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const add = () => {
    onChange([...items, { ...emptyItem }]);
  };

  return (
    <div className="flex flex-col gap-3">
      <span className="text-xs font-medium uppercase tracking-wide text-ink-dim">{label}</span>

      {items.map((item, i) => (
        <div key={i} className="rounded-sm border border-border bg-bg-surface2 p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs text-ink-dim">#{i + 1}</span>
            <button
              type="button"
              onClick={() => removeAt(i)}
              aria-label="Remover"
              className="flex h-7 w-7 items-center justify-center rounded-sm border border-border text-ink-muted hover:border-primary hover:text-primary"
            >
              <Trash2 width={12} height={12} />
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {fields.map((field) => (
              <label key={field.key} className="flex flex-col gap-1">
                <span className="text-[11px] text-ink-dim">{field.label}</span>
                {field.type === "textarea" ? (
                  <textarea
                    rows={2}
                    value={String(item[field.key] ?? "")}
                    onChange={(e) => updateField(i, field.key, e.target.value)}
                    placeholder={field.placeholder}
                    className="min-h-[4.5rem] resize-y rounded-sm border border-border bg-bg-surface px-2.5 py-2 text-sm text-ink placeholder:text-ink-dim outline-none focus:border-primary"
                  />
                ) : field.type === "select" ? (
                  <select
                    value={String(item[field.key] ?? "")}
                    onChange={(e) => updateField(i, field.key, e.target.value)}
                    className="h-9 rounded-sm border border-border bg-bg-surface px-2.5 text-sm text-ink outline-none focus:border-primary"
                  >
                    {(field.options ?? []).map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type === "number" ? "number" : "text"}
                    value={String(item[field.key] ?? "")}
                    onChange={(e) =>
                      updateField(
                        i,
                        field.key,
                        field.type === "number" ? Number(e.target.value) : e.target.value
                      )
                    }
                    placeholder={field.placeholder}
                    className="h-9 rounded-sm border border-border bg-bg-surface px-2.5 text-sm text-ink placeholder:text-ink-dim outline-none focus:border-primary"
                  />
                )}
              </label>
            ))}
          </div>
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
