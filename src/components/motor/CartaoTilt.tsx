"use client";

/* ============================================================
   CARTÃO COM TILT 3D no hover — mesma linguagem tátil do motor.
   rotateX/rotateY a seguir o rato; respeita prefers-reduced-motion.
   ============================================================ */

import { useRef, type ReactNode } from "react";

export function CartaoTilt({
  children,
  className = "",
  intensidade = 9,
}: {
  children: ReactNode;
  className?: string;
  intensidade?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  function aoMover(e: React.MouseEvent) {
    const el = ref.current;
    if (!el) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const caixa = el.getBoundingClientRect();
    const x = (e.clientX - caixa.left) / caixa.width - 0.5;
    const y = (e.clientY - caixa.top) / caixa.height - 0.5;
    el.style.transform = `rotateY(${x * intensidade}deg) rotateX(${
      -y * intensidade
    }deg) translateY(-4px)`;
    el.style.boxShadow = "9px 9px 0 var(--cor-tinta)";
  }

  function aoSair() {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "";
    el.style.boxShadow = "";
  }

  return (
    <div className="cartao-perspectiva">
      <div
        ref={ref}
        className={`cartao ${className}`}
        onMouseMove={aoMover}
        onMouseLeave={aoSair}
      >
        {children}
      </div>
    </div>
  );
}
