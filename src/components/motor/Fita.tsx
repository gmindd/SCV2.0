/* ============================================================
   FITA / MARQUEE — loop CSS infinito que inclina (skew) com a velocidade.
   O motor escreve a CSS var --vel-skew em .fita a cada frame.
   ============================================================ */

export function Fita({
  itens,
  className = "",
}: {
  itens: string[];
  className?: string;
}) {
  // duplicado para loop contínuo (animação translateX -50%)
  const pista = [...itens, ...itens];
  return (
    <div className={`fita ${className}`} role="presentation">
      <div className="fita__pista">
        {pista.map((t, i) => (
          <span className="fita__item" key={i}>
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
