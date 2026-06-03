// Pure helpers for shareable sigils. A sigil is fully determined by its intention
// string, so a "share" is just a URL carrying that intention — no stored state, no
// backend. These builders are used by the share button, the /seal landing page, and
// the og:image meta, and are kept pure so they can be unit-tested without a browser.

// The public landing page for a shared sigil (clean, single-sigil view).
export function sealPath(intention: string): string {
  return `/seal?q=${encodeURIComponent(intention)}`;
}

// The deterministic sigil rendered as a standalone SVG image (served by server.ts).
export function sigilImagePath(intention: string): string {
  return `/og/sigil.svg?q=${encodeURIComponent(intention)}`;
}

// Join an origin and a path into an absolute URL, tolerating a trailing slash on the
// origin. Returns the path unchanged when no origin is known (SSR without a site URL).
export function absoluteUrl(path: string, origin?: string | null): string {
  if (!origin) return path;
  return `${origin.replace(/\/+$/, "")}${path}`;
}

export function sealUrl(intention: string, origin?: string | null): string {
  return absoluteUrl(sealPath(intention), origin);
}

export function sigilImageUrl(intention: string, origin?: string | null): string {
  return absoluteUrl(sigilImagePath(intention), origin);
}

// A one-line description woven from the reading, used in share text and OG meta.
export function shareDescription(parts: {
  planet: string;
  tarot: string;
  sephira: string;
}): string {
  return `A sigil under ${parts.planet}, drawn with ${parts.tarot} and framed in ${parts.sephira} — composed from the Keys of Solomon and the seven planets.`;
}
