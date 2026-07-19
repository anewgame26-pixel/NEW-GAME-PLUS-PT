import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";

/**
 * As páginas públicas do site (homepage, /jogos, /guias/[slug], etc.) são
 * geradas e guardadas em cache — não sabem sozinhas quando o conteúdo no
 * Supabase muda, porque os formulários do /admin escrevem diretamente na
 * base de dados a partir do browser, sem passar pelo Next.js.
 *
 * Esta rota é chamada por esses formulários logo a seguir a uma gravação
 * bem-sucedida, e diz ao Next.js "esta página está desatualizada, gera-a
 * de novo no próximo pedido" — sem precisar de um redeploy inteiro.
 *
 * Protegida da mesma forma que a pesquisa IGDB: só editores com sessão
 * iniciada podem pedir revalidação.
 */
export async function POST(request: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const { data: editorRow } = await supabase
    .from("editors")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!editorRow) {
    return NextResponse.json({ error: "Sem permissão." }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const paths: unknown = body?.paths;

  if (!Array.isArray(paths) || paths.some((p) => typeof p !== "string")) {
    return NextResponse.json(
      { error: "Formato inválido — esperado { paths: string[] }." },
      { status: 400 }
    );
  }

  for (const path of paths as string[]) {
    revalidatePath(path);
  }

  return NextResponse.json({ revalidated: paths });
}
