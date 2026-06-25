import { getCondicoesMar } from "@/lib/mar";

/* Widget de condições do mar — leitura de boia / relógio de marés.
   Server component (revalidate via fetch cache 30 min). */
export async function CondicoesMar() {
  const c = await getCondicoesMar();
  const leituras = [
    { v: `${c.ondulacao.toFixed(1)}m`, r: "Ondulação" },
    { v: `${Math.round(c.periodo)}s`, r: "Período" },
    { v: `${Math.round(c.vento)}km/h`, r: "Vento" },
    { v: `${Math.round(c.rajada)}km/h`, r: "Rajada" },
  ];

  return (
    <div className="mar">
      <div className="mar__cabeca">
        <div>
          <span className="eyebrow eyebrow--claro">
            Cabedelo · {c.fonte === "ao-vivo" ? "ao vivo" : "leitura demo"}
          </span>
          <h3 className="mar__rating">{c.rating.label}</h3>
        </div>
        <div className="mar__estrelas" aria-label={`Rating ${c.rating.score} de 5`}>
          {Array.from({ length: 5 }).map((_, i) => (
            <span
              key={i}
              className={`mar__estrela ${i < c.rating.score ? "is-on" : ""}`}
            >
              ●
            </span>
          ))}
        </div>
      </div>
      <div className="mar__grelha">
        {leituras.map((l) => (
          <div className="mar__leitura" key={l.r}>
            <span className="mar__valor">{l.v}</span>
            <span className="mar__rotulo mono">{l.r}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
