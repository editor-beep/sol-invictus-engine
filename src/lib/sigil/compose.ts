// Compose a complete invocation reading from an intention string.

import { analyzeIntention, toSingleDigit } from "./numerology";
import { planetForRoot, planetOfDay, planetOfHour, type Planet } from "./planetary";
import { getKamea, traceOnKamea } from "./kamea";
import { drawTarot, type TarotCard } from "./tarot";
import { sephiraForIntention, pathForIntention, SEPHIROTH, type Sephira } from "./tree-of-life";
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
  pathConnects: { from: Sephira; to: Sephira | null; pathNumber: number };
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
  const pathNumber = pathForIntention(numerology.letterCount, numerology.root);
  // The path "connects" sephira → another sephira derived from numerology.
  const otherIdx = ((sephira.number + numerology.root) % 10);
  const otherSephira = SEPHIROTH[otherIdx] ?? null;
  const chakra = chakraForVowelRatio(numerology.vowelRatio);

  const kamea = getKamea(planet.key);
  const letterValues = numerology.letters.map((l) => l.value);
  const tracePoints = traceOnKamea(kamea, letterValues);

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
    pathConnects: { from: sephira, to: otherSephira, pathNumber },
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
