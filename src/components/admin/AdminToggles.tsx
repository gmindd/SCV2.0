"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { TOGGLES_DEMO } from "@/lib/demo";
import type { SiteToggle } from "@/lib/types";

export function AdminToggles() {
  const [toggles, setToggles] = useState<SiteToggle[]>(TOGGLES_DEMO);
  const [demo, setDemo] = useState(false);

  useEffect(() => {
    const sb = createClient();
    if (!sb) {
      setDemo(true);
      return;
    }
    sb.from("site_toggles")
      .select("*")
      .order("key")
      .then(({ data }) => {
        if (data && data.length) setToggles(data as SiteToggle[]);
      });

    // Realtime — reflecte mudanças vindas de outras sessões
    const canal = sb
      .channel("toggles")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "site_toggles" },
        (payload) => {
          const novo = payload.new as SiteToggle;
          setToggles((prev) =>
            prev.map((t) => (t.key === novo.key ? { ...t, value: novo.value } : t))
          );
        }
      )
      .subscribe();

    return () => {
      sb.removeChannel(canal);
    };
  }, []);

  async function alternar(t: SiteToggle) {
    const sb = createClient();
    setToggles((prev) =>
      prev.map((x) => (x.key === t.key ? { ...x, value: !t.value } : x))
    );
    if (!sb) return;
    await sb
      .from("site_toggles")
      .update({ value: !t.value, updated_at: new Date().toISOString() })
      .eq("key", t.key);
  }

  return (
    <>
      <div className="admin__cabeca">
        <h1 className="display-md">Secções da homepage</h1>
        {demo && (
          <span className="mono" style={{ color: "var(--cor-tinta-suave)" }}>
            (alterações não persistem em modo demo)
          </span>
        )}
      </div>
      <div style={{ display: "grid", gap: "0.6rem", maxWidth: "640px" }}>
        {toggles.map((t) => (
          <div className="painel-stat entre" key={t.key} style={{ padding: "1rem 1.2rem" }}>
            <div>
              <strong>{t.label}</strong>
              <div className="mono" style={{ fontSize: "0.7rem", color: "var(--cor-tinta-fraca)" }}>
                {t.key}
              </div>
            </div>
            <label className="interruptor">
              <input
                type="checkbox"
                checked={t.value}
                onChange={() => alternar(t)}
              />
              {t.value ? "Ligado" : "Desligado"}
            </label>
          </div>
        ))}
      </div>
    </>
  );
}
