import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { PLANETS, type PlanetKey } from "@/lib/sigil/planetary";
import { HOUR_WORKS } from "@/lib/sigil/planetary-works";
import {
  utcDayKey,
  dailyPlanet,
  dailyTarot,
  currentHourPlanet,
  dailyIncantation,
  nextHourWindow,
} from "@/lib/daily";
import { recordVisit, type StreakState } from "@/lib/streak";

export const Route = createFileRoute("/today")({
  head: () => ({
    meta: [
      { title: "The Daily Working — Invocation Engine" },
      {
        name: "description",
        content:
          "Today's planetary lord, the card of the day, and the auspicious hour for your working — a small rite to return to each day.",
      },
    ],
  }),
  component: TodayPage,
});

function TodayPage() {
  const [now, setNow] = useState(() => new Date());
  const [streak, setStreak] = useState<StreakState | null>(null);
  const [working, setWorking] = useState<PlanetKey | null>(null);

  // Tick the clock so the current hour and its window stay live.
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  // Record today's visit once, after hydration, to avoid an SSR mismatch.
  useEffect(() => {
    setStreak(recordVisit());
  }, []);

  const dayKey = utcDayKey(now);
  const dayPlanet = dailyPlanet(now);
  const hourPlanet = currentHourPlanet(now);
  const card = useMemo(() => dailyTarot(dayKey), [dayKey]);
  const incantation = useMemo(() => dailyIncantation(dayKey), [dayKey]);

  // The working defaults to the day's own lord until the visitor chooses one.
  const activePlanetKey = working ?? dayPlanet.key;
  const activePlanet = PLANETS[activePlanetKey];
  const workWindow = nextHourWindow(now, activePlanetKey);

  const dateStr = now.toLocaleDateString([], {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const windowPhrase = (() => {
    if (!workWindow) return null;
    if (workWindow.status === "now") return "is open now";
    if (workWindow.status === "today") return `opens at ${workWindow.label.split(" – ")[0]}`;
    return `opens tomorrow at ${workWindow.label.split(" – ")[0]}`;
  })();

  return (
    <section className="relative mx-auto max-w-4xl px-6 pb-32 pt-12 space-y-16">
      {/* Header */}
      <header className="text-center">
        <p className="text-xs tracking-[0.4em] uppercase text-gold/70">The Daily Working</p>
        <h1 className="mt-3 font-display text-4xl md:text-5xl text-parchment">
          Under the eye of {dayPlanet.name}
        </h1>
        <p className="mt-3 text-parchment/50 text-sm tracking-widest uppercase">{dateStr}</p>
        {streak && streak.current > 0 && (
          <p className="mt-5 inline-flex items-center gap-2 rounded-sm border border-gold/30 bg-gold/5 px-5 py-2 text-sm text-gold">
            <span className="flicker">✦</span>
            {streak.current === 1
              ? "First day at the altar"
              : `${streak.current} days at the altar`}
            {streak.longest > streak.current && (
              <span className="text-parchment/40 text-xs">· best {streak.longest}</span>
            )}
          </p>
        )}
      </header>

      {/* Day & hour lords */}
      <div className="flex flex-wrap justify-center gap-4">
        <div className="rounded-sm border border-gold/30 bg-black/40 px-8 py-5 text-center">
          <div className="text-xs tracking-[0.3em] uppercase text-parchment/50 mb-1">
            Lord of the day
          </div>
          <div className="text-4xl text-gold">{dayPlanet.glyph}</div>
          <div className="font-display text-parchment mt-1">{dayPlanet.name}</div>
        </div>
        <div className="rounded-sm border border-gold/20 bg-black/30 px-8 py-5 text-center">
          <div className="text-xs tracking-[0.3em] uppercase text-parchment/50 mb-1">
            Hour now · {timeStr}
          </div>
          <div className="text-4xl text-gold">{hourPlanet.glyph}</div>
          <div className="font-display text-parchment mt-1">{hourPlanet.name}</div>
        </div>
      </div>
      <p className="-mt-8 text-center text-parchment/50 text-sm max-w-md mx-auto italic">
        {dayPlanet.domain}
      </p>

      {/* Card of the day */}
      <div className="rounded-sm border border-gold/20 bg-black/30 p-8 text-center">
        <p className="text-xs tracking-[0.4em] uppercase text-gold/70">The card of the day</p>
        <div className="mt-4 text-5xl text-gold">{card.glyph}</div>
        <h2 className="mt-3 font-display text-3xl text-parchment">
          {card.number}. {card.name}
        </h2>
        <p className="mt-1 text-xs tracking-[0.3em] uppercase text-parchment/50">
          {card.hebrew} · {card.keyword}
        </p>
        <p className="mx-auto mt-4 max-w-md font-serif text-lg italic text-parchment/80">
          {card.meaning}
        </p>
      </div>

      {/* The daily incantation */}
      <blockquote className="mx-auto max-w-xl text-center">
        <p className="font-serif text-2xl italic leading-relaxed text-gold/90">“{incantation}”</p>
      </blockquote>

      {/* Choose a working */}
      <div>
        <h2 className="mb-2 font-display text-2xl text-gold">Choose your working</h2>
        <p className="mb-6 text-parchment/55 text-sm max-w-2xl">
          Each planet rules certain hours of the day. Pick the nature of your work and the engine
          will tell you when its sphere next governs the hour.
        </p>
        <div className="flex flex-wrap gap-2">
          {Object.values(PLANETS).map((p) => {
            const isActive = p.key === activePlanetKey;
            return (
              <button
                key={p.key}
                onClick={() => setWorking(p.key)}
                className={`flex items-center gap-2 rounded-sm border px-4 py-2 text-sm transition-colors ${
                  isActive
                    ? "border-gold bg-gold/10 text-gold"
                    : "border-gold/20 bg-black/30 text-parchment/70 hover:border-gold/40"
                }`}
              >
                <span className="text-lg">{p.glyph}</span>
                <span className="font-display">{p.name}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-6 rounded-sm border border-gold/20 bg-black/30 p-6">
          {windowPhrase && (
            <p className="text-parchment">
              The hour of{" "}
              <span className="text-gold">
                {activePlanet.glyph} {activePlanet.name}
              </span>{" "}
              <span className="text-gold">{windowPhrase}</span>
              {workWindow && workWindow.status !== "now" && (
                <span className="text-parchment/50"> ({workWindow.label})</span>
              )}
              .
            </p>
          )}
          <ul className="mt-4 space-y-1.5">
            {HOUR_WORKS[activePlanetKey].map((work, i) => (
              <li key={i} className="flex gap-2 text-sm text-parchment/60">
                <span className="text-gold/50 shrink-0">·</span>
                <span>{work}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Call to the altar */}
      <div className="text-center">
        <p className="text-parchment/60 text-sm">
          When the hour is right, speak your intention and cast its seal.
        </p>
        <Link
          to="/"
          className="mt-5 inline-block rounded-sm border border-gold/40 bg-gold/10 px-8 py-2.5 text-xs tracking-[0.3em] uppercase text-gold hover:bg-gold/20"
        >
          To the altar
        </Link>
      </div>
    </section>
  );
}
