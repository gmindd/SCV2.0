import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Fita } from "@/components/motor/Fita";
import { CAR_INFRA, CAR_PROGRAMA, CAR_STATS, CLUBE } from "@/lib/conteudo";

export const metadata: Metadata = {
  title: "Centro de Alto Rendimento",
  description:
    "Centro de Alto Rendimento de Surf reconhecido pelo IPDJ. Infraestrutura de 700 mil euros na Praia do Cabedelo.",
};

export default function AltoRendimentoPage() {
  return (
    <>
      <PageHero
        num="02"
        marco="Drop · Centro de Alto Rendimento"
        titulo={<>Da areia ao circuito mundial</>}
      >
        Centro de Alto Rendimento reconhecido pelo IPDJ. Infraestrutura de 700
        mil euros e ondas constantes todo o ano. Aqui formam-se campeões.
      </PageHero>

      <section className="container" style={{ marginTop: "1.5rem" }}>
        <div
          className="foto-larga revelar"
          style={{ backgroundImage: "url(/imagens/alto-rendimento/surf-elite.jpg)" }}
          role="img"
          aria-label="Surf de alto rendimento no Cabedelo"
        />
      </section>

      {/* Stats */}
      <section className="seccao container">
        <div className="stats">
          {CAR_STATS.map((s, i) => (
            <div className={`revelar revelar--atraso-${i % 4}`} key={s.rotulo}>
              <div
                className="stat__num"
                data-counter
                data-to={s.to}
                data-suffix={s.suffix}
              >
                0
              </div>
              <div className="stat__rotulo">{s.rotulo}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Programa em 3 fases — secção de contraste */}
      <section className="tubo tubo--media">
        <video
          className="tubo__video"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
        >
          <source src="/videos/altrorendimento.mp4" type="video/mp4" />
        </video>
        <div className="tubo__veu" />
        <div className="seccao container tubo__conteudo">
          <div className="cabeca-seccao">
            <span className="eyebrow eyebrow--claro revelar">O programa</span>
            <h2 className="revelar">Três fases, um percurso de elite</h2>
          </div>
          {CAR_PROGRAMA.map((f, i) => (
            <div className={`fase revelar revelar--atraso-${i}`} key={f.fase}>
              <span className="fase__num">{f.fase}</span>
              <div>
                <h3 className="fase__nome">{f.nome}</h3>
                <p className="fase__desc">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Fita itens={["Infraestrutura 700K€", "Ondas todo o ano", "IPDJ", "3× Campeão Nacional"]} />

      {/* Infraestrutura */}
      <section className="seccao container grelha-2">
        <div className="revelar">
          <span className="eyebrow">Infraestrutura</span>
          <h2 className="display-md mt-1">Tudo num só lugar, à beira-mar</h2>
          <div
            className="foto-duo__item mt-2"
            style={{ backgroundImage: "url(/imagens/alto-rendimento/analise.jpg)" }}
            role="img"
            aria-label="Sala de vídeo e análise tática"
          >
            <span className="foto-duo__legenda">Análise de vídeo</span>
          </div>
        </div>
        <ul className="lista-traco revelar revelar--atraso-1">
          {CAR_INFRA.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>
      </section>

      {/* Candidatura */}
      <section className="seccao container">
        <div className="banner-cta revelar">
          <h2>Candidata-te ao CAR</h2>
          <p>
            Selecionamos atletas com potencial para o alto rendimento.
            Candidatura por email.
          </p>
          <a href={`mailto:${CLUBE.email}`} className="btn btn--claro">
            {CLUBE.email}
          </a>
        </div>
      </section>
    </>
  );
}
