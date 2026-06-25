import Link from "next/link";
import { CartaoTilt } from "@/components/motor/CartaoTilt";
import { dataCurta } from "@/lib/format";
import type { Event } from "@/lib/types";

export function EventCard({ evento }: { evento: Event }) {
  const d = new Date(evento.event_date);
  const dia = Number.isNaN(d.getTime()) ? "--" : d.getDate();
  return (
    <CartaoTilt className="cartao-evento">
      <Link href={`/agenda/${evento.slug}`} className="cartao-evento__link">
        <div className="cartao-evento__data">
          <span className="cartao-evento__dia">{dia}</span>
          <span className="cartao-evento__mes mono">
            {dataCurta(evento.event_date).split(" ").slice(1).join(" ")}
          </span>
        </div>
        <div className="cartao-evento__corpo">
          {evento.type && <span className="etiqueta">{evento.type}</span>}
          <h3 className="cartao-evento__titulo">{evento.title}</h3>
          <p className="cartao-evento__intro">{evento.intro}</p>
          {evento.location && (
            <span className="mono cartao-evento__local">
              {evento.location}
            </span>
          )}
        </div>
      </Link>
    </CartaoTilt>
  );
}
