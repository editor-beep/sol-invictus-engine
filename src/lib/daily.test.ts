import { describe, expect, test } from "bun:test";
import {
  utcDayKey,
  dailyRoot,
  dailySeed,
  dailyTarot,
  dailyPlanet,
  dailyIncantation,
  hoursRuledBy,
  nextHourWindow,
} from "./daily";
import { MAJOR_ARCANA } from "./sigil/tarot";
import { planetOfDay } from "./sigil/planetary";

describe("utcDayKey", () => {
  test("is the UTC calendar date, independent of local time", () => {
    expect(utcDayKey(new Date("2026-06-03T15:30:00Z"))).toBe("2026-06-03");
    expect(utcDayKey(new Date("2026-06-03T23:59:59Z"))).toBe("2026-06-03");
  });
});

describe("dailyRoot", () => {
  test("is a single digit 1..9", () => {
    for (const key of ["2026-06-03", "2026-01-01", "2026-12-31", "1999-09-09"]) {
      const r = dailyRoot(key);
      expect(r).toBeGreaterThanOrEqual(1);
      expect(r).toBeLessThanOrEqual(9);
    }
  });
});

describe("dailyTarot", () => {
  test("is deterministic for a given day", () => {
    expect(dailyTarot("2026-06-03")).toBe(dailyTarot("2026-06-03"));
  });
  test("returns a real Major Arcana card", () => {
    const card = dailyTarot("2026-06-03");
    expect(MAJOR_ARCANA).toContain(card);
  });
  test("the seed is woven from the day key", () => {
    expect(dailySeed("2026-06-03")).toBe("daily:2026-06-03");
  });
});

describe("dailyPlanet", () => {
  test("matches the weekday lord", () => {
    const d = new Date("2026-06-03T12:00:00");
    expect(dailyPlanet(d)).toBe(planetOfDay(d));
  });
});

describe("dailyIncantation", () => {
  test("is stable for a given day and non-empty", () => {
    const line = dailyIncantation("2026-06-03");
    expect(line.length).toBeGreaterThan(0);
    expect(dailyIncantation("2026-06-03")).toBe(line);
  });
});

describe("hoursRuledBy / nextHourWindow", () => {
  test("each planet rules 3 or 4 of the 24 hours", () => {
    const d = new Date("2026-06-03T00:00:00");
    const day = planetOfDay(d);
    const hours = hoursRuledBy(d, day.key);
    expect(hours.length).toBeGreaterThanOrEqual(3);
    expect(hours.length).toBeLessThanOrEqual(4);
  });

  test("the day's lord rules the first hour of the day", () => {
    const d = new Date("2026-06-03T00:00:00");
    const day = planetOfDay(d);
    expect(hoursRuledBy(d, day.key)).toContain(0);
  });

  test("reports 'now' when the current hour is ruled by the planet", () => {
    const d = new Date("2026-06-03T00:30:00"); // hour 0 -> day lord
    const day = planetOfDay(d);
    const w = nextHourWindow(d, day.key);
    expect(w?.status).toBe("now");
    expect(w?.index).toBe(0);
  });
});
