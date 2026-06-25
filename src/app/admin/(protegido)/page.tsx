import { createAdminClient } from "@/lib/supabase/admin";
import {
  EVENTS_DEMO,
  POSTS_DEMO,
  PRODUCTS_DEMO,
} from "@/lib/demo";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const sb = createAdminClient();

  let posts = POSTS_DEMO.length;
  let eventos = EVENTS_DEMO.length;
  let produtos = PRODUCTS_DEMO.length;
  let porLer = 0;

  if (sb) {
    const [p, e, pr, il] = await Promise.all([
      sb.from("posts").select("id", { count: "exact", head: true }),
      sb.from("events").select("id", { count: "exact", head: true }),
      sb.from("products").select("id", { count: "exact", head: true }),
      sb
        .from("inscricoes")
        .select("id", { count: "exact", head: true })
        .eq("read", false),
    ]);
    posts = p.count ?? 0;
    eventos = e.count ?? 0;
    produtos = pr.count ?? 0;
    porLer = il.count ?? 0;
  }

  const cartoes = [
    { num: posts, rotulo: "Artigos" },
    { num: eventos, rotulo: "Eventos" },
    { num: produtos, rotulo: "Produtos" },
    { num: porLer, rotulo: "Inscrições por ler" },
  ];

  return (
    <>
      <div className="admin__cabeca">
        <h1 className="display-md">Dashboard</h1>
      </div>
      <div className="painel-stats">
        {cartoes.map((c) => (
          <div className="painel-stat" key={c.rotulo}>
            <div className="painel-stat__num">{c.num}</div>
            <div className="painel-stat__rotulo">{c.rotulo}</div>
          </div>
        ))}
      </div>
    </>
  );
}
