"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/slugify";
import type { Event } from "@/lib/types";

const TIPOS: NonNullable<Event["type"]>[] = [
  "Competição",
  "Formação",
  "Internacional",
  "Inclusão",
];

export function EventForm({ evento }: { evento?: Event }) {
  const router = useRouter();
  const editar = Boolean(evento);
  const [title, setTitle] = useState(evento?.title ?? "");
  const [slug, setSlug] = useState(evento?.slug ?? "");
  const [slugTocado, setSlugTocado] = useState(editar);
  const [erro, setErro] = useState("");
  const [aGravar, setAGravar] = useState(false);

  useEffect(() => {
    if (!slugTocado) setSlug(slugify(title));
  }, [title, slugTocado]);

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
      title,
      slug,
      intro: String(fd.get("intro")),
      content: String(fd.get("content")) || null,
      cover_url: String(fd.get("cover_url")) || null,
      event_date: String(fd.get("event_date")),
      location: String(fd.get("location")) || null,
      type: String(fd.get("type")) || null,
      published: fd.get("published") === "on",
    };
    const res = editar
      ? await sb.from("events").update(registo).eq("id", evento!.id)
      : await sb.from("events").insert(registo);
    if (res.error) {
      setErro(res.error.message);
      setAGravar(false);
      return;
    }
    router.push("/admin/agenda");
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
        <label>Intro</label>
        <textarea name="intro" defaultValue={evento?.intro} required style={{ minHeight: "80px" }} />
      </div>
      <div className="campo">
        <label>Conteúdo</label>
        <textarea name="content" defaultValue={evento?.content ?? ""} style={{ minHeight: "180px" }} />
      </div>
      <div className="campo--duplo">
        <div className="campo">
          <label>Data</label>
          <input name="event_date" type="date" defaultValue={evento?.event_date} required />
        </div>
        <div className="campo">
          <label>Tipo</label>
          <select name="type" defaultValue={evento?.type ?? ""}>
            <option value="">—</option>
            {TIPOS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="campo">
        <label>Local</label>
        <input name="location" defaultValue={evento?.location ?? ""} />
      </div>
      <div className="campo">
        <label>URL da capa</label>
        <input name="cover_url" defaultValue={evento?.cover_url ?? ""} />
      </div>
      <label className="interruptor">
        <input type="checkbox" name="published" defaultChecked={evento?.published} />
        Publicado
      </label>
      {erro && <div className="aviso aviso--erro">{erro}</div>}
      <button className="btn" disabled={aGravar}>
        {aGravar ? "A gravar…" : editar ? "Guardar alterações" : "Criar evento"}
      </button>
    </form>
  );
}
