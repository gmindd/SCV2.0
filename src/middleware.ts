import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/* Refresca a sessão Supabase e protege /admin (excepto /admin/login).
   Sem credenciais, deixa passar (modo demo). */
export async function middleware(req: NextRequest) {
  const res = NextResponse.next({ request: req });

  if (!URL || !ANON) return res;

  const supabase = createServerClient(URL, ANON, {
    cookies: {
      getAll() {
        return req.cookies.getAll();
      },
      setAll(
        list: { name: string; value: string; options?: Record<string, unknown> }[]
      ) {
        list.forEach(({ name, value }) => req.cookies.set(name, value));
        list.forEach(({ name, value, options }) =>
          res.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = req.nextUrl;
  const protegido =
    pathname.startsWith("/admin") && pathname !== "/admin/login";

  if (protegido && !user) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }

  if (pathname === "/admin/login" && user) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin";
    return NextResponse.redirect(url);
  }

  return res;
}

export const config = {
  matcher: ["/admin/:path*"],
};
