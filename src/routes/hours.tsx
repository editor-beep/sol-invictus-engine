import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  PLANETS,
  CHALDEAN,
  DOW_TO_PLANET,
  DOW_NAMES,
  planetOfDay,
  planetOfHour,
  planetOfHourN,
} from "@/lib/sigil/planetary";
import { HOUR_WORKS, getWork } from "@/lib/sigil/planetary-works";

export const Route = createFileRoute("/hours")({
  head: () => ({
    meta: [
      { title: "Planetary Hours — Invocation Engine" },
      {
        name: "description",
        content:
          "A live clock and calendar of the planetary hours and days — the classical Chaldean system from Agrippa's Three Books of Occult Philosophy.",
      },
    ],
  }),
  component: HoursPage,
});

function HoursPage() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const dow = now.getDay();
  const currentHour = now.getHours();
  const dayPlanet = planetOfDay(now);
  const hourPlanet = planetOfHour(now);

  const hours = Array.from({ length: 24 }, (_, i) => ({
    index: i,
    planet: planetOfHourN(now, i),
    label: `${String(i).padStart(2, "0")}:00 – ${String((i + 1) % 24).padStart(2, "0")}:00`,
    isCurrent: i === currentHour,
  }));

  const week = Array.from({ length: 7 }, (_, i) => ({
    dow: i,
    name: DOW_NAMES[i],
    planet: PLANETS[DOW_TO_PLANET[i]],
    isToday: i === dow,
  }));

  const timeStr = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const dateStr = now.toLocaleDateString([], {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <section className="relative mx-auto max-w-5xl px-6 pb-32 pt-12 space-y-20">
      {/* Page header */}
      <header className="text-center">
        <p className="text-xs tracking-[0.4em] uppercase text-gold/70">Planetary Hours</p>
        <h1 className="mt-3 font-display text-4xl md:text-5xl text-parchment">
          The Clock of the Spheres
        </h1>
        <p className="mt-4 max-w-xl mx-auto text-parchment/60 text-sm">
          The Chaldean system of Agrippa divides each day into twenty-four hours, each governed
          by one of the seven classical planets in their ancient order. Work begun in the right
          hour is said to carry the stamp of its sphere.
        </p>
      </header>

      {/* Live clock */}
      <div className="text-center space-y-4">
        <div className="font-display text-6xl md:text-7xl text-gold tabular-nums tracking-tight">
          {timeStr}
        </div>
        <div className="text-parchment/60 text-sm tracking-widest uppercase">{dateStr}</div>
        <div className="mt-2 inline-flex gap-0 rounded-sm border border-gold/30 bg-black/40 overflow-hidden">
          <div className="px-8 py-5 text-center">
            <div className="text-xs tracking-[0.3em] uppercase text-parchment/50 mb-1">Day</div>
            <div className="text-4xl text-gold">{dayPlanet.glyph}</div>
            <div className="font-display text-parchment mt-1">{dayPlanet.name}</div>
          </div>
          <div className="border-l border-gold/20" />
          <div className="px-8 py-5 text-center">
            <div className="text-xs tracking-[0.3em] uppercase text-parchment/50 mb-1">Hour</div>
            <div className="text-4xl text-gold">{hourPlanet.glyph}</div>
            <div className="font-display text-parchment mt-1">{hourPlanet.name}</div>
          </div>
        </div>
        <p className="text-parchment/50 text-sm max-w-md mx-auto italic">
          {hourPlanet.domain}
        </p>
      </div>

      {/* 24-hour table */}
      <div>
        <h2 className="mb-2 font-display text-2xl text-gold">
          All twenty-four hours of this day
        </h2>
        <p className="mb-6 text-parchment/55 text-sm max-w-2xl">
          Each hour is suited to works within its planet's domain. The highlighted row is the
          current hour. On a small screen the works column is hidden — scroll right or widen the
          window to see it.
        </p>
        <div className="overflow-x-auto rounded-sm border border-gold/20">
          <table className="w-full text-sm min-w-[520px]">
            <thead>
              <tr className="border-b border-gold/15 bg-black/40">
                <th className="py-3 px-4 text-left text-xs tracking-[0.3em] uppercase text-parchment/50 w-36">
                  Hour
                </th>
                <th className="py-3 px-4 text-left text-xs tracking-[0.3em] uppercase text-parchment/50 w-40">
                  Planet
                </th>
                <th className="py-3 px-4 text-left text-xs tracking-[0.3em] uppercase text-parchment/50">
                  Works suited to this hour
                </th>
              </tr>
            </thead>
            <tbody>
              {hours.map((h) => (
                <tr
                  key={h.index}
                  className={`border-b border-gold/10 transition-colors ${
                    h.isCurrent
                      ? "bg-gold/10 border-gold/30"
                      : "hover:bg-white/[0.02]"
                  }`}
                >
                  <td className="py-2.5 px-4 font-serif text-parchment/80 tabular-nums whitespace-nowrap">
                    {h.label}
                    {h.isCurrent && (
                      <span className="ml-2 text-[10px] text-gold tracking-widest uppercase">
                        ← now
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-4">
                    <span className="inline-flex items-center gap-2">
                      <span className="text-xl text-gold">{h.planet.glyph}</span>
                      <span className="font-display text-parchment">{h.planet.name}</span>
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-parchment/60">{getWork(h.planet.key, h.index)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Weekly calendar */}
      <div>
        <h2 className="mb-2 font-display text-2xl text-gold">The seven days and their lords</h2>
        <p className="mb-6 text-parchment/55 text-sm max-w-2xl">
          Each day of the week bears the name and virtue of its planetary ruler. The first hour
          of each day belongs to that planet — and from it the remaining hours cascade in
          Chaldean order.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
          {week.map((d) => (
            <div
              key={d.dow}
              className={`rounded-sm border p-4 text-center transition-colors ${
                d.isToday
                  ? "border-gold bg-gold/10"
                  : "border-gold/20 bg-black/30 hover:border-gold/40"
              }`}
            >
              <div className="text-3xl text-gold mb-2">{d.planet.glyph}</div>
              <div className="font-display text-parchment text-sm">{d.planet.name}</div>
              <div className="mt-2 text-[10px] tracking-widest uppercase text-parchment/50">
                {d.name}
              </div>
              {d.isToday && (
                <div className="mt-1.5 text-[10px] text-gold tracking-widest uppercase">today</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Chaldean order */}
      <div>
        <h2 className="mb-2 font-display text-2xl text-gold">The Chaldean order</h2>
        <p className="mb-6 text-parchment/55 text-sm max-w-2xl">
          The hours cycle through the seven planets in this fixed sequence — from slowest to
          fastest as the ancients observed them in the sky.
        </p>
        <div className="flex flex-wrap gap-3 items-center">
          {CHALDEAN.map((key, i) => {
            const p = PLANETS[key];
            return (
              <div key={key} className="flex items-center gap-2">
                <div className="rounded-sm border border-gold/20 bg-black/30 px-4 py-3 text-center min-w-[80px]">
                  <div className="text-2xl text-gold">{p.glyph}</div>
                  <div className="font-display text-parchment text-xs mt-1">{p.name}</div>
                </div>
                {i < CHALDEAN.length - 1 && (
                  <span className="text-gold/40 text-lg">→</span>
                )}
              </div>
            );
          })}
          <span className="text-gold/40 text-lg">→ repeats</span>
        </div>
      </div>

      {/* Planet reference */}
      <div>
        <h2 className="mb-6 font-display text-2xl text-gold">What each sphere governs</h2>
        <div className="grid gap-5 md:grid-cols-2">
          {Object.values(PLANETS).map((p) => (
            <div key={p.key} className="rounded-sm border border-gold/20 bg-black/30 p-5">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl text-gold">{p.glyph}</span>
                <div>
                  <div className="font-display text-xl text-parchment">{p.name}</div>
                  <div className="text-xs tracking-widest uppercase text-parchment/50">
                    {p.day} · {p.metal}
                  </div>
                </div>
              </div>
              <p className="text-parchment/70 text-sm mb-3">{p.domain}</p>
              <ul className="space-y-1">
                {HOUR_WORKS[p.key].map((work, i) => (
                  <li key={i} className="flex gap-2 text-xs text-parchment/50">
                    <span className="text-gold/50 shrink-0">·</span>
                    <span>{work}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className="rounded-sm border border-gold/15 bg-black/20 p-6 space-y-3">
        <h3 className="font-display text-lg text-parchment">How the planetary hours are counted</h3>
        <p className="text-sm text-parchment/60">
          The seven classical planets rotate through each day in the Chaldean order. The planet
          that rules the first hour of a day gives that day its name — Sol rules Sunday's first
          hour, Luna rules Monday's, and so on. Starting from the ruling planet, each successive
          hour advances one step along the sequence. After the 24th hour, the next day's first
          hour falls naturally on the next day's planet: a self-consistent cycle that has turned
          for thousands of years.
        </p>
        <p className="text-xs text-parchment/40">
          This engine uses civil equal hours (midnight to midnight) as an approximation of the
          traditional sunrise-to-sunrise planetary hours of Agrippa. The classical reckoning
          divides daylight into 12 unequal hours and night into 12 — the two methods diverge
          by roughly 1–2 hours near the solstices.
        </p>
      </div>
    </section>
  );
}
