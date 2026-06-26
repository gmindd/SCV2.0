/* ============================================================
   LOGÓTIPO — Surf Clube de Viana
   Tubarão (recriação vetorial do logo) + wordmark SCV.
   Para substituir pela arte original: troca o <SharkIcon> por
   <img src="/logo/logo.svg" /> (coloca o ficheiro em public/logo/).
   ============================================================ */

type Props = {
  /** true = versão para fundos escuros (tubarão branco) */
  mono?: boolean;
  /** altura do tubarão em px */
  tamanho?: number;
  className?: string;
};

/** Só o símbolo (tubarão), usado também como favicon. */
export function SharkIcon({ mono = false, tamanho = 34, className }: Props) {
  const corpo = mono ? "#fbfaf6" : "var(--cor-azul)";
  const detalhe = mono ? "var(--cor-azul)" : "#fbfaf6";
  const pupila = mono ? "var(--cor-azul)" : "#0a1a22";
  return (
    <svg
      viewBox="-60 -56 120 116"
      width={tamanho}
      height={tamanho}
      className={className}
      role="img"
      aria-label="Surf Clube de Viana"
    >
      {/* corpo (gota arredondada, focinho no topo) */}
      <path
        fill={corpo}
        d="M0,-52 C18,-52 33,-32 33,-6 C33,28 18,50 0,50 C-18,50 -33,28 -33,-6 C-33,-32 -18,-52 0,-52 Z"
      />
      {/* barbatanas laterais */}
      <path fill={corpo} d="M-31,2 L-54,15 L-29,20 Z" />
      <path fill={corpo} d="M31,2 L54,15 L29,20 Z" />
      {/* olhos */}
      <circle cx="-14" cy="-10" r="8.5" fill={detalhe} />
      <circle cx="14" cy="-10" r="8.5" fill={detalhe} />
      <circle cx="-14" cy="-10" r="3.6" fill={pupila} />
      <circle cx="14" cy="-10" r="3.6" fill={pupila} />
      {/* boca sorridente */}
      <path
        d="M-16,16 Q0,31 16,16"
        fill="none"
        stroke={detalhe}
        strokeWidth="4.5"
        strokeLinecap="round"
      />
      {/* guelras */}
      <path
        d="M-25,1 l8,3 M-26,8 l8,2"
        stroke={detalhe}
        strokeWidth="2.6"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M25,1 l-8,3 M26,8 l-8,2"
        stroke={detalhe}
        strokeWidth="2.6"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

/** Lockup completo: tubarão + wordmark SCV + subtítulo. */
export function Logo({
  mono = false,
  tamanho = 38,
  comSubtitulo = true,
}: Props & { comSubtitulo?: boolean }) {
  const corTexto = mono ? "var(--cor-espuma)" : "var(--cor-azul)";
  return (
    <span className="logo">
      <SharkIcon mono={mono} tamanho={tamanho} />
      <span className="logo__txt">
        <span className="logo__sigla" style={{ color: corTexto }}>
          SCV
        </span>
        {comSubtitulo && (
          <span className="logo__sub mono">Surf Clube de Viana</span>
        )}
      </span>
    </span>
  );
}
