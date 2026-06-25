"use client";

/* ============================================================
   FUNDO OCEANO — a assinatura visual (fixo, z-index 0)
   ------------------------------------------------------------
   - Camadas de oceano em parallax (horizonte lento → espuma rápida)
   - Sol que gira ligado a scrollSuave
   - O traçado da onda que se desenha (ondaTraco) sobre a base
     invisível (ondaBase), com o surfista (ponto) a viajar nele
   - Spray que aparece acima de um limiar de velocidade
   ============================================================ */

import { useRegistarMotor } from "./MotorDeScroll";

export function FundoOceano() {
  const refOndaTraco = useRegistarMotor("ondaTraco");
  const refOndaBase = useRegistarMotor("ondaBase");
  const refSurfista = useRegistarMotor("surfista");
  const refSol = useRegistarMotor("sol");

  // A linha da onda a quebrar — atravessa o ecrã da esquerda para a direita.
  const linhaOnda =
    "M -40 620 C 220 600 360 540 520 470 S 760 300 980 360 S 1240 540 1500 470";

  return (
    <div className="fundo-oceano" aria-hidden="true">
      {/* Sol que gira (atrás de tudo) */}
      <div
        ref={refSol}
        style={{
          position: "absolute",
          top: "22%",
          left: "78%",
          width: "min(46vw, 540px)",
          height: "min(46vw, 540px)",
          transform: "translate(-50%, -50%)",
          willChange: "transform",
        }}
      >
        <svg viewBox="0 0 200 200" style={{ width: "100%", height: "100%" }}>
          <circle cx="100" cy="100" r="46" fill="rgba(255,129,99,0.16)" />
          {Array.from({ length: 24 }).map((_, i) => {
            const ang = (i / 24) * Math.PI * 2;
            const x1 = 100 + Math.cos(ang) * 58;
            const y1 = 100 + Math.sin(ang) * 58;
            const x2 = 100 + Math.cos(ang) * 92;
            const y2 = 100 + Math.sin(ang) * 92;
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="rgba(255,90,60,0.18)"
                strokeWidth={i % 2 ? 1.5 : 4}
                strokeLinecap="round"
              />
            );
          })}
        </svg>
      </div>

      {/* Camadas de oceano em parallax */}
      <svg
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        style={{ position: "absolute", inset: 0 }}
      >
        {/* horizonte lento */}
        <g data-parallax="0.04">
          <path
            d="M0 540 Q 360 520 720 540 T 1440 540 V900 H0 Z"
            fill="rgba(18,80,107,0.06)"
          />
        </g>
        {/* ondas médias */}
        <g data-parallax="0.10">
          <path
            d="M0 640 Q 360 600 720 640 T 1440 640 V900 H0 Z"
            fill="rgba(43,134,166,0.08)"
          />
        </g>
        {/* espuma rápida em primeiro plano */}
        <g data-parallax="0.20">
          <path
            d="M0 760 Q 360 710 720 760 T 1440 760 V900 H0 Z"
            fill="rgba(111,194,214,0.10)"
          />
        </g>

        {/* A onda: base translúcida + traçado coral que se desenha */}
        <path
          ref={refOndaBase as unknown as React.Ref<SVGPathElement>}
          className="onda-base"
          d={linhaOnda}
          pathLength={1000}
        />
        <path
          ref={refOndaTraco as unknown as React.Ref<SVGPathElement>}
          className="onda-traco"
          d={linhaOnda}
          pathLength={1000}
        />

        {/* O surfista — viaja ao longo do traçado */}
        <g ref={refSurfista as unknown as React.Ref<SVGGElement>}>
          <circle className="surfista-ponto" r="9" />
          <circle r="20" fill="none" stroke="var(--cor-coral)" strokeWidth="1.5" opacity="0.5" />
        </g>
      </svg>

      {/* Spray / linhas de água acima do limiar de velocidade */}
      <div className="fundo-oceano__spray" />
    </div>
  );
}
