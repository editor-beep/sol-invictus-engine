// Pythagorean numerology: A=1..I=9, J=1..R=9, S=1..Z=8
// Master numbers 11, 22, 33 are preserved.
const LETTER_VALUE: Record<string, number> = {
  a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9,
  j: 1, k: 2, l: 3, m: 4, n: 5, o: 6, p: 7, q: 8, r: 9,
  s: 1, t: 2, u: 3, v: 4, w: 5, x: 6, y: 7, z: 8,
};

// Simple ordinal values A=1..Z=26, used for kamea cell lookup so the trace
// can reach the full range of each square (not just cells 1-9).
const LETTER_ORDINAL: Record<string, number> = {
  a: 1,  b: 2,  c: 3,  d: 4,  e: 5,  f: 6,  g: 7,  h: 8,  i: 9,
  j: 10, k: 11, l: 12, m: 13, n: 14, o: 15, p: 16, q: 17, r: 18,
  s: 19, t: 20, u: 21, v: 22, w: 23, x: 24, y: 25, z: 26,
};

const VOWELS = new Set(["a", "e", "i", "o", "u"]);

export type NumerologyResult = {
  letters: { char: string; value: number; ordinal: number; isVowel: boolean }[];
  rawSum: number;
  reductionSteps: number[];
  root: number;          // 1-9, or 11/22/33
  isMaster: boolean;
  vowelRatio: number;    // 0..1
  consonantCount: number;
  vowelCount: number;
  letterCount: number;
};

export function analyzeIntention(text: string): NumerologyResult {
  const cleaned = text.toLowerCase();
  const letters: { char: string; value: number; ordinal: number; isVowel: boolean }[] = [];
  let vowels = 0;
  let consonants = 0;
  for (const ch of cleaned) {
    const v = LETTER_VALUE[ch];
    if (v == null) continue;
    const isVowel = VOWELS.has(ch);
    letters.push({ char: ch, value: v, ordinal: LETTER_ORDINAL[ch]!, isVowel });
    if (isVowel) vowels++;
    else consonants++;
  }
  const rawSum = letters.reduce((s, l) => s + l.value, 0) || 1;

  const reductionSteps: number[] = [rawSum];
  let n = rawSum;
  while (n > 9 && n !== 11 && n !== 22 && n !== 33) {
    n = String(n).split("").reduce((s, d) => s + Number(d), 0);
    reductionSteps.push(n);
  }

  const total = vowels + consonants || 1;
  return {
    letters,
    rawSum,
    reductionSteps,
    root: n,
    isMaster: n === 11 || n === 22 || n === 33,
    vowelRatio: vowels / total,
    consonantCount: consonants,
    vowelCount: vowels,
    letterCount: letters.length,
  };
}

// Map a number to a single digit 1-9 (for kamea letter wrapping).
export function toSingleDigit(n: number): number {
  let v = Math.abs(n);
  if (v === 0) return 9;
  while (v > 9) {
    v = String(v).split("").reduce((s, d) => s + Number(d), 0);
  }
  return v || 9;
}
