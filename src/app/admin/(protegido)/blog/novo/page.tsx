import Link from "next/link";
import { PostForm } from "@/components/admin/PostForm";

export default function NovoPostPage() {
  return (
    <>
      <div className="admin__cabeca">
        <h1 className="display-md">Novo artigo</h1>
        <Link href="/admin/blog" className="voltar">
          ← Voltar
        </Link>
      </div>
      <PostForm />
    </>
  );
}
