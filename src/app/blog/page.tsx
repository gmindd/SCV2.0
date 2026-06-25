import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { PostCard } from "@/components/cartoes/PostCard";
import { getPosts } from "@/lib/dados";

export const metadata: Metadata = {
  title: "Blog",
  description: "Notícias, resultados e histórias do Surf Clube de Viana.",
};

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const posts = await getPosts();
  return (
    <>
      <PageHero num="04" marco="Manobra · Blog" titulo={<>Blog</>}>
        Notícias, resultados e histórias do clube e dos seus atletas.
      </PageHero>

      <section className="seccao container">
        {posts.length === 0 ? (
          <p className="mono">Ainda não há artigos publicados.</p>
        ) : (
          <div className="grelha-cartoes">
            {posts.map((p, i) => (
              <div className={`revelar revelar--atraso-${i % 3}`} key={p.id}>
                <PostCard post={p} />
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
