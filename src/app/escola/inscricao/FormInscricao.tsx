"use client";

import { useState } from "react";
import { MODALIDADES_FORM, NIVEIS } from "@/lib/conteudo";

type Estado = "idle" | "enviar" | "ok" | "erro";

export function FormInscricao() {
  const [estado, setEstado] = useState<Estado>("idle");
  const [erro, setErro] = useState("");

  async function aoSubmeter(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setEstado("enviar");
    setErro("");
    const form = e.currentTarget;
    const fd = new FormData(form);
    const body = Object.fromEntries(fd.entries());

    try {
      const res = await fetch("/api/inscricao", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || "Não foi possível enviar a inscrição.");
      }
      setEstado("ok");
      form.reset();
    } catch (err) {
      setEstado("erro");
      setErro(err instanceof Error ? err.message : "Erro inesperado.");
    }
  }

  if (estado === "ok") {
    return (
      <div className="aviso aviso--ok">
        Inscrição recebida. Entramos em contacto em breve. Até ao Cabedelo!
      </div>
    );
  }

  return (
    <form className="form" onSubmit={aoSubmeter}>
      <div className="campo">
        <label htmlFor="name">Nome *</label>
        <input id="name" name="name" required autoComplete="name" />
      </div>

      <div className="campo--duplo">
        <div className="campo">
          <label htmlFor="email">Email *</label>
          <input id="email" name="email" type="email" required autoComplete="email" />
        </div>
        <div className="campo">
          <label htmlFor="phone">Telefone</label>
          <input id="phone" name="phone" type="tel" autoComplete="tel" />
        </div>
      </div>

      <div className="campo--duplo">
        <div className="campo">
          <label htmlFor="modalidade">Modalidade</label>
          <select id="modalidade" name="modalidade" defaultValue="">
            <option value="" disabled>
              Escolher…
            </option>
            {MODALIDADES_FORM.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
        <div className="campo">
          <label htmlFor="nivel">Nível</label>
          <select id="nivel" name="nivel" defaultValue="">
            <option value="" disabled>
              Escolher…
            </option>
            {NIVEIS.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="campo">
        <label htmlFor="message">Mensagem</label>
        <textarea id="message" name="message" placeholder="Conta-nos a tua experiência ou dúvidas." />
      </div>

      {estado === "erro" && <div className="aviso aviso--erro">{erro}</div>}

      <button type="submit" className="btn" disabled={estado === "enviar"}>
        {estado === "enviar" ? "A enviar…" : "Enviar inscrição"}
      </button>
    </form>
  );
}
