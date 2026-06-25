/* Condições do mar ao vivo — Open-Meteo (sem API key, cache 30 min).
   Praia do Cabedelo · lat 41.6787 · lon -8.8263 */

import { CLUBE } from "./conteudo";

export interface CondicoesMar {
  ondulacao: number; // m
  periodo: number; // s
  swell: number; // m
  vento: number; // km/h
  rajada: number; // km/h
  direcaoVento: number; // graus
  rating: { score: number; label: string };
  atualizado: string; // ISO
  fonte: "ao-vivo" | "demo";
}

function classificar(altura: number): { score: number; label: string } {
  if (altura < 0.5) return { score: 1, label: "Flat" };
  if (altura < 1) return { score: 2, label: "Fraco" };
  if (altura < 1.5) return { score: 3, label: "Razoável" };
  if (altura < 2) return { score: 4, label: "Bom" };
  return { score: 5, label: "Excelente" };
}

const DEMO: CondicoesMar = {
  ondulacao: 1.4,
  periodo: 11,
  swell: 1.2,
  vento: 14,
  rajada: 22,
  direcaoVento: 315,
  rating: classificar(1.4),
  atualizado: new Date().toISOString(),
  fonte: "demo",
};

export async function getCondicoesMar(): Promise<CondicoesMar> {
  const { lat, lon } = CLUBE.gps;
  try {
    const [marRes, ventoRes] = await Promise.all([
      fetch(
        `https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lon}` +
          `&hourly=wave_height,wave_period,wave_direction,swell_wave_height&forecast_days=1`,
        { next: { revalidate: 1800 } }
      ),
      fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
          `&hourly=wind_speed_10m,wind_direction_10m,wind_gusts_10m&forecast_days=1`,
        { next: { revalidate: 1800 } }
      ),
    ]);

    if (!marRes.ok || !ventoRes.ok) return DEMO;

    const mar = await marRes.json();
    const vento = await ventoRes.json();

    // hora actual aproximada -> índice horário
    const i = Math.min(new Date().getHours(), 23);
    const ondulacao = num(mar?.hourly?.wave_height?.[i], 1.4);

    return {
      ondulacao,
      periodo: num(mar?.hourly?.wave_period?.[i], 11),
      swell: num(mar?.hourly?.swell_wave_height?.[i], 1.2),
      vento: num(vento?.hourly?.wind_speed_10m?.[i], 14),
      rajada: num(vento?.hourly?.wind_gusts_10m?.[i], 22),
      direcaoVento: num(vento?.hourly?.wind_direction_10m?.[i], 315),
      rating: classificar(ondulacao),
      atualizado: new Date().toISOString(),
      fonte: "ao-vivo",
    };
  } catch {
    return DEMO;
  }
}

function num(v: unknown, fallback: number): number {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? Math.round(n * 10) / 10 : fallback;
}
