// Re-engagement nudges. On each visit we read the visitor's local state (return
// streak + grimoire) and decide whether to surface a single, gentle prompt back to
// the daily working. Pure and date-key based so the decision is deterministic and
// unit-testable; the React banner is a thin shell over chooseNudge().
//
// The app is local-only by design (no accounts, no server), so this is in-app
// re-engagement rather than closed-tab push — which would require a backend.

import { utcDayKey } from "./daily";
import { dayDiff, type StreakState } from "./streak";

const KEY = "invocation-engine.nudge.v1";

export type NudgeKind = "cast-today" | "streak-at-risk" | "welcome-back";

export type Nudge = {
  kind: NudgeKind;
  title: string;
  body: string;
  ctaLabel: string;
  ctaTo: "/" | "/today";
};

export type NudgeInput = {
  today: string; // utcDayKey()
  streak: StreakState;
  grimoire: { createdAt: number }[];
  dismissedForDay: string; // day key the user last dismissed a nudge for ("" if none)
};

// Whether any intention was sealed on `dayKey` (UTC).
export function hasCastOn(grimoire: { createdAt: number }[], dayKey: string): boolean {
  return grimoire.some((g) => utcDayKey(new Date(g.createdAt)) === dayKey);
}

// The most recent day the visitor did anything — visited the daily working (streak)
// or sealed an intention (grimoire). "" when there is no history at all.
export function lastActiveDay(streak: StreakState, grimoire: { createdAt: number }[]): string {
  const days = grimoire.map((g) => utcDayKey(new Date(g.createdAt)));
  if (streak.lastVisitDay) days.push(streak.lastVisitDay);
  if (days.length === 0) return "";
  return days.reduce((max, d) => (d > max ? d : max));
}

// Decide the single nudge to show, or null for "say nothing". Brand-new visitors and
// fully-engaged returners (already cast today) get no nudge; once dismissed, the day
// stays quiet.
export function chooseNudge(input: NudgeInput): Nudge | null {
  const { today, streak, grimoire, dismissedForDay } = input;
  if (dismissedForDay === today) return null;

  const last = lastActiveDay(streak, grimoire);
  if (!last) return null; // no history — let newcomers explore unprompted

  const gap = dayDiff(last, today);

  // Active today already.
  if (gap <= 0) {
    if (!hasCastOn(grimoire, today)) {
      return {
        kind: "cast-today",
        title: "The day is open",
        body: "No intention has been sealed today. Speak one before the hour turns.",
        ctaLabel: "To the altar",
        ctaTo: "/",
      };
    }
    return null; // visited and cast today — fully engaged
  }

  // Returned the day after — the streak is still savable.
  if (gap === 1 && streak.current >= 1) {
    return {
      kind: "streak-at-risk",
      title: streak.current === 1 ? "Your vigil has begun" : `Your ${streak.current}-day vigil`,
      body: "Return to the daily working today to keep the chain unbroken.",
      ctaLabel: "Today's working",
      ctaTo: "/today",
    };
  }

  // A gap opened up — welcome them back.
  const body =
    gap === 1
      ? "A day has passed since your last working. Today's awaits."
      : `${gap} days have passed since your last working. Rekindle it today.`;
  return {
    kind: "welcome-back",
    title: gap >= 2 ? "The altar has gone quiet" : "The altar remembers you",
    body,
    ctaLabel: "Today's working",
    ctaTo: "/today",
  };
}

// --- Dismissal persistence (mirrors the SSR guards used elsewhere) ---

export function loadNudgeDismissal(): string {
  if (typeof window === "undefined") return "";
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return "";
    const parsed = JSON.parse(raw);
    return typeof parsed?.dismissedDay === "string" ? parsed.dismissedDay : "";
  } catch {
    return "";
  }
}

export function dismissNudgeForDay(day = utcDayKey()): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify({ dismissedDay: day }));
  } catch {
    // storage unavailable — the nudge simply reappears next load
  }
}
