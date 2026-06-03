// The Daily Working — a date-seeded ritual that is identical for every visitor on
// a given calendar day and stable across reloads. Built entirely by composing the
// existing deterministic engine (drawTarot, planetOfDay, planetOfHourN); the engine
// itself is left untouched.

import { toSingleDigit } from "./sigil/numerology";
import { drawTarot, type TarotCard } from "./sigil/tarot";
import {
  planetOfDay,
  planetOfHour,
  planetOfHourN,
  type Planet,
  type PlanetKey,
} from "./sigil/planetary";

// "2026-06-03" — UTC so that "today" flips at the same instant worldwide and lines
// up exactly with the streak's day boundary (see streak.ts).
export function utcDayKey(date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

// A stable single digit 1–9 derived from the day key, used as the tarot root and to
// index the daily incantation. Deterministic for a given date.
export function dailyRoot(dayKey: string): number {
  let sum = 0;
  for (let i = 0; i < dayKey.length; i++) sum += dayKey.charCodeAt(i);
  return toSingleDigit(sum);
}

// The seed string fed in place of an intention. drawTarot already accepts any string.
export function dailySeed(dayKey: string): string {
  return `daily:${dayKey}`;
}

// The card of the day — same for everyone, stable on reload.
export function dailyTarot(dayKey: string): TarotCard {
  return drawTarot(dailySeed(dayKey), dailyRoot(dayKey));
}

// The planet that rules today (its weekday lord).
export function dailyPlanet(date = new Date()): Planet {
  return planetOfDay(date);
}

// The planet ruling the current civil hour.
export function currentHourPlanet(date = new Date()): Planet {
  return planetOfHour(date);
}

export function hourLabel(index: number): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(index)}:00 – ${pad((index + 1) % 24)}:00`;
}

// Every civil hour (0–23) of `date`'s day that is ruled by `planetKey`.
export function hoursRuledBy(date: Date, planetKey: PlanetKey): number[] {
  const out: number[] = [];
  for (let i = 0; i < 24; i++) {
    if (planetOfHourN(date, i).key === planetKey) out.push(i);
  }
  return out;
}

export type HourWindow = {
  index: number; // 0–23
  label: string; // e.g. "08:00 – 09:00"
  status: "now" | "today" | "tomorrow";
};

// The soonest hour window ruled by `planetKey`: the current hour if it qualifies,
// otherwise the next one later today, otherwise the first such hour (tomorrow, since
// the Chaldean cycle repeats each day this is the same index).
export function nextHourWindow(date: Date, planetKey: PlanetKey): HourWindow | null {
  const hours = hoursRuledBy(date, planetKey);
  if (hours.length === 0) return null;
  const current = date.getHours();
  if (hours.includes(current)) {
    return { index: current, label: hourLabel(current), status: "now" };
  }
  const later = hours.find((h) => h > current);
  if (later != null) return { index: later, label: hourLabel(later), status: "today" };
  const first = hours[0];
  return { index: first, label: hourLabel(first), status: "tomorrow" };
}

// A short daily meditation, chosen deterministically by the day's root. Static so it
// costs no LLM call and is identical for everyone on a given day.
const DAILY_INCANTATIONS = [
  "Today the work is begun, not finished. Lay one true stone.",
  "What you attend to grows. Attend, then, to the worthy thing.",
  "Speak the intention once, clearly, and let the hours carry it.",
  "The seal is patience pressed into the soft wax of the day.",
  "Name the fear, name the wish; give the larger name your hands.",
  "Light a single point and the whole dark room is changed.",
  "Let the planet of this day lend you its single virtue.",
  "Do the small rite well; the great rite is made of small rites.",
  "Return tomorrow. The thread is woven by returning.",
];

export function dailyIncantation(dayKey: string): string {
  return DAILY_INCANTATIONS[(dailyRoot(dayKey) - 1) % DAILY_INCANTATIONS.length];
}
