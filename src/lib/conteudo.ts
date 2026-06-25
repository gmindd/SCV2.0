/* Conteúdo estático e identidade do clube (CONTEXT_SCV.md).
   Tom: directo, atlético, sem floreados. Proibido travessões — usar ponto médio (·). */

export const CLUBE = {
  nome: "Surf Clube de Viana",
  sigla: "SCV",
  fundacao: 1989,
  praia: "Praia do Cabedelo",
  cidade: "Viana do Castelo",
  morada:
    "Rua Diogo Álvares, Centro de Alto Rendimento de Surf, 4935-161 Viana do Castelo",
  telefone: "+351 258 332 043",
  telefoneRaw: "+351258332043",
  email: "info@surfingviana.com",
  site: "surfingviana.com",
  gps: { lat: 41.678702, lon: -8.826283 },
  rnaat: "RNAAT Nº 52/2014",
  certificacoes: ["FPS", "IPDJ", "Turismo de Portugal", "RNAAT Nº 52/2014"],
  redes: {
    facebook: "https://facebook.com/surfclubeviana",
    instagram: "https://instagram.com/surfclubedeviana",
  },
} as const;

export const FRASES = [
  "Onde o Atlântico nos treina desde 1989",
  "Primeira escola de surf de Portugal",
  "Surf de elite, treinado pelo Atlântico",
  "Rigor de elite à beira do oceano que nos formou",
] as const;

export const FITA_HOME = [
  "Surf desde 1989",
  "Centro de Alto Rendimento",
  "Praia do Cabedelo",
  "3× Campeão Nacional",
  "Primeira escola de Portugal",
];

export const NAV = [
  { href: "/escola", label: "Escola" },
  { href: "/alto-rendimento", label: "Alto Rendimento" },
  { href: "/blog", label: "Blog" },
  { href: "/agenda", label: "Agenda" },
  { href: "/loja", label: "Loja" },
  { href: "/sobre", label: "Sobre" },
];

/* Stats do clube (homepage / CAR) — usados em contadores data-counter */
export const STATS = [
  { to: 1989, suffix: "", rotulo: "Fundado" },
  { to: 3, suffix: "×", rotulo: "Campeão Nacional" },
  { to: 700, prefix: "", suffix: "K€", rotulo: "Infraestrutura CAR" },
  { to: 6, suffix: "", rotulo: "Modalidades" },
];

export const MODALIDADES = [
  {
    nome: "Surf",
    desc: "Da iniciação ao alto rendimento. Todos os níveis e idades.",
  },
  {
    nome: "Bodyboard",
    desc: "Técnica de prancha e ondas. Prática individual ou em grupo.",
  },
  {
    nome: "Longboard",
    desc: "Estilo clássico, manobras suaves. Ideal para adultos.",
  },
  {
    nome: "SUP",
    desc: "Stand Up Paddle em águas planas e onda. Equilíbrio e força.",
  },
  {
    nome: "Surf Adaptado",
    desc: "Programa certificado para pessoas com deficiência motora.",
  },
  {
    nome: "Waveski",
    desc: "Caiaque de surf. Alta performance em ondas de qualquer tamanho.",
  },
];

export const MODALIDADES_FORM = [
  "Surf",
  "Bodyboard",
  "Longboard",
  "SUP",
  "Surf Adaptado",
  "Waveski",
] as const;

export const NIVEIS = ["Iniciante", "Intermédio", "Avançado"] as const;

export const HORARIOS = [
  { periodo: "Manhã", horas: "09:00 · 12:00" },
  { periodo: "Tarde", horas: "14:00 · 17:00" },
];

export const ESCOLA_INFO = [
  "Equipamento incluído · fatos e pranchas",
  "Instrutores certificados pela FPS",
  "Aulas individuais ou em grupo",
];

/* Centro de Alto Rendimento */
export const CAR_STATS = [
  { to: 35, suffix: "+", rotulo: "Anos de formação" },
  { to: 700, suffix: "K€", rotulo: "Infraestrutura" },
  { to: 3, suffix: "×", rotulo: "Campeão Nacional" },
  { to: 1989, suffix: "", rotulo: "Desde" },
];

export const CAR_PROGRAMA = [
  {
    fase: "01",
    nome: "Desenvolvimento",
    desc: "Identificação de talentos e formação FPS. A base técnica e física.",
  },
  {
    fase: "02",
    nome: "Competição",
    desc: "Circuitos nacionais e internacionais com análise de performance.",
  },
  {
    fase: "03",
    nome: "Elite",
    desc: "WSL e circuitos europeus. Programa individualizado de alto rendimento.",
  },
];

export const CAR_INFRA = [
  "Praia do Cabedelo · ondas constantes todo o ano",
  "Ginásio e sala de treino em seco",
  "Sala de vídeo e análise tática",
  "Alojamento para atletas e treinadores",
  "Parque de materiais e oficina de pranchas",
  "Acesso prioritário às instalações do clube",
];

/* Marcos narrativos da sessão de surf (estrutura da homepage) */
export const MARCOS = [
  { num: "00", label: "Lineup" },
  { num: "01", label: "Take-off" },
  { num: "02", label: "Drop" },
  { num: "03", label: "Tubo" },
  { num: "04", label: "Manobra" },
  { num: "05", label: "Praia" },
];
