import type { Reading } from "./compose";

export interface LetterRule {
  from: string;    // single lowercase a–z letter (source)
  to: string;      // single lowercase a–z letter (target)
  nthOnly?: number; // if set, only replace every nth occurrence of `from`
}

export interface CosmicTruth {
  id: string;
  title: string;
  source: string;
  hint: string;
  encoded: string;
  decoded: string;
  rules: LetterRule[];
}

// Each rule is an independent pass over the current text (not the original).
// This means rule N can interact with the output of rule N-1.
// Case is preserved: uppercase source → uppercase output.
export function applyLetterRules(text: string, rules: LetterRule[]): string {
  let current = text;
  for (const rule of rules) {
    let count = 0;
    current = current
      .split("")
      .map((char) => {
        const lower = char.toLowerCase();
        if (lower === rule.from) {
          count++;
          if (!rule.nthOnly || count % rule.nthOnly === 0) {
            return char === lower ? rule.to : rule.to.toUpperCase();
          }
        }
        return char;
      })
      .join("");
  }
  return current;
}

// Produce the encoded form of a decoded truth by applying inverted rules.
// Guarantees applyLetterRules(encode(text, rules), rules) === text when the
// rules use non-overlapping from/to letters that don't appear in each other's sets.
function encode(decoded: string, decodingRules: LetterRule[]): string {
  const encodingRules = decodingRules.map((r) => ({
    from: r.to,
    to: r.from,
    nthOnly: r.nthOnly,
  }));
  return applyLetterRules(decoded, encodingRules);
}

const _truths = [
  {
    id: "mental-universe",
    title: "The Mental Universe",
    source: "The Kybalion, Three Initiates (1908)",
    hint: "Three consonants are wearing borrowed names. j stands in for t · k for m · q for n.",
    decoded: "the universe is mental all is mind",
    rules: [
      { from: "j", to: "t" },
      { from: "k", to: "m" },
      { from: "q", to: "n" },
    ],
  },
  {
    id: "i-am",
    title: "The Sacred Name",
    source: "Exodus 3:14",
    hint: "Vowels have been displaced. e holds i's place · o holds a's place · w stands for m.",
    decoded: "i am that i am",
    rules: [
      { from: "e", to: "i" },
      { from: "o", to: "a" },
      { from: "w", to: "m" },
    ],
  },
  {
    id: "as-above",
    title: "The Hermetic Axiom",
    source: "The Emerald Tablet of Hermes Trismegistus",
    hint: "Three letters wear borrowed faces. f is a · g is o · j is e.",
    decoded: "as above so below as within so without",
    rules: [
      { from: "f", to: "a" },
      { from: "g", to: "o" },
      { from: "j", to: "e" },
    ],
  },
  {
    id: "consciousness",
    title: "The Observer Effect",
    source: "Niels Bohr, Copenhagen interpretation (1927)",
    hint: "Three letters stand as proxies. d was c · f was o · k was e. Return each to its origin.",
    decoded: "consciousness collapses the wave into being",
    rules: [
      { from: "d", to: "c" },
      { from: "f", to: "o" },
      { from: "k", to: "e" },
    ],
  },
  {
    id: "present-moment",
    title: "The Eternal Present",
    source: "Ludwig Wittgenstein, Tractatus 6.4311",
    hint: "r carries the weight of t · u stands in for o · x holds e's place.",
    decoded: "this moment always will have been",
    rules: [
      { from: "r", to: "t" },
      { from: "u", to: "o" },
      { from: "x", to: "e" },
    ],
  },
];

export const COSMIC_TRUTHS: CosmicTruth[] = _truths.map((t) => ({
  ...t,
  encoded: encode(t.decoded, t.rules),
}));

const ALPHA = "abcdefghijklmnopqrstuvwxyz";

// Derive 2–3 personalized cipher rules from a reading's numerology and correspondences.
// Deterministic: same reading always produces the same rules.
export function buildCipherFromReading(reading: Reading): LetterRule[] {
  const root = reading.numerology.root % 9 || 9; // collapse master numbers to 1–9

  const from1 = ALPHA[(root - 1) % 26];
  const from2 = ALPHA[(root * 3) % 26];
  const from3 = ALPHA[(root * 7) % 26];

  const to1 = reading.planet.name[0].toLowerCase();
  const to2 = reading.chakra.bija[0].toLowerCase();
  const to3 = reading.tarot.name[0].toLowerCase();

  const candidates: LetterRule[] = [
    { from: from1, to: to1 },
    { from: from2, to: to2, nthOnly: (root % 3) + 2 },
    { from: from3, to: to3 },
  ];

  // Drop identity rules (from === to) and deduplicate by source letter.
  const seen = new Set<string>();
  return candidates.filter((r) => {
    if (r.from === r.to || seen.has(r.from)) return false;
    seen.add(r.from);
    return true;
  });
}
