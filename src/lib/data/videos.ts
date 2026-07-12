import { supabase } from "@/lib/supabase/client";
import type { LatestBeforePlatinumEpisode, UpcomingVideo } from "@/types";

export interface ArchiveEpisode {
  id: string;
  gameId: string;
  publishDate: string;
  status: "publicado" | "agendado";
  /** Tipo (para agendados) ou veredito curto (para publicados) */
  label: string;
}

/**
 * Vai buscar os episódios "Antes da Platina" já publicados (tabela videos,
 * status = "publicado"), mais recentes primeiro.
 */
export async function getLatestBeforePlatinum(): Promise<LatestBeforePlatinumEpisode[]> {
  const { data, error } = await supabase
    .from("videos")
    .select("id, game_id, publish_date, verdict")
    .eq("status", "publicado")
    .order("publish_date", { ascending: false });

  if (error) {
    console.error("Erro ao carregar episódios publicados do Supabase:", error);
    return [];
  }

  return (data ?? []).map((row) => ({
    id: row.id as string,
    gameId: row.game_id as string,
    publishDate: row.publish_date as string,
    verdict: (row.verdict as string) ?? "",
  }));
}

/**
 * Vai buscar os vídeos agendados (tabela videos, status = "agendado"),
 * mais próximos primeiro.
 */
export async function getUpcomingVideos(): Promise<UpcomingVideo[]> {
  const { data, error } = await supabase
    .from("videos")
    .select("id, game_id, publish_date, type")
    .eq("status", "agendado")
    .order("publish_date", { ascending: true });

  if (error) {
    console.error("Erro ao carregar vídeos agendados do Supabase:", error);
    return [];
  }

  return (data ?? []).map((row) => ({
    id: row.id as string,
    gameId: row.game_id as string,
    publishDate: row.publish_date as string,
    type: row.type as UpcomingVideo["type"],
  }));
}

/**
 * Vai buscar TODOS os episódios (publicados + agendados) da página
 * "Antes da Platina", já ordenados por data (mais recentes primeiro).
 * Usa a mesma tabela "videos", sem precisar de duas perguntas separadas.
 */
export async function getEpisodeArchive(): Promise<ArchiveEpisode[]> {
  const { data, error } = await supabase
    .from("videos")
    .select("id, game_id, publish_date, status, verdict, type")
    .order("publish_date", { ascending: false });

  if (error) {
    console.error("Erro ao carregar o arquivo de episódios do Supabase:", error);
    return [];
  }

  return (data ?? []).map((row) => ({
    id: row.id as string,
    gameId: row.game_id as string,
    publishDate: row.publish_date as string,
    status: row.status as "publicado" | "agendado",
    label: row.status === "publicado" ? (row.verdict as string) : (row.type as string),
  }));
}
