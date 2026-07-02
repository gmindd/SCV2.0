"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NAV, CLUBE } from "@/lib/conteudo";
import { useCarrinho } from "@/components/loja/CarrinhoContexto";
import { Logo } from "@/components/Logo";

export function Nav() {
  const pathname = usePathname();
  const { contagem } = useCarrinho();
  const [aberto, setAberto] = useState(false);
  const [solido, setSolido] = useState(false);
  const [oculta, setOculta] = useState(false);

  useEffect(() => setAberto(false), [pathname]);

  useEffect(() => {
    let ultimoY = window.scrollY;
    const aoScroll = () => {
      const y = window.scrollY;
      setSolido(y > 40);
      // esconde ao descer (depois da 1ª dobra), reaparece assim que sobe
      setOculta(y > 180 && y > ultimoY);
      ultimoY = y;
    };
    aoScroll();
    window.addEventListener("scroll", aoScroll, { passive: true });
    return () => window.removeEventListener("scroll", aoScroll);
  }, []);

  return (
    <header
      className={`nav ${solido ? "nav--solido" : ""} ${
        oculta && !aberto ? "nav--oculta" : ""
      }`}
    >
      <div className="container nav__barra">
        <Link href="/" className="nav__logo" aria-label={CLUBE.nome}>
          <Logo tamanho={40} />
        </Link>

        <nav className="nav__links" aria-label="Principal">
          {NAV.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`nav__link ${
                pathname.startsWith(l.href) ? "is-ativo" : ""
              }`}
            >
              {l.label}
            </Link>
          ))}
          <Link href="/loja/carrinho" className="nav__link" aria-label="Carrinho">
            Carrinho{contagem > 0 ? ` (${contagem})` : ""}
          </Link>
          <Link href="/escola/inscricao" className="btn nav__cta">
            Inscrever
          </Link>
        </nav>

        <button
          className="nav__hamburguer"
          aria-label="Abrir menu"
          aria-expanded={aberto}
          onClick={() => setAberto((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {aberto && (
        <div className="nav__movel">
          {NAV.map((l) => (
            <Link key={l.href} href={l.href} className="nav__movel-link">
              {l.label}
            </Link>
          ))}
          <Link href="/escola/inscricao" className="btn">
            Inscrever
          </Link>
        </div>
      )}
    </header>
  );
}
