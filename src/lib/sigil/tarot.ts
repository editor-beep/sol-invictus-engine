// Major Arcana with traditional Hebrew letter, Tree-of-Life path, and core meaning.

export type TarotCard = {
  number: number;
  name: string;
  hebrew: string;       // letter name
  glyph: string;        // Hebrew letter
  path: number;         // Tree of Life path 11..32
  keyword: string;
  meaning: string;
};

export const MAJOR_ARCANA: TarotCard[] = [
  { number: 0,  name: "The Fool",            hebrew: "Aleph",  glyph: "א", path: 11, keyword: "Beginning", meaning: "The leap into the unknown; spirit before form." },
  { number: 1,  name: "The Magician",        hebrew: "Beth",   glyph: "ב", path: 12, keyword: "Will",      meaning: "As above, so below — directed will channels the elements." },
  { number: 2,  name: "The High Priestess",  hebrew: "Gimel",  glyph: "ג", path: 13, keyword: "Mystery",   meaning: "The veil; intuition, the lunar hidden current." },
  { number: 3,  name: "The Empress",         hebrew: "Daleth", glyph: "ד", path: 14, keyword: "Bloom",     meaning: "Generative love; the fertile gate." },
  { number: 4,  name: "The Emperor",         hebrew: "Heh",    glyph: "ה", path: 15, keyword: "Order",     meaning: "Structure, sovereignty, the throne." },
  { number: 5,  name: "The Hierophant",      hebrew: "Vav",    glyph: "ו", path: 16, keyword: "Tradition", meaning: "The bridge of teaching; sacred lineage." },
  { number: 6,  name: "The Lovers",          hebrew: "Zayin",  glyph: "ז", path: 17, keyword: "Union",     meaning: "Discrimination and choice; the sword of love." },
  { number: 7,  name: "The Chariot",         hebrew: "Cheth",  glyph: "ח", path: 18, keyword: "Triumph",   meaning: "Will held in tension; victory through balance." },
  { number: 8,  name: "Strength",            hebrew: "Teth",   glyph: "ט", path: 19, keyword: "Lust",      meaning: "The serpent tamed by the open hand." },
  { number: 9,  name: "The Hermit",          hebrew: "Yod",    glyph: "י", path: 20, keyword: "Solitude",  meaning: "Inner light, the lantern in the wilderness." },
  { number: 10, name: "Wheel of Fortune",    hebrew: "Kaph",   glyph: "כ", path: 21, keyword: "Cycle",     meaning: "The turning law; what rises must descend." },
  { number: 11, name: "Justice",             hebrew: "Lamed",  glyph: "ל", path: 22, keyword: "Balance",   meaning: "Karmic equilibrium; the sword and scales." },
  { number: 12, name: "The Hanged Man",      hebrew: "Mem",    glyph: "מ", path: 23, keyword: "Surrender", meaning: "Reversal of perspective; the willing pause." },
  { number: 13, name: "Death",               hebrew: "Nun",    glyph: "נ", path: 24, keyword: "Release",   meaning: "Transformation; the necessary ending." },
  { number: 14, name: "Temperance",          hebrew: "Samekh", glyph: "ס", path: 25, keyword: "Alchemy",   meaning: "The mixing of opposites in the cup." },
  { number: 15, name: "The Devil",           hebrew: "Ayin",   glyph: "ע", path: 26, keyword: "Bondage",   meaning: "Matter mistaken for self; the laughing chain." },
  { number: 16, name: "The Tower",           hebrew: "Peh",    glyph: "פ", path: 27, keyword: "Lightning", meaning: "Sudden truth shattering false structure." },
  { number: 17, name: "The Star",            hebrew: "Tzaddi", glyph: "צ", path: 28, keyword: "Hope",      meaning: "Pouring forth; serene grace after storm." },
  { number: 18, name: "The Moon",            hebrew: "Qoph",   glyph: "ק", path: 29, keyword: "Dream",     meaning: "The dark mirror; instinct and tide." },
  { number: 19, name: "The Sun",             hebrew: "Resh",   glyph: "ר", path: 30, keyword: "Radiance",  meaning: "Joy revealed; the child crowned in light." },
  { number: 20, name: "Judgement",           hebrew: "Shin",   glyph: "ש", path: 31, keyword: "Awakening", meaning: "The trumpet; resurrection of purpose." },
  { number: 21, name: "The World",           hebrew: "Tav",    glyph: "ת", path: 32, keyword: "Completion",meaning: "The dance of the four; the seal of the great work." },
];

// Pick a Major Arcana card from the intention.
// Use a stable hash so the same intention always pulls the same card,
// but mix in the numerology root so it's not just random.
export function drawTarot(intention: string, root: number): TarotCard {
  let h = root * 31;
  for (let i = 0; i < intention.length; i++) {
    h = (h * 33 + intention.charCodeAt(i)) >>> 0;
  }
  return MAJOR_ARCANA[h % MAJOR_ARCANA.length];
}
