import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useMemo, useRef, useState } from "react";
import { z } from "zod";
import { composeReading } from "@/lib/sigil/compose";
import { SigilSVG } from "@/lib/sigil/SigilSVG";
import { generateIncantation, type IncantationOutput } from "@/lib/incantation.functions";
import { saveToGrimoire } from "@/lib/grimoire";

const Search = z.object({ q: z.string().min(1).max(300) });

export const Route = createFileRoute("/invoke")({
  validateSearch: Search,
  head: ({ match }) => {
    const q = (match.search as { q?: string })?.q ?? "";
    const title = q ? `Sigil for "${q.slice(0, 40)}" — Invocation Engine` : "Invocation";
    return {
      meta: [
        { title },
        {
          name: "description",
          content:
            "A sigil composed from planetary kameas, tarot, the Tree of Life, and the Keys of Solomon for your stated intention.",
        },
      ],
    };
  },
  component: InvokePage,
});

function InvokePage() {
  const { q } = Route.useSearch();
  const navigate = useNavigate();
  const reading = useMemo(() => composeReading(q), [q]);
  const callIncantation = useServerFn(generateIncantation);
  const [incantation, setIncantation] = useState<IncantationOutput | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    setIncantation(null);
    callIncantation({
      data: {
        intention: reading.intention,
        planet: reading.planet.name,
        planetDomain: reading.planet.domain,
        tarotName: reading.tarot.name,
        tarotMeaning: reading.tarot.meaning,
        sephira: reading.sephira.name,
        sephiraMeaning: reading.sephira.meaning,
        chakra: reading.chakra.english,
        bija: reading.chakra.bija,
        numerologyRoot: reading.numerology.root,
      },
    })
      .then((res) => {
        if (controller.signal.aborted) return;
        setIncantation(res);
      })
      .catch((e) => {
        if (controller.signal.aborted) return;
        setError(e?.message ?? "The voice failed.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    saveToGrimoire(reading);
    return () => {
      controller.abort();
    };
  }, [reading]); // callIncantation is a stable module-level ref from useServerFn

  const downloadSVG = () => {
    const svg = svgRef.current;
    if (!svg) {
      setError("Sigil not ready for download.");
      return;
    }
    const xml = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([xml], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sigil-${reading.hash}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadPNG = () => {
    const svg = svgRef.current;
    if (!svg) {
      setError("Sigil not ready for download.");
      return;
    }
    const xml = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([xml], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onerror = () => {
      URL.revokeObjectURL(url);
      setError("Could not render sigil image.");
    };
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const size = 1200;
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        URL.revokeObjectURL(url);
        setError("Canvas unavailable — try SVG instead.");
        return;
      }
      ctx.fillStyle = "oklch(0.13 0.012 60)";
      ctx.fillRect(0, 0, size, size);
      ctx.drawImage(img, 0, 0, size, size);
      canvas.toBlob((b) => {
        if (!b) {
          setError("Could not encode PNG.");
          return;
        }
        const u = URL.createObjectURL(b);
        const a = document.createElement("a");
        a.href = u;
        a.download = `sigil-${reading.hash}.png`;
        a.click();
        URL.revokeObjectURL(u);
      }, "image/png");
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  return (
    <section className="relative mx-auto max-w-6xl px-6 pb-32 pt-12">
      <div className="text-center">
        <p className="text-xs tracking-[0.4em] uppercase text-gold/70">Your invocation</p>
        <h1 className="mt-4 font-display text-3xl text-parchment md:text-4xl italic">
          “{reading.intention}”
        </h1>
      </div>

      <div className="mt-12 grid gap-12 md:grid-cols-[460px_1fr] md:items-start">
        {/* Sigil */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="absolute inset-0 -z-10 rounded-full bg-gold/5 blur-3xl" />
            <SigilSVG
              id={`sigil-${reading.hash}`}
              reading={reading}
              size={460}
              animate
              svgRef={svgRef}
            />
          </div>
          <p className="mt-2 text-center text-xs tracking-[0.3em] uppercase text-parchment/50">
            Seal {reading.hash}
          </p>
          <div className="mt-6 flex gap-2">
            <button
              onClick={downloadSVG}
              className="rounded-sm border border-gold/40 bg-gold/5 px-4 py-2 text-xs tracking-widest uppercase text-gold hover:bg-gold/15"
            >
              Download SVG
            </button>
            <button
              onClick={downloadPNG}
              className="rounded-sm border border-gold/40 bg-gold/5 px-4 py-2 text-xs tracking-widest uppercase text-gold hover:bg-gold/15"
            >
              Download PNG
            </button>
          </div>
          <button
            onClick={() => navigate({ to: "/" })}
            className="mt-3 text-xs tracking-widest uppercase text-parchment/50 hover:text-gold"
          >
            ← Speak another
          </button>
        </div>

        {/* Reading */}
        <div className="space-y-10">
          {/* Incantation */}
          <Card label="Incantation">
            {loading && (
              <div className="text-parchment/50 italic">The voice is gathering…</div>
            )}
            {error && <div className="text-blood">{error}</div>}
            {incantation && (
              <>
                <pre className="whitespace-pre-wrap font-serif text-2xl leading-relaxed text-parchment">
                  {incantation.invocation}
                </pre>
                {incantation.interpretation && (
                  <p className="mt-6 text-parchment/70 italic border-l border-gold/30 pl-4">
                    {incantation.interpretation}
                  </p>
                )}
                {incantation.charge && (
                  <p className="mt-4 text-sm tracking-wide text-gold/80">
                    ⌖ {incantation.charge}
                  </p>
                )}
              </>
            )}
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <MiniCard title="Planet" value={`${reading.planet.glyph}  ${reading.planet.name}`}>
              <p className="text-sm text-parchment/70">{reading.planet.domain}</p>
              <Meta label="Day" value={reading.planet.day} />
              <Meta label="Metal" value={reading.planet.metal} />
              <Meta label="Intelligence" value={reading.planet.intelligence} />
              <Meta label="Spirit" value={reading.planet.spirit} />
            </MiniCard>

            <MiniCard
              title="Tarot drawn"
              value={`${reading.tarot.glyph}  ${reading.tarot.name}`}
            >
              <p className="text-sm text-parchment/70">{reading.tarot.meaning}</p>
              <Meta label="Hebrew" value={reading.tarot.hebrew} />
              <Meta label="Path" value={String(reading.tarot.path)} />
              <Meta label="Keyword" value={reading.tarot.keyword} />
            </MiniCard>

            <MiniCard
              title="Tree of Life"
              value={`${reading.sephira.name} — ${reading.sephira.english}`}
            >
              <span
                className="inline-block h-3 w-12 rounded-sm"
                style={{ background: reading.sephira.color }}
              />
              <p className="mt-3 text-sm text-parchment/70">{reading.sephira.meaning}</p>
              <Meta label="Pillar" value={reading.sephira.pillar} />
              <Meta label="Path no." value={String(reading.pathConnects.pathNumber)} />
              <Meta
                label="Path connects"
                value={`${reading.pathConnects.a.name} → ${reading.pathConnects.b.name}`}
              />
            </MiniCard>

            <MiniCard
              title="Chakra"
              value={`${reading.chakra.english} — ${reading.chakra.bija}`}
            >
              <span
                className="inline-block h-3 w-12 rounded-sm"
                style={{ background: reading.chakra.color }}
              />
              <p className="mt-3 text-sm text-parchment/70">{reading.chakra.meaning}</p>
              <Meta label="Sanskrit" value={reading.chakra.sanskrit} />
              <Meta label="Element" value={reading.chakra.element} />
              <Meta label="Petals" value={String(reading.chakra.petals)} />
            </MiniCard>
          </div>

          <Card label="Numerology">
            <div className="flex flex-wrap items-baseline gap-2 text-2xl text-parchment">
              {reading.numerology.letters.map((l, i) => (
                <span key={i} className="flex flex-col items-center">
                  <span
                    className={`font-display uppercase ${l.isVowel ? "text-gold" : "text-parchment"}`}
                    title={l.isVowel ? "vowel" : "consonant"}
                  >
                    {l.char}
                  </span>
                  <span className={`text-xs ${l.isVowel ? "text-gold/60" : "text-parchment/50"}`}>
                    {l.value}
                  </span>
                </span>
              ))}
            </div>
            <p className="mt-3 text-xs text-parchment/40 tracking-wider">
              <span className="text-gold/70">Gold</span> = vowel · drives chakra selection
            </p>
            <p className="mt-6 font-display text-lg text-parchment/80">
              {reading.numerology.reductionSteps.join(" → ")}{" "}
              <span className="text-gold text-2xl">= {reading.numerology.root}</span>
              {reading.numerology.isMaster && (
                <span className="ml-2 text-xs tracking-widest uppercase text-gold/70">
                  master number
                </span>
              )}
            </p>
            <Meta label="Vowels" value={String(reading.numerology.vowelCount)} />
            <Meta label="Consonants" value={String(reading.numerology.consonantCount)} />
          </Card>

          <Card label="Hour of casting">
            <p className="text-parchment/80">
              The day belongs to{" "}
              <span className="text-gold">{reading.dayPlanet.name}</span>; this hour to{" "}
              <span className="text-gold">{reading.hourPlanet.name}</span>.
            </p>
            <p className="mt-2 text-sm text-parchment/60">
              For greatest force, charge this seal on{" "}
              <span className="text-parchment/90">{reading.planet.day}</span> in the
              hour of <span className="text-parchment/90">{reading.planet.name}</span>.
            </p>
          </Card>
        </div>
      </div>

      <div className="mt-20 text-center">
        <Link
          to="/grimoire"
          className="text-xs tracking-[0.3em] uppercase text-parchment/60 hover:text-gold"
        >
          View your grimoire →
        </Link>
      </div>
    </section>
  );
}

function Card({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-sm border border-gold/20 bg-black/30 p-7 backdrop-blur-sm">
      <div className="mb-4 text-xs tracking-[0.3em] uppercase text-gold/70">{label}</div>
      {children}
    </div>
  );
}

function MiniCard({
  title,
  value,
  children,
}: {
  title: string;
  value: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-sm border border-gold/20 bg-black/30 p-6">
      <div className="text-xs tracking-[0.3em] uppercase text-gold/60">{title}</div>
      <div className="mt-2 font-display text-xl text-parchment">{value}</div>
      <div className="mt-4 space-y-1">{children}</div>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-gold/10 py-1.5 text-sm">
      <span className="text-parchment/50 tracking-wider uppercase text-xs">{label}</span>
      <span className="text-parchment/90 text-right">{value}</span>
    </div>
  );
}
