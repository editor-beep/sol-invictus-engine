// The ten Sephiroth and the Hebrew name of each.
// Colors here approximate the Golden Dawn King/Queen scale.

export type Sephira = {
  number: number;          // 1..10
  name: string;            // Hebrew transliteration
  english: string;
  meaning: string;
  color: string;           // hex token approximating the Queen scale
  pillar: "Mercy" | "Severity" | "Mildness";
};

export const SEPHIROTH: Sephira[] = [
  { number: 1,  name: "Kether",   english: "The Crown",       meaning: "Pure being; the first spark of will.",     color: "#f8f3e3", pillar: "Mildness" },
  { number: 2,  name: "Chokmah",  english: "Wisdom",          meaning: "Active force; the primordial father.",     color: "#5a7da3", pillar: "Mercy" },
  { number: 3,  name: "Binah",    english: "Understanding",   meaning: "Receptive form; the great mother.",        color: "#2a2236", pillar: "Severity" },
  { number: 4,  name: "Chesed",   english: "Mercy",           meaning: "Expansive grace; the open hand.",          color: "#3865a1", pillar: "Mercy" },
  { number: 5,  name: "Geburah",  english: "Severity",        meaning: "Cleaving fire; the just sword.",           color: "#9b2a2a", pillar: "Severity" },
  { number: 6,  name: "Tiphareth",english: "Beauty",          meaning: "The harmonizing heart; the radiant child.",color: "#c9a64c", pillar: "Mildness" },
  { number: 7,  name: "Netzach",  english: "Victory",         meaning: "Enduring desire; the green flame.",        color: "#3f8a5a", pillar: "Mercy" },
  { number: 8,  name: "Hod",      english: "Splendor",        meaning: "Form and word; the named pattern.",        color: "#a65b27", pillar: "Severity" },
  { number: 9,  name: "Yesod",    english: "Foundation",      meaning: "The astral mirror; the hidden current.",   color: "#6a3fa0", pillar: "Mildness" },
  { number: 10, name: "Malkuth",  english: "The Kingdom",     meaning: "The manifest world; the bride.",           color: "#4a3826", pillar: "Mildness" },
];

export function sephiraForIntention(letterCount: number, root: number): Sephira {
  const n = ((letterCount + root - 1) % 10) + 1;
  return SEPHIROTH[n - 1];
}

// The 22 paths (11-32) each connect a fixed pair of sephiroth.
// Endpoints listed as [upper sephira number, lower sephira number].
// Source: Golden Dawn / Regardie, "The Tree of Life."
export const PATH_ENDPOINTS: Record<number, [number, number]> = {
  11: [1, 2],   // Kether   – Chokmah    (Fool / Aleph)
  12: [1, 3],   // Kether   – Binah      (Magician / Beth)
  13: [1, 6],   // Kether   – Tiphareth  (High Priestess / Gimel)
  14: [2, 3],   // Chokmah  – Binah      (Empress / Daleth)
  15: [2, 6],   // Chokmah  – Tiphareth  (Emperor / Heh)
  16: [2, 4],   // Chokmah  – Chesed     (Hierophant / Vav)
  17: [3, 6],   // Binah    – Tiphareth  (Lovers / Zayin)
  18: [3, 5],   // Binah    – Geburah    (Chariot / Cheth)
  19: [4, 5],   // Chesed   – Geburah    (Strength / Teth)
  20: [4, 6],   // Chesed   – Tiphareth  (Hermit / Yod)
  21: [4, 7],   // Chesed   – Netzach    (Wheel / Kaph)
  22: [5, 6],   // Geburah  – Tiphareth  (Justice / Lamed)
  23: [5, 8],   // Geburah  – Hod        (Hanged Man / Mem)
  24: [6, 7],   // Tiphareth– Netzach    (Death / Nun)
  25: [6, 9],   // Tiphareth– Yesod      (Temperance / Samekh)
  26: [6, 8],   // Tiphareth– Hod        (Devil / Ayin)
  27: [7, 8],   // Netzach  – Hod        (Tower / Peh)
  28: [7, 9],   // Netzach  – Yesod      (Star / Tzaddi)
  29: [7, 10],  // Netzach  – Malkuth    (Moon / Qoph)
  30: [8, 9],   // Hod      – Yesod      (Sun / Resh)
  31: [8, 10],  // Hod      – Malkuth    (Judgement / Shin)
  32: [9, 10],  // Yesod    – Malkuth    (World / Tav)
};

export function sephiraEndpointsForPath(pathNumber: number): { a: Sephira; b: Sephira } {
  const [ai, bi] = PATH_ENDPOINTS[pathNumber] ?? [1, 10];
  return { a: SEPHIROTH[ai - 1]!, b: SEPHIROTH[bi - 1]! };
}
