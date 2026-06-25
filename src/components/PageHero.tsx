import { type ReactNode } from "react";

/* Cabeçalho de página interior — eyebrow numerado + título display. */
export function PageHero({
  num,
  marco,
  titulo,
  children,
}: {
  num: string;
  marco: string;
  titulo: ReactNode;
  children?: ReactNode;
}) {
  return (
    <header className="container" style={{ paddingTop: "150px", paddingBottom: "1rem" }}>
      <span className="marco revelar">
        <span className="marco__num">{num}</span>
        <span className="marco__label">{marco}</span>
      </span>
      <h1 className="display-lg revelar revelar--atraso-1" style={{ marginTop: "1rem" }}>
        {titulo}
      </h1>
      {children && (
        <div
          className="revelar revelar--atraso-2"
          style={{ maxWidth: "60ch", marginTop: "1.2rem", color: "var(--cor-tinta-suave)", fontSize: "1.1rem" }}
        >
          {children}
        </div>
      )}
    </header>
  );
}
