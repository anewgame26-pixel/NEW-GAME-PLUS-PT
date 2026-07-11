import { createClient } from "@supabase/supabase-js";

/**
 * Cliente Supabase — usado para ler dados (jogos, análises, rankings, etc.)
 *
 * Nesta fase (Fase 1: conteúdo público) usamos apenas a "anon key",
 * que só tem permissão de LEITURA graças às políticas de RLS que
 * criámos no schema (01-schema-conteudo.sql). Não é possível escrever
 * dados através deste cliente — isso vai ficar reservado ao painel
 * /admin, que vamos construir mais tarde com autenticação própria.
 *
 * As duas variáveis abaixo vêm do ficheiro .env.local (que tu crias
 * localmente e nunca é enviado para o GitHub — ver .env.local.example).
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Faltam as variáveis NEXT_PUBLIC_SUPABASE_URL e/ou NEXT_PUBLIC_SUPABASE_ANON_KEY. " +
      "Verifica se o ficheiro .env.local existe na raiz do projeto e se reiniciaste o `npm run dev`."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
