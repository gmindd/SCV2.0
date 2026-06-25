"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/blog", label: "Blog" },
  { href: "/admin/agenda", label: "Agenda" },
  { href: "/admin/loja", label: "Loja" },
  { href: "/admin/inscricoes", label: "Inscrições" },
  { href: "/admin/galeria", label: "Galeria" },
  { href: "/admin/toggles", label: "Secções" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function sair() {
    const sb = createClient();
    if (sb) await sb.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="admin__lateral">
      <Link href="/" className="admin__sigla">
        SCV
      </Link>
      <nav className="admin__nav">
        {LINKS.map((l) => {
          const ativo =
            l.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(l.href);
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`admin__link ${ativo ? "is-ativo" : ""}`}
            >
              {l.label}
            </Link>
          );
        })}
      </nav>
      <button
        onClick={sair}
        className="admin__link"
        style={{ marginTop: "2rem", background: "none", border: "none", textAlign: "left", cursor: "pointer", width: "100%" }}
      >
        Sair
      </button>
      <Link
        href="/"
        className="admin__link"
        target="_blank"
        style={{ marginTop: "0.4rem" }}
      >
        Ver site ↗
      </Link>
    </aside>
  );
}
