/**
 * Pede ao site para gerar de novo as páginas indicadas, logo a seguir a
 * uma gravação bem-sucedida no /admin — para as alterações aparecerem no
 * site sem precisares de fazer redeploy.
 *
 * Falhas aqui não bloqueiam a experiência do editor: o conteúdo já ficou
 * guardado no Supabase de qualquer forma, isto só acelera quando aparece
 * no site público. Por isso os erros só vão para a consola, não para o
 * ecrã do editor.
 */
export async function revalidatePaths(paths: string[]) {
  try {
    const res = await fetch("/api/admin/revalidate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paths }),
    });

    if (!res.ok) {
      console.error("Revalidação falhou:", await res.text());
    }
  } catch (err) {
    console.error("Não foi possível pedir revalidação:", err);
  }
}
