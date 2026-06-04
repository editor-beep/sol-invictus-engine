import { describe, expect, test } from "bun:test";
import { chooseNudge, hasCastOn, lastActiveDay, type NudgeInput } from "./nudge";
import type { StreakState } from "./streak";

// A grimoire entry whose createdAt falls on the given UTC day.
const castOn = (dayKey: string) => ({ createdAt: Date.parse(`${dayKey}T12:00:00Z`) });

const streak = (current: number, lastVisitDay: string): StreakState => ({
  current,
  longest: Math.max(current, 1),
  lastVisitDay,
});

const base: NudgeInput = {
  today: "2026-06-10",
  streak: streak(0, ""),
  grimoire: [],
  dismissedForDay: "",
};

describe("hasCastOn", () => {
  test("matches an intention sealed on the UTC day", () => {
    expect(hasCastOn([castOn("2026-06-10")], "2026-06-10")).toBe(true);
    expect(hasCastOn([castOn("2026-06-09")], "2026-06-10")).toBe(false);
    expect(hasCastOn([], "2026-06-10")).toBe(false);
  });
});

describe("lastActiveDay", () => {
  test("returns the most recent of streak visit and grimoire casts", () => {
    expect(lastActiveDay(streak(3, "2026-06-08"), [castOn("2026-06-09")])).toBe("2026-06-09");
    expect(lastActiveDay(streak(3, "2026-06-09"), [castOn("2026-06-07")])).toBe("2026-06-09");
  });
  test("is empty when there is no history", () => {
    expect(lastActiveDay(streak(0, ""), [])).toBe("");
  });
});

describe("chooseNudge", () => {
  test("says nothing once dismissed for today", () => {
    const input: NudgeInput = {
      ...base,
      streak: streak(2, "2026-06-09"),
      dismissedForDay: "2026-06-10",
    };
    expect(chooseNudge(input)).toBeNull();
  });

  test("says nothing to a brand-new visitor with no history", () => {
    expect(chooseNudge(base)).toBeNull();
  });

  test("active today but nothing cast → nudge to the altar", () => {
    const input: NudgeInput = { ...base, streak: streak(1, "2026-06-10") };
    const n = chooseNudge(input);
    expect(n?.kind).toBe("cast-today");
    expect(n?.ctaTo).toBe("/");
  });

  test("active today and already cast → fully engaged, no nudge", () => {
    const input: NudgeInput = {
      ...base,
      streak: streak(1, "2026-06-10"),
      grimoire: [castOn("2026-06-10")],
    };
    expect(chooseNudge(input)).toBeNull();
  });

  test("returned the day after with a live streak → streak-at-risk", () => {
    const input: NudgeInput = { ...base, streak: streak(4, "2026-06-09") };
    const n = chooseNudge(input);
    expect(n?.kind).toBe("streak-at-risk");
    expect(n?.ctaTo).toBe("/today");
    expect(n?.title).toContain("4");
  });

  test("a single-day streak uses gentler copy", () => {
    const input: NudgeInput = { ...base, streak: streak(1, "2026-06-09") };
    const n = chooseNudge(input);
    expect(n?.kind).toBe("streak-at-risk");
    expect(n?.title).not.toContain("1-day");
  });

  test("yesterday's activity without a streak → welcome-back", () => {
    const input: NudgeInput = { ...base, grimoire: [castOn("2026-06-09")] };
    const n = chooseNudge(input);
    expect(n?.kind).toBe("welcome-back");
    expect(n?.ctaTo).toBe("/today");
  });

  test("a multi-day gap → welcome-back naming the gap", () => {
    const input: NudgeInput = { ...base, grimoire: [castOn("2026-06-05")] };
    const n = chooseNudge(input);
    expect(n?.kind).toBe("welcome-back");
    expect(n?.body).toContain("5 days");
  });
});
