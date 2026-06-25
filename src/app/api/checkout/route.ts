import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { enviarEmail } from "@/lib/email";

interface ItemPedido {
  slug: string;
  name: string;
  price: number;
  qtd: number;
}
interface Corpo {
  name?: string;
  email?: string;
  itens?: ItemPedido[];
  total?: number;
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
  const itens = Array.isArray(corpo.itens) ? corpo.itens : [];

  if (!name || !emailValido(email)) {
    return NextResponse.json(
      { error: "Nome e email válido são obrigatórios." },
      { status: 400 }
    );
  }
  if (itens.length === 0) {
    return NextResponse.json({ error: "O carrinho está vazio." }, { status: 400 });
  }

  const total = itens.reduce((s, i) => s + i.price * i.qtd, 0);

  // Registar ordem (se Supabase configurado e a tabela existir)
  const sb = createAdminClient();
  if (sb) {
    await sb
      .from("orders")
      .insert({ name, email, itens, total })
      .then(({ error }) => {
        if (error) console.warn("Tabela orders ausente ou erro:", error.message);
      });
  }

  const linhas = itens
    .map((i) => `<li>${escapar(i.name)} × ${i.qtd} · ${(i.price * i.qtd).toFixed(2)}€</li>`)
    .join("");

  await enviarEmail(
    `Nova encomenda · ${name}`,
    `<h2>Nova encomenda na loja</h2>
     <p><strong>Cliente:</strong> ${escapar(name)} (${escapar(email)})</p>
     <ul>${linhas}</ul>
     <p><strong>Total:</strong> ${total.toFixed(2)}€</p>`
  );

  // confirmação ao cliente
  await enviarEmail(
    "Encomenda recebida · Surf Clube de Viana",
    `<h2>Obrigado pela tua encomenda</h2>
     <p>Recebemos o teu pedido no valor de ${total.toFixed(2)}€. Entramos em contacto para combinar pagamento e entrega.</p>
     <p>Cada compra apoia a formação de novos surfistas no Cabedelo.</p>`,
    email
  );

  return NextResponse.json({ ok: true, total });
}

function escapar(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
