-- ============================================================
-- Surf Clube de Viana · Schema Supabase (PostgreSQL)
-- Executar no SQL Editor do projecto Supabase.
-- ============================================================

-- ---------- Tabelas ----------

create table if not exists posts (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,
  title         text not null,
  intro         text not null,
  content       text not null,
  cover_url     text,
  image_format  text default '16:9',
  tag           text,
  published     boolean default false,
  published_at  timestamptz,
  created_at    timestamptz default now()
);

create table if not exists events (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  title       text not null,
  intro       text not null,
  content     text,
  cover_url   text,
  event_date  date not null,
  location    text,
  type        text,
  published   boolean default false,
  created_at  timestamptz default now()
);

create table if not exists products (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  name        text not null,
  description text,
  price       numeric(10,2) not null,
  cover_url   text,
  images      text[] default '{}',
  ref         text,
  stock       integer default 0,
  active      boolean default true,
  featured    boolean default false,
  created_at  timestamptz default now()
);

create table if not exists site_toggles (
  key         text primary key,
  value       boolean default true,
  label       text,
  updated_at  timestamptz default now()
);

create table if not exists inscricoes (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null,
  phone       text,
  modalidade  text,
  nivel       text,
  message     text,
  created_at  timestamptz default now(),
  read        boolean default false
);

create table if not exists orders (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null,
  itens       jsonb not null,
  total       numeric(10,2) not null,
  created_at  timestamptz default now()
);

-- ---------- Toggles iniciais ----------

insert into site_toggles (key, value, label) values
  ('show_last_post', true, 'Último artigo blog na homepage'),
  ('show_next_event', true, 'Próximo evento na homepage'),
  ('show_shop_featured', true, 'Secção loja na homepage'),
  ('show_inscription_form', true, 'Formulário inscrições escola'),
  ('show_newsletter_popup', false, 'Pop-up newsletter'),
  ('show_competition_results', true, 'Bloco resultados'),
  ('show_enrollment_banner', true, 'Banner inscrições abertas')
on conflict (key) do nothing;

-- ---------- Row Level Security ----------

alter table posts        enable row level security;
alter table events       enable row level security;
alter table products     enable row level security;
alter table site_toggles enable row level security;
alter table inscricoes   enable row level security;
alter table orders       enable row level security;

-- Leitura pública apenas de conteúdo publicado / ativo
create policy "posts_select_public"    on posts    for select using (published = true);
create policy "events_select_public"   on events   for select using (published = true);
create policy "products_select_public" on products for select using (active = true);
create policy "toggles_select_public"  on site_toggles for select using (true);

-- Escrita só para admins autenticados (app_metadata.role = 'admin')
create policy "posts_admin_all" on posts for all
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
create policy "events_admin_all" on events for all
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
create policy "products_admin_all" on products for all
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
create policy "toggles_admin_update" on site_toggles for update
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- Inscrições: insert público, leitura/gestão só admin
create policy "inscricoes_insert_public" on inscricoes for insert with check (true);
create policy "inscricoes_admin_select" on inscricoes for select
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
create policy "inscricoes_admin_update" on inscricoes for update
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- Orders: gestão só admin (insert feito via service role)
create policy "orders_admin_select" on orders for select
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- ---------- Realtime ----------
-- Activar Realtime para site_toggles no painel Supabase (Database → Replication)
-- ou:
alter publication supabase_realtime add table site_toggles;

-- ---------- Storage ----------
-- Criar bucket público "galeria" no painel Supabase (Storage → New bucket).
