# Motor de animação de scroll — ficheiro de contexto reutilizável

Documento de referência sobre **como** está construído o sistema de animações de
scroll (não sobre o conteúdo específico de bicicletas). Serve para reaplicar o
mesmo padrão noutro projeto — no caso seguinte, **tema surf**. No fim há um mapa
de tradução do conceito "volta de bicicleta" para "sessão de surf".

---

## 1. Filosofia central

**O scroll é uma viagem.** A página inteira é uma metáfora física contínua
(um percurso, uma onda, uma descida) e a posição de scroll é o "tempo" dessa
viagem. Tudo o que se move no ecrã é derivado de **um único número**: o
progresso de scroll normalizado entre `0` e `1`.

```
progresso = scrollY / (scrollHeight - innerHeight)   // 0 no topo, 1 no fundo
```

Regras que tornam isto coerente e barato:

1. **Uma só fonte de verdade** (o progresso) alimenta todos os efeitos.
2. **Um só `requestAnimationFrame`** atualiza tudo. Nunca há vários rAF nem
   listeners de scroll a fazer trabalho pesado.
3. **O DOM é tocado por refs, não por estado React.** Nenhuma animação passa por
   re-render. O React monta a estrutura; o motor mexe diretamente em
   `style.transform`, `textContent` e atributos SVG.
4. **Só se anima `transform` e `opacity`** (propriedades aceleradas por GPU,
   sem reflow). `will-change` declarado nos elementos que se movem sempre.
5. **`prefers-reduced-motion` desliga o motor** e deixa um estado estático
   legível.

Sem GSAP, sem Framer Motion, sem libs de scroll. É um rAF com interpolação
(lerp). Leve e suficiente.

---

## 2. Arquitetura de componentes

Três peças, ligadas por React Context para evitar prop-drilling de refs:

```
<MotorDeScroll>            ← provider: detém os refs + arranca os hooks
   ├── useRegistarMotor()  ← cada componente regista o seu elemento por "chave"
   ├── useMotorDeScroll()  ← o rAF que anima tudo
   └── useRevelar()        ← IntersectionObserver para os reveals
```

### 2.1 O provider (registo de refs por chave)

O provider guarda um `useRef` com um dicionário `{ chave: Element }`. Cada
componente filho chama `useRegistarMotor("nomeDoElemento")` e recebe uma
callback-ref para pôr no seu JSX. Quando o elemento monta, fica registado no
dicionário; o motor lê-o de lá.

```tsx
const MotorContexto = createContext<(chave, el) => void>(() => {});

export function useRegistarMotor(chave: string) {
  const registar = useContext(MotorContexto);
  return useCallback((el: Element | null) => registar(chave, el), [registar, chave]);
}

export function MotorDeScroll({ children }) {
  const refs = useRef<Record<string, Element | null>>({});
  const registar = useCallback((chave, el) => { refs.current[chave] = el; }, []);

  useRevelar();
  useMotorDeScroll(refs);

  return <MotorContexto.Provider value={registar}>{children}</MotorContexto.Provider>;
}
```

Uso num componente qualquer:

```tsx
function Onda() {
  const refOnda = useRegistarMotor("onda");      // "onda" é a chave
  return <path ref={refOnda} className="onda" d="..." />;
}
```

**Porquê context e não props:** os elementos animados estão espalhados por muitos
componentes (fundo, header, secções). O context deixa cada um registar-se sem
ter de passar refs pela árvore toda. O motor recebe um único objeto `refs` e
puxa o que precisar por chave, com tolerância a `null` (elemento ainda não
montado ou ausente nesta página).

### 2.2 O motor (`useMotorDeScroll`)

Um `useEffect` que corre uma vez. Estrutura:

```ts
export function useMotorDeScroll(refs) {
  useEffect(() => {
    const r = refs.current ?? {};

    // 1. Puxar os elementos por chave (todos podem ser null)
    const elA = r.chaveA as HTMLElement | null;
    // ...

    // 2. Curto-circuito de movimento reduzido
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      aplicarEstadoEstatico();
      return;
    }

    // 3. Estado do lerp
    let scrollAlvo = scrollY;     // posição real (atualizada pelo listener)
    let scrollSuave = scrollAlvo; // posição interpolada
    let scrollAnterior = scrollAlvo;
    let velocidade = 0;           // px/frame, suavizada
    let idRaf = 0;

    // 4. Listener leve: só grava a posição, nada de trabalho aqui
    const aoScroll = () => { scrollAlvo = scrollY; };
    addEventListener("scroll", aoScroll, { passive: true });

    // 5. O ciclo
    function ciclo() {
      const max = document.documentElement.scrollHeight - innerHeight;
      const progresso = max > 0 ? Math.min(scrollAlvo / max, 1) : 0;

      // interpolação suave + velocidade instantânea suavizada
      scrollSuave += (scrollAlvo - scrollSuave) * 0.08;
      velocidade  += ((scrollAlvo - scrollAnterior) - velocidade) * 0.12;
      scrollAnterior = scrollAlvo;

      // ... chamar cada efeito com (progresso) e/ou (velocidade) ...

      idRaf = requestAnimationFrame(ciclo);
    }
    idRaf = requestAnimationFrame(ciclo);

    // 6. Limpeza
    return () => {
      cancelAnimationFrame(idRaf);
      removeEventListener("scroll", aoScroll);
    };
  }, [refs]);
}
```

