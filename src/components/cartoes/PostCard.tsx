import Link from "next/link";
import { CartaoTilt } from "@/components/motor/CartaoTilt";
import { dataCurta } from "@/lib/format";
import type { Post } from "@/lib/types";

export function PostCard({ post }: { post: Post }) {
  return (
    <CartaoTilt className="cartao-post">
      <Link href={`/blog/${post.slug}`} className="cartao-post__link">
        <div
          className="cartao-post__capa"
          style={
            post.cover_url
              ? { backgroundImage: `url(${post.cover_url})` }
              : undefined
          }
        >
          {!post.cover_url && <span className="cartao-post__marca">SCV</span>}
          {post.tag && <span className="etiqueta">{post.tag}</span>}
        </div>
        <div className="cartao-post__corpo">
          <span className="mono cartao-post__data">
            {post.published_at ? dataCurta(post.published_at) : ""}
          </span>
          <h3 className="cartao-post__titulo">{post.title}</h3>
          <p className="cartao-post__intro">{post.intro}</p>
          <span className="ligar mono">Ler artigo →</span>
        </div>
      </Link>
    </CartaoTilt>
  );
}
