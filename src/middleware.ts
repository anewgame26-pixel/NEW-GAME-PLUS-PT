import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Corre em todos os caminhos exceto:
     * - ficheiros estáticos do Next.js (_next/static, _next/image)
     * - o favicon
     * - ficheiros de imagem/outros assets em /public
     * Isto evita trabalho desnecessário em pedidos que nunca precisam
     * de saber se alguém está autenticado.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
