"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/slugify";

export function ProductForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTocado, setSlugTocado] = useState(false);
  const [erro, setErro] = useState("");
  const [aGravar, setAGravar] = useState(false);

  useEffect(() => {
    if (!slugTocado) setSlug(slugify(name));
  }, [name, slugTocado]);

  async function gravar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setAGravar(true);
    setErro("");
    const sb = createClient();
    if (!sb) {
      setErro("Supabase não configurado (modo demo).");
      setAGravar(false);
      return;
    }
    const fd = new FormData(e.currentTarget);
    const registo = {
      name,
      slug,
      description: String(fd.get("description")) || null,
      price: Number(fd.get("price")),
      cover_url: String(fd.get("cover_url")) || null,
      ref: String(fd.get("ref")) || null,
      stock: Number(fd.get("stock")) || 0,
      active: fd.get("active") === "on",
      featured: false,
    };
    const { error } = await sb.from("products").insert(registo);
    if (error) {
      setErro(error.message);
      setAGravar(false);
      return;
    }
    router.push("/admin/loja");
    router.refresh();
  }

  return (
    <form className="form" onSubmit={gravar} style={{ maxWidth: "760px" }}>
      <div className="campo">
        <label>Nome</label>
        <input value={name} onChange={(e) => setName(e.target.value)} required />
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
        <label>Descrição</label>
        <textarea name="description" style={{ minHeight: "120px" }} />
      </div>
      <div className="campo--duplo">
        <div className="campo">
          <label>Preço (€)</label>
          <input name="price" type="number" step="0.01" min="0" required />
        </div>
        <div className="campo">
          <label>Referência</label>
          <input name="ref" placeholder="SCV-005" />
        </div>
      </div>
      <div className="campo--duplo">
        <div className="campo">
          <label>Stock</label>
          <input name="stock" type="number" min="0" defaultValue={0} />
        </div>
        <div className="campo">
          <label>URL da capa</label>
          <input name="cover_url" />
        </div>
      </div>
      <label className="interruptor">
        <input type="checkbox" name="active" defaultChecked />
        Ativo
      </label>
      {erro && <div className="aviso aviso--erro">{erro}</div>}
      <button className="btn" disabled={aGravar}>
        {aGravar ? "A gravar…" : "Criar produto"}
      </button>
    </form>
  );
}
