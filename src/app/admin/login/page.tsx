"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [erro, setErro] = useState("");
  const [carregar, setCarregar] = useState(false);

  async function aoSubmeter(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErro("");
    setCarregar(true);
    const fd = new FormData(e.currentTarget);
    const supabase = createClient();

    if (!supabase) {
      setErro("Supabase não está configurado neste ambiente.");
      setCarregar(false);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: String(fd.get("email")),
      password: String(fd.get("password")),
    });

    if (error) {
      setErro("Credenciais inválidas.");
      setCarregar(false);
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "var(--cor-abismo)",
        padding: "2rem",
      }}
    >
      <form
        onSubmit={aoSubmeter}
        className="cartao"
        style={{ padding: "2rem", width: "min(100%, 400px)" }}
      >
        <div
          style={{
            fontFamily: "var(--fonte-display)",
            fontStyle: "italic",
            fontSize: "2rem",
            color: "var(--cor-azul)",
          }}
        >
          SCV · Admin
        </div>
        <p className="mono" style={{ fontSize: "0.78rem", color: "var(--cor-tinta-suave)", marginBottom: "1.5rem" }}>
          Backoffice do Surf Clube de Viana
        </p>
        <div className="form">
          <div className="campo">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" required autoComplete="email" />
          </div>
          <div className="campo">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" required autoComplete="current-password" />
          </div>
          {erro && <div className="aviso aviso--erro">{erro}</div>}
          <button className="btn" disabled={carregar}>
            {carregar ? "A entrar…" : "Entrar"}
          </button>
        </div>
      </form>
    </div>
  );
}
