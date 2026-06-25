import Link from "next/link";
import { EventForm } from "@/components/admin/EventForm";

export default function NovoEventoPage() {
  return (
    <>
      <div className="admin__cabeca">
        <h1 className="display-md">Novo evento</h1>
        <Link href="/admin/agenda" className="voltar">
          ← Voltar
        </Link>
      </div>
      <EventForm />
    </>
  );
}
