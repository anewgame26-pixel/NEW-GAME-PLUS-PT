import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Cliente Supabase para o SERVIDOR (páginas, layouts e Server Actions
 * dentro de /admin), com sessão lida a partir dos cookies do pedido.
 *
 * É este cliente que usamos para confirmar "quem está autenticado" antes
 * de mostrar qualquer página do painel, e mais tarde para guardar
 * alterações (criar/editar/apagar conteúdo) já identificado como esse
 * editor.
 */
export async function createServerSupabaseClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Chamado a partir de um Server Component (não pode escrever
            // cookies) — é seguro ignorar, o middleware trata de renovar
            // a sessão nesses casos.
          }
        },
      },
    }
  );
}
