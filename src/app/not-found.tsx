import Link from "next/link";

export default function NotFound() {
  return (
    <section className="interior container" style={{ minHeight: "70vh" }}>
      <span className="marco">
        <span className="marco__num">404</span>
        <span className="marco__label">Wipeout</span>
      </span>
      <h1 className="display-lg mt-1">Apanhaste um wipeout</h1>
      <p className="mt-1" style={{ color: "var(--cor-tinta-suave)", fontSize: "1.1rem" }}>
        Esta página não existe ou já foi para a praia. Volta ao lineup.
      </p>
      <div className="mt-2">
        <Link href="/" className="btn">
          Voltar à homepage
        </Link>
      </div>
    </section>
  );
}
