/* Camada de acesso a dados.
   Tenta Supabase; sem credenciais (ou em erro) cai para conteúdo demo,
   de modo que o site renderiza sempre de forma coerente. */

import { createServerClient } from "./supabase/server";
import {
  EVENTS_DEMO,
  POSTS_DEMO,
  PRODUCTS_DEMO,
  TOGGLES_DEMO,
} from "./demo";
import type { Event, Post, Product, SiteToggle, ToggleKey } from "./types";

const hoje = () => new Date().toISOString().split("T")[0];

/* ---------- Blog ---------- */

export async function getPosts(): Promise<Post[]> {
  const sb = await createServerClient();
  if (!sb) return POSTS_DEMO;
  const { data, error } = await sb
    .from("posts")
    .select("*")
    .eq("published", true)
    .order("published_at", { ascending: false });
  if (error || !data) return POSTS_DEMO;
  return data as Post[];
}

export async function getPost(slug: string): Promise<Post | null> {
  const sb = await createServerClient();
  if (!sb) return POSTS_DEMO.find((p) => p.slug === slug) ?? null;
  const { data } = await sb
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();
  return (data as Post) ?? POSTS_DEMO.find((p) => p.slug === slug) ?? null;
}

export async function getUltimoPost(): Promise<Post | null> {
  const posts = await getPosts();
  return posts[0] ?? null;
}

/* ---------- Agenda ---------- */

export async function getEventos(): Promise<Event[]> {
  const sb = await createServerClient();
  if (!sb) return EVENTS_DEMO;
  const { data, error } = await sb
    .from("events")
    .select("*")
    .eq("published", true)
    .order("event_date", { ascending: true });
  if (error || !data) return EVENTS_DEMO;
  return data as Event[];
}

export async function getEvento(slug: string): Promise<Event | null> {
  const sb = await createServerClient();
  if (!sb) return EVENTS_DEMO.find((e) => e.slug === slug) ?? null;
  const { data } = await sb
    .from("events")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();
  return (data as Event) ?? EVENTS_DEMO.find((e) => e.slug === slug) ?? null;
}

export async function getProximoEvento(): Promise<Event | null> {
  const sb = await createServerClient();
  if (!sb)
    return (
      EVENTS_DEMO.filter((e) => e.event_date >= hoje()).sort((a, b) =>
        a.event_date.localeCompare(b.event_date)
      )[0] ?? EVENTS_DEMO[0]
    );
  const { data } = await sb
    .from("events")
    .select("*")
    .eq("published", true)
    .gte("event_date", hoje())
    .order("event_date", { ascending: true })
    .limit(1)
    .single();
  return (data as Event) ?? null;
}

/* ---------- Loja ---------- */

export async function getProdutos(): Promise<Product[]> {
  const sb = await createServerClient();
  if (!sb) return PRODUCTS_DEMO.filter((p) => p.active);
  const { data, error } = await sb
    .from("products")
    .select("*")
    .eq("active", true)
    .order("created_at", { ascending: false });
  if (error || !data) return PRODUCTS_DEMO.filter((p) => p.active);
  return data as Product[];
}

export async function getProduto(slug: string): Promise<Product | null> {
  const sb = await createServerClient();
  if (!sb) return PRODUCTS_DEMO.find((p) => p.slug === slug) ?? null;
  const { data } = await sb
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("active", true)
    .single();
  return (data as Product) ?? PRODUCTS_DEMO.find((p) => p.slug === slug) ?? null;
}

export async function getProdutosDestaque(): Promise<Product[]> {
  const sb = await createServerClient();
  if (!sb) return PRODUCTS_DEMO.filter((p) => p.featured).slice(0, 3);
  const { data } = await sb
    .from("products")
    .select("*")
    .eq("active", true)
    .eq("featured", true)
    .limit(3);
  return (data as Product[]) ?? PRODUCTS_DEMO.filter((p) => p.featured).slice(0, 3);
}

/* ---------- Toggles ---------- */

export async function getToggles(): Promise<Record<string, boolean>> {
  const sb = await createServerClient();
  const base = Object.fromEntries(TOGGLES_DEMO.map((t) => [t.key, t.value]));
  if (!sb) return base;
  const { data } = await sb.from("site_toggles").select("key, value");
  if (!data) return base;
  return Object.fromEntries(
    (data as Pick<SiteToggle, "key" | "value">[]).map((t) => [t.key, t.value])
  );
}

export function ligado(toggles: Record<string, boolean>, key: ToggleKey): boolean {
  return toggles[key] !== false;
}
