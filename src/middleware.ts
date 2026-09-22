import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Só as zonas /admin e /perfil precisam mesmo de confirmar o login
     * (é a própria função updateSession que decide, mais abaixo, se
     * bloqueia ou deixa passar). Todas as outras páginas são públicas —
     * homepage, jogos, review, vale a pena, etc. — e não têm nenhum
     * motivo para pagar o tempo de um pedido ao servidor do Supabase em
     * cada clique. Isto é o que estava a tornar o site inteiro lento,
     * não só o login.
     */
    "/admin/:path*",
    "/perfil/:path*",
  ],
};
