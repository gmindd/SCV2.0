"use client";

import { useState } from "react";
import Link from "next/link";
import { useCarrinho } from "@/components/loja/CarrinhoContexto";
import type { Product } from "@/lib/types";

export function BotaoAdicionar({ produto }: { produto: Product }) {
  const { adicionar } = useCarrinho();
  const [adicionado, setAdicionado] = useState(false);
  const esgotado = produto.stock <= 0;

  function aoAdicionar() {
    adicionar({
      slug: produto.slug,
      name: produto.name,
      price: produto.price,
      ref: produto.ref,
      cover_url: produto.cover_url,
    });
    setAdicionado(true);
    setTimeout(() => setAdicionado(false), 2200);
  }

  return (
    <div className="flex-linha mt-2">
      <button className="btn" onClick={aoAdicionar} disabled={esgotado}>
        {esgotado ? "Esgotado" : adicionado ? "Adicionado ✓" : "Adicionar ao carrinho"}
      </button>
      <Link href="/loja/carrinho" className="btn btn--ghost">
        Ver carrinho
      </Link>
    </div>
  );
}
