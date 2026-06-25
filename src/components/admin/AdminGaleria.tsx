"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const BUCKET = "galeria";

interface Ficheiro {
  name: string;
  url: string;
}

export function AdminGaleria() {
  const [ficheiros, setFicheiros] = useState<Ficheiro[]>([]);
  const [demo, setDemo] = useState(false);
  const [aCarregar, setACarregar] = useState(false);
  const [erro, setErro] = useState("");

  async function listar() {
    const sb = createClient();
    if (!sb) {
      setDemo(true);
      return;
    }
    const { data, error } = await sb.storage.from(BUCKET).list("", {
      sortBy: { column: "created_at", order: "desc" },
    });
    if (error) {
      setErro(error.message);
      return;
    }
    const lista = (data ?? [])
      .filter((f) => f.id)
      .map((f) => ({
        name: f.name,
        url: sb.storage.from(BUCKET).getPublicUrl(f.name).data.publicUrl,
      }));
    setFicheiros(lista);
  }

  useEffect(() => {
    listar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function carregar(e: React.ChangeEvent<HTMLInputElement>) {
    const sb = createClient();
    const files = e.target.files;
    if (!sb || !files || files.length === 0) return;
    setACarregar(true);
    setErro("");
    for (const file of Array.from(files)) {
      const caminho = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
      const { error } = await sb.storage.from(BUCKET).upload(caminho, file);
      if (error) setErro(error.message);
    }
    setACarregar(false);
    listar();
  }

  return (
    <>
      <div className="admin__cabeca">
        <h1 className="display-md">Galeria</h1>
        <label className="btn" style={{ cursor: aCarregar ? "wait" : "pointer" }}>
          {aCarregar ? "A carregar…" : "Carregar fotos"}
          <input
            type="file"
            accept="image/*,video/*"
            multiple
            hidden
            onChange={carregar}
            disabled={demo || aCarregar}
          />
        </label>
      </div>

      {demo && (
        <div className="aviso aviso--erro mb-1">
          Modo demo · upload requer Supabase Storage configurado (bucket “{BUCKET}”).
        </div>
      )}
      {erro && <div className="aviso aviso--erro mb-1">{erro}</div>}

      {ficheiros.length === 0 ? (
        <p className="mono">Sem ficheiros na galeria.</p>
      ) : (
        <div className="galeria">
          {ficheiros.map((f) => (
            <div
              key={f.name}
              className="galeria__item"
              style={{ backgroundImage: `url(${f.url})` }}
              title={f.name}
            />
          ))}
        </div>
      )}
    </>
  );
}
