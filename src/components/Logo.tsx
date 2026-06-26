/* ============================================================
   LOGÓTIPO — Surf Clube de Viana
   Usa a arte original do clube: public/logo/logo-cor.png
   (tubarão + wordmark SCV). O favicon é o tubarão recortado.
   ============================================================ */

import Image from "next/image";

type Props = {
  /** altura do logótipo em px */
  tamanho?: number;
  /** mostrar o subtítulo "Surf Clube de Viana" ao lado */
  comSubtitulo?: boolean;
  /** versão para fundos escuros (subtítulo claro) */
  mono?: boolean;
};

// logo-cor.png = 380×200 (proporção 1.9:1)
const RACIO = 380 / 200;

export function Logo({ tamanho = 40, comSubtitulo = false, mono = false }: Props) {
  return (
    <span className="logo">
      <Image
        src="/logo/logo-cor.png"
        alt="Surf Clube de Viana"
        width={Math.round(tamanho * RACIO)}
        height={tamanho}
        priority
      />
      {comSubtitulo && (
        <span
          className="logo__sub mono"
          style={mono ? { color: "var(--cor-agua)" } : undefined}
        >
          Surf Clube de Viana
        </span>
      )}
    </span>
  );
}
