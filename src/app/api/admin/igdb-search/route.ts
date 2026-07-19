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
 * Protegida: só editores com sessão iniciada podem usar (evita que
 * qualquer pessoa gaste os pedidos à IGDB do nosso projeto — incluindo
 * visitantes normais, que também têm sessão iniciada desde que passaram
 * a poder criar conta).
 */
export async function GET(request: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  // Confirma que é mesmo um EDITOR, não só um visitante com conta. A
  // política de segurança da tabela "editors" já garante isto sozinha:
  // um visitante normal não consegue ver nenhuma linha desta tabela, nem
  // sequer a sua própria (porque não está lá) — por isso esta pergunta
  // só devolve algo quando quem pergunta é mesmo um editor.
  const { data: editorRow } = await supabase
    .from("editors")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!editorRow) {
    return NextResponse.json({ error: "Sem permissão." }, { status: 403 });
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
