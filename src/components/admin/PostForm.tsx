"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/slugify";
import type { Post } from "@/lib/types";

const FORMATOS: Post["image_format"][] = ["16:9", "9:16", "1:1"];

export function PostForm({ post }: { post?: Post }) {
  const router = useRouter();
  const editar = Boolean(post);
  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugTocado, setSlugTocado] = useState(editar);
  const [estado, setEstado] = useState<"idle" | "a-gravar" | "erro">("idle");
  const [erro, setErro] = useState("");

  useEffect(() => {
    if (!slugTocado) setSlug(slugify(title));
  }, [title, slugTocado]);

  async function gravar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setEstado("a-gravar");
    setErro("");
    const sb = createClient();
    if (!sb) {
      setErro("Supabase não configurado (modo demo).");
      setEstado("erro");
      return;
    }
    const fd = new FormData(e.currentTarget);
    const registo = {
      title,
      slug,
      intro: String(fd.get("intro")),
      content: String(fd.get("content")),
      cover_url: String(fd.get("cover_url")) || null,
      image_format: String(fd.get("image_format")),
      tag: String(fd.get("tag")) || null,
      published: fd.get("published") === "on",
      published_at: fd.get("published") === "on" ? new Date().toISOString() : null,
    };

    const res = editar
      ? await sb.from("posts").update(registo).eq("id", post!.id)
      : await sb.from("posts").insert(registo);

    if (res.error) {
      setErro(res.error.message);
      setEstado("erro");
      return;
    }
    router.push("/admin/blog");
    router.refresh();
  }

  return (
    <form className="form" onSubmit={gravar} style={{ maxWidth: "760px" }}>
      <div className="campo">
        <label>Título</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>
      <div className="campo">
        <label>Slug</label>
        <input
          value={slug}
          onChange={(e) => {
            setSlug(e.target.value);
            setSlugTocado(true);
          }}
          required
        />
      </div>
      <div className="campo">
        <label>Intro (resumo)</label>
        <textarea name="intro" defaultValue={post?.intro} required style={{ minHeight: "80px" }} />
      </div>
      <div className="campo">
        <label>Conteúdo</label>
        <textarea name="content" defaultValue={post?.content} required style={{ minHeight: "240px" }} />
      </div>
      <div className="campo--duplo">
        <div className="campo">
          <label>Tag</label>
          <input name="tag" defaultValue={post?.tag ?? ""} placeholder="Internacional, CAR…" />
        </div>
        <div className="campo">
          <label>Formato de imagem</label>
          <select name="image_format" defaultValue={post?.image_format ?? "16:9"}>
            {FORMATOS.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="campo">
        <label>URL da capa (Supabase Storage)</label>
        <input name="cover_url" defaultValue={post?.cover_url ?? ""} />
      </div>
      <label className="interruptor">
        <input type="checkbox" name="published" defaultChecked={post?.published} />
        Publicado
      </label>
      {estado === "erro" && <div className="aviso aviso--erro">{erro}</div>}
      <div className="flex-linha">
        <button className="btn" disabled={estado === "a-gravar"}>
          {estado === "a-gravar" ? "A gravar…" : editar ? "Guardar alterações" : "Criar artigo"}
        </button>
      </div>
    </form>
  );
}
