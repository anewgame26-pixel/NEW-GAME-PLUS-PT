import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { searchIgdbGames } from "@/lib/igdb/search";

/**
 * Ponte entre o painel /admin e a IGDB.
 *
 * Só existe porque a IGDB não permite pedidos diretos a partir do browser
 * (bloqueia por CORS de propósito) e porque a chave secreta da Twitch
 * nunca pode aparecer no código que corre no browser do editor. Por isso
 * é o SERVIDOR do nosso site que fala com a IGDB, e o browser fala só com
 * esta rota.
 *
 * Protegida: só editores com sessão iniciada podem usar.
 */
export async function GET(request: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (!user) {
    // === DIAGNÓSTICO TEMPORÁRIO ===
    return NextResponse.json(
      {
        error: "Não autenticado.",
        diagnostico: { userError: userError?.message ?? null },
      },
      { status: 401 }
    );
  }

  const { data: editorRow, error: editorError } = await supabase
    .from("editors")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!editorRow) {
    // === DIAGNÓSTICO TEMPORÁRIO — remover depois de resolvido ===
    return NextResponse.json(
      {
        error: "Sem permissão.",
        diagnostico: {
          teuUserId: user.id,
          teuEmail: user.email,
          erroDaConsultaEditors: editorError
            ? { message: editorError.message, code: editorError.code, details: editorError.details }
            : null,
        },
      },
      { status: 403 }
    );
  }

  const query = request.nextUrl.searchParams.get("q")?.trim();

  if (!query) {
    return NextResponse.json({ error: "Falta o parâmetro de pesquisa." }, { status: 400 });
  }

  try {
    const results = await searchIgdbGames(query);
    return NextResponse.json({ results });
  } catch (err) {
    console.error("Erro na pesquisa IGDB:", err);
    return NextResponse.json({ error: "Falha ao pesquisar na IGDB." }, { status: 502 });
  }
}
