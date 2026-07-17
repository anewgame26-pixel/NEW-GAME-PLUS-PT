"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { User } from "@supabase/supabase-js";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

interface FavoritesContextValue {
  /** true assim que já sabemos se há (ou não) sessão e favoritos carregados */
  ready: boolean;
  user: User | null;
  isFavorite: (gameId: string) => boolean;
  /** Liga/desliga o favorito. Devolve false se não havia sessão (o
   * componente que chamou deve então mandar para /entrar). */
  toggleFavorite: (gameId: string) => Promise<boolean>;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());

  const loadFavorites = useCallback(async (currentUser: User | null) => {
    if (!currentUser) {
      setFavoriteIds(new Set());
      return;
    }
    const supabase = createBrowserSupabaseClient();
    const { data, error } = await supabase
      .from("favorites")
      .select("game_id")
      .eq("user_id", currentUser.id);

    if (error) {
      console.error("Erro ao carregar favoritos:", error);
      return;
    }
    setFavoriteIds(new Set((data ?? []).map((f) => f.game_id as string)));
  }, []);

  useEffect(() => {
    const supabase = createBrowserSupabaseClient();

    supabase.auth.getUser().then(async ({ data }) => {
      setUser(data.user);
      await loadFavorites(data.user);
      setReady(true);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const nextUser = session?.user ?? null;
      setUser(nextUser);
      await loadFavorites(nextUser);
    });

    return () => subscription.subscription.unsubscribe();
  }, [loadFavorites]);

  const toggleFavorite = useCallback(
    async (gameId: string) => {
      if (!user) return false;

      const supabase = createBrowserSupabaseClient();
      const alreadyFavorite = favoriteIds.has(gameId);

      // Atualização otimista — a UI reage já, sem esperar pela rede.
      setFavoriteIds((prev) => {
        const next = new Set(prev);
        alreadyFavorite ? next.delete(gameId) : next.add(gameId);
        return next;
      });

      const { error } = alreadyFavorite
        ? await supabase.from("favorites").delete().eq("user_id", user.id).eq("game_id", gameId)
        : await supabase.from("favorites").insert({ user_id: user.id, game_id: gameId });

      if (error) {
        console.error("Erro ao atualizar favorito:", error);
        // Reverte, já que a gravação falhou.
        setFavoriteIds((prev) => {
          const next = new Set(prev);
          alreadyFavorite ? next.add(gameId) : next.delete(gameId);
          return next;
        });
      }

      return true;
    },
    [user, favoriteIds]
  );

  const isFavorite = useCallback((gameId: string) => favoriteIds.has(gameId), [favoriteIds]);

  return (
    <FavoritesContext.Provider value={{ ready, user, isFavorite, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites tem de ser usado dentro de <FavoritesProvider>");
  return ctx;
}
