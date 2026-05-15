import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { composeReading } from "@/lib/sigil/compose";
import { SigilSVG } from "@/lib/sigil/SigilSVG";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "The Altar — Invocation Engine" },
      {
        name: "description",
        content:
          "Speak an intention into the altar. The engine draws a sigil from the seven planets, tarot, Tree of Life, chakras, and the Keys of Solomon.",
      },
    ],
  }),
  component: AltarPage,
});

const SAMPLE = composeReading("Let what is true in me become visible.");

function AltarPage() {
  const navigate = useNavigate();
  const [intention, setIntention] = useState("");

  // Live preview as the user types — but keep the sample sigil if empty.
  const livePreview = useMemo(() => {
    const trimmed = intention.trim();
    if (trimmed.length < 3) return SAMPLE;
    return composeReading(trimmed);
  }, [intention]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const v = intention.trim();
    if (v.length < 3) return;
    navigate({ to: "/invoke", search: { q: v } });
  };

  return (
    <section className="relative mx-auto max-w-6xl px-6 pb-32 pt-12 md:pt-20">
      <div className="grid items-center gap-12 md:grid-cols-2">
        {/* Left — intention */}
        <div className="order-2 md:order-1">
          <p className="mb-6 text-xs tracking-[0.4em] uppercase text-gold/70">
            The Invocation Engine
          </p>
          <h1 className="font-display text-5xl leading-[1.05] text-parchment md:text-6xl">
            Name what you seek.
            <br />
            <span className="text-gold text-shadow-glow">Receive its sigil.</span>
          </h1>
          <p className="mt-6 max-w-md text-lg text-parchment/70">
            An ancient engine, woven from the planetary kameas of Agrippa, the keys of
            Solomon, the Tree of Life, the tarot, the chakras, and the silent law of
            number. Speak your intention and the seal will be drawn.
          </p>

          <form onSubmit={onSubmit} className="mt-10 space-y-4">
            <label className="block text-xs tracking-[0.3em] uppercase text-parchment/50">
              Your intention
            </label>
            <textarea
              value={intention}
              onChange={(e) => setIntention(e.target.value)}
              maxLength={300}
              placeholder="Let me move through this fear with quiet courage…"
              rows={3}
              className="w-full resize-none rounded-sm border border-gold/30 bg-black/40 px-4 py-3 font-serif text-lg text-parchment placeholder:text-parchment/30 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/40"
            />
            <div className="flex items-center justify-between">
              <span className="text-xs tracking-widest uppercase text-parchment/40">
                {intention.length} / 300
              </span>
              <button
                type="submit"
                disabled={intention.trim().length < 3}
                className="group relative inline-flex items-center gap-3 rounded-sm border border-gold bg-gold/10 px-7 py-3 text-sm tracking-[0.3em] uppercase text-gold transition-all hover:bg-gold hover:text-background hover:glow-gold disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <span>Cast the seal</span>
                <span className="text-lg leading-none">✦</span>
              </button>
            </div>
          </form>

          <div className="mt-10 hairline pt-6 text-xs tracking-widest uppercase text-parchment/40">
            <span className="text-gold/80">Tonight</span> — the day belongs to{" "}
            <span className="text-parchment/80">{livePreview.dayPlanet.name}</span>, the
            hour to{" "}
            <span className="text-parchment/80">{livePreview.hourPlanet.name}</span>.
          </div>
        </div>

        {/* Right — live sigil */}
        <div className="order-1 md:order-2 flex items-center justify-center">
          <div className="relative">
            <div className="absolute inset-0 -z-10 rounded-full bg-gold/5 blur-3xl" />
            <SigilSVG
              key={livePreview.hash}
              reading={livePreview}
              size={460}
              animate
              className="drop-shadow-[0_0_30px_oklch(0.78_0.13_80/0.25)]"
            />
            <p className="mt-2 text-center text-xs tracking-[0.3em] uppercase text-parchment/40">
              {intention.trim().length < 3
                ? "An echo of what may come"
                : `Seal of ${livePreview.planet.name} · ${livePreview.tarot.name}`}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
