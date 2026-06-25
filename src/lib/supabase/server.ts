import { createServerClient as createSSRClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "./config";

/** Cliente Supabase server-side (usa cookies de sessão). Pode devolver null sem credenciais. */
export async function createServerClient() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return null;
  const cookieStore = await cookies();
  return createSSRClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(
        list: { name: string; value: string; options?: Record<string, unknown> }[]
      ) {
        try {
          list.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // chamado de um Server Component — ignorável (middleware refresca a sessão)
        }
      },
    },
  });
}
