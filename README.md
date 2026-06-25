# Surf Clube de Viana · SCV 2.0

Site do **Surf Clube de Viana** — primeira escola de surf de Portugal e Centro de
Alto Rendimento, na Praia do Cabedelo. Onde o Atlântico nos treina desde 1989.

Construído juntando dois contextos: o **conteúdo do clube** (`CONTEXT_SCV.md`) e o
**motor de animação de scroll** (`motor-de-scroll-contexto.md`), com a mecânica
adaptada ao tema surf.

## Stack

- **Next.js 15** (App Router) · **React 19** · **TypeScript**
- **Tailwind CSS v4** + design system próprio (paleta areia/oceano/espuma · acento coral)
- **Supabase** (PostgreSQL + Auth + Storage + Realtime)
- **Resend** (email transacional)
- **Open-Meteo** (condições do mar ao vivo, sem API key)

## O motor de animação (tema surf)

O scroll é uma **sessão de surf**: do lineup (0) à praia (1). Um único número
(progresso 0→1) e a sua velocidade, suavizados por *lerp*, alimentam num só
`requestAnimationFrame` várias funções que escrevem direto no DOM via refs.

- `src/components/motor/MotorDeScroll.tsx` — provider + `useMotorDeScroll` (rAF) + `useRevelar`
- `FundoOceano` — a onda que se desenha (assinatura) + o surfista que viaja no traçado, parallax de oceano, sol que gira, spray acima de um limiar de velocidade
- `Telemetria` — metros surfados + velocímetro (régua lateral / barra inferior)
- `Fita` — marquee que inclina (skew) com a velocidade
- `CartaoTilt` — tilt 3D no hover

Só anima `transform`/`opacity`, zero re-renders React, e desliga em
`prefers-reduced-motion`. Reinicializa em cada navegação client-side via `usePathname`.

## Arranque

```bash
npm install
cp .env.example .env.local   # preencher credenciais (opcional em dev)
npm run dev
```

Sem credenciais Supabase, o site corre em **modo demo** com conteúdo de exemplo
(`src/lib/demo.ts`) e o admin fica acessível sem autenticação para inspeção.

## Supabase

1. Criar projecto em supabase.com
2. Correr `supabase/schema.sql` no SQL Editor (tabelas, RLS, toggles, Realtime)
3. Criar bucket público **`galeria`** (Storage)
4. Criar um utilizador admin e definir `app_metadata.role = 'admin'`
5. Preencher `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
RESEND_FROM_EMAIL=noreply@surfingviana.com
CONTACT_EMAIL=info@surfingviana.com
```

## Estrutura

```
src/
├── app/
│   ├── (público)            page, escola, alto-rendimento, blog, agenda, loja, sobre
│   ├── admin/login          login (Supabase Auth)
│   ├── admin/(protegido)    dashboard + CRUD (blog, agenda, loja, inscrições, galeria, toggles)
│   └── api/                 inscricao, checkout
├── components/
│   ├── motor/               motor de scroll + efeitos surf
│   ├── cartoes/             PostCard, EventCard, ProductCard
│   ├── layout/              Nav, Footer
│   ├── loja/                carrinho (context + localStorage)
│   └── admin/               listas e formulários do backoffice
└── lib/                     supabase, dados (+ fallback demo), conteúdo, mar, tipos
```

## Deploy

Vercel. Definir as variáveis de ambiente no painel do projecto.
