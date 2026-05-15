// Pythagorean numerology: A=1..I=9, J=1..R=9, S=1..Z=8
// Master numbers 11, 22, 33 are preserved.
const LETTER_VALUE: Record<string, number> = {
  a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9,
  j: 1, k: 2, l: 3, m: 4, n: 5, o: 6, p: 7, q: 8, r: 9,
  s: 1, t: 2, u: 3, v: 4, w: 5, x: 6, y: 7, z: 8,
};

const VOWELS = new Set(["a", "e", "i", "o", "u"]);

export type NumerologyResult = {
  letters: { char: string; value: number }[];
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
  const letters: { char: string; value: number }[] = [];
  let vowels = 0;
  let consonants = 0;
  for (const ch of cleaned) {
    const v = LETTER_VALUE[ch];
    if (v == null) continue;
    letters.push({ char: ch, value: v });
    if (VOWELS.has(ch)) vowels++;
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
