import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { EventCard } from "@/components/cartoes/EventCard";
import { getEventos } from "@/lib/dados";

export const metadata: Metadata = {
  title: "Agenda",
  description: "Competições, formações e eventos do Surf Clube de Viana.",
};

export const dynamic = "force-dynamic";

export default async function AgendaPage() {
  const eventos = await getEventos();
  const hoje = new Date().toISOString().split("T")[0];
  const futuros = eventos.filter((e) => e.event_date >= hoje);
  const passados = eventos.filter((e) => e.event_date < hoje);

  return (
    <>
      <PageHero num="04" marco="Manobra · Agenda" titulo={<>Agenda</>}>
        Competições, formações e eventos do clube. Entrada livre salvo indicação
        em contrário.
      </PageHero>

      <section className="seccao container">
        <span className="eyebrow revelar">Próximos eventos</span>
        {futuros.length === 0 ? (
          <p className="mono mt-2">Sem eventos agendados de momento.</p>
        ) : (
          <div className="grelha-2 mt-2">
            {futuros.map((e, i) => (
              <div className={`revelar revelar--atraso-${i % 2}`} key={e.id}>
                <EventCard evento={e} />
              </div>
            ))}
          </div>
        )}

        {passados.length > 0 && (
          <div className="mt-3">
            <span className="eyebrow revelar">Já aconteceu</span>
            <div className="grelha-2 mt-2" style={{ opacity: 0.7 }}>
              {passados.map((e, i) => (
                <div className={`revelar revelar--atraso-${i % 2}`} key={e.id}>
                  <EventCard evento={e} />
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </>
  );
}
