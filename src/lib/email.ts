/* Envio de email transacional via Resend. Degrada em silêncio sem API key. */

import { Resend } from "resend";

const KEY = process.env.RESEND_API_KEY ?? "";
const FROM = process.env.RESEND_FROM_EMAIL ?? "noreply@surfingviana.com";
const PARA = process.env.CONTACT_EMAIL ?? "info@surfingviana.com";

export async function enviarEmail(assunto: string, html: string, para = PARA) {
  if (!KEY) return { ok: false, motivo: "sem-resend" as const };
  try {
    const resend = new Resend(KEY);
    await resend.emails.send({ from: FROM, to: para, subject: assunto, html });
    return { ok: true as const };
  } catch (e) {
    console.error("Resend erro:", e);
    return { ok: false, motivo: "erro" as const };
  }
}
