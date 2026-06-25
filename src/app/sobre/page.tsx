import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { CLUBE } from "@/lib/conteudo";

export const metadata: Metadata = {
  title: "Sobre",
  description:
    "Fundado em 1989, o Surf Clube de Viana é a primeira escola de surf de Portugal e um Centro de Alto Rendimento.",
};

export default function SobrePage() {
  return (
    <>
      <PageHero num="05" marco="Praia · Sobre o clube" titulo={<>O clube</>}>
        Fundado em 1989, primeira escola de surf de Portugal. Reconhecido pela
        FPS, IPDJ e Turismo de Portugal.
      </PageHero>

      <section className="seccao container grelha-2">
        <div className="prosa revelar">
          <p>
            O Surf Clube de Viana nasceu em 1989, na Praia do Cabedelo, e foi a
            primeira escola de surf de Portugal. Mais de três décadas depois,
            continua a treinar gerações de surfistas à beira do mesmo Atlântico.
          </p>
          <p>
            Hoje é também um Centro de Alto Rendimento reconhecido pelo IPDJ,
            com uma infraestrutura de 700 mil euros. Três vezes campeão nacional,
            o clube leva o nome de Viana do Castelo aos circuitos internacionais.
          </p>
          <p>
            Da iniciação à elite, do surf adaptado ao waveski, o clube mantém a
            mesma missão: formar pessoas através do mar.
          </p>
        </div>
        <div className="revelar revelar--atraso-1">
          <ul className="lista-traco">
            <li>Fundação · 1989</li>
            <li>{CLUBE.praia} · {CLUBE.cidade}</li>
            <li>Centro de Alto Rendimento (IPDJ)</li>
            <li>3× Campeão Nacional de Surf</li>
            <li>Certificações · {CLUBE.certificacoes.join(" · ")}</li>
            <li>{CLUBE.rnaat}</li>
          </ul>
        </div>
      </section>
    </>
  );
}
