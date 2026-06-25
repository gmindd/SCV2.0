import Link from "next/link";
import { notFound } from "next/navigation";
import { EventForm } from "@/components/admin/EventForm";
import { createAdminClient } from "@/lib/supabase/admin";
import { EVENTS_DEMO } from "@/lib/demo";
import type { Event } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function EditarEventoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const sb = createAdminClient();
  let evento: Event | null = null;
  if (sb) {
    const { data } = await sb.from("events").select("*").eq("id", id).single();
    evento = (data as Event) ?? null;
  } else {
    evento = EVENTS_DEMO.find((e) => e.id === id) ?? null;
  }
  if (!evento) notFound();

  return (
    <>
      <div className="admin__cabeca">
        <h1 className="display-md">Editar evento</h1>
        <Link href="/admin/agenda" className="voltar">
          ← Voltar
        </Link>
      </div>
      <EventForm evento={evento} />
    </>
  );
}
