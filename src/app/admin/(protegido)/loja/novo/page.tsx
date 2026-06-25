import Link from "next/link";
import { ProductForm } from "@/components/admin/ProductForm";

export default function NovoProdutoPage() {
  return (
    <>
      <div className="admin__cabeca">
        <h1 className="display-md">Novo produto</h1>
        <Link href="/admin/loja" className="voltar">
          ← Voltar
        </Link>
      </div>
      <ProductForm />
    </>
  );
}
