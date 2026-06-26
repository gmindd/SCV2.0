"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { EVENTS_DEMO } from "@/lib/demo";
import { dataCurta } from "@/lib/format";
import type { Event } from "@/lib/types";

export function AdminAgendaLista() {
  const [eventos, setEventos] = useState<Event[]>([]);
  const [demo, setDemo] = useState(false);

  useEffect(() => {
    const sb = createClient();
    if (!sb) {
      setEventos(EVENTS_DEMO);
      setDemo(true);
      return;
    }
    sb.from("events")
      .select("*")
      .order("event_date", { ascending: true })
      .then(({ data }) => setEventos((data as Event[]) ?? []));
  }, []);

  async function alternar(ev: Event) {
    const sb = createClient();
    if (!sb) return;
    await sb.from("events").update({ published: !ev.published }).eq("id", ev.id);
    setEventos((prev) =>
      prev.map((x) => (x.id === ev.id ? { ...x, published: !ev.published } : x))
    );
  }

  async function apagar(ev: Event) {
    if (!confirm(`Apagar "${ev.title}"?`)) return;
    const sb = createClient();
    if (!sb) return;
    await sb.from("events").delete().eq("id", ev.id);
    setEventos((prev) => prev.filter((x) => x.id !== ev.id));
  }

  return (
    <>
      <div className="admin__cabeca">
        <h1 className="display-md">Agenda</h1>
        <Link href="/admin/agenda/novo" className="btn">
          Novo evento
        </Link>
      </div>
      <table className="tabela">
        <thead>
          <tr>
            <th>Evento</th>
            <th>Tipo</th>
            <th>Data</th>
            <th>Estado</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {eventos.map((ev) => (
            <tr key={ev.id}>
              <td>
                <Link href={`/admin/agenda/${ev.id}`}>
                  <strong>{ev.title}</strong>
                </Link>
              </td>
              <td className="mono">{ev.type ?? "—"}</td>
              <td className="mono">{dataCurta(ev.event_date)}</td>
              <td>
                <label className="interruptor">
                  <input
                    type="checkbox"
                    checked={ev.published}
                    onChange={() => alternar(ev)}
                    disabled={demo}
                  />
                  {ev.published ? "Publicado" : "Rascunho"}
                </label>
              </td>
              <td>
                <button
                  onClick={() => apagar(ev)}
                  disabled={demo}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "var(--cor-azul)" }}
                >
                  Apagar
                </button>
              </td>
            </tr>
          ))}
          {eventos.length === 0 && (
            <tr>
              <td colSpan={5} className="mono">
                Sem eventos.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
}
