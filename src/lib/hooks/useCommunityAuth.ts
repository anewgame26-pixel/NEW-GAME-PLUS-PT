"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

interface CommunityAuthState {
  ready: boolean;
  user: User | null;
  isEditor: boolean;
  isBanned: boolean;
  banReason: string | null;
}

/**
 * Estado de autenticação partilhado por tudo o que é "comunidade"
 * (comentários, fórum): quem está a ver, se é editor (pode moderar), e
 * se a própria conta está banida (não pode publicar).
 */
export function useCommunityAuth(): CommunityAuthState {
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isEditor, setIsEditor] = useState(false);
  const [isBanned, setIsBanned] = useState(false);
  const [banReason, setBanReason] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createBrowserSupabaseClient();

    async function load(currentUser: User | null) {
      setUser(currentUser);
      if (currentUser) {
        const [{ data: editorRow }, { data: banRow }] = await Promise.all([
          supabase.from("editors").select("user_id").eq("user_id", currentUser.id).maybeSingle(),
          supabase.from("user_bans").select("reason").eq("user_id", currentUser.id).maybeSingle(),
        ]);
        setIsEditor(Boolean(editorRow));
        setIsBanned(Boolean(banRow));
        setBanReason((banRow?.reason as string | null) ?? null);
      } else {
        setIsEditor(false);
        setIsBanned(false);
        setBanReason(null);
      }
      setReady(true);
    }

    supabase.auth.getUser().then(({ data }) => load(data.user));

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      load(session?.user ?? null);
    });

    return () => subscription.subscription.unsubscribe();
  }, []);

  return { ready, user, isEditor, isBanned, banReason };
}
