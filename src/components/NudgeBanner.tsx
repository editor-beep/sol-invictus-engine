import { Link, useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { utcDayKey } from "@/lib/daily";
import { loadStreak } from "@/lib/streak";
import { loadGrimoire } from "@/lib/grimoire";
import { chooseNudge, dismissNudgeForDay, loadNudgeDismissal, type Nudge } from "@/lib/nudge";

// A slim, dismissible re-engagement prompt shown beneath the header. Reads local state
// only, so it renders nothing on the server pass (avoids a hydration mismatch) and only
// appears once the visitor has some history.
export function NudgeBanner() {
  const [nudge, setNudge] = useState<Nudge | null>(null);
  const pathname = useLocation({ select: (l) => l.pathname });

  useEffect(() => {
    const today = utcDayKey();
    setNudge(
      chooseNudge({
        today,
        streak: loadStreak(),
        grimoire: loadGrimoire(),
        dismissedForDay: loadNudgeDismissal(),
      }),
    );
  }, []);

  // Don't point visitors to the page they are already on.
  if (!nudge || nudge.ctaTo === pathname) return null;

  const dismiss = () => {
    dismissNudgeForDay();
    setNudge(null);
  };

  return (
    <div className="relative z-10 border-b border-gold/20 bg-gold/[0.04]">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-6 py-2.5">
        <span className="text-gold/70 flicker" aria-hidden>
          ✦
        </span>
        <div className="min-w-0 flex-1 text-sm">
          <span className="font-display text-parchment">{nudge.title}</span>
          <span className="text-parchment/50"> — {nudge.body}</span>
        </div>
        <Link
          to={nudge.ctaTo}
          className="shrink-0 rounded-sm border border-gold/40 bg-gold/10 px-3 py-1 text-[11px] tracking-widest uppercase text-gold hover:bg-gold/20"
        >
          {nudge.ctaLabel}
        </Link>
        <button
          onClick={dismiss}
          aria-label="Dismiss"
          className="shrink-0 text-parchment/40 hover:text-gold"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
