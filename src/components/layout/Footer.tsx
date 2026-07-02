import Link from "next/link";
import { CLUBE, NAV } from "@/lib/conteudo";
import { Logo } from "@/components/Logo";

export function Footer() {
  return (
    <footer className="rodape" id="contacto">
      <div className="container">
        <div className="rodape__marca" aria-hidden="true">
          Surf Clube de Viana
        </div>
      </div>
      <div className="container rodape__grelha">
        <div>
          <Logo mono tamanho={52} comSubtitulo={false} />
          <p className="rodape__lema mono">
            Onde o Atlântico nos treina desde 1989
          </p>
          <p className="rodape__certs mono">
            {CLUBE.certificacoes.join(" · ")}
          </p>
        </div>

        <div>
          <h3 className="rodape__titulo">Navegar</h3>
          <ul className="rodape__lista">
            {NAV.map((l) => (
              <li key={l.href}>
                <Link href={l.href}>{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="rodape__titulo">Contacto</h3>
          <ul className="rodape__lista">
            <li>{CLUBE.morada}</li>
            <li>
              <a href={`tel:${CLUBE.telefoneRaw}`}>{CLUBE.telefone}</a>
            </li>
            <li>
              <a href={`mailto:${CLUBE.email}`}>{CLUBE.email}</a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="rodape__titulo">Redes</h3>
          <ul className="rodape__lista">
            <li>
              <a href={CLUBE.redes.instagram} target="_blank" rel="noreferrer">
                Instagram
              </a>
            </li>
            <li>
              <a href={CLUBE.redes.facebook} target="_blank" rel="noreferrer">
                Facebook
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="container rodape__base mono">
        <span>
          © {new Date().getFullYear()} {CLUBE.nome}
        </span>
        <span>
          {CLUBE.praia} · {CLUBE.cidade}
        </span>
      </div>
    </footer>
  );
}
