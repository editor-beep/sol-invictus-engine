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

// A connecting path 11..32 — derive from intention length and root.
export function pathForIntention(letterCount: number, root: number): number {
  return 11 + ((letterCount * 7 + root * 3) % 22);
}
