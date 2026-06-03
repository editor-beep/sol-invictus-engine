// Traditional works attributed to each planet's hour.
// Shared between the Planetary Hours table (/hours) and the Daily Working (/today),
// so the two routes draw from one canonical list rather than duplicating it.

import type { PlanetKey } from "./planetary";

export const HOUR_WORKS: Record<PlanetKey, string[]> = {
  sun: [
    "Seeking fame, friendship, and victory",
    "Ceremonies honoring kings or those in power",
    "Works of illumination and confidence",
  ],
  moon: [
    "Psychic work, dreams, and hidden matters",
    "Travel, sea voyages, and the sending of messages",
    "Planting, gathering, and all works tied to cycles",
  ],
  mars: [
    "Conflict, courage, and the breaking of bonds",
    "Surgery, iron-work, and banishment",
    "Protection magic and forceful action",
  ],
  mercury: [
    "Commerce, contracts, writing, and cunning",
    "Divination and the opening of paths",
    "Learning, messengers, and communication",
  ],
  jupiter: [
    "Wealth, healing, and matters of law",
    "Expansion and the favor of powerful allies",
    "Fortune-seeking and works of mercy",
  ],
  venus: [
    "Love, beauty, and reconciliation",
    "Arts, music, and the pleasure of company",
    "Attraction, harmony, and softening of strife",
  ],
  saturn: [
    "Binding, banishment, and endings",
    "Works requiring patience and long endurance",
    "Death rites, lead-work, and the crossing of thresholds",
  ],
};

export function getWork(key: PlanetKey, hourIndex: number): string {
  const list = HOUR_WORKS[key];
  return list[hourIndex % list.length];
}
