import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Corre em (quase) todos os pedidos ao site. Três responsabilidades:
 *
 * 1. Renovar a sessão de login, se estiver perto de expirar (isto evita
 *    que um editor seja desligado sem querer a meio de uma edição).
 * 2. Bloquear o acesso a /admin (exceto /admin/login) a quem não tiver
 *    sessão válida, mandando-o para a página de login de editores.
 * 3. Bloquear o acesso a /perfil (área do visitante) a quem não tiver
 *    sessão válida, mandando-o para /entrar (login de visitantes —
 *    diferente do login de editores, ver /admin/login).
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANTE: usar getUser(), não getSession(). O getUser() confirma o
  // login diretamente com o servidor do Supabase; o getSession() só lê o
  // cookie, que teoricamente podia ser falsificado.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
  const isAdminLoginRoute = request.nextUrl.pathname === "/admin/login";
  const isVisitorProtectedRoute = request.nextUrl.pathname.startsWith("/perfil");

  if (isAdminRoute && !isAdminLoginRoute && !user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/admin/login";
    return NextResponse.redirect(loginUrl);
  }

  if (isVisitorProtectedRoute && !user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/entrar";
    loginUrl.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}
