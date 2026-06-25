import Link from "next/link";
import { CartaoTilt } from "@/components/motor/CartaoTilt";
import { preco } from "@/lib/format";
import type { Product } from "@/lib/types";

export function ProductCard({ produto }: { produto: Product }) {
  return (
    <CartaoTilt className="cartao-produto">
      <Link href={`/loja/${produto.slug}`} className="cartao-produto__link">
        <div
          className="cartao-produto__capa"
          style={
            produto.cover_url
              ? { backgroundImage: `url(${produto.cover_url})` }
              : undefined
          }
        >
          {!produto.cover_url && (
            <span className="cartao-produto__marca">SCV</span>
          )}
          {produto.stock <= 0 && (
            <span className="etiqueta etiqueta--esgotado">Esgotado</span>
          )}
        </div>
        <div className="cartao-produto__corpo">
          {produto.ref && (
            <span className="mono cartao-produto__ref">{produto.ref}</span>
          )}
          <h3 className="cartao-produto__nome">{produto.name}</h3>
          <span className="cartao-produto__preco">{preco(produto.price)}</span>
        </div>
      </Link>
    </CartaoTilt>
  );
}
