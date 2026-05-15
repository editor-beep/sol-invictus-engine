// Seven major chakras with bija mantras.

export type Chakra = {
  key: string;
  sanskrit: string;
  english: string;
  bija: string;          // seed mantra
  element: string;
  color: string;         // hex
  petals: number;
  meaning: string;
};

export const CHAKRAS: Chakra[] = [
  { key: "muladhara",   sanskrit: "Mūlādhāra",  english: "Root",          bija: "LAM",  element: "Earth",  color: "#a8331f", petals: 4,  meaning: "Ground, survival, the seat of being." },
  { key: "svadhisthana",sanskrit: "Svādhiṣṭhāna",english: "Sacral",       bija: "VAM",  element: "Water",  color: "#d2691e", petals: 6,  meaning: "Flow, desire, the creative water." },
  { key: "manipura",    sanskrit: "Maṇipūra",   english: "Solar Plexus",  bija: "RAM",  element: "Fire",   color: "#e6b422", petals: 10, meaning: "Will, transformation, the inner sun." },
  { key: "anahata",     sanskrit: "Anāhata",    english: "Heart",         bija: "YAM",  element: "Air",    color: "#3f8a5a", petals: 12, meaning: "Love, breath, the unstruck sound." },
  { key: "vishuddha",   sanskrit: "Viśuddha",   english: "Throat",        bija: "HAM",  element: "Ether",  color: "#3a7ca5", petals: 16, meaning: "Voice, truth, the spoken word." },
  { key: "ajna",        sanskrit: "Ājñā",       english: "Third Eye",     bija: "OM",   element: "Light",  color: "#5a4fcf", petals: 2,  meaning: "Vision, insight, the inner lamp." },
  { key: "sahasrara",   sanskrit: "Sahasrāra",  english: "Crown",         bija: "AUM",  element: "Conscious", color: "#b388ff", petals: 1000, meaning: "Union, the thousand-petalled lotus." },
];

export function chakraForVowelRatio(ratio: number): Chakra {
  // Higher vowel ratio → upper chakras (more breath/voice/openness).
  const idx = Math.min(6, Math.max(0, Math.floor(ratio * 7)));
  return CHAKRAS[idx];
}
