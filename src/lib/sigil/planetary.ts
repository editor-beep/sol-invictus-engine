// Classical seven planets — Agrippa / Solomonic correspondences.

export type PlanetKey = "sun" | "moon" | "mercury" | "venus" | "mars" | "jupiter" | "saturn";

export type Planet = {
  key: PlanetKey;
  name: string;
  glyph: string;
  day: string;            // planetary day
  metal: string;
  intelligence: string;   // angelic intelligence (Agrippa)
  spirit: string;         // planetary spirit (Agrippa)
  domain: string;         // sphere of influence
  color: string;          // approximate king-scale color (token name)
  hue: number;            // for oklch accents
};

export const PLANETS: Record<PlanetKey, Planet> = {
  sun: {
    key: "sun",
    name: "Sol",
    glyph: "☉",
    day: "Sunday",
    metal: "Gold",
    intelligence: "Nakhiel",
    spirit: "Sorath",
    domain: "Vitality, sovereignty, illumination, the radiant Self",
    color: "gold",
    hue: 80,
  },
  moon: {
    key: "moon",
    name: "Luna",
    glyph: "☽",
    day: "Monday",
    metal: "Silver",
    intelligence: "Malkah be-Tarshishim ve-ad Ruachoth Shechalim",
    spirit: "Schad Barschemoth ha-Schartathan",
    domain: "Dreams, intuition, tides, the hidden mirror",
    color: "silver",
    hue: 230,
  },
  mars: {
    key: "mars",
    name: "Mars",
    glyph: "♂",
    day: "Tuesday",
    metal: "Iron",
    intelligence: "Graphiel",
    spirit: "Bartzabel",
    domain: "Will, courage, severance, the cleaving sword",
    color: "blood",
    hue: 25,
  },
  mercury: {
    key: "mercury",
    name: "Mercurius",
    glyph: "☿",
    day: "Wednesday",
    metal: "Quicksilver",
    intelligence: "Tiriel",
    spirit: "Taphthartharath",
    domain: "Speech, commerce, cunning, the messenger between worlds",
    color: "violet",
    hue: 280,
  },
  jupiter: {
    key: "jupiter",
    name: "Jupiter",
    glyph: "♃",
    day: "Thursday",
    metal: "Tin",
    intelligence: "Iophiel",
    spirit: "Hismael",
    domain: "Expansion, fortune, mercy, the open hand",
    color: "azure",
    hue: 240,
  },
  venus: {
    key: "venus",
    name: "Venus",
    glyph: "♀",
    day: "Friday",
    metal: "Copper",
    intelligence: "Hagiel",
    spirit: "Kedemel",
    domain: "Love, beauty, harmony, the tender flame",
    color: "emerald",
    hue: 150,
  },
  saturn: {
    key: "saturn",
    name: "Saturn",
    glyph: "♄",
    day: "Saturday",
    metal: "Lead",
    intelligence: "Agiel",
    spirit: "Zazel",
    domain: "Time, boundary, silence, the keeper of thresholds",
    color: "indigo",
    hue: 300,
  },
};

// Numerology root → planet (traditional Agrippa-adjacent mapping).
const ROOT_TO_PLANET: Record<number, PlanetKey> = {
  1: "sun",
  2: "moon",
  3: "jupiter",
  4: "mercury", // earthly cube; Agrippa attributes 4 to Mercury's square
  5: "mars",
  6: "venus",
  7: "saturn",
  8: "mercury",
  9: "moon",
  11: "moon",
  22: "saturn",
  33: "jupiter",
};

export function planetForRoot(root: number): Planet {
  return PLANETS[ROOT_TO_PLANET[root] ?? "sun"];
}

// Planetary day-of-week (Chaldean). 0=Sun..6=Sat
const DOW_TO_PLANET: Record<number, PlanetKey> = {
  0: "sun",
  1: "moon",
  2: "mars",
  3: "mercury",
  4: "jupiter",
  5: "venus",
  6: "saturn",
};

export function planetOfDay(date = new Date()): Planet {
  return PLANETS[DOW_TO_PLANET[date.getDay()]];
}

// Chaldean order for planetary hours.
const CHALDEAN: PlanetKey[] = ["saturn", "jupiter", "mars", "sun", "venus", "mercury", "moon"];

export function planetOfHour(date = new Date()): Planet {
  // Approximation: equal hours from local midnight.
  const dayRuler = DOW_TO_PLANET[date.getDay()];
  const startIdx = CHALDEAN.indexOf(dayRuler);
  const hour = date.getHours();
  const idx = (startIdx + hour) % 7;
  return PLANETS[CHALDEAN[idx]];
}
