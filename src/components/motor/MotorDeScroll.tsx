"use client";

/* ============================================================
   MOTOR DE SCROLL — Surf Clube de Viana
   ------------------------------------------------------------
   O scroll é uma SESSÃO DE SURF: do lineup (0) à praia (1).
   Um único número (progresso 0→1) e a sua velocidade, suavizados
   por lerp, alimentam num só requestAnimationFrame um conjunto de
   funções que escrevem direto no DOM via refs.

   Só se anima transform / opacity (GPU, sem reflow).
   Zero re-renders React. prefers-reduced-motion desliga tudo.

   Três peças:
     <MotorDeScroll>        provider — detém os refs e arranca os hooks
       useRegistarMotor()   cada componente regista o seu elemento por chave
       useMotorDeScroll()   o rAF que anima tudo
       useRevelar()         IntersectionObserver para os reveals + contadores

   Reinicializa em cada navegação client-side (usePathname).
   ============================================================ */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";

type Refs = Record<string, Element | null>;

const MotorContexto = createContext<(chave: string, el: Element | null) => void>(
  () => {}
);

/** Cada componente regista o seu elemento por "chave" e recebe uma callback-ref. */
export function useRegistarMotor(chave: string) {
  const registar = useContext(MotorContexto);
  return useCallback(
    (el: Element | null) => registar(chave, el),
    [registar, chave]
  );
}

export function MotorDeScroll({ children }: { children: ReactNode }) {
  const refs = useRef<Refs>({});
  const pathname = usePathname();

  const registar = useCallback((chave: string, el: Element | null) => {
    refs.current[chave] = el;
  }, []);

  useRevelar(pathname);
  useMotorDeScroll(refs, pathname);

  return (
    <MotorContexto.Provider value={registar}>{children}</MotorContexto.Provider>
  );
}

/* ------------------------------------------------------------
   O MOTOR — um rAF, um listener de scroll passivo
   ------------------------------------------------------------ */

const MAX_METROS = 540; // "metros surfados" — telemetria principal

