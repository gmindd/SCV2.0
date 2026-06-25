"use client";

import { useState } from "react";
import Link from "next/link";
import { useCarrinho } from "@/components/loja/CarrinhoContexto";
import { preco } from "@/lib/format";

export default function CarrinhoPage() {
  const { itens, total, definirQtd, remover, limpar } = useCarrinho();
  const [estado, setEstado] = useState<"idle" | "enviar" | "ok" | "erro">("idle");
  const [erro, setErro] = useState("");

  async function checkout(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setEstado("enviar");
    setErro("");
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fd.get("name"),
          email: fd.get("email"),
          itens,
          total,
        }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || "Não foi possível concluir a encomenda.");
      }
      setEstado("ok");
      limpar();
    } catch (err) {
      setEstado("erro");
      setErro(err instanceof Error ? err.message : "Erro inesperado.");
    }
  }

  return (
    <section className="interior container">
      <Link href="/loja" className="voltar">
        ← Continuar a comprar
      </Link>
      <h1 className="display-md mt-2 mb-1">Carrinho</h1>

      {estado === "ok" ? (
        <div className="aviso aviso--ok">
          Encomenda registada. Enviámos a confirmação por email. Obrigado por
          apoiares o clube!
        </div>
      ) : itens.length === 0 ? (
        <p className="mono mt-2">O carrinho está vazio.</p>
      ) : (
        <div className="grelha-2 mt-2" style={{ alignItems: "start" }}>
          {/* Itens */}
          <div>
            <table className="tabela">
              <thead>
                <tr>
                  <th>Produto</th>
                  <th>Qtd</th>
                  <th>Total</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {itens.map((i) => (
                  <tr key={i.slug}>
                    <td>
                      <strong>{i.name}</strong>
                      <br />
                      <span className="mono" style={{ fontSize: "0.72rem", color: "var(--cor-tinta-fraca)" }}>
                        {i.ref} · {preco(i.price)}
                      </span>
                    </td>
                    <td>
                      <input
                        type="number"
                        min={1}
                        value={i.qtd}
                        onChange={(e) => definirQtd(i.slug, Number(e.target.value))}
                        style={{ width: "64px", padding: "0.3rem", border: "2px solid var(--cor-tinta)" }}
                      />
                    </td>
                    <td className="mono">{preco(i.price * i.qtd)}</td>
                    <td>
                      <button
                        className="voltar"
                        onClick={() => remover(i.slug)}
                        aria-label={`Remover ${i.name}`}
                        style={{ background: "none", border: "none", cursor: "pointer" }}
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="entre mt-1">
              <button className="voltar" onClick={limpar} style={{ background: "none", border: "none", cursor: "pointer" }}>
                Esvaziar carrinho
              </button>
              <strong className="mono" style={{ fontSize: "1.2rem", color: "var(--cor-coral)" }}>
                Total · {preco(total)}
              </strong>
            </div>
          </div>

          {/* Checkout */}
          <form className="cartao" style={{ padding: "1.5rem" }} onSubmit={checkout}>
            <h3 className="mb-1">Finalizar encomenda</h3>
            <div className="form">
              <div className="campo">
                <label htmlFor="name">Nome *</label>
                <input id="name" name="name" required />
              </div>
              <div className="campo">
                <label htmlFor="email">Email *</label>
                <input id="email" name="email" type="email" required />
              </div>
              {estado === "erro" && <div className="aviso aviso--erro">{erro}</div>}
              <button className="btn" disabled={estado === "enviar"}>
                {estado === "enviar" ? "A processar…" : `Encomendar · ${preco(total)}`}
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}
