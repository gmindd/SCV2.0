import Link from "next/link";
import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Fita } from "@/components/motor/Fita";
import {
  ESCOLA_INFO,
  HORARIOS,
  MODALIDADES,
} from "@/lib/conteudo";

export const metadata: Metadata = {
  title: "Escola de Surf",
  description:
    "Da iniciação ao alto rendimento. Seis modalidades, todos os níveis e idades, na Praia do Cabedelo.",
};

export default function EscolaPage() {
  return (
    <>
      <PageHero num="01" marco="Take-off · Escola de Surf" titulo={<>Escola de Surf</>}>
        Da iniciação ao alto rendimento. Seis modalidades, todos os níveis e
        idades. Equipamento incluído e instrutores certificados pela FPS.
      </PageHero>

      <Fita itens={["Surf", "Bodyboard", "Longboard", "SUP", "Surf Adaptado", "Waveski"]} />

      {/* Modalidades */}
      <section className="seccao container">
        <span className="eyebrow revelar">Modalidades</span>
        <div className="mt-2">
          {MODALIDADES.map((m, i) => (
            <div className={`modalidade revelar revelar--atraso-${i % 3}`} key={m.nome}>
              <h2 className="modalidade__nome">{m.nome}</h2>
              <p className="modalidade__desc">{m.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Horários + info */}
      <section className="tubo">
        <div className="seccao container grelha-2">
          <div className="revelar">
            <span className="eyebrow eyebrow--claro">Horários</span>
            <div className="mt-2">
              {HORARIOS.map((h) => (
                <div className="entre" key={h.periodo} style={{ borderTop: "1px solid rgba(251,250,246,0.18)", padding: "1rem 0" }}>
                  <span style={{ fontSize: "1.6rem", fontFamily: "var(--fonte-display)", fontStyle: "italic" }}>
                    {h.periodo}
                  </span>
                  <span className="mono" style={{ color: "var(--cor-agua)" }}>{h.horas}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="revelar revelar--atraso-1">
            <span className="eyebrow eyebrow--claro">Incluído</span>
            <ul className="lista-traco mt-2">
              {ESCOLA_INFO.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="seccao container">
        <div className="banner-cta revelar">
          <h2>Pronto para a primeira onda?</h2>
          <p>Inscreve-te e escolhe a tua modalidade. O Cabedelo trata do resto.</p>
          <Link href="/escola/inscricao" className="btn btn--claro">
            Inscrever na escola
          </Link>
        </div>
      </section>
    </>
  );
}
