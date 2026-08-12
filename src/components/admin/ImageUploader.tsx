"use client";

import { useRef, useState } from "react";
import { Loader2, Upload, X } from "lucide-react";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

interface ImageUploaderProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  /** Pasta dentro do bucket "article-images", ex: "top", "retro", "descobertas" */
  folder: string;
}

const MAX_SIZE_MB = 5;

export function ImageUploader({ label, value, onChange, folder }: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = ""; // permite escolher o mesmo ficheiro outra vez, se necessário

    if (!file.type.startsWith("image/")) {
      setError("Escolhe um ficheiro de imagem (jpg, png, webp...).");
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`A imagem tem de ter menos de ${MAX_SIZE_MB}MB.`);
      return;
    }

    setError(null);
    setUploading(true);

    const supabase = createBrowserSupabaseClient();
    const extension = file.name.split(".").pop() || "jpg";
    // Nome único por upload (pasta + timestamp) para nunca sobrescrever
    // fotos antigas de outros artigos por engano.
    const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from("article-images")
      .upload(path, file, { upsert: false, cacheControl: "3600" });

    setUploading(false);

    if (uploadError) {
      console.error("Erro ao enviar a imagem:", uploadError);
      setError("Não foi possível enviar a imagem. Tenta novamente.");
      return;
    }

    const { data: publicUrlData } = supabase.storage.from("article-images").getPublicUrl(path);
    onChange(publicUrlData.publicUrl);
  }

  const inputClass =
    "h-11 flex-1 rounded-sm border border-border bg-bg-surface2 px-3 text-sm text-ink placeholder:text-ink-dim outline-none focus:border-primary";
  const labelClass = "text-xs font-medium uppercase tracking-wide text-ink-dim";

  return (
    <div className="flex flex-col gap-1.5">
      <span className={labelClass}>{label}</span>

      {value && (
        // eslint-disable-next-line @next/next/no-img-element
        <div className="relative mb-1 h-32 w-full overflow-hidden rounded-sm border border-border bg-bg-surface2">
          <img src={value} alt="Pré-visualização" className="h-full w-full object-cover" />
          <button
            type="button"
            onClick={() => onChange("")}
            title="Remover imagem"
            className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-bg/80 text-ink hover:bg-primary hover:text-white"
          >
            <X width={13} height={13} />
          </button>
        </div>
      )}

      <div className="flex items-center gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Cola aqui um URL, ou anexa um ficheiro →"
          className={inputClass}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex h-11 shrink-0 items-center gap-1.5 rounded-sm border border-border-light px-3 text-sm font-medium text-ink-muted hover:border-primary hover:text-primary disabled:opacity-60"
        >
          {uploading ? (
            <Loader2 width={15} height={15} className="animate-spin" />
          ) : (
            <Upload width={15} height={15} />
          )}
          {uploading ? "A enviar..." : "Anexar"}
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {error && <p className="text-[11px] text-primary-light">{error}</p>}
    </div>
  );
}
