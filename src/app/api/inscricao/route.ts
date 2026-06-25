import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { enviarEmail } from "@/lib/email";

interface Corpo {
  name?: string;
  email?: string;
  phone?: string;
  modalidade?: string;
  nivel?: string;
  message?: string;
}

const emailValido = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

export async function POST(req: Request) {
  let corpo: Corpo;
  try {
    corpo = await req.json();
  } catch {
    return NextResponse.json({ error: "Pedido inválido." }, { status: 400 });
  }

  const name = (corpo.name ?? "").trim();
  const email = (corpo.email ?? "").trim();

  if (!name || !email) {
    return NextResponse.json(
      { error: "Nome e email são obrigatórios." },
      { status: 400 }
    );
  }
  if (!emailValido(email)) {
    return NextResponse.json({ error: "Email inválido." }, { status: 400 });
  }

  const registo = {
    name,
    email,
    phone: corpo.phone?.trim() || null,
    modalidade: corpo.modalidade || null,
    nivel: corpo.nivel || null,
    message: corpo.message?.trim() || null,
  };

  // 1. Persistir no Supabase (se configurado)
  const sb = createAdminClient();
  if (sb) {
    const { error } = await sb.from("inscricoes").insert(registo);
    if (error) {
      console.error("Supabase inscricao erro:", error);
      return NextResponse.json(
        { error: "Não foi possível registar a inscrição." },
        { status: 500 }
      );
    }
  }

  // 2. Notificar o clube por email (opcional)
  await enviarEmail(
    `Nova inscrição · ${name}`,
    `<h2>Nova inscrição na escola</h2>
     <p><strong>Nome:</strong> ${escapar(name)}</p>
     <p><strong>Email:</strong> ${escapar(email)}</p>
     <p><strong>Telefone:</strong> ${escapar(registo.phone ?? "—")}</p>
     <p><strong>Modalidade:</strong> ${escapar(registo.modalidade ?? "—")}</p>
     <p><strong>Nível:</strong> ${escapar(registo.nivel ?? "—")}</p>
     <p><strong>Mensagem:</strong> ${escapar(registo.message ?? "—")}</p>`
  );

  return NextResponse.json({ ok: true });
}

function escapar(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
