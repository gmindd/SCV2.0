import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { ProductCard } from "@/components/cartoes/ProductCard";
import { getProdutos } from "@/lib/dados";

export const metadata: Metadata = {
  title: "Loja",
  description:
    "Loja oficial do Surf Clube de Viana. Cada compra apoia a formação de novos surfistas no Cabedelo.",
};

export const dynamic = "force-dynamic";

export default async function LojaPage() {
  const produtos = await getProdutos();
  return (
    <>
      <PageHero num="05" marco="Praia · Loja" titulo={<>Loja do clube</>}>
        Cada compra apoia a formação de novos surfistas no Cabedelo.
      </PageHero>

      <section className="seccao container">
        <div className="entre mb-1">
          <span className="eyebrow revelar">{produtos.length} produtos</span>
          <Link href="/loja/carrinho" className="btn btn--ghost">
            Ver carrinho
          </Link>
        </div>
        {produtos.length === 0 ? (
          <p className="mono mt-2">A loja está a ser reabastecida.</p>
        ) : (
          <div className="grelha-cartoes mt-2">
            {produtos.map((p, i) => (
              <div className={`revelar revelar--atraso-${i % 3}`} key={p.id}>
                <ProductCard produto={p} />
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
