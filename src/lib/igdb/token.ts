/**
 * Gere o token de acesso à IGDB (que na verdade vem da Twitch — a IGDB usa
 * a autenticação da Twitch por baixo). Guarda o token em memória e só pede
 * um novo quando o atual expira, para não gastar pedidos à toa.
 *
 * Nunca é chamado a partir do browser — só a partir de código do servidor
 * (a rota /api/admin/igdb-search), porque precisa do Client Secret, que
 * tem de ficar sempre escondido.
 */

let cachedToken: { value: string; expiresAt: number } | null = null;

export async function getIgdbAccessToken(): Promise<string> {
  const now = Date.now();

  if (cachedToken && cachedToken.expiresAt > now) {
    return cachedToken.value;
  }

  const clientId = process.env.IGDB_CLIENT_ID;
  const clientSecret = process.env.IGDB_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error(
      "Faltam as variáveis IGDB_CLIENT_ID e/ou IGDB_CLIENT_SECRET no .env.local."
    );
  }

  const response = await fetch(
    `https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`,
    { method: "POST" }
  );

  if (!response.ok) {
    throw new Error("Não foi possível autenticar com a IGDB/Twitch.");
  }

  const data = (await response.json()) as { access_token: string; expires_in: number };

  // Guarda o token com uma margem de segurança de 5 minutos antes de expirar.
  cachedToken = {
    value: data.access_token,
    expiresAt: now + (data.expires_in - 300) * 1000,
  };

  return cachedToken.value;
}
