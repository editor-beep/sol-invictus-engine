import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Codex — How the Invocation Engine works" },
      {
        name: "description",
        content:
          "How an intention becomes a sigil: numerology, planetary attribution, kamea trace, tarot pull, Tree of Life path, chakra resonance, and Solomonic seal ring.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <section className="relative mx-auto max-w-3xl px-6 pb-32 pt-12">
      <header className="text-center">
        <p className="text-xs tracking-[0.4em] uppercase text-gold/70">The Codex</p>
        <h1 className="mt-3 font-display text-4xl md:text-5xl text-parchment">
          How a sigil is drawn
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-parchment/60">
          The engine performs no oracle of its own. It walks the same paths the
          old grimoires walked, then traces what it finds.
        </p>
      </header>

      <ol className="mt-16 space-y-10">
        <Step n={1} title="The intention is reduced">
          Each letter is given its Pythagorean value (A=1, B=2, … I=9, J=1, …). The
          sum is reduced by adding its digits until a single root remains, except
          that 11, 22 and 33 — the master numbers — are kept whole.
        </Step>
        <Step n={2} title="A planet claims it">
          The root names a planet from the seven of the classical week. That planet
          provides its kamea (magic square), its day, its metal, its angelic
          intelligence and its spirit, after Agrippa.
        </Step>
        <Step n={3} title="The seal is traced on the kamea">
          Every letter-value names a cell on the planet's square. Lines are drawn
          from cell to cell in the order of the letters — a small open circle marks
          the head, a short bar marks the foot, in the manner of the old letter-sigils
          of the Three Books of Occult Philosophy.
        </Step>
        <Step n={4} title="The tarot is consulted">
          A Major Arcana card is pulled by a stable hash of the intention seasoned
          with its root number. The card's Hebrew letter is set into the seal as
          its silent name.
        </Step>
        <Step n={5} title="A Sephira and Path are named">
          The intention's letter-count and root together choose one of the ten
          Sephiroth and one of the twenty-two Paths between them. The Sephira's
          colour stains the inner field of the seal.
        </Step>
        <Step n={6} title="A chakra answers in colour">
          The ratio of vowels to consonants names a chakra; its bija mantra and its
          colour become the accent that draws the trace itself.
        </Step>
        <Step n={7} title="Solomonic glyphs ring the seal">
          Stylised fragments inspired by the planetary pentacles of the Greater Key
          of Solomon and the seals of the Lesser Key form the slow-turning outer
          ring.
        </Step>
        <Step n={8} title="The voice speaks">
          Finally, an old voice — borrowed for the moment — composes a short
          incantation and a charging instruction in the planet's hour, woven from
          everything above.
        </Step>
      </ol>

      <div className="mt-20 rounded-sm border border-gold/20 bg-black/30 p-8 text-center">
        <h3 className="font-display text-2xl text-gold">A note on use</h3>
        <p className="mt-3 text-parchment/70">
          A sigil is a focusing-glass for attention. The engine is a tool of
          poetry, study, and contemplation. Do with it what you would do with any
          honest art: hold it lightly, take it seriously.
        </p>
        <Link
          to="/"
          className="mt-6 inline-block rounded-sm border border-gold bg-gold/10 px-6 py-2 text-xs tracking-[0.3em] uppercase text-gold hover:bg-gold hover:text-background"
        >
          Return to the altar
        </Link>
      </div>
    </section>
  );
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <li className="grid grid-cols-[60px_1fr] gap-6">
      <span className="font-display text-4xl text-gold/60 leading-none">
        {String(n).padStart(2, "0")}
      </span>
      <div>
        <h3 className="font-display text-xl text-parchment">{title}</h3>
        <p className="mt-2 text-parchment/70 leading-relaxed">{children}</p>
      </div>
    </li>
  );
}
