import { NextResponse, type NextRequest } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

/**
 * Rota de "regresso" depois de alguém fazer login com o Google (ou outro
 * provedor OAuth no futuro).
 *
 * O que acontece:
 * 1. A pessoa clica "Entrar com Google" no site.
 * 2. É enviada para a Google, faz login lá.
 * 3. A Google manda a pessoa de volta para ESTA página, com um código
 *    especial na URL (?code=...).
 * 4. Aqui trocamos esse código por uma sessão válida (login efetivo) e
 *    guardamos isso nos cookies.
 * 5. Enviamos a pessoa para onde ela queria ir (ou para /perfil por defeito).
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") || "/perfil";

  if (code) {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Se algo correu mal, manda a pessoa de volta para o login com um aviso.
  return NextResponse.redirect(`${origin}/entrar?erro=google`);
}
