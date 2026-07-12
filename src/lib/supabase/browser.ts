import { createBrowserClient } from "@supabase/ssr";

/**
 * Cliente Supabase para o BROWSER, com sessão guardada em cookies.
 *
 * Diferente do cliente em `src/lib/supabase/client.ts` (esse é só para
 * ler conteúdo público, sem sessão de utilizador). Este aqui é usado
 * especificamente na página de login do painel /admin, porque precisa
 * de saber "quem está autenticado" e guardar isso de forma a que o
 * servidor (páginas, formulários) também consiga ler.
 */
export function createBrowserSupabaseClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
