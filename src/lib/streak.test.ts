import { describe, expect, test } from "bun:test";
import { advanceStreak, dayDiff, type StreakState } from "./streak";

const fresh: StreakState = { current: 0, longest: 0, lastVisitDay: "" };

describe("dayDiff", () => {
  test("same day is 0", () => {
    expect(dayDiff("2026-06-03", "2026-06-03")).toBe(0);
  });
  test("consecutive days is 1", () => {
    expect(dayDiff("2026-06-03", "2026-06-04")).toBe(1);
  });
  test("handles month rollover", () => {
    expect(dayDiff("2026-01-31", "2026-02-01")).toBe(1);
  });
  test("handles year rollover", () => {
    expect(dayDiff("2026-12-31", "2027-01-01")).toBe(1);
  });
  test("multi-day gap", () => {
    expect(dayDiff("2026-06-03", "2026-06-06")).toBe(3);
  });
});

describe("advanceStreak", () => {
  test("first visit starts the run at 1", () => {
    const next = advanceStreak(fresh, "2026-06-03");
    expect(next.current).toBe(1);
    expect(next.longest).toBe(1);
    expect(next.lastVisitDay).toBe("2026-06-03");
  });

  test("same-day revisit is idempotent (returns the same state)", () => {
    const day1 = advanceStreak(fresh, "2026-06-03");
    const again = advanceStreak(day1, "2026-06-03");
    expect(again).toBe(day1);
    expect(again.current).toBe(1);
  });

  test("consecutive day increments the run", () => {
    const day1 = advanceStreak(fresh, "2026-06-03");
    const day2 = advanceStreak(day1, "2026-06-04");
    expect(day2.current).toBe(2);
    expect(day2.longest).toBe(2);
  });

  test("consecutive day across a month boundary still increments", () => {
    const jan31 = advanceStreak(fresh, "2026-01-31");
    const feb01 = advanceStreak(jan31, "2026-02-01");
    expect(feb01.current).toBe(2);
  });

  test("a gap resets the run but preserves the longest", () => {
    let s = advanceStreak(fresh, "2026-06-01");
    s = advanceStreak(s, "2026-06-02");
    s = advanceStreak(s, "2026-06-03"); // current 3, longest 3
    expect(s.current).toBe(3);
    const afterGap = advanceStreak(s, "2026-06-06"); // skipped days
    expect(afterGap.current).toBe(1);
    expect(afterGap.longest).toBe(3);
  });

  test("a clock that moves backward resets rather than going negative", () => {
    const day2 = advanceStreak(advanceStreak(fresh, "2026-06-03"), "2026-06-04");
    const back = advanceStreak(day2, "2026-06-02");
    expect(back.current).toBe(1);
    expect(back.longest).toBe(2);
  });
});
