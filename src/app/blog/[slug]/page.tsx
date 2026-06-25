import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPost } from "@/lib/dados";
import { dataCurta } from "@/lib/format";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Artigo não encontrado" };
  return {
    title: post.title,
    description: post.intro,
    openGraph: { title: post.title, description: post.intro },
  };
}

export default async function ArtigoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  return (
    <article className="interior container">
      <Link href="/blog" className="voltar">
        ← Voltar ao blog
      </Link>

      <header style={{ margin: "1.5rem 0 2rem", maxWidth: "60ch" }}>
        <div className="flex-linha mb-1">
          {post.tag && <span className="etiqueta" style={{ position: "static" }}>{post.tag}</span>}
          <span className="mono" style={{ fontSize: "0.8rem", color: "var(--cor-tinta-fraca)" }}>
            {post.published_at ? dataCurta(post.published_at) : ""}
          </span>
        </div>
        <h1 className="display-md revelar">{post.title}</h1>
        <p style={{ fontSize: "1.2rem", color: "var(--cor-tinta-suave)", marginTop: "1rem" }}>
          {post.intro}
        </p>
      </header>

      {post.cover_url && (
        <div
          className="interior__capa"
          style={{ backgroundImage: `url(${post.cover_url})` }}
        />
      )}

      <div className="prosa">
        {post.content.split("\n").filter(Boolean).map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </article>
  );
}