**As três variáveis que tudo usa:**

| Variável | O que é | Usada para |
|---|---|---|
| `progresso` | 0→1, posição na viagem | tudo o que é posicional (traçado, contadores, parallax) |
| `scrollSuave` | scrollY com lerp | rotações contínuas, movimento que deve "arrastar" |
| `velocidade` | px/frame suavizado, com sinal | skew, linhas de velocidade, efeitos de intensidade |

O **lerp** (`valor += (alvo - valor) * fator`) é o coração da sensação. Um
fator pequeno (`0.08`) = movimento pesado e fluido; maior = mais responsivo,
mais nervoso. A velocidade é a diferença entre frames, também suavizada, e tem
**sinal** (positivo a descer, negativo a subir) — isso permite efeitos
direcionais.

### 2.3 Os reveals (`useRevelar`)

Separado do rAF porque é eventual, não contínuo. Um `IntersectionObserver`
adiciona `.visivel` aos elementos `.revelar` quando entram no ecrã, e deixa de
os observar (one-shot). O CSS faz a transição.

```ts
const obs = new IntersectionObserver((entradas) => {
  entradas.forEach((e) => {
    if (e.isIntersecting) {
      e.target.classList.add("visivel");
      obs.unobserve(e.target);        // anima uma vez só
    }
  });
}, { threshold: 0.18 });
document.querySelectorAll(".revelar").forEach((el) => obs.observe(el));
```

CSS correspondente (com escalonamento por atraso):

```css
.revelar { opacity: 0; transform: translateY(28px);
  transition: opacity .7s ease, transform .7s cubic-bezier(.2,.7,.2,1); }
.revelar.visivel { opacity: 1; transform: none; }
.revelar--atraso-1.visivel { transition-delay: .08s; }
.revelar--atraso-2.visivel { transition-delay: .16s; }
.revelar--atraso-3.visivel { transition-delay: .24s; }
```

---

## 3. Catálogo de efeitos (padrões reutilizáveis)

Cada efeito é uma pequena função pura que recebe `progresso` ou `velocidade` e
escreve num elemento. Aqui estão os padrões, descritos pelo **mecanismo** para
poderes reusar com qualquer tema.

### 3.1 Traçado que se desenha com o scroll (a assinatura)

Um `<path>` SVG cujo comprimento se revela com o progresso. Truque:
`pathLength={1000}` normaliza o comprimento do path para 1000 unidades
independentemente da geometria real, e mexe-se só no `stroke-dashoffset`.

```css
.traco { stroke-dasharray: 1000; stroke-dashoffset: 1000; }  /* começa invisível */
```
```ts
function desenhar(progresso) {
  traco.style.strokeDashoffset = String(1000 - progresso * 1000);
}
```

**Um ponto que viaja ao longo do traçado:** `path.getTotalLength()` +
`path.getPointAtLength(progresso * total)` dá as coordenadas `{x, y}` em
qualquer fração do percurso. Posiciona-se um `<circle>` (ou ícone) aí.

```ts
const total = traco.getTotalLength();
function mover(progresso) {
  const p = traco.getPointAtLength(progresso * total);
  ponto.setAttribute("cx", p.x);
  ponto.setAttribute("cy", p.y);
}
```

> Surf: o traçado é a linha de uma onda a quebrar, ou o rasto de uma prancha
> na água; o ponto que viaja é o surfista. Mesmíssima mecânica.

### 3.2 Contadores / telemetria

Um valor numérico mapeado linearmente ao progresso, escrito em `textContent`
(não em estado React). Um segundo valor derivado da velocidade.

```ts
contador.textContent = (progresso * VALOR_MAX).toFixed(1);
velocimetro.textContent = String(Math.min(99, Math.round(Math.abs(velocidade) * 1.4)));
```

