"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { POSTS_DEMO } from "@/lib/demo";
import { dataCurta } from "@/lib/format";
import type { Post } from "@/lib/types";

export function AdminBlogLista() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [demo, setDemo] = useState(false);

  useEffect(() => {
    const sb = createClient();
    if (!sb) {
      setPosts(POSTS_DEMO);
      setDemo(true);
      return;
    }
    sb.from("posts")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => setPosts((data as Post[]) ?? []));
  }, []);

  async function alternarPublicado(p: Post) {
    const sb = createClient();
    if (!sb) return;
    const novo = !p.published;
    await sb
      .from("posts")
      .update({
        published: novo,
        published_at: novo ? new Date().toISOString() : null,
      })
      .eq("id", p.id);
    setPosts((prev) =>
      prev.map((x) => (x.id === p.id ? { ...x, published: novo } : x))
    );
  }

  async function apagar(p: Post) {
    if (!confirm(`Apagar "${p.title}"?`)) return;
    const sb = createClient();
    if (!sb) return;
    await sb.from("posts").delete().eq("id", p.id);
    setPosts((prev) => prev.filter((x) => x.id !== p.id));
  }

  return (
    <>
      <div className="admin__cabeca">
        <h1 className="display-md">Blog</h1>
        <Link href="/admin/blog/novo" className="btn">
          Novo artigo
        </Link>
      </div>
      <table className="tabela">
        <thead>
          <tr>
            <th>Título</th>
            <th>Tag</th>
            <th>Estado</th>
            <th>Data</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {posts.map((p) => (
            <tr key={p.id}>
              <td>
                <Link href={`/admin/blog/${p.id}`}>
                  <strong>{p.title}</strong>
                </Link>
              </td>
              <td className="mono">{p.tag ?? "—"}</td>
              <td>
                <label className="interruptor">
                  <input
                    type="checkbox"
                    checked={p.published}
                    onChange={() => alternarPublicado(p)}
                    disabled={demo}
                  />
                  {p.published ? "Publicado" : "Rascunho"}
                </label>
              </td>
              <td className="mono">
                {p.published_at ? dataCurta(p.published_at) : "—"}
              </td>
              <td>
                <button
                  onClick={() => apagar(p)}
                  disabled={demo}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "var(--cor-coral)" }}
                >
                  Apagar
                </button>
              </td>
            </tr>
          ))}
          {posts.length === 0 && (
            <tr>
              <td colSpan={5} className="mono">
                Sem artigos.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
}
