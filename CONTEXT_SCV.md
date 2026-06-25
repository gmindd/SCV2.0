# SCV · Surf Clube de Viana — Contexto de Projecto

Ficheiro de contexto completo para iniciar um novo projecto com frontend/animações diferentes,
mantendo toda a lógica de conteúdo, backoffice e base de dados deste projecto.

---

## Identidade do clube

- **Nome:** Surf Clube de Viana (SCV)
- **Fundação:** 1989 — primeira escola de surf de Portugal
- **Localização:** Praia do Cabedelo, Viana do Castelo (GPS: 41.678702, -8.826283)
- **Morada:** Rua Diogo Álvares, Centro de Alto Rendimento de Surf, 4935-161 Viana do Castelo
- **Contactos:** +351 258 332 043 · info@surfingviana.com
- **Website actual:** surfingviana.com
- **Redes sociais:** facebook.com/surfclubeviana · instagram.com/surfclubedeviana
- **Certificações:** FPS · IPDJ · Turismo de Portugal · RNAAT Nº 52/2014
- **Estatuto:** Centro de Alto Rendimento (CAR) reconhecido pelo IPDJ
- **Infraestrutura CAR:** ~700 000 €
- **Títulos nacionais:** 3× Campeão Nacional de Surf

---

## Stack técnico

| Camada | Tecnologia |
|---|---|
| Framework | Next.js (App Router) |
| Base de dados | Supabase (PostgreSQL + Auth + Storage + Realtime) |
| Deploy | Vercel |
| Email transacional | Resend (`RESEND_API_KEY`, `from: noreply@surfingviana.com`) |
| Imagens | Supabase Storage (URLs públicas em `cover_url`, `images[]`) |