Uma barra de progresso fina cresce em `height` (desktop) ou `width` (mobile),
decidido por `matchMedia`.

> Surf: odómetro de km → **metros percorridos na onda**, ou profundidade, ou
> "velocidade de surf" em km/h. Marcos quilométricos → boias / sets numerados.

### 3.3 Parallax multi-camada

Camadas de fundo movem-se a velocidades diferentes para dar profundidade. Cada
elemento declara o seu fator num `data-*`; o motor desloca-o em função da sua
posição relativa ao centro do ecrã.

```ts
document.querySelectorAll("[data-parallax]").forEach((el) => {
  const fator = parseFloat(el.dataset.parallax);          // ex. 0.1, 0.16, 0.22
  const caixa = el.getBoundingClientRect();
  const desvio = (caixa.top - innerHeight / 2) * fator;
  el.style.transform = `translateY(${desvio}px)`;
});
```

> Surf: camadas de oceano — horizonte lento, ondas médias, espuma rápida em
> primeiro plano. Fatores diferentes = sensação de água com profundidade.

### 3.4 Rotação contínua ligada ao scroll

Um elemento decorativo roda proporcionalmente a `scrollSuave` (não ao
progresso — queremos que continue a rodar mesmo em páginas longas).

```ts
elemento.style.transform = `rotate(${scrollSuave * 0.12}deg)`;
```

> Surf: a roda dentada (prato pedaleiro) vira o **sol/lua a pôr-se**, a rosa
> dos ventos de uma bússola, ou uma hélice/turbina. Algo circular que gira.

### 3.5 Skew proporcional à velocidade (sensação de aceleração)

Um elemento inclina-se consoante a rapidez e direção do scroll. Dá vida a
faixas de texto em marcha.

```ts
const s = Math.max(-8, Math.min(8, -velocidade * 0.18));   // clampado
faixa.style.transform = `skewX(${s}deg)`;
```

> Surf: a faixa de marcas inclina como spray ao vento; ou a linha do horizonte
> inclina-se levemente como se a prancha "cavasse" na onda.

### 3.6 Classe de estado acima de um limiar

Quando a velocidade passa um limiar, alterna uma classe no `body` que ativa um
efeito CSS (ex.: linhas de velocidade num pseudo-fundo).

```ts
document.body.classList.toggle("a-acelerar", Math.abs(velocidade) > 14);
```
```css
.fundo__velocidade { opacity: 0; transition: opacity .25s; }
body.a-acelerar .fundo__velocidade { opacity: 1; }
```

> Surf: ao acelerar, aparece **spray / linhas de água / bolhas** a passar.

### 3.7 Objetos que seguem o relevo de um terreno

Padrão mais avançado: um elemento (bicicleta) "pousa" sobre a crista de uma
colina SVG e avança com o progresso. Pré-calcula-se uma tabela de pontos da
crista (`getPointAtLength` amostrado N vezes, normalizado em frações 0–1) e
interpola-se a altura para um dado `x`. Depois posiciona-se o objeto em
coordenadas de ecrã com `getBoundingClientRect` da colina.

```ts
// pré-cálculo (uma vez): amostrar a linha de topo em frações 0–1
for (let i = 0; i <= 160; i++) {
  const p = crista.getPointAtLength(total * i / 160);
  pontos.push({ x: p.x / larguraVB, y: p.y / alturaVB });
}
// por frame: interpolar y para o x pretendido e posicionar o objeto
```

> Surf: a prancha/surfista segue a **curva da onda** em vez da crista da colina.
> Idêntico — a "crista" passa a ser o lip da onda.

### 3.8 Tilt 3D no hover (cartões)

Não é scroll, mas faz parte da mesma linguagem tátil. O cartão inclina seguindo
o rato via `rotateX/rotateY`, com `perspective` no contentor pai.

```ts
const x = (e.clientX - caixa.left) / caixa.width - 0.5;
const y = (e.clientY - caixa.top) / caixa.height - 0.5;
carta.style.transform = `rotateY(${x*10}deg) rotateX(${-y*10}deg) translateY(-4px)`;
// reset em mouseleave; respeitar prefers-reduced-motion
```

---

## 4. Estrutura narrativa da página

A página é uma sequência de **marcos** ao longo da viagem. Cada secção é uma
paragem com um número/etiqueta (eyebrow) que ancora o utilizador no percurso. O
progresso de scroll mapeia simbolicamente a esses marcos (a telemetria conta até
ao valor do último).

```
Início(0)  →  Marco A  →  Marco B (zona escura/contraste)  →  ...  →  Meta(1)
```

