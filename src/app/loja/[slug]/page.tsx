import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduto } from "@/lib/dados";
import { preco } from "@/lib/format";
import { BotaoAdicionar } from "./BotaoAdicionar";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const produto = await getProduto(slug);
  if (!produto) return { title: "Produto não encontrado" };
  return { title: produto.name, description: produto.description ?? undefined };
}

export default async function ProdutoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const produto = await getProduto(slug);
  if (!produto) notFound();

  return (
    <section className="interior container">
      <Link href="/loja" className="voltar">
        ← Voltar à loja
      </Link>

      <div className="produto mt-2">
        <div
          className="produto__capa"
          style={
            produto.cover_url
              ? { backgroundImage: `url(${produto.cover_url})` }
              : undefined
          }
        />
        <div>
          {produto.ref && (
            <span className="mono" style={{ color: "var(--cor-tinta-fraca)", letterSpacing: "0.14em" }}>
              {produto.ref}
            </span>
          )}
          <h1 className="display-md revelar" style={{ margin: "0.4rem 0 1rem" }}>
            {produto.name}
          </h1>
          <div className="produto__preco">{preco(produto.price)}</div>
          {produto.description && (
            <p style={{ marginTop: "1.2rem", color: "var(--cor-tinta-suave)", fontSize: "1.05rem" }}>
              {produto.description}
            </p>
          )}
          <p className="mono mt-1" style={{ fontSize: "0.8rem", color: "var(--cor-tinta-fraca)" }}>
            {produto.stock > 0 ? `${produto.stock} em stock` : "Sem stock"}
          </p>
          <BotaoAdicionar produto={produto} />
          <p className="mono mt-2" style={{ fontSize: "0.78rem", color: "var(--cor-tinta-fraca)" }}>
            Cada compra apoia a formação de novos surfistas no Cabedelo.
          </p>
        </div>
      </div>
    </section>
  );
}
