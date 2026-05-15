import type { Reading } from "@/lib/sigil/compose";

const KEY = "invocation-engine.grimoire.v1";
const MAX = 50;

export type SavedInvocation = {
  hash: string;
  intention: string;
  createdAt: number;
  // We re-derive the full Reading on view to keep storage tiny.
};

export function loadGrimoire(): SavedInvocation[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export function saveToGrimoire(reading: Reading): void {
  if (typeof window === "undefined") return;
  const current = loadGrimoire();
  const next: SavedInvocation[] = [
    {
      hash: reading.hash,
      intention: reading.intention,
      createdAt: reading.createdAt,
    },
    ...current.filter((c) => c.intention !== reading.intention),
  ].slice(0, MAX);
  window.localStorage.setItem(KEY, JSON.stringify(next));
}

export function removeFromGrimoire(intention: string): void {
  if (typeof window === "undefined") return;
  const next = loadGrimoire().filter((c) => c.intention !== intention);
  window.localStorage.setItem(KEY, JSON.stringify(next));
}
