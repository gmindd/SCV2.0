/* Tipos do domínio — espelham o schema Supabase (CONTEXT_SCV.md) */

export interface Post {
  id: string;
  slug: string;
  title: string;
  intro: string;
  content: string;
  cover_url: string | null;
  image_format: "16:9" | "9:16" | "1:1";
  tag: string | null;
  published: boolean;
  published_at: string | null;
  created_at: string;
}

export interface Event {
  id: string;
  slug: string;
  title: string;
  intro: string;
  content: string | null;
  cover_url: string | null;
  event_date: string;
  location: string | null;
  type: "Competição" | "Formação" | "Internacional" | "Inclusão" | null;
  published: boolean;
  created_at: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  price: number;
  cover_url: string | null;
  images: string[];
  ref: string | null;
  stock: number;
  active: boolean;
  featured: boolean;
  created_at: string;
}

export interface SiteToggle {
  key: string;
  value: boolean;
  label: string;
  updated_at: string;
}

export interface Inscricao {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  modalidade: string | null;
  nivel: "Iniciante" | "Intermédio" | "Avançado" | null;
  message: string | null;
  created_at: string;
  read: boolean;
}

export type ToggleKey =
  | "show_last_post"
  | "show_next_event"
  | "show_shop_featured"
  | "show_inscription_form"
  | "show_newsletter_popup"
  | "show_competition_results"
  | "show_enrollment_banner";
