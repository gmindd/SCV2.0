import Link from "next/link";
import { notFound } from "next/navigation";
import { PostForm } from "@/components/admin/PostForm";
import { createAdminClient } from "@/lib/supabase/admin";
import { POSTS_DEMO } from "@/lib/demo";
import type { Post } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function EditarPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const sb = createAdminClient();
  let post: Post | null = null;

  if (sb) {
    const { data } = await sb.from("posts").select("*").eq("id", id).single();
    post = (data as Post) ?? null;
  } else {
    post = POSTS_DEMO.find((p) => p.id === id) ?? null;
  }

  if (!post) notFound();

  return (
    <>
      <div className="admin__cabeca">
        <h1 className="display-md">Editar artigo</h1>
        <Link href="/admin/blog" className="voltar">
          ← Voltar
        </Link>
      </div>
      <PostForm post={post} />
    </>
  );
}
