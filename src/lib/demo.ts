/* Conteúdo demo — usado quando não há ligação Supabase, para o site
   renderizar de forma coerente em desenvolvimento / preview. */

import type { Event, Post, Product, SiteToggle } from "./types";

export const POSTS_DEMO: Post[] = [
  {
    id: "demo-1",
    slug: "scv-no-circuito-mundial",
    title: "SCV leva dois atletas ao circuito mundial",
    intro:
      "Formados no Cabedelo, dois surfistas do clube qualificaram-se para a etapa europeia da WSL.",
    content:
      "Depois de uma época de rigor no Centro de Alto Rendimento, dois atletas do Surf Clube de Viana garantiram presença na etapa europeia. O trabalho começou no lineup do Cabedelo, ao amanhecer, e leva agora a bandeira do clube ao circuito mundial.",
    cover_url: null,
    image_format: "16:9",
    tag: "Internacional",
    published: true,
    published_at: "2026-05-12T08:00:00Z",
    created_at: "2026-05-12T08:00:00Z",
  },
  {
    id: "demo-2",
    slug: "surf-adaptado-cresce-no-cabedelo",
    title: "Surf adaptado cresce no Cabedelo",
    intro:
      "O programa certificado de surf adaptado recebe novos alunos esta primavera.",
    content:
      "O mar é de todos. O programa de surf adaptado do clube, certificado pela FPS, abre novas vagas. Equipamento próprio, instrutores especializados e a mesma onda que treina os nossos campeões.",
    cover_url: null,
    image_format: "16:9",
    tag: "Inclusão",
    published: true,
    published_at: "2026-04-02T08:00:00Z",
    created_at: "2026-04-02T08:00:00Z",
  },
  {
    id: "demo-3",
    slug: "novo-ginasio-no-car",
    title: "Novo ginásio reforça o Centro de Alto Rendimento",
    intro:
      "A infraestrutura do CAR ganha uma sala de treino em seco e análise de vídeo.",
    content:
      "O investimento de 700 mil euros no Centro de Alto Rendimento dá mais um passo. O novo ginásio e a sala de análise tática completam um percurso de formação que vai da areia ao palco mundial.",
    cover_url: null,
    image_format: "16:9",
    tag: "CAR",
    published: true,
    published_at: "2026-03-18T08:00:00Z",
    created_at: "2026-03-18T08:00:00Z",
  },
];

export const EVENTS_DEMO: Event[] = [
  {
    id: "demo-e1",
    slug: "open-de-surf-cabedelo-2026",
    title: "Open de Surf do Cabedelo 2026",
    intro: "Etapa do circuito nacional na nossa praia. Entrada livre.",
    content:
      "O Cabedelo recebe mais uma etapa do circuito nacional. Dois dias de competição, com as melhores ondas da costa norte e os atletas do SCV em casa.",
    cover_url: null,
    event_date: "2026-07-14",
    location: "Praia do Cabedelo, Viana do Castelo",
    type: "Competição",
    published: true,
    created_at: "2026-01-10T08:00:00Z",
  },
  {
    id: "demo-e2",
    slug: "estagio-de-formacao-fps",
    title: "Estágio de formação FPS",
    intro: "Fim de semana de formação para jovens promessas do clube.",
    content:
      "Estágio técnico orientado pela equipa do CAR. Análise de vídeo, treino físico e muitas ondas.",
    cover_url: null,
    event_date: "2026-09-20",
    location: "Centro de Alto Rendimento de Surf",
    type: "Formação",
    published: true,
    created_at: "2026-01-10T08:00:00Z",
  },
];

export const PRODUCTS_DEMO: Product[] = [
  {
    id: "demo-p1",
    slug: "t-shirt-scv-1989",
    name: "T-shirt SCV 1989",
    description:
      "Algodão orgânico, serigrafia do logo histórico. Cada compra apoia a formação de novos surfistas no Cabedelo.",
    price: 22,
    cover_url: null,
    images: [],
    ref: "SCV-001",
    stock: 40,
    active: true,
    featured: true,
    created_at: "2026-02-01T08:00:00Z",
  },
  {
    id: "demo-p2",
    slug: "hoodie-cabedelo",
    name: "Hoodie Cabedelo",
    description: "Camisola com capuz, interior em felpa. Quente para os dias de nordeste.",
    price: 45,
    cover_url: null,
    images: [],
    ref: "SCV-002",
    stock: 25,
    active: true,
    featured: true,
    created_at: "2026-02-01T08:00:00Z",
  },
  {
    id: "demo-p3",
    slug: "boné-atlantico",
    name: "Boné Atlântico",
    description: "Boné de pala curva, bordado SCV. Proteção para o lineup.",
    price: 18,
    cover_url: null,
    images: [],
    ref: "SCV-003",
    stock: 60,
    active: true,
    featured: true,
    created_at: "2026-02-01T08:00:00Z",
  },
  {
    id: "demo-p4",
    slug: "decal-pack-scv",
    name: "Pack de autocolantes SCV",
    description: "Cinco autocolantes resistentes à água para a prancha e o carro.",
    price: 6,
    cover_url: null,
    images: [],
    ref: "SCV-004",
    stock: 100,
    active: true,
    featured: false,
    created_at: "2026-02-01T08:00:00Z",
  },
];

export const TOGGLES_DEMO: SiteToggle[] = [
  { key: "show_last_post", value: true, label: "Último artigo blog na homepage", updated_at: "" },
  { key: "show_next_event", value: true, label: "Próximo evento na homepage", updated_at: "" },
  { key: "show_shop_featured", value: true, label: "Secção loja na homepage", updated_at: "" },
  { key: "show_inscription_form", value: true, label: "Formulário inscrições escola", updated_at: "" },
  { key: "show_newsletter_popup", value: false, label: "Pop-up newsletter", updated_at: "" },
  { key: "show_competition_results", value: true, label: "Bloco resultados", updated_at: "" },
  { key: "show_enrollment_banner", value: true, label: "Banner inscrições abertas", updated_at: "" },
];
