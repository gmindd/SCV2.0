import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { createServerClient } from "@/lib/supabase/server";
import { temSupabase } from "@/lib/supabase/config";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Protecção a nível de layout (reforça o middleware).
  if (temSupabase()) {
    const sb = await createServerClient();
    const {
      data: { user },
    } = (await sb?.auth.getUser()) ?? { data: { user: null } };
    if (!user) redirect("/admin/login");
  }

  return (
    <div className="admin">
      <AdminSidebar />
      <div className="admin__main">
        {!temSupabase() && (
          <div className="aviso aviso--erro mb-1">
            Modo demo · Supabase não configurado. Define as variáveis de
            ambiente para ativar autenticação e persistência.
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
