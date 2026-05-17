function buildStars(count: number) {
  return Array.from({ length: count }, (_, i) => {
    // Deterministic pseudo-random so SSR matches client.
    const x = ((i * 9301 + 49297) % 233280) / 233280;
    const y = ((i * 6271 + 12345) % 233280) / 233280;
    const r = 0.4 + (((i * 7) % 100) / 100) * 1.4;
    const o = 0.15 + (((i * 13) % 100) / 100) * 0.6;
    return { x: x * 100, y: y * 100, r, o };
  });
}

const DEFAULT_STARS = buildStars(80);

// A faint drifting starfield rendered in SVG — pure decoration, no JS animation cost.
export function Starfield({ count = 80 }: { count?: number }) {
  const stars = count === 80 ? DEFAULT_STARS : buildStars(count);
  return (
    <svg
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
      preserveAspectRatio="xMidYMid slice"
      viewBox="0 0 100 100"
    >
      {stars.map((s, i) => (
        <circle
          key={i}
          cx={s.x}
          cy={s.y}
          r={s.r * 0.06}
          fill="oklch(0.92 0.04 80)"
          opacity={s.o}
        />
      ))}
    </svg>
  );
}
