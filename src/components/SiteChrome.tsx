import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { loadStreak } from "@/lib/streak";

const NAV = [
  { to: "/", label: "Altar" },
  { to: "/today", label: "Today" },
  { to: "/hours", label: "Hours" },
  { to: "/grimoire", label: "Grimoire" },
  { to: "/correspondences", label: "Correspondences" },
  { to: "/cipher", label: "Cipher" },
  { to: "/about", label: "Codex" },
] as const;

// The streak lives in localStorage, so it can only be read after hydration —
// render nothing on the server pass to avoid a mismatch.
function StreakBadge() {
  const [current, setCurrent] = useState<number | null>(null);

  useEffect(() => {
    setCurrent(loadStreak().current);
  }, []);

  if (!current) return null;

  return (
    <Link
      to="/today"
      title="Your days at the altar"
      className="hidden sm:inline-flex items-center gap-1.5 rounded-sm border border-gold/30 bg-gold/5 px-3 py-1 text-xs tracking-widest text-gold hover:bg-gold/10"
    >
      <span className="flicker">✦</span>
      {current}
    </Link>
  );
}

export function SiteHeader() {
  return (
    <header className="relative z-20 border-b border-gold/20">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link to="/" className="flex items-center gap-3 group">
          <span className="text-gold text-2xl flicker">✦</span>
          <span className="font-display text-lg tracking-[0.3em] text-parchment uppercase">
            The Invocation Engine
          </span>
        </Link>
        <div className="flex items-center gap-5">
          <nav className="hidden md:flex items-center gap-7 text-sm tracking-widest uppercase text-parchment/70">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className="hover:text-gold transition-colors"
                activeProps={{ className: "text-gold" }}
                activeOptions={{ exact: n.to === "/" }}
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <StreakBadge />
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="relative z-10 mt-24 border-t border-gold/15">
      <div className="mx-auto max-w-6xl px-6 py-8 text-center text-xs tracking-[0.25em] uppercase text-parchment/40">
        Drawn from Agrippa, the Keys of Solomon, and the silent stars
      </div>
    </footer>
  );
}
