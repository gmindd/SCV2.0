"use client";

/* ============================================================
   TELEMETRIA — instrumento de leitura (régua lateral / barra inferior)
   Lê metros surfados (progresso) e velocidade de surf (km/h aprox).
   Estética mono = relógio de marés / leitura de boia.
   ============================================================ */

import { useRegistarMotor } from "./MotorDeScroll";

export function Telemetria() {
  const refDist = useRegistarMotor("telDist");
  const refVel = useRegistarMotor("telVel");
  const refEnch = useRegistarMotor("telEnch");

  return (
    <aside className="telemetria" aria-hidden="true">
      <div>
        <span
          ref={refDist as unknown as React.Ref<HTMLSpanElement>}
          className="telemetria__valor"
        >
          0
        </span>
        <span style={{ marginLeft: "0.25rem" }}>ondas surfadas</span>
      </div>
      <div className="telemetria__barra">
        <div
          ref={refEnch as unknown as React.Ref<HTMLDivElement>}
          className="telemetria__enchimento"
        />
      </div>
      <div>
        <span
          ref={refVel as unknown as React.Ref<HTMLSpanElement>}
          className="telemetria__valor"
        >
          0
        </span>
        <span style={{ marginLeft: "0.25rem" }}>m · altura da onda</span>
      </div>
    </aside>
  );
}
