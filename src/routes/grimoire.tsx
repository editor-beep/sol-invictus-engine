import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { composeReading } from "@/lib/sigil/compose";
import { SigilSVG } from "@/lib/sigil/SigilSVG";
import { loadGrimoire, removeFromGrimoire, type SavedInvocation } from "@/lib/grimoire";

export const Route = createFileRoute("/grimoire")({
  head: () => ({
    meta: [
      { title: "Your Grimoire — Invocation Engine" },
      {
        name: "description",
        content: "Every sigil you have cast, kept in your private grimoire on this device.",
      },
    ],
  }),
  component: GrimoirePage,
});

function GrimoirePage() {
  const [items, setItems] = useState<SavedInvocation[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(loadGrimoire());
    setHydrated(true);
  }, []);

  const remove = (intention: string) => {
    removeFromGrimoire(intention);
    setItems(loadGrimoire());
  };

  return (
    <section className="relative mx-auto max-w-6xl px-6 pb-32 pt-12">
      <header className="text-center">
        <p className="text-xs tracking-[0.4em] uppercase text-gold/70">Your Grimoire</p>
        <h1 className="mt-3 font-display text-4xl md:text-5xl text-parchment">
          The seals you have cast
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-parchment/60">
          Kept on this device alone. Clear your browser and they are released back to
          the silent ether.
        </p>
      </header>

      {hydrated && items.length === 0 && (
        <div className="mt-20 text-center">
          <p className="text-parchment/60">
            The pages are blank. Speak an intention to begin.
          </p>
          <Link
            to="/"
            className="mt-6 inline-block rounded-sm border border-gold/40 bg-gold/10 px-6 py-2 text-xs tracking-[0.3em] uppercase text-gold hover:bg-gold/20"
          >
            To the altar
          </Link>
        </div>
      )}

      <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => {
          const r = composeReading(item.intention, new Date(item.createdAt));
          return (
            <article
              key={item.hash}
              className="group rounded-sm border border-gold/20 bg-black/40 p-5 backdrop-blur-sm transition-colors hover:border-gold/50"
            >
              <Link to="/invoke" search={{ q: item.intention }} className="block">
                <div className="flex justify-center">
                  <SigilSVG reading={r} size={220} animate={false} />
                </div>
                <p className="mt-4 line-clamp-2 font-serif text-lg italic text-parchment">
                  “{item.intention}”
                </p>
                <p className="mt-2 text-xs tracking-widest uppercase text-parchment/50">
                  {r.planet.name} · {r.tarot.name}
                </p>
              </Link>
              <button
                onClick={() => remove(item.intention)}
                className="mt-4 text-[10px] tracking-[0.3em] uppercase text-parchment/30 hover:text-blood"
              >
                Release
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}
