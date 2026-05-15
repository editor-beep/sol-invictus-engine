// Planetary kameas (magic squares) from Agrippa's Three Books of Occult Philosophy.
// The classical orders are:
//   Saturn 3, Jupiter 4, Mars 5, Sun 6, Venus 7, Mercury 8, Moon 9.

import type { PlanetKey } from "./planetary";

export type Kamea = {
  order: number;
  square: number[][];      // [row][col], values 1..order^2
  positions: Map<number, { x: number; y: number }>; // value -> grid coord (col, row)
};

const SATURN_3 = [
  [4, 9, 2],
  [3, 5, 7],
  [8, 1, 6],
];

const JUPITER_4 = [
  [4, 14, 15, 1],
  [9, 7, 6, 12],
  [5, 11, 10, 8],
  [16, 2, 3, 13],
];

const MARS_5 = [
  [11, 24, 7, 20, 3],
  [4, 12, 25, 8, 16],
  [17, 5, 13, 21, 9],
  [10, 18, 1, 14, 22],
  [23, 6, 19, 2, 15],
];

const SUN_6 = [
  [6, 32, 3, 34, 35, 1],
  [7, 11, 27, 28, 8, 30],
  [19, 14, 16, 15, 23, 24],
  [18, 20, 22, 21, 17, 13],
  [25, 29, 10, 9, 26, 12],
  [36, 5, 33, 4, 2, 31],
];

const VENUS_7 = [
  [22, 47, 16, 41, 10, 35, 4],
  [5, 23, 48, 17, 42, 11, 29],
  [30, 6, 24, 49, 18, 36, 12],
  [13, 31, 7, 25, 43, 19, 37],
  [38, 14, 32, 1, 26, 44, 20],
  [21, 39, 8, 33, 2, 27, 45],
  [46, 15, 40, 9, 34, 3, 28],
];

const MERCURY_8 = [
  [8, 58, 59, 5, 4, 62, 63, 1],
  [49, 15, 14, 52, 53, 11, 10, 56],
  [41, 23, 22, 44, 45, 19, 18, 48],
  [32, 34, 35, 29, 28, 38, 39, 25],
  [40, 26, 27, 37, 36, 30, 31, 33],
  [17, 47, 46, 20, 21, 43, 42, 24],
  [9, 55, 54, 12, 13, 51, 50, 16],
  [64, 2, 3, 61, 60, 6, 7, 57],
];

const MOON_9 = [
  [37, 78, 29, 70, 21, 62, 13, 54, 5],
  [6, 38, 79, 30, 71, 22, 63, 14, 46],
  [47, 7, 39, 80, 31, 72, 23, 55, 15],
  [16, 48, 8, 40, 81, 32, 64, 24, 56],
  [57, 17, 49, 9, 41, 73, 33, 65, 25],
  [26, 58, 18, 50, 1, 42, 74, 34, 66],
  [67, 27, 59, 10, 51, 2, 43, 75, 35],
  [36, 68, 19, 60, 11, 52, 3, 44, 76],
  [77, 28, 69, 20, 61, 12, 53, 4, 45],
];

const RAW: Record<PlanetKey, number[][]> = {
  saturn: SATURN_3,
  jupiter: JUPITER_4,
  mars: MARS_5,
  sun: SUN_6,
  venus: VENUS_7,
  mercury: MERCURY_8,
  moon: MOON_9,
};

function build(square: number[][]): Kamea {
  const order = square.length;
  const positions = new Map<number, { x: number; y: number }>();
  for (let r = 0; r < order; r++) {
    for (let c = 0; c < order; c++) {
      positions.set(square[r][c], { x: c, y: r });
    }
  }
  return { order, square, positions };
}

const CACHE: Partial<Record<PlanetKey, Kamea>> = {};

export function getKamea(planet: PlanetKey): Kamea {
  if (!CACHE[planet]) CACHE[planet] = build(RAW[planet]);
  return CACHE[planet]!;
}

// Trace letter-values onto kamea following Agrippa's method:
// each letter value maps to a cell on the square. Wrap large values
// modulo order^2 (1-indexed).
export function traceOnKamea(
  kamea: Kamea,
  letterValues: number[],
): { x: number; y: number }[] {
  const max = kamea.order * kamea.order;
  const points: { x: number; y: number }[] = [];
  for (const v of letterValues) {
    let normalized = ((v - 1) % max) + 1;
    const pos = kamea.positions.get(normalized);
    if (pos) points.push(pos);
  }
  return points;
}
