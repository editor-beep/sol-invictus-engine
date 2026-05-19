import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  applyLetterRules,
  COSMIC_TRUTHS,
  type LetterRule,
  type CosmicTruth,
} from "@/lib/sigil/letter-substitution";

export const Route = createFileRoute("/cipher")({
  head: () => ({
    meta: [
      { title: "Cipher — The Invocation Engine" },
      {
        name: "description",
        content:
          "Transform letters through sequential substitution rules to reveal truths encoded in reality.",
      },
    ],
  }),
  component: CipherPage,
});

const LETTERS = "abcdefghijklmnopqrstuvwxyz".split("");

function CipherPage() {
  const [rules, setRules] = useState<LetterRule[]>([]);
  const [input, setInput] = useState("");
  const [newFrom, setNewFrom] = useState("a");
  const [newTo, setNewTo] = useState("b");
  const [newNth, setNewNth] = useState("");

  const output = useMemo(() => applyLetterRules(input, rules), [input, rules]);

  const addRule = () => {
    if (newFrom === newTo) return;
    setRules((prev) => [
      ...prev,
      {
        from: newFrom,
        to: newTo,
        ...(newNth && parseInt(newNth) > 1 ? { nthOnly: parseInt(newNth) } : {}),
      },
    ]);
    setNewNth("");
  };

  const removeRule = (idx: number) =>
    setRules((prev) => prev.filter((_, j) => j !== idx));

  const loadTruth = (truth: CosmicTruth) => setInput(truth.encoded);

  return (
    <section className="relative mx-auto max-w-5xl px-6 pb-32 pt-12">
      <div className="text-center">
        <p className="text-xs tracking-[0.4em] uppercase text-gold/70">The Cipher</p>
        <h1 className="mt-4 font-display text-3xl text-parchment md:text-4xl">
          Letter Substitution
        </h1>
        <p className="mt-4 max-w-xl mx-auto text-sm text-parchment/60 leading-relaxed">
          Build rules that transform one letter into another — each rule a full pass over the
          working text, so later rules act on what earlier ones have wrought.
        </p>
      </div>

      <div className="mt-14 space-y-10">
        {/* ── Rule Builder ─────────────────────────────────────────── */}
        <div className="rounded-sm border border-gold/20 bg-black/30 p-7 backdrop-blur-sm">
          <div className="mb-5 text-xs tracking-[0.3em] uppercase text-gold/70">
            Substitution Rules
          </div>

          {rules.length === 0 && (
            <p className="mb-5 text-sm text-parchment/40 italic">
              No rules yet — all letters pass through unchanged.
            </p>
          )}

          {rules.length > 0 && (
            <ol className="mb-5 space-y-2">
              {rules.map((rule, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between gap-4 rounded-sm border border-gold/10 bg-black/20 px-4 py-3"
                >
                  <span className="text-xs text-parchment/40 w-5 shrink-0">{i + 1}.</span>
                  <span className="font-mono text-parchment text-sm tracking-widest flex-1">
                    <span className="text-gold">{rule.from}</span>
                    <span className="text-parchment/40 mx-2">→</span>
                    <span className="text-gold">{rule.to}</span>
                    {rule.nthOnly && (
                      <span className="ml-3 text-parchment/40 text-xs">
                        every {rule.nthOnly}
                      </span>
                    )}
                  </span>
                  <button
                    onClick={() => removeRule(i)}
                    className="text-parchment/30 hover:text-blood text-xs tracking-widest uppercase"
                  >
                    remove
                  </button>
                </li>
              ))}
            </ol>
          )}

          {/* Add rule form */}
          <div className="flex flex-wrap items-end gap-4 border-t border-gold/10 pt-5">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-parchment/40 tracking-widest uppercase">From</label>
              <select
                value={newFrom}
                onChange={(e) => setNewFrom(e.target.value)}
                className="rounded-sm border border-gold/30 bg-black/60 px-3 py-2 text-sm text-parchment font-mono tracking-widest focus:outline-none focus:border-gold/60"
              >
                {LETTERS.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>

            <span className="text-gold/40 text-lg mb-2">→</span>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-parchment/40 tracking-widest uppercase">To</label>
              <select
                value={newTo}
                onChange={(e) => setNewTo(e.target.value)}
                className="rounded-sm border border-gold/30 bg-black/60 px-3 py-2 text-sm text-parchment font-mono tracking-widest focus:outline-none focus:border-gold/60"
              >
                {LETTERS.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-parchment/40 tracking-widest uppercase">
                Every N<span className="normal-case text-parchment/30"> (optional)</span>
              </label>
              <input
                type="number"
                min={2}
                max={99}
                value={newNth}
                onChange={(e) => setNewNth(e.target.value)}
                placeholder="—"
                className="w-20 rounded-sm border border-gold/30 bg-black/60 px-3 py-2 text-sm text-parchment font-mono focus:outline-none focus:border-gold/60"
              />
            </div>

            <button
              onClick={addRule}
              disabled={newFrom === newTo}
              className="mb-0.5 rounded-sm border border-gold/40 bg-gold/5 px-5 py-2 text-xs tracking-widest uppercase text-gold hover:bg-gold/15 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Add Rule
            </button>

            {rules.length > 0 && (
              <button
                onClick={() => setRules([])}
                className="mb-0.5 text-xs tracking-widest uppercase text-parchment/30 hover:text-blood"
              >
                Clear all
              </button>
            )}
          </div>
        </div>

        {/* ── The Working ──────────────────────────────────────────── */}
        <div className="rounded-sm border border-gold/20 bg-black/30 p-7 backdrop-blur-sm">
          <div className="mb-5 text-xs tracking-[0.3em] uppercase text-gold/70">
            The Working
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label className="text-xs text-parchment/40 tracking-widest uppercase">Input</label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                rows={5}
                placeholder="Enter text to transform…"
                className="w-full rounded-sm border border-gold/20 bg-black/40 px-4 py-3 text-sm text-parchment/90 font-mono leading-relaxed resize-none focus:outline-none focus:border-gold/50 placeholder:text-parchment/20"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs text-parchment/40 tracking-widest uppercase">
                Transformed
              </label>
              <div className="w-full rounded-sm border border-gold/10 bg-black/20 px-4 py-3 min-h-[7.5rem] text-sm font-mono leading-relaxed break-all">
                {output ? (
                  <DiffSpan original={input} transformed={output} />
                ) : (
                  <span className="text-parchment/20 italic">awaiting text…</span>
                )}
              </div>
            </div>
          </div>

          {rules.length > 0 && input && output !== input && (
            <p className="mt-4 text-xs text-parchment/40 tracking-wider">
              <span className="text-gold">Gold letters</span> have been transformed by your rules.
            </p>
          )}
          {rules.length > 0 && input && output === input && (
            <p className="mt-4 text-xs text-parchment/40 tracking-wider italic">
              No letters matched your rules — the text is unchanged.
            </p>
          )}
        </div>

        {/* ── Mysteries ────────────────────────────────────────────── */}
        <div>
          <div className="mb-2 text-xs tracking-[0.3em] uppercase text-gold/70">
            Encoded Truths
          </div>
          <p className="mb-8 text-sm text-parchment/50 leading-relaxed">
            Each mystery below contains a truth about reality, encoded through letter substitution.
            Load the encoded text into the working area, build the correct rules, and the truth
            will reveal itself.
          </p>

          <div className="grid gap-6 md:grid-cols-2">
            {COSMIC_TRUTHS.map((truth) => {
              const solved =
                rules.length > 0 &&
                applyLetterRules(truth.encoded, rules) === truth.decoded;
              return (
                <MysteryCard
                  key={truth.id}
                  truth={truth}
                  solved={solved}
                  onLoad={() => loadTruth(truth)}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function DiffSpan({
  original,
  transformed,
}: {
  original: string;
  transformed: string;
}) {
  return (
    <>
      {transformed.split("").map((char, i) => (
        <span
          key={i}
          className={
            char !== original[i] ? "text-gold" : "text-parchment/80"
          }
        >
          {char}
        </span>
      ))}
    </>
  );
}

function MysteryCard({
  truth,
  solved,
  onLoad,
}: {
  truth: CosmicTruth;
  solved: boolean;
  onLoad: () => void;
}) {
  return (
    <div
      className={`rounded-sm border p-6 transition-colors ${
        solved ? "border-gold/50 bg-gold/5" : "border-gold/20 bg-black/30"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs tracking-[0.3em] uppercase text-gold/60">{truth.title}</div>
          <div className="mt-0.5 text-xs text-parchment/30 italic">{truth.source}</div>
        </div>
        {solved && (
          <span className="text-gold text-lg flicker shrink-0">✦</span>
        )}
      </div>

      <p className="mt-4 text-xs text-parchment/50 leading-relaxed italic">
        {truth.hint}
      </p>

      <div className="mt-4 rounded-sm bg-black/40 px-4 py-3 font-mono text-sm text-parchment/70 tracking-wide break-all">
        {truth.encoded}
      </div>

      {solved && (
        <div className="mt-3 rounded-sm border border-gold/20 bg-gold/5 px-4 py-3 font-serif text-sm text-parchment leading-relaxed">
          {truth.decoded}
        </div>
      )}

      <button
        onClick={onLoad}
        className="mt-4 text-xs tracking-widest uppercase text-parchment/40 hover:text-gold transition-colors"
      >
        Load into working →
      </button>
    </div>
  );
}
