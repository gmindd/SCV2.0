"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { PRODUCTS_DEMO } from "@/lib/demo";
import { preco } from "@/lib/format";
import type { Product } from "@/lib/types";

const MAX_DESTAQUES = 3;

export function AdminLojaLista() {
  const [produtos, setProdutos] = useState<Product[]>([]);
  const [demo, setDemo] = useState(false);
  const [aviso, setAviso] = useState("");

  useEffect(() => {
    const sb = createClient();
    if (!sb) {
      setProdutos(PRODUCTS_DEMO);
      setDemo(true);
      return;
    }
    sb.from("products")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => setProdutos((data as Product[]) ?? []));
  }, []);

  async function alternarAtivo(p: Product) {
    const sb = createClient();
    if (!sb) return;
    await sb.from("products").update({ active: !p.active }).eq("id", p.id);
    setProdutos((prev) =>
      prev.map((x) => (x.id === p.id ? { ...x, active: !p.active } : x))
    );
  }

  async function alternarDestaque(p: Product) {
    const sb = createClient();
    if (!sb) return;
    const novo = !p.featured;
    // Regra dos 3 destaques — contagem local antes do update
    if (novo) {
      const atuais = produtos.filter((x) => x.featured).length;
      if (atuais >= MAX_DESTAQUES) {
        setAviso("Limite de 3 destaques atingido. Desmarque outro produto.");
        return;
      }
    }
    setAviso("");
    await sb.from("products").update({ featured: novo }).eq("id", p.id);
    setProdutos((prev) =>
      prev.map((x) => (x.id === p.id ? { ...x, featured: novo } : x))
    );
  }

  const totalDestaques = produtos.filter((p) => p.featured).length;

  return (
    <>
      <div className="admin__cabeca">
        <div>
          <h1 className="display-md">Loja</h1>
          <span className="mono" style={{ fontSize: "0.78rem", color: "var(--cor-tinta-suave)" }}>
            Destaques: {totalDestaques}/{MAX_DESTAQUES}
          </span>
        </div>
        <Link href="/admin/loja/novo" className="btn">
          Novo produto
        </Link>
      </div>

      {aviso && <div className="aviso aviso--erro mb-1">{aviso}</div>}

      <table className="tabela">
        <thead>
          <tr>
            <th>Produto</th>
            <th>Ref</th>
            <th>Preço</th>
            <th>Stock</th>
            <th>Ativo</th>
            <th>Destaque</th>
          </tr>
        </thead>
        <tbody>
          {produtos.map((p) => (
            <tr key={p.id}>
              <td>
                <strong>{p.name}</strong>
              </td>
              <td className="mono">{p.ref ?? "—"}</td>
              <td className="mono">{preco(p.price)}</td>
              <td className="mono">{p.stock}</td>
              <td>
                <label className="interruptor">
                  <input
                    type="checkbox"
                    checked={p.active}
                    onChange={() => alternarAtivo(p)}
                    disabled={demo}
                  />
                </label>
              </td>
              <td>
                <label className="interruptor">
                  <input
                    type="checkbox"
                    checked={p.featured}
                    onChange={() => alternarDestaque(p)}
                    disabled={demo}
                  />
                </label>
              </td>
            </tr>
          ))}
          {produtos.length === 0 && (
            <tr>
              <td colSpan={6} className="mono">
                Sem produtos.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
}