function useMotorDeScroll(refs: React.MutableRefObject<Refs>, pathname: string) {
  useEffect(() => {
    const r = refs.current ?? {};

    // 1. Puxar elementos por chave (todos podem ser null nesta página)
    const ondaTraco = r.ondaTraco as SVGPathElement | null;
    const ondaBase = r.ondaBase as SVGPathElement | null;
    const surfista = r.surfista as SVGGElement | null;
    const sol = r.sol as HTMLElement | null;
    const telDist = r.telDist as HTMLElement | null;
    const telVel = r.telVel as HTMLElement | null;
    const telEnch = r.telEnch as HTMLElement | null;

    const parallax = Array.from(
      document.querySelectorAll<HTMLElement>("[data-parallax]")
    );
    const fitas = Array.from(document.querySelectorAll<HTMLElement>(".fita"));

    // pré-cálculo do comprimento do traçado (para o surfista viajar)
    let totalOnda = 0;
    try {
      if (ondaBase) totalOnda = ondaBase.getTotalLength();
    } catch {
      totalOnda = 0;
    }

    const eMobile = matchMedia("(max-width: 900px)").matches;

    // 2. Curto-circuito de movimento reduzido — estado estático legível
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      if (ondaTraco) ondaTraco.style.strokeDashoffset = "0";
      if (telDist) telDist.textContent = String(MAX_METROS);
      if (telVel) telVel.textContent = "0";
      if (telEnch)
        telEnch.style[eMobile ? "width" : "height"] = "100%";
      return;
    }

    // 3. Estado do lerp
    let scrollAlvo = window.scrollY;
    let scrollSuave = scrollAlvo;
    let scrollAnterior = scrollAlvo;
    let velocidade = 0;
    let idRaf = 0;

    // 4. Listener leve — só grava a posição
    const aoScroll = () => {
      scrollAlvo = window.scrollY;
    };
    window.addEventListener("scroll", aoScroll, { passive: true });

    // 5. O ciclo
    function ciclo() {
      const max =
        document.documentElement.scrollHeight - window.innerHeight;
      const progresso = max > 0 ? Math.min(scrollAlvo / max, 1) : 0;

      // interpolação suave + velocidade instantânea suavizada (com sinal)
      scrollSuave += (scrollAlvo - scrollSuave) * 0.08;
      velocidade += ((scrollAlvo - scrollAnterior) - velocidade) * 0.12;
      scrollAnterior = scrollAlvo;

      // (3.1) A assinatura: a onda desenha-se com o progresso
      if (ondaTraco) {
        ondaTraco.style.strokeDashoffset = String(1000 - progresso * 1000);
      }

      // (3.1) O surfista viaja ao longo do traçado da onda
      if (surfista && ondaBase && totalOnda > 0) {
        const p = ondaBase.getPointAtLength(progresso * totalOnda);
        surfista.setAttribute("transform", `translate(${p.x} ${p.y})`);
      }

      // (3.4) O sol/maré gira proporcional a scrollSuave (continua sempre)
      if (sol) {
        sol.style.transform = `translate(-50%, -50%) rotate(${
          scrollSuave * 0.02
        }deg)`;
      }

      // (3.3) Parallax multi-camada de oceano
      for (const el of parallax) {
        const fator = parseFloat(el.dataset.parallax || "0");
        const caixa = el.getBoundingClientRect();
        const desvio = (caixa.top - window.innerHeight / 2) * fator;
        el.style.transform = `translate3d(0, ${desvio.toFixed(1)}px, 0)`;
      }

      // (3.5) Skew das fitas proporcional à velocidade (spray ao vento)
      const skew = Math.max(-7, Math.min(7, -velocidade * 0.16));
      for (const f of fitas) {
        f.style.setProperty("--vel-skew", `${skew.toFixed(2)}deg`);
      }

      // (3.6) Classe de estado acima de um limiar — spray no fundo
      document.body.classList.toggle(
        "a-acelerar",
        Math.abs(velocidade) > 14
      );

      // (3.2) Telemetria — metros surfados + velocímetro
      if (telDist) {
        telDist.textContent = String(Math.round(progresso * MAX_METROS));
      }
      if (telVel) {
        telVel.textContent = String(
          Math.min(99, Math.round(Math.abs(velocidade) * 1.4))
        );
      }
      if (telEnch) {
        const pct = (progresso * 100).toFixed(1) + "%";
        if (eMobile) telEnch.style.width = pct;
        else telEnch.style.height = pct;
      }

      idRaf = requestAnimationFrame(ciclo);
    }
    idRaf = requestAnimationFrame(ciclo);

    // 6. Limpeza
    return () => {
      cancelAnimationFrame(idRaf);
      window.removeEventListener("scroll", aoScroll);
      document.body.classList.remove("a-acelerar");
    };
    // pathname garante reinicialização em cada navegação client-side
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refs, pathname]);
}

/* ------------------------------------------------------------
   REVEALS — IntersectionObserver one-shot + contadores
   ------------------------------------------------------------ */

function useRevelar(pathname: string) {
  useEffect(() => {
    const reduzido = matchMedia("(prefers-reduced-motion: reduce)").matches;

    const alvos = Array.from(document.querySelectorAll<HTMLElement>(".revelar"));
    const contadores = Array.from(
      document.querySelectorAll<HTMLElement>("[data-counter]")
    );

    if (reduzido) {
      alvos.forEach((el) => el.classList.add("visivel"));
      contadores.forEach((el) => {
        el.textContent =
          (el.dataset.to || "0") + (el.dataset.suffix || "");
      });
      return;
    }

    const obs = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.classList.add("visivel");

          // contador: tween 0 → data-to ao revelar
          if ((e.target as HTMLElement).dataset.counter !== undefined) {
            animarContador(e.target as HTMLElement);
          }
          obs.unobserve(e.target);
        });
      },
      { threshold: 0.18 }
    );

    alvos.forEach((el) => obs.observe(el));
    contadores.forEach((el) => {
      if (!el.classList.contains("revelar")) obs.observe(el);
    });

    return () => obs.disconnect();
  }, [pathname]);
}

/** Conta de 0 ao data-to com easing, escrevendo em textContent (sem estado React). */
function animarContador(el: HTMLElement) {
  const destino = parseFloat(el.dataset.to || "0");
  const sufixo = el.dataset.suffix || "";
  const prefixo = el.dataset.prefix || "";
  const duracao = 1100;
  const inicio = performance.now();

  function passo(agora: number) {
    const t = Math.min((agora - inicio) / duracao, 1);
    const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
    const valor = Math.round(destino * eased);
    el.textContent = prefixo + valor + sufixo;
    if (t < 1) requestAnimationFrame(passo);
  }
  requestAnimationFrame(passo);
}
