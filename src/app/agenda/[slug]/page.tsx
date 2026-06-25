import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getEvento } from "@/lib/dados";
import { dataCurta } from "@/lib/format";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const evento = await getEvento(slug);
  if (!evento) return { title: "Evento não encontrado" };
  return { title: evento.title, description: evento.intro };
}

export default async function EventoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const evento = await getEvento(slug);
  if (!evento) notFound();

  return (
    <article className="interior container">
      <Link href="/agenda" className="voltar">
        ← Voltar à agenda
      </Link>

      <header style={{ margin: "1.5rem 0 2rem", maxWidth: "60ch" }}>
        <div className="flex-linha mb-1">
          {evento.type && (
            <span className="etiqueta" style={{ position: "static" }}>
              {evento.type}
            </span>
          )}
          <span className="mono" style={{ fontSize: "0.9rem", color: "var(--cor-coral)" }}>
            {dataCurta(evento.event_date)}
          </span>
        </div>
        <h1 className="display-md revelar">{evento.title}</h1>
        {evento.location && (
          <p className="mono mt-1" style={{ color: "var(--cor-tinta-suave)" }}>
            {evento.location}
          </p>
        )}
        <p style={{ fontSize: "1.2rem", color: "var(--cor-tinta-suave)", marginTop: "1rem" }}>
          {evento.intro}
        </p>
      </header>

      {evento.cover_url && (
        <div className="interior__capa" style={{ backgroundImage: `url(${evento.cover_url})` }} />
      )}

      {evento.content && (
        <div className="prosa">
          {evento.content.split("\n").filter(Boolean).map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      )}
    </article>
  );
}
