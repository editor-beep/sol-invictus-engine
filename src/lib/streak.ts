// "Days at the altar" — a consecutive-day return streak kept on this device.
// Mirrors the storage shape and SSR guards of grimoire.ts. The day boundary is UTC
// to match utcDayKey() in daily.ts, so the day a visit counts toward is unambiguous.

import { utcDayKey } from "./daily";

const KEY = "invocation-engine.streak.v1";

export type StreakState = {
  current: number; // consecutive days including today
  longest: number; // best run ever reached
  lastVisitDay: string; // UTC "YYYY-MM-DD" of the most recent counted visit
};

const EMPTY: StreakState = { current: 0, longest: 0, lastVisitDay: "" };

export function loadStreak(): StreakState {
  if (typeof window === "undefined") return { ...EMPTY };
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return { ...EMPTY };
    const parsed = JSON.parse(raw);
    if (
      typeof parsed?.current !== "number" ||
      typeof parsed?.longest !== "number" ||
      typeof parsed?.lastVisitDay !== "string"
    ) {
      return { ...EMPTY };
    }
    return parsed as StreakState;
  } catch {
    return { ...EMPTY };
  }
}

// Whole-day difference between two UTC day keys ("YYYY-MM-DD"). Uses Date.UTC rather
// than string comparison so month and year rollovers are handled correctly.
export function dayDiff(from: string, to: string): number {
  const ms = Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`);
  return Math.round(ms / 86_400_000);
}

// Pure transition: given the prior state and today's key, return the next state.
// Same day → unchanged (idempotent across reloads/navigations); +1 day → increment;
// any larger gap (or no prior visit) → the run resets to 1.
export function advanceStreak(prev: StreakState, today: string): StreakState {
  let current: number;
  if (!prev.lastVisitDay) {
    current = 1;
  } else {
    const diff = dayDiff(prev.lastVisitDay, today);
    if (diff === 0) return prev; // already counted today
    if (diff === 1) current = prev.current + 1;
    else current = 1; // gap (or clock moved backward) breaks the run
  }
  return {
    current,
    longest: Math.max(prev.longest, current),
    lastVisitDay: today,
  };
}

// Record a visit for `today` (UTC) and persist. Returns the resulting state.
export function recordVisit(today = utcDayKey()): StreakState {
  const prev = loadStreak();
  const next = advanceStreak(prev, today);
  if (typeof window !== "undefined" && next !== prev) {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      // storage unavailable (private mode, quota) — fall through with the computed value
    }
  }
  return next;
}
