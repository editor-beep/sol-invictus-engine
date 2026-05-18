// Compose a complete invocation reading from an intention string.

import { analyzeIntention, toSingleDigit } from "./numerology";
import { planetForRoot, planetOfDay, planetOfHour, type Planet } from "./planetary";
import { getKamea, traceOnKamea } from "./kamea";
import { drawTarot, type TarotCard } from "./tarot";
import { sephiraForIntention, sephiraEndpointsForPath, type Sephira } from "./tree-of-life";
import { chakraForVowelRatio, type Chakra } from "./chakra";
import { PLANETARY_SEALS, ringGlyphFor } from "./seals";

export type Reading = {
  intention: string;
  hash: string;
  numerology: ReturnType<typeof analyzeIntention>;
  planet: Planet;
  dayPlanet: Planet;
  hourPlanet: Planet;
  tarot: TarotCard;
  sephira: Sephira;
  pathConnects: { a: Sephira; b: Sephira; pathNumber: number };
  chakra: Chakra;
  // Geometry for the SVG sigil
  sigil: {
    kameaOrder: number;
    kameaSquare: number[][];
    tracePoints: { x: number; y: number }[];   // grid coords on kamea
    sealMotif: string;
    sealPaths: string[];
    ringGlyphs: { angle: number; path: string }[];
    accentColor: string;
    sephiraColor: string;
  };
  createdAt: number;
};

function hashIntention(s: string): string {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(16).padStart(8, "0");
}

export function composeReading(rawIntention: string, now = new Date()): Reading {
  const intention = rawIntention.trim();
  const numerology = analyzeIntention(intention);
  const planet = planetForRoot(numerology.root);
  const dayPlanet = planetOfDay(now);
  const hourPlanet = planetOfHour(now);
  const tarot = drawTarot(intention, numerology.root);
  const sephira = sephiraForIntention(numerology.letterCount, numerology.root);
  // The tarot card IS its Tree of Life path — use that as the canonical path number.
  const pathNumber = tarot.path;
  const pathEndpoints = sephiraEndpointsForPath(pathNumber);
  const chakra = chakraForVowelRatio(numerology.vowelRatio);

  const kamea = getKamea(planet.key);
  // Use ordinal values (A=1..Z=26) so the trace spans the full kamea range,
  // not just the first 9 cells.
  const ordinalValues = numerology.letters.map((l) => l.ordinal);
  const tracePoints = traceOnKamea(kamea, ordinalValues);

  const seal = PLANETARY_SEALS[planet.key];
  const seed = toSingleDigit(numerology.rawSum);
  const ringCount = 8 + (numerology.root % 4) * 2;
  const ringGlyphs = Array.from({ length: ringCount }, (_, i) => ({
    angle: (360 / ringCount) * i,
    path: ringGlyphFor(seed, i),
  }));

  return {
    intention,
    hash: hashIntention(intention),
    numerology,
    planet,
    dayPlanet,
    hourPlanet,
    tarot,
    sephira,
    pathConnects: { a: pathEndpoints.a, b: pathEndpoints.b, pathNumber },
    chakra,
    sigil: {
      kameaOrder: kamea.order,
      kameaSquare: kamea.square,
      tracePoints,
      sealMotif: seal.motif,
      sealPaths: seal.paths,
      ringGlyphs,
      accentColor: chakra.color,
      sephiraColor: sephira.color,
    },
    createdAt: now.getTime(),
  };
}
