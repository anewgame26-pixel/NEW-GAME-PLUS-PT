"use client";

import { useRef, useState } from "react";
import { User, Loader2, Camera } from "lucide-react";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

interface AvatarUploaderProps {
  userId: string;
  initialAvatarUrl: string | null;
}

const MAX_SIZE_MB = 3;

export function AvatarUploader({ userId, initialAvatarUrl }: AvatarUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarUrl, setAvatarUrl] = useState(initialAvatarUrl);
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
    // Caminho sempre igual (avatar.<extensão>) para cada visitante — cada
    // upload novo substitui a foto anterior, em vez de acumular ficheiros
    // velhos na Storage.
    const extension = file.name.split(".").pop() || "jpg";
    const path = `${userId}/avatar.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true, cacheControl: "3600" });

    if (uploadError) {
      console.error("Erro ao enviar a foto:", uploadError);
      setError("Não foi possível enviar a foto. Tenta novamente.");
      setUploading(false);
      return;
    }

    const { data: publicUrlData } = supabase.storage.from("avatars").getPublicUrl(path);
    // Acrescenta um "cache-buster" — sem isto, como o caminho do ficheiro
    // é sempre o mesmo, o browser podia continuar a mostrar a foto antiga
    // em cache mesmo depois de a substituíres.
    const freshUrl = `${publicUrlData.publicUrl}?v=${Date.now()}`;

    const { error: profileError } = await supabase
      .from("profiles")
      .upsert({ id: userId, avatar_url: freshUrl });

    setUploading(false);

    if (profileError) {
      console.error("Erro ao guardar a foto no perfil:", profileError);
      setError("A foto foi enviada, mas não foi possível associá-la ao perfil.");
      return;
    }

    setAvatarUrl(freshUrl);
  }

  return (
    <div className="flex flex-col items-center gap-1.5">
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className="group relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-accent/10 text-accent disabled:opacity-60"
        title="Trocar foto de perfil"
      >
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatarUrl} alt="Foto de perfil" className="h-full w-full object-cover" />
        ) : (
          <User width={26} height={26} />
        )}

        {/*
          Badge da câmara sempre visível (não só ao passar o rato) — em
          telemóvel não há "hover", por isso um botão que só aparecesse ao
          pairar o cursor nunca seria descoberto por ninguém a usar o site
          num ecrã tátil.
        */}
        <span className="absolute bottom-0 right-0 flex h-6 w-6 items-center justify-center rounded-full border-2 border-bg-surface bg-primary text-white shadow-sm transition-transform group-hover:scale-110">
          {uploading ? (
            <Loader2 width={12} height={12} className="animate-spin" />
          ) : (
            <Camera width={12} height={12} />
          )}
        </span>
      </button>

      <span className="text-[11px] text-ink-dim">Foto de perfil</span>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {error && <p className="max-w-[10rem] text-center text-[11px] text-primary-light">{error}</p>}
    </div>
  );
}
