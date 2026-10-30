import { supabase } from "@/lib/supabase/client";

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatarInitials: string;
  photoUrl: string | null;
  bio: string;
  favoriteGame: string;
  /** Autor convidado (não faz parte da equipa fixa). */
  isGuest: boolean;
}

/**
 * Vai buscar a equipa à base de dados (tabela team_members), ordenada pela
 * mesma ordem definida no painel/editor (sort_order).
 */
export async function getTeamMembers(): Promise<TeamMember[]> {
  const { data, error } = await supabase
    .from("team_members")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Erro ao carregar a equipa do Supabase:", error);
    return [];
  }

  return (data ?? []).map((m) => ({
    id: m.id,
    name: m.name,
    role: m.role,
    avatarInitials: m.avatar_initials,
    photoUrl: m.photo_url ?? null,
    bio: m.bio,
    favoriteGame: m.favorite_game ?? "",
    isGuest: m.is_guest === true,
  }));
}
