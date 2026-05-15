import { createFileRoute } from "@tanstack/react-router";
import { PLANETS } from "@/lib/sigil/planetary";
import { MAJOR_ARCANA } from "@/lib/sigil/tarot";
import { SEPHIROTH } from "@/lib/sigil/tree-of-life";
import { CHAKRAS } from "@/lib/sigil/chakra";
import { getKamea } from "@/lib/sigil/kamea";

export const Route = createFileRoute("/correspondences")({
  head: () => ({
    meta: [
      { title: "Correspondences — Invocation Engine" },
      {
        name: "description",
        content:
          "The tables behind the engine: planetary kameas from Agrippa, the Major Arcana, the ten Sephiroth, and the seven chakras.",
      },
    ],
  }),
  component: CorrespondencesPage,
});

function CorrespondencesPage() {
  return (
    <section className="relative mx-auto max-w-5xl px-6 pb-32 pt-12 space-y-20">
      <header className="text-center">
        <p className="text-xs tracking-[0.4em] uppercase text-gold/70">Correspondences</p>
        <h1 className="mt-3 font-display text-4xl md:text-5xl text-parchment">
          The tables behind the seal
        </h1>
      </header>

      <Section title="The seven planets">
        <div className="grid gap-6 md:grid-cols-2">
          {Object.values(PLANETS).map((p) => (
            <div
              key={p.key}
              className="rounded-sm border border-gold/20 bg-black/30 p-5"
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl text-gold">{p.glyph}</span>
                <div>
                  <div className="font-display text-xl text-parchment">{p.name}</div>
                  <div className="text-xs tracking-widest uppercase text-parchment/50">
                    {p.day} · {p.metal}
                  </div>
                </div>
              </div>
              <p className="mt-3 text-parchment/70 text-sm">{p.domain}</p>
              <div className="mt-3 text-xs text-parchment/50">
                Intelligence: <span className="text-parchment/80">{p.intelligence}</span>
                <br />
                Spirit: <span className="text-parchment/80">{p.spirit}</span>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="The planetary kameas (magic squares)">
        <p className="mb-6 text-parchment/60 text-sm max-w-2xl">
          From Cornelius Agrippa's <em>Three Books of Occult Philosophy</em>. Each row,
          column, and diagonal sums to the same constant — the planet's magical number.
          Sigils are traced by walking the cells named by the letter-values of an
          intention.
        </p>
        <div className="grid gap-8 md:grid-cols-2">
          {(Object.keys(PLANETS) as Array<keyof typeof PLANETS>).map((k) => {
            const p = PLANETS[k];
            const kamea = getKamea(p.key);
            const sum =
              kamea.square[0].reduce((s, n) => s + n, 0);
            return (
              <div key={k} className="rounded-sm border border-gold/20 bg-black/30 p-5">
                <div className="flex items-baseline justify-between">
                  <div className="font-display text-lg text-parchment">
                    {p.glyph} {p.name}
                  </div>
                  <div className="text-xs tracking-widest uppercase text-gold/70">
                    order {kamea.order} · sum {sum}
                  </div>
                </div>
                <div
                  className="mt-4 grid gap-px overflow-hidden rounded-sm border border-gold/20 bg-gold/10"
                  style={{ gridTemplateColumns: `repeat(${kamea.order}, minmax(0, 1fr))` }}
                >
                  {kamea.square.flat().map((v, i) => (
                    <div
                      key={i}
                      className="bg-background text-center font-serif text-parchment/90"
                      style={{
                        padding: kamea.order > 6 ? "4px 2px" : "8px 4px",
                        fontSize: kamea.order > 6 ? "0.7rem" : "0.95rem",
                      }}
                    >
                      {v}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      <Section title="The Major Arcana">
        <div className="grid gap-3 md:grid-cols-2">
          {MAJOR_ARCANA.map((c) => (
            <div
              key={c.number}
              className="flex gap-4 rounded-sm border border-gold/15 bg-black/20 px-4 py-3"
            >
              <span className="font-display text-2xl text-gold w-10">{c.glyph}</span>
              <div className="flex-1">
                <div className="font-display text-parchment">
                  {c.number}. {c.name}{" "}
                  <span className="text-xs text-parchment/50 ml-1">{c.hebrew}</span>
                </div>
                <div className="text-sm text-parchment/65">{c.meaning}</div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="The ten Sephiroth">
        <div className="grid gap-3 md:grid-cols-2">
          {SEPHIROTH.map((s) => (
            <div
              key={s.number}
              className="flex gap-4 rounded-sm border border-gold/15 bg-black/20 px-4 py-3"
            >
              <span
                className="block h-8 w-8 shrink-0 rounded-full border border-gold/30"
                style={{ background: s.color }}
              />
              <div>
                <div className="font-display text-parchment">
                  {s.number}. {s.name}{" "}
                  <span className="text-parchment/50 text-sm">— {s.english}</span>
                </div>
                <div className="text-sm text-parchment/65">{s.meaning}</div>
                <div className="text-xs text-parchment/40 tracking-widest uppercase mt-1">
                  Pillar of {s.pillar}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="The seven chakras">
        <div className="grid gap-3 md:grid-cols-2">
          {CHAKRAS.map((c) => (
            <div
              key={c.key}
              className="flex gap-4 rounded-sm border border-gold/15 bg-black/20 px-4 py-3"
            >
              <span
                className="block h-8 w-8 shrink-0 rounded-full border border-gold/30"
                style={{ background: c.color }}
              />
              <div>
                <div className="font-display text-parchment">
                  {c.english}{" "}
                  <span className="text-parchment/50 text-sm">— {c.sanskrit}</span>
                </div>
                <div className="text-sm text-parchment/65">{c.meaning}</div>
                <div className="text-xs text-gold/70 tracking-widest uppercase mt-1">
                  Bija: {c.bija} · {c.element}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </section>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="mb-6 font-display text-2xl text-gold">{title}</h2>
      {children}
    </div>
  );
}
