import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

/**
 * Recebe o formulário de /contactos. Faz duas coisas:
 * 1. Guarda a mensagem na tabela "contact_messages" (aparece no painel
 *    /admin/contactos).
 * 2. Envia um email de aviso para a equipa, usando o serviço Resend —
 *    ver instruções em .env.local.example para configurar isto.
 *
 * Se o envio de email falhar ou não estiver configurado, a mensagem é
 * sempre guardada na base de dados de qualquer forma — nunca se perde.
 */
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);

  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const email = typeof body?.email === "string" ? body.email.trim() : "";
  const subject = typeof body?.subject === "string" ? body.subject.trim() : "";
  const message = typeof body?.message === "string" ? body.message.trim() : "";

  if (!name || !email || !subject || !message) {
    return NextResponse.json(
      { error: "Faltam campos obrigatórios." },
      { status: 400 }
    );
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Email inválido." }, { status: 400 });
  }

  const supabase = await createServerSupabaseClient();
  const { error: dbError } = await supabase
    .from("contact_messages")
    .insert({ name, email, subject, message });

  if (dbError) {
    console.error("Erro ao guardar mensagem de contacto:", dbError);
    return NextResponse.json(
      { error: "Não foi possível guardar a mensagem. Tenta novamente." },
      { status: 500 }
    );
  }

  // Envio de email — opcional. Se as variáveis de ambiente RESEND_API_KEY
  // e CONTACT_EMAIL_TO não estiverem configuradas, esta parte é ignorada
  // em silêncio (a mensagem já ficou guardada acima, sempre visível em
  // /admin/contactos).
  const resendApiKey = process.env.RESEND_API_KEY;
  const contactEmailTo = process.env.CONTACT_EMAIL_TO;

  if (resendApiKey && contactEmailTo) {
    try {
      const emailRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // "onboarding@resend.dev" funciona logo, sem precisares de
          // configurar um domínio próprio no Resend. Podes trocar mais
          // tarde por um endereço @newgameplus.pt, por exemplo, depois
          // de verificares o domínio lá no painel do Resend.
          from: "NewGame+ <onboarding@resend.dev>",
          to: [contactEmailTo],
          reply_to: email,
          subject: `[Contacto] ${subject}`,
          text: `De: ${name} (${email})\n\n${message}`,
        }),
      });

      if (!emailRes.ok) {
        console.error("Erro ao enviar email de contacto:", await emailRes.text());
      }
    } catch (err) {
      console.error("Erro ao enviar email de contacto:", err);
    }
  }

  return NextResponse.json({ success: true });
}