### Variáveis de ambiente necessárias

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=     # só server-side (admin, routes API)
RESEND_API_KEY=
RESEND_FROM_EMAIL=noreply@surfingviana.com
```

### Clientes Supabase

```ts
// server component / route handler (usa cookies de sessão)
import { createServerClient as createSSRClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createServerClient() {
  const cookieStore = await cookies()
  return createSSRClient(url, anonKey, {
    cookies: {
      getAll() { return cookieStore.getAll() },
      setAll(list) { list.forEach(({ name, value, options }) => cookieStore.set(name, value, options)) },
    },
  })
}

// admin / service role (sem cookies, sem RLS)
import { createClient } from '@supabase/supabase-js'
export const createAdminClient = () => createClient(url, serviceRoleKey)

// client component
import { createBrowserClient } from '@supabase/ssr'
export const createClient = () => createBrowserClient(url, anonKey)
```

---

## Schema da base de dados (Supabase / PostgreSQL)

### Tabela `posts` (blog)

```sql
id            uuid primary key default gen_random_uuid()
slug          text unique not null
title         text not null
intro         text not null          -- resumo para listagens e homepage
content       text not null          -- markdown ou HTML
cover_url     text                   -- URL Supabase Storage
image_format  text default '16:9'   -- '16:9' | '9:16' | '1:1'
tag           text                   -- ex: 'Internacional', 'Inclusão', 'CAR'
published     boolean default false
published_at  timestamptz
created_at    timestamptz default now()
```

### Tabela `events` (agenda)

```sql
id          uuid primary key default gen_random_uuid()
slug        text unique not null
title       text not null
intro       text not null
content     text
cover_url   text
event_date  date not null
location    text
type        text   -- 'Competição' | 'Formação' | 'Internacional' | 'Inclusão'
published   boolean default false
created_at  timestamptz default now()
```

### Tabela `products` (loja)

```sql
id          uuid primary key default gen_random_uuid()
slug        text unique not null
name        text not null
description text
price       numeric(10,2) not null
cover_url   text
images      text[]                   -- array de URLs Storage
ref         text                     -- ex: 'SCV-001'
stock       integer default 0
active      boolean default true
featured    boolean default false    -- destaque homepage (máx 3)
created_at  timestamptz default now()
```

### Tabela `site_toggles`

```sql
key         text primary key
value       boolean default true
label       text
updated_at  timestamptz default now()
```

**Toggles existentes:**
| key | label |
|---|---|
| `show_last_post` | Último artigo blog na homepage |
| `show_next_event` | Próximo evento na homepage |
| `show_shop_featured` | Secção loja na homepage |
| `show_inscription_form` | Formulário inscrições escola |
| `show_newsletter_popup` | Pop-up newsletter |
| `show_competition_results` | Bloco resultados |
| `show_enrollment_banner` | Banner inscrições abertas |

Os toggles usam **Supabase Realtime** — alterações no admin reflectem no site sem deploy.

### Tabela `inscricoes`

```sql
id          uuid primary key default gen_random_uuid()
name        text not null
email       text not null
phone       text
modalidade  text
nivel       text    -- 'Iniciante' | 'Intermédio' | 'Avançado'
message     text
created_at  timestamptz default now()
read        boolean default false
```

### RLS (Row Level Security)

```
posts, events, products:
  SELECT público para rows com published=true (ou active=true para products)
  INSERT / UPDATE / DELETE: apenas admins autenticados

site_toggles:
  SELECT público
  UPDATE: apenas admins autenticados

inscricoes:
  INSERT público (qualquer visitante pode submeter formulário)
  SELECT / UPDATE: apenas admins autenticados
```

---

## TypeScript types

```ts
export interface Post {
  id: string
  slug: string
  title: string
  intro: string
  content: string
  cover_url: string | null
  image_format: '16:9' | '9:16' | '1:1'
  tag: string | null
  published: boolean
  published_at: string | null
  created_at: string
}

export interface Event {
  id: string
  slug: string
  title: string
  intro: string
  content: string | null
  cover_url: string | null
  event_date: string
  location: string | null
  type: 'Competição' | 'Formação' | 'Internacional' | 'Inclusão' | null
  published: boolean
  created_at: string
}

export interface Product {
  id: string
  slug: string
  name: string
  description: string | null
  price: number
  cover_url: string | null
  images: string[]
  ref: string | null
  stock: number
  active: boolean
  featured: boolean
  created_at: string
}

export interface SiteToggle {
  key: string
  value: boolean
  label: string
  updated_at: string
}

export interface Inscricao {
  id: string
  name: string
  email: string
  phone: string | null
  modalidade: string | null
  nivel: 'Iniciante' | 'Intermédio' | 'Avançado' | null
  message: string | null
  created_at: string
  read: boolean
}
```

---

## Estrutura de rotas (App Router)

```
app/
├── page.tsx                    # Homepage
├── layout.tsx                  # Root layout (Nav + Footer + providers)
├── escola/
│   ├── page.tsx                # Modalidades, horários, info escola
│   └── inscricao/page.tsx      # Formulário de inscrição (POST /api/inscricao)
├── alto-rendimento/
│   └── page.tsx                # CAR, programa, infraestrutura, candidatura
├── blog/
│   ├── page.tsx                # Lista de artigos (Supabase, force-dynamic)
│   └── [slug]/page.tsx         # Artigo individual
├── agenda/
│   ├── page.tsx                # Calendário + lista eventos (force-dynamic)
│   └── [slug]/page.tsx         # Evento individual
├── loja/
│   ├── page.tsx                # Todos os produtos (force-dynamic)
│   ├── [slug]/page.tsx         # Produto individual
│   └── carrinho/page.tsx       # Carrinho + checkout
├── sobre/
│   └── page.tsx                # Sobre o clube (estática)
├── admin/                      # PROTEGIDO — Supabase Auth
│   ├── layout.tsx              # Sidebar fixa + verificação de sessão + redirect
│   ├── login/page.tsx          # Login email/password (Supabase Auth)
│   ├── page.tsx                # Dashboard (contadores: posts, eventos, produtos, inscrições não lidas)
│   ├── blog/
│   │   ├── page.tsx            # Lista posts — toggle published inline
│   │   ├── novo/page.tsx       # Criar post (title → auto-slug, image_format select)
│   │   └── [id]/page.tsx       # Editar post
│   ├── agenda/
│   │   ├── page.tsx            # Lista eventos
│   │   ├── novo/page.tsx       # Criar evento
│   │   └── [id]/page.tsx       # Editar evento
│   ├── loja/
│   │   ├── page.tsx            # Lista produtos — toggles active/featured (máx 3 featured)
│   │   └── novo/page.tsx       # Criar produto
│   ├── inscricoes/page.tsx     # Ver formulários — toggle read
│   ├── galeria/page.tsx        # Upload fotos/vídeos (Supabase Storage)
│   └── toggles/page.tsx        # On/off secções homepage (Realtime)
└── api/
    ├── inscricao/route.ts      # POST → Supabase inscricoes + email Resend
    └── checkout/route.ts       # POST ordem loja
```

---

## Lógica da homepage — dados dinâmicos

A homepage é um **server component** que faz fetch de 4 fontes em paralelo:

```ts
// revalidate a cada 5 minutos
const supabase = createServerClient()

// Último post publicado
const { data: lastPost } = await supabase
  .from('posts')
  .select('slug, title, intro, cover_url, tag, published_at')
  .eq('published', true)
  .order('published_at', { ascending: false })
  .limit(1)
  .single()

// Próximo evento (data >= hoje)
const { data: nextEvent } = await supabase
  .from('events')
  .select('slug, title, intro, cover_url, type, event_date, location')
  .eq('published', true)
  .gte('event_date', new Date().toISOString().split('T')[0])
  .order('event_date', { ascending: true })
  .limit(1)
  .single()

// 3 produtos em destaque (featured=true)
const { data: featuredProducts } = await supabase
  .from('products')
  .select('slug, name, price, cover_url, ref')
  .eq('active', true)
  .eq('featured', true)
  .limit(3)

// Toggles para controlo de visibilidade de secções
const { data: toggles } = await supabase
  .from('site_toggles')
  .select('key, value')
```

---

## Condições do mar (Open-Meteo)

Widget de condições ao vivo para a Praia do Cabedelo (sem API key, cache 30 min):

```ts
// Coordenadas: lat=41.6787, lon=-8.8263
// Marine API: https://marine-api.open-meteo.com/v1/marine
//   - hourly: wave_height, wave_period, wave_direction, swell_wave_height
// Wind API: https://api.open-meteo.com/v1/forecast
//   - hourly: wind_speed_10m, wind_direction_10m, wind_gusts_10m
//   - cache: next: { revalidate: 1800 }

// Rating (score 1-5):
// < 0.5m → "Flat" (1)
// 0.5-1m → "Fraco" (2)
// 1-1.5m → "Razoável" (3)
// 1.5-2m → "Bom" (4)
// >= 2m  → "Excelente" (5)
```

---

## Backoffice — regras de negócio

### Autenticação
- Supabase Auth, login email/password (sem OAuth)
- `admin/layout.tsx` verifica sessão com `createServerClient().auth.getSession()`
- Se não logado: `redirect('/admin/login')`
- Role check: `app_metadata.role === 'admin'`

### Regra dos 3 destaques (loja)
- Máximo 3 produtos com `featured = true`
- Ao tentar marcar um 4.º: mostrar aviso `"Limite de 3 destaques atingido. Desmarque outro produto."`
- Implementado no cliente com contagem local antes de fazer update no Supabase

### Slugify (blog e agenda)
```ts
function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}
```
O slug é gerado automaticamente ao escrever o título, mas editável manualmente.

### Toggles com Realtime
```ts
// admin/toggles/page.tsx — subscrive a mudanças na tabela site_toggles
const channel = supabase
  .channel('toggles')
  .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'site_toggles' }, payload => {
    // actualiza estado local instantaneamente
  })
  .subscribe()
