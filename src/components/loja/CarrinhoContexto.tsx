"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export interface ItemCarrinho {
  slug: string;
  name: string;
  price: number;
  ref: string | null;
  cover_url: string | null;
  qtd: number;
}

interface CarrinhoCtx {
  itens: ItemCarrinho[];
  total: number;
  contagem: number;
  adicionar: (item: Omit<ItemCarrinho, "qtd">, qtd?: number) => void;
  remover: (slug: string) => void;
  definirQtd: (slug: string, qtd: number) => void;
  limpar: () => void;
}

const Ctx = createContext<CarrinhoCtx | null>(null);
const CHAVE = "scv-carrinho";

export function CarrinhoProvider({ children }: { children: ReactNode }) {
  const [itens, setItens] = useState<ItemCarrinho[]>([]);

  useEffect(() => {
    try {
      const guardado = localStorage.getItem(CHAVE);
      if (guardado) setItens(JSON.parse(guardado));
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(CHAVE, JSON.stringify(itens));
    } catch {
      /* ignore */
    }
  }, [itens]);

  const adicionar = useCallback(
    (item: Omit<ItemCarrinho, "qtd">, qtd = 1) => {
      setItens((prev) => {
        const existe = prev.find((i) => i.slug === item.slug);
        if (existe) {
          return prev.map((i) =>
            i.slug === item.slug ? { ...i, qtd: i.qtd + qtd } : i
          );
        }
        return [...prev, { ...item, qtd }];
      });
    },
    []
  );

  const remover = useCallback(
    (slug: string) => setItens((prev) => prev.filter((i) => i.slug !== slug)),
    []
  );

  const definirQtd = useCallback((slug: string, qtd: number) => {
    setItens((prev) =>
      prev
        .map((i) => (i.slug === slug ? { ...i, qtd: Math.max(0, qtd) } : i))
        .filter((i) => i.qtd > 0)
    );
  }, []);

  const limpar = useCallback(() => setItens([]), []);

  const total = useMemo(
    () => itens.reduce((s, i) => s + i.price * i.qtd, 0),
    [itens]
  );
  const contagem = useMemo(
    () => itens.reduce((s, i) => s + i.qtd, 0),
    [itens]
  );

  return (
    <Ctx.Provider
      value={{ itens, total, contagem, adicionar, remover, definirQtd, limpar }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useCarrinho() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCarrinho fora do CarrinhoProvider");
  return ctx;
}
