import { describe, expect, test } from "bun:test";
import {
  sealPath,
  sigilImagePath,
  absoluteUrl,
  sealUrl,
  sigilImageUrl,
  shareDescription,
} from "./share";

describe("sealPath / sigilImagePath", () => {
  test("encode the intention into the query string", () => {
    expect(sealPath("a wish")).toBe("/seal?q=a%20wish");
    expect(sigilImagePath("a wish")).toBe("/og/sigil.svg?q=a%20wish");
  });

  test("encode reserved characters so the round-trip is exact", () => {
    const intention = "love & war?";
    const path = sealPath(intention);
    const decoded = decodeURIComponent(new URL(`http://x${path}`).searchParams.get("q") ?? "");
    expect(decoded).toBe(intention);
  });
});

describe("absoluteUrl", () => {
  test("returns the path unchanged when no origin is given", () => {
    expect(absoluteUrl("/seal?q=x")).toBe("/seal?q=x");
    expect(absoluteUrl("/seal?q=x", "")).toBe("/seal?q=x");
    expect(absoluteUrl("/seal?q=x", null)).toBe("/seal?q=x");
  });

  test("joins origin and path without a double slash", () => {
    expect(absoluteUrl("/seal?q=x", "https://example.com")).toBe("https://example.com/seal?q=x");
    expect(absoluteUrl("/seal?q=x", "https://example.com/")).toBe("https://example.com/seal?q=x");
  });
});

describe("sealUrl / sigilImageUrl", () => {
  test("produce absolute URLs when an origin is supplied", () => {
    expect(sealUrl("hope", "https://x.io")).toBe("https://x.io/seal?q=hope");
    expect(sigilImageUrl("hope", "https://x.io")).toBe("https://x.io/og/sigil.svg?q=hope");
  });

  test("fall back to relative paths without an origin", () => {
    expect(sealUrl("hope")).toBe("/seal?q=hope");
    expect(sigilImageUrl("hope")).toBe("/og/sigil.svg?q=hope");
  });
});

describe("shareDescription", () => {
  test("weaves the reading facets into one line", () => {
    const d = shareDescription({ planet: "Venus", tarot: "The Star", sephira: "Netzach" });
    expect(d).toContain("Venus");
    expect(d).toContain("The Star");
    expect(d).toContain("Netzach");
  });
});