```

### Galeria (Supabase Storage)
- Bucket: `galeria` (ou similar)
- Upload via `supabase.storage.from('galeria').upload(path, file)`
- URL pública: `supabase.storage.from('galeria').getPublicUrl(path).data.publicUrl`

---

## Formulário de inscrição

```
POST /api/inscricao
Body: { name, email, phone?, modalidade?, nivel?, message? }
→ INSERT into inscricoes
→ (opcional) email via Resend para info@surfingviana.com

Campos modalidade: 'Surf' | 'Bodyboard' | 'Longboard' | 'SUP' | 'Surf Adaptado' | 'Waveski'
Campos nivel: 'Iniciante' | 'Intermédio' | 'Avançado'
```

---

## Conteúdo estático das páginas

### Homepage — secções
1. **Hero** — título principal, CTA para inscrição e CAR
2. **Marquee** — frase repetida animada (ex: "Surf desde 1989 ·")
3. **Manifesto** — texto editorial sobre o clube e o Atlântico
4. **Escola de Surf** — intro com link para /escola
5. **CAR (Centro de Alto Rendimento)** — stats: 1989 · 3× · 700K€ · 6 modalidades
6. **Condições do mar** — widget Open-Meteo em tempo real
7. **Comunidade / Galeria** — grid de imagens do clube
8. **CTA Inscrição** — secção de chamada à acção
9. **Blog & Agenda** — último post + próximo evento (Supabase)
10. **Loja** — 3 produtos em destaque (Supabase)
11. **Contacto / Footer** — morada, contactos, redes sociais

### /escola — conteúdo
**Modalidades:**
- Surf — Da iniciação ao alto rendimento. Todos os níveis e idades.
- Bodyboard — Técnica de prancha e ondas. Prática individual ou em grupo.
- Longboard — Estilo clássico, manobras suaves. Ideal para adultos.
- SUP — Stand Up Paddle em águas planas e onda. Equilíbrio e força.
- Surf Adaptado — Programa certificado para pessoas com deficiência motora.
- Waveski — Caiaque de surf. Alta performance em ondas de qualquer tamanho.

**Horários:** Manhã 09:00-12:00 · Tarde 14:00-17:00

**Info:** Equipamento incluído (fatos + pranchas) · Instrutores certificados

### /alto-rendimento — conteúdo
**Stats:** 35+ anos · 700K€ · 3× campeão nacional · 1989

**Programa (3 fases):**
1. Desenvolvimento — identificação de talentos, formação FPS
2. Competição — circuitos nacionais/internacionais, análise de performance
3. Elite — WSL + circuitos europeus, programa individualizado

**Infraestrutura:**
- Praia do Cabedelo · ondas constantes durante todo o ano
- Ginásio e sala de treino em seco
- Sala de vídeo e análise tática
- Alojamento para atletas e treinadores
- Parque de materiais e oficina de pranchas
- Acesso prioritário às instalações do clube

**CTA:** Candidatura por email — info@surfingviana.com

### /sobre — conteúdo
Fundado em 1989, primeira escola de surf de Portugal. Reconhecido pela FPS, IPDJ e Turismo de Portugal. CAR com infraestrutura de 700 mil euros. 3× campeão nacional.

---

## Assets locais existentes

```
public/assets/
├── hero-parallax.jpg    # imagem vertical surfer acima/abaixo de água (hero principal)
├── hero-parallax.png    # variante PNG
├── hero.png
├── home-escola.jpg      # imagem para secção escola
├── galeria-01.jpg       # fotografia do clube/surf
├── galeria-02.jpg
├── galeria-04.jpg       # (galeria-03 não existe)
├── logo.png             # logótipo colorido
├── logo_branco.png      # logótipo branco
├── shark-crop.png       # ícone/mascote
└── favicon/             # favicons em vários tamanhos
```

---

## Copy e tom de voz

- **Língua:** Português (Portugal)
- **Tom:** Directo, atlético, sem floreados — "à beira do oceano que nos formou"
- **Proibido:** travessões (`—`). Usar ponto médio (`·`), dois pontos, ou parágrafo novo
- **Datas:** "14 Jul 2026" — sem artigos desnecessários
- **Números em destaque:** formato grande, peso visual (stat blocks)

### Frases da identidade do clube
- "Onde o Atlântico nos treina desde 1989"
- "Primeira escola de surf de Portugal"
- "Surf de elite, treinado pelo Atlântico"
- "Rigor de elite à beira do oceano que nos formou"
- "Cada compra apoia a formação de novos surfistas no Cabedelo"

---

## SEO / Metadata

```ts
export const metadata: Metadata = {
  metadataBase: new URL('https://surfingviana.com'),
  title: 'Surf Clube de Viana · Onde o Atlântico nos treina desde 1989',
  description: 'Primeira escola de surf de Portugal e Centro de Alto Rendimento. Praia do Cabedelo, Viana do Castelo. Fundado em 1989.',
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'Surf Clube de Viana',
    description: 'Centro de Alto Rendimento de Surf. Praia do Cabedelo, Viana do Castelo.',
    images: ['/assets/og-image.jpg'],
  },
}
```

**JSON-LD (schema.org):**
```json
{
  "@context": "https://schema.org",
  "@type": "SportsActivityLocation",
  "name": "Surf Clube de Viana",
  "url": "https://surfingviana.com",
  "telephone": "+351258332043",
  "email": "info@surfingviana.com",
  "foundingDate": "1989",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Rua Diogo Álvares, Centro de Alto Rendimento de Surf",
    "postalCode": "4935-161",
    "addressLocality": "Viana do Castelo",
    "addressCountry": "PT"
  },
  "geo": { "@type": "GeoCoordinates", "latitude": 41.678702, "longitude": -8.826283 },
  "sameAs": [
    "https://facebook.com/surfclubeviana",
    "https://instagram.com/surfclubedeviana"
  ]
}
```

---

## Notas para o novo projecto

### O que reutilizar directamente
- **Schema Supabase** — tabelas, RLS, tipos TypeScript: copiar sem alterações
- **Lógica de backoffice** — CRUD de posts/events/products, toggles Realtime, lógica dos 3 destaques
- **API routes** — `/api/inscricao` e `/api/checkout`
- **Clientes Supabase** — `server.ts`, `client.ts`, `admin.ts`
- **Conteúdo estático** — copy, frases, dados das secções Escola e CAR

### O que substituir no novo projecto
- **Design system** — tokens CSS, tipografia, cores (substituir pelo do novo projecto)
- **MotionProvider** — substituir pela lógica de animação do novo projecto
- **Componentes de layout** — Nav, Footer, PageHero, ProductCard, PostCard, EventCard
- **Homepage** — estrutura de secções (manter a sequência narrativa, mudar o visual)
- **WaterCanvas** — efeito de água opcional, pode ser removido ou substituído

### Padrão de reveal de conteúdo (para referência)
O sistema actual usa `data-reveal` + IntersectionObserver:
- `html.motion-ready [data-reveal]` → esconde com `opacity:0; transform:translateY(28px)`
- JS adiciona `.is-revealed` ao entrar no viewport → `opacity:1; transform:none`
- `MotionProvider` (client component no root layout) usa `usePathname()` como dependência do `useEffect` para reinicializar em cada navegação client-side
- `data-counter` com `data-to="700" data-suffix="K€"` → GSAP tween de 0 ao valor final

### Importante: navegação client-side
Qualquer sistema de reveal/animação baseado em observers/timelines deve reinicializar em cada mudança de rota. Em Next.js App Router, usar `usePathname()` do `next/navigation` como dependência do `useEffect`.