Padrões de composição que reforçam a metáfora:
- **Eyebrow numerado** por secção ("KM 12 · …") com um traço de cor de acento.
- **Uma secção de contraste** (banda escura com clip-path diagonal) a meio, para
  quebrar o ritmo — translúcida, para o fundo animado continuar a ver-se.
- **Fita/marquee** entre secções, em loop CSS infinito, que reage à velocidade.
- **Fundo fixo** (`position: fixed; inset: 0; z-index: 0`) com a animação
  principal; o conteúdo scrolla por cima com `z-index: 1`.

> Surf: marcos = fases de uma sessão/onda — **Lineup(0) → Take-off → Drop →
> Tubo (zona escura) → Manobra → Kick-out / Praia(meta)**. Ou pontos de uma costa
> (spots). O contador conta metros de onda ou a altura da ondulação.

---

## 5. Design system (o que torna a estética coesa)

A identidade visual e a animação andam juntas. Princípios transponíveis:

- **Tokens de cor como CSS custom properties** (`--cor-papel`, `--cor-sinal`…),
  expostos depois ao Tailwind via `@theme inline`. Nunca espalhar hex.
  - Uma **cor de acento única** e forte, usada com parcimónia (no caso, o
    vermelho do logo). Tudo o resto é neutro/frio à volta dela.
- **Tipografia com papéis fixos:** display condensado itálico para títulos
  (ar de dorsal de prova), corpo neutro, e uma **mono para dados/telemetria/
  eyebrows** (letter-spacing largo). A mono é o que "vende" o lado instrumento.
- **Detalhes de assinatura repetidos:** sombras duras offset (`box-shadow: 4px
  4px 0`), `skewX(-3deg)` nos hovers de botões, clip-path diagonal na secção de
  contraste, eyebrows com traço de acento.

> Surf: troca a paleta granito/asfalto/vermelho por **areia/oceano/espuma** com
> um acento (coral, turquesa ou amarelo-sol). Mantém a mono para a telemetria —
> dá o mesmo ar "instrumento de medição" (que numa app de surf encaixa lindamente:
> parece um relógio de marés / leitura de boia). Display condensado itálico
> continua a funcionar para a energia.

---

## 6. Regras de qualidade (não negociáveis)

1. **Mobile-first.** Testar a telemetria em viewport estreito (passa de régua
   lateral a barra inferior; o `body` ganha `padding-bottom`).
2. **Só `transform` / `opacity`** nas animações. `will-change` onde há movimento.
3. **Um rAF, um listener de scroll passivo.** Zero trabalho pesado no listener.
4. **`prefers-reduced-motion`:** motor desligado, estado estático legível,
   reveals instantâneos, marquees parados.
5. **Foco de teclado visível** em links e botões.
6. **Alvo Lighthouse 95+** em Performance e Acessibilidade. O padrão rAF+refs
   ajuda porque não há re-renders nem layout thrashing.

---

## 7. Checklist para arrancar o projeto de surf

1. Define a **metáfora física**: o scroll é ___ (descer uma onda? percorrer uma
   costa? uma sessão do amanhecer ao pôr-do-sol?). Tudo deriva daqui.
2. Copia as 3 peças: `MotorDeScroll` (provider), `useMotorDeScroll` (rAF) e
   `useRevelar` (IntersectionObserver). São agnósticas ao tema — só mudam as
   funções de efeito dentro do ciclo.
3. Desenha a **assinatura**: um traçado SVG (a onda) que se desenha + um ponto
   que viaja (o surfista). É o efeito que define o site.
4. Escolhe 3–4 efeitos secundários do catálogo (§3) que façam sentido com água:
   parallax de camadas de oceano, spray acima de um limiar de velocidade,
   horizonte com skew, sol a girar.
5. Mapeia a **telemetria**: que número conta? (metros de onda, altura de
   ondulação, velocidade). Mantém a estética de instrumento mono.
6. Define os **marcos** narrativos (fases da onda/spots da costa) e uma secção
   de contraste a meio (o tubo, naturalmente escuro).
7. Tokens de cor + tipografia (§5). Acento único.
8. Passa por toda a §6 antes de considerar fechado.

---

### Resumo de uma linha

> Um número (progresso de scroll 0→1) e a sua velocidade, suavizados por lerp,
> alimentam num único `requestAnimationFrame` um conjunto de pequenas funções que
> escrevem direto no DOM via refs — traçado SVG que se desenha, contadores,
> parallax, rotações e skews — tudo só com `transform`/`opacity`, com reveals por
> IntersectionObserver à parte e tudo desligável por `prefers-reduced-motion`.
