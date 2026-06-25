import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { FormInscricao } from "./FormInscricao";

export const metadata: Metadata = {
  title: "Inscrição na escola",
  description: "Inscreve-te na escola de surf do Surf Clube de Viana.",
};

export default function InscricaoPage() {
  return (
    <>
      <PageHero num="01" marco="Take-off · Inscrição" titulo={<>Inscrever na escola</>}>
        Preenche os teus dados e escolhe a modalidade. Entramos em contacto para
        confirmar horários e nível. Equipamento incluído.
      </PageHero>

      <section className="seccao container">
        <FormInscricao />
      </section>
    </>
  );
}
