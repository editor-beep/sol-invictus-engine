// SVG path fragments inspired by the planetary pentacles in the
// Greater Key of Solomon and the seals of the Lesser Key (Goetia).
// These are stylized re-drawings — abstract glyphs evoking the original
// ring inscriptions, not exact reproductions.

import type { PlanetKey } from "./planetary";

// Each entry returns a small SVG fragment to be placed at (cx, cy) in a 400x400 viewbox.
// The fragments are stroked, not filled, so they animate cleanly.

export type SealGlyph = {
  paths: string[];        // SVG path "d" strings
  motif: string;          // describes what the seal evokes
};

export const PLANETARY_SEALS: Record<PlanetKey, SealGlyph> = {
  saturn: {
    motif: "Six-pointed seal of the lead-bearer; gates of time.",
    paths: [
      "M0 -50 L43 25 L-43 25 Z",
      "M0 50 L-43 -25 L43 -25 Z",
      "M-30 0 h60",
    ],
  },
  jupiter: {
    motif: "Open-handed seal; the sweeping arc of mercy.",
    paths: [
      "M-40 -20 Q0 -55 40 -20",
      "M-40 20 Q0 55 40 20",
      "M-15 -8 L15 -8 M-15 8 L15 8",
    ],
  },
  mars: {
    motif: "Cleaving five-pointed star of the iron lord.",
    paths: [
      "M0 -50 L14 -16 L50 -16 L20 6 L31 40 L0 20 L-31 40 L-20 6 L-50 -16 L-14 -16 Z",
    ],
  },
  sun: {
    motif: "Radiant seal of the solar sovereign; twelve rays.",
    paths: [
      // 12 rays
      ...Array.from({ length: 12 }, (_, i) => {
        const a = (i * Math.PI * 2) / 12;
        const x1 = Math.cos(a) * 28;
        const y1 = Math.sin(a) * 28;
        const x2 = Math.cos(a) * 50;
        const y2 = Math.sin(a) * 50;
        return `M${x1.toFixed(2)} ${y1.toFixed(2)} L${x2.toFixed(2)} ${y2.toFixed(2)}`;
      }),
      "M0 0 m-22 0 a22 22 0 1 0 44 0 a22 22 0 1 0 -44 0",
    ],
  },
  venus: {
    motif: "Heptagonal rose of the green flame.",
    paths: [
      // heptagram
      (() => {
        const pts: string[] = [];
        for (let i = 0; i < 7; i++) {
          const a = (-Math.PI / 2) + (i * Math.PI * 2 * 3) / 7; // {7/3} star
          pts.push(`${(Math.cos(a) * 48).toFixed(2)} ${(Math.sin(a) * 48).toFixed(2)}`);
        }
        return "M" + pts.join(" L") + " Z";
      })(),
    ],
  },
  mercury: {
    motif: "Caduceus seal; the eight-fold messenger.",
    paths: [
      "M0 -50 v100",
      "M0 -45 q-25 25 0 50 q25 -25 0 -50",
      "M0 -45 q25 25 0 50 q-25 -25 0 -50",
      "M-15 -50 q15 -10 30 0",
    ],
  },
  moon: {
    motif: "Crescent seal of the silver tide.",
    paths: [
      "M-30 -35 a40 40 0 1 0 0 70 a30 30 0 1 1 0 -70 Z",
      "M0 0 m-6 0 a6 6 0 1 0 12 0 a6 6 0 1 0 -12 0",
    ],
  },
};

// Fragments redrawn from Goetia-style seal rings — abstract sigil-shapes
// to use as decorative motifs along the outer ring.
export const RING_GLYPHS: string[] = [
  "M-8 0 a8 8 0 1 0 16 0 a8 8 0 1 0 -16 0 M0 -8 v16",         // crossed circle
  "M-10 -10 L10 10 M-10 10 L10 -10 M0 -12 v24",                // 8-point cross
  "M0 -10 L9 5 L-9 5 Z M0 10 L-9 -5 L9 -5 Z",                  // hexagram fragment
  "M-12 0 q12 -16 24 0 q-12 16 -24 0 Z",                        // vesica
  "M0 -12 v24 M-12 0 h24 M-8 -8 L8 8 M-8 8 L8 -8",             // 8-spoke wheel
  "M-10 0 a10 10 0 1 1 20 0 M0 0 v-12",                         // half-moon staff
  "M-10 -6 L10 -6 L0 10 Z M-6 -2 L6 -2",                        // triangle bar
  "M0 -12 q-10 6 -10 12 q10 -2 10 0 q0 -2 10 0 q0 -6 -10 -12",  // sigil curl
];

export function ringGlyphFor(seed: number, idx: number): string {
  return RING_GLYPHS[(seed * 7 + idx * 3) % RING_GLYPHS.length];
}
