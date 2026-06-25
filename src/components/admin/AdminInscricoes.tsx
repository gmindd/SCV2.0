"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { dataCurta } from "@/lib/format";
import type { Inscricao } from "@/lib/types";

const DEMO: Inscricao[] = [
  {
    id: "i1",
    name: "Maria Costa",
    email: "maria@exemplo.pt",
    phone: "912 345 678",
    modalidade: "Surf",
    nivel: "Iniciante",
    message: "Quero começar nas férias de verão.",
    created_at: "2026-06-10T10:00:00Z",
    read: false,
  },
  {
    id: "i2",
    name: "João Silva",
    email: "joao@exemplo.pt",
    phone: null,
    modalidade: "Bodyboard",
    nivel: "Intermédio",
    message: null,
    created_at: "2026-06-08T09:00:00Z",
    read: true,
  },
];

export function AdminInscricoes() {
  const [lista, setLista] = useState<Inscricao[]>([]);
  const [demo, setDemo] = useState(false);

  useEffect(() => {
    const sb = createClient();
    if (!sb) {
      setLista(DEMO);
      setDemo(true);
      return;
    }
    sb.from("inscricoes")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => setLista((data as Inscricao[]) ?? []));
  }, []);

  async function alternarLida(i: Inscricao) {
    const sb = createClient();
    if (!sb) return;
    await sb.from("inscricoes").update({ read: !i.read }).eq("id", i.id);
    setLista((prev) =>
      prev.map((x) => (x.id === i.id ? { ...x, read: !i.read } : x))
    );
  }

  return (
    <>
      <div className="admin__cabeca">
        <h1 className="display-md">Inscrições</h1>
        <span className="mono" style={{ color: "var(--cor-tinta-suave)" }}>
          {lista.filter((i) => !i.read).length} por ler
        </span>
      </div>
      <table className="tabela">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Contacto</th>
            <th>Modalidade</th>
            <th>Nível</th>
            <th>Data</th>
            <th>Lida</th>
          </tr>
        </thead>
        <tbody>
          {lista.map((i) => (
            <tr key={i.id} style={{ fontWeight: i.read ? 400 : 600 }}>
              <td>
                {i.name}
                {i.message && (
                  <div className="mono" style={{ fontWeight: 400, fontSize: "0.72rem", color: "var(--cor-tinta-fraca)" }}>
                    {i.message}
                  </div>
                )}
              </td>
              <td className="mono" style={{ fontSize: "0.78rem" }}>
                {i.email}
                {i.phone && <br />}
                {i.phone}
              </td>
              <td>{i.modalidade ?? "—"}</td>
              <td>{i.nivel ?? "—"}</td>
              <td className="mono">{dataCurta(i.created_at)}</td>
              <td>
                <label className="interruptor">
                  <input
                    type="checkbox"
                    checked={i.read}
                    onChange={() => alternarLida(i)}
                    disabled={demo}
                  />
                </label>
              </td>
            </tr>
          ))}
          {lista.length === 0 && (
            <tr>
              <td colSpan={6} className="mono">
                Sem inscrições.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
}
