import Link from "next/link";
import { Fita } from "@/components/motor/Fita";
import { CondicoesMar } from "@/components/CondicoesMar";
import { PostCard } from "@/components/cartoes/PostCard";
import { EventCard } from "@/components/cartoes/EventCard";
import { ProductCard } from "@/components/cartoes/ProductCard";
import {
  CAR_STATS,
  CLUBE,
  FITA_HOME,
  MARCOS,
  STATS,
} from "@/lib/conteudo";
import {
  getProdutosDestaque,
  getProximoEvento,
  getToggles,
  getUltimoPost,
  ligado,
} from "@/lib/dados";

export const revalidate = 300; // 5 min

export default async function Homepage() {
  const [ultimoPost, proximoEvento, destaques, toggles] = await Promise.all([
    getUltimoPost(),
    getProximoEvento(),
    getProdutosDestaque(),
    getToggles(),
  ]);

  return (
    <>
      {/* ---------- HERO · Lineup (0) ---------- */}
      <section className="hero container">
        <div className="hero__marcos">
          <span className="marco">
            <span className="marco__num">{MARCOS[0].num}</span>
            <span className="marco__label">{MARCOS[0].label} · Cabedelo</span>
          </span>
        </div>
        <div>
          <h1 className="hero__titulo revelar">
            Surf de elite,
            <br />
            treinado pelo <span className="ac">Atlântico</span>
          </h1>
          <p className="hero__lema revelar revelar--atraso-1">
            Primeira escola de surf de Portugal e Centro de Alto Rendimento. À
            beira do oceano que nos formou, na Praia do Cabedelo, desde 1989.
          </p>
          <div className="hero__ctas revelar revelar--atraso-2">
            <Link href="/escola/inscricao" className="btn">
              Inscrever na escola
            </Link>
            <Link href="/alto-rendimento" className="btn btn--ghost">
              Centro de Alto Rendimento
            </Link>
          </div>
        </div>
        <span className="hero__scroll">Scroll · drop in</span>
      </section>

      {/* ---------- FITA / marquee ---------- */}
      <Fita itens={FITA_HOME} />

      {/* ---------- MANIFESTO ---------- */}
      <section className="seccao container">
        <p className="manifesto revelar">
          Onde o <span className="ac">Atlântico</span> nos treina desde 1989.
        </p>
        <div className="grelha-2 mt-3">
          <p className="revelar" style={{ fontSize: "1.15rem", color: "var(--cor-tinta-suave)" }}>
            Não escolhemos uma onda fácil. Escolhemos o Cabedelo: vento, fundo
            de areia, ondulação constante todo o ano. É aqui que formamos
            surfistas desde a primeira escola de Portugal até ao palco mundial.
          </p>
          <p className="revelar revelar--atraso-1" style={{ fontSize: "1.15rem", color: "var(--cor-tinta-suave)" }}>
            Rigor de elite à beira do oceano. Da iniciação ao alto rendimento,
            o mar é a sala de aula e o Atlântico o treinador mais exigente.
          </p>
        </div>
      </section>

      {/* ---------- ESCOLA · Take-off (1) ---------- */}
      <section className="seccao container">
        <div className="cabeca-seccao">
          <span className="marco revelar">
            <span className="marco__num">{MARCOS[1].num}</span>
            <span className="marco__label">{MARCOS[1].label} · Escola de Surf</span>
          </span>
          <h2 className="revelar">A primeira escola de surf de Portugal</h2>
          <p className="revelar revelar--atraso-1">
            Seis modalidades, todos os níveis e idades. Equipamento incluído e
            instrutores certificados pela FPS.
          </p>
        </div>
        <Link href="/escola" className="btn revelar">
          Ver modalidades e horários
        </Link>
      </section>

      {/* ---------- CAR · Drop (2) — secção de contraste (o tubo) ---------- */}
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
            <span className="marco revelar">
              <span className="marco__num">{MARCOS[2].num}</span>
              <span className="marco__label">{MARCOS[2].label} · Centro de Alto Rendimento</span>
            </span>
            <h2 className="revelar">Da areia ao circuito mundial</h2>
          </div>
          <div className="stats">
            {STATS.map((s, i) => (
              <div className={`revelar revelar--atraso-${i % 4}`} key={s.rotulo}>
                <div
                  className="stat__num"
                  data-counter
                  data-to={s.to}
                  data-suffix={s.suffix ?? ""}
                  data-prefix={s.prefix ?? ""}
                >
                  0
                </div>
                <div className="stat__rotulo">{s.rotulo}</div>
              </div>
            ))}
          </div>
          <div className="mt-3">
            <Link href="/alto-rendimento" className="btn btn--claro revelar">
              Conhecer o programa
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- CONDIÇÕES DO MAR · Tubo (3) ---------- */}
      <section className="seccao container">
        <div className="cabeca-seccao">
          <span className="marco revelar">
            <span className="marco__num">{MARCOS[3].num}</span>
            <span className="marco__label">{MARCOS[3].label} · Condições ao vivo</span>
          </span>
          <h2 className="revelar">Como está o Cabedelo agora</h2>
        </div>
        <div className="revelar">
          <CondicoesMar />
        </div>
      </section>

      {/* ---------- BLOG + AGENDA · Manobra (4) ---------- */}
      {(ligado(toggles, "show_last_post") ||
        ligado(toggles, "show_next_event")) && (
        <section className="seccao container">
          <div className="cabeca-seccao">
            <span className="marco revelar">
              <span className="marco__num">{MARCOS[4].num}</span>
              <span className="marco__label">{MARCOS[4].label} · Clube em movimento</span>
            </span>
            <h2 className="revelar">Últimas do clube</h2>
          </div>
          <div className="grelha-2">
            {ligado(toggles, "show_last_post") && ultimoPost && (
              <div className="revelar">
                <PostCard post={ultimoPost} />
              </div>
            )}
            {ligado(toggles, "show_next_event") && proximoEvento && (
              <div className="revelar revelar--atraso-1">
                <EventCard evento={proximoEvento} />
              </div>
            )}
          </div>
          <div className="flex-linha mt-2">
            <Link href="/blog" className="btn btn--ghost">
              Ver blog
            </Link>
            <Link href="/agenda" className="btn btn--ghost">
              Ver agenda
            </Link>
          </div>
        </section>
      )}

      {/* ---------- LOJA ---------- */}
      {ligado(toggles, "show_shop_featured") && destaques.length > 0 && (
        <section className="seccao container">
          <div className="cabeca-seccao">
            <h2 className="revelar">Loja do clube</h2>
            <p className="revelar revelar--atraso-1">
              Cada compra apoia a formação de novos surfistas no Cabedelo.
            </p>
          </div>
          <div className="grelha-3">
            {destaques.map((p, i) => (
              <div className={`revelar revelar--atraso-${i}`} key={p.id}>
                <ProductCard produto={p} />
              </div>
            ))}
          </div>
          <div className="mt-2">
            <Link href="/loja" className="btn btn--ghost revelar">
              Ver toda a loja
            </Link>
          </div>
        </section>
      )}

      {/* ---------- CTA · Praia (5) ---------- */}
      <section className="seccao container">
        <div className="banner-cta banner-cta--media revelar">
          <video
            className="banner-cta__video"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-hidden="true"
          >
            <source src="/videos/reel.mp4" type="video/mp4" />
          </video>
          <div className="banner-cta__veu" />
          <div className="banner-cta__conteudo">
            <span className="marco" style={{ justifyContent: "center" }}>
              <span className="marco__num" style={{ color: "var(--cor-espuma)" }}>
                {MARCOS[5].num}
              </span>
              <span className="marco__label" style={{ color: "rgba(255,255,255,0.8)" }}>
                {MARCOS[5].label}
              </span>
            </span>
            <h2>O mar está à espera</h2>
            <p>
              Inscreve-te na escola ou candidata-te ao Centro de Alto Rendimento.
              A tua sessão começa no Cabedelo.
            </p>
            <div className="flex-linha" style={{ justifyContent: "center" }}>
              <Link href="/escola/inscricao" className="btn btn--claro">
                Inscrever agora
              </Link>
              <a href={`tel:${CLUBE.telefoneRaw}`} className="btn btn--claro">
                {CLUBE.telefone}
              </a>
            </div>
          </div>
        </div>
      </section>

      <CarStatsFita />
    </>
  );
}

function CarStatsFita() {
  return (
    <Fita
      className="fita"
      itens={CAR_STATS.map((s) => `${s.to}${s.suffix} ${s.rotulo}`)}
    />
  );
}
