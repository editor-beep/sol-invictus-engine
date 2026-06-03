import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { composeReading } from "@/lib/sigil/compose";
import { SigilSVG } from "@/lib/sigil/SigilSVG";
import { ShareButton } from "@/components/ShareButton";
import { sealUrl, sigilImageUrl, shareDescription } from "@/lib/share";

const Search = z.object({ q: z.string().min(1).max(300) });

// An absolute origin is needed for OG/Twitter image and url tags to unfurl on social
// platforms. It isn't knowable from inside the SSR head(), so it comes from a build-time
// site URL when configured; otherwise the tags fall back to root-relative paths.
const SITE_ORIGIN = import.meta.env.VITE_SITE_URL ?? "";

export const Route = createFileRoute("/seal")({
  validateSearch: Search,
  head: ({ match }) => {
    const q = (match.search as { q?: string })?.q ?? "";
    if (!q) {
      return { meta: [{ title: "A Sealed Sigil — Invocation Engine" }] };
    }
    const r = composeReading(q);
    const title = `A sigil for “${q.slice(0, 60)}” — Invocation Engine`;
    const description = shareDescription({
      planet: r.planet.name,
      tarot: r.tarot.name,
      sephira: r.sephira.name,
    });
    const image = sigilImageUrl(q, SITE_ORIGIN);
    const pageUrl = sealUrl(q, SITE_ORIGIN);
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: pageUrl },
        { property: "og:image", content: image },
        { property: "og:image:type", content: "image/svg+xml" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: image },
      ],
    };
  },
  component: SealPage,
});

function SealPage() {
  const { q } = Route.useSearch();
  const reading = composeReading(q);

  return (
    <section className="relative mx-auto max-w-2xl px-6 pb-32 pt-12 text-center">
      <p className="text-xs tracking-[0.4em] uppercase text-gold/70">A sealed sigil</p>
      <h1 className="mt-4 font-display text-3xl md:text-4xl italic text-parchment">
        “{reading.intention}”
      </h1>

      <div className="relative mx-auto mt-10 w-fit">
        <div className="absolute inset-0 -z-10 rounded-full bg-gold/5 blur-3xl" />
        <SigilSVG id={`seal-${reading.hash}`} reading={reading} size={420} animate />
      </div>
      <p className="mt-3 text-xs tracking-[0.3em] uppercase text-parchment/50">
        Seal {reading.hash}
      </p>

      {/* Compact reading summary */}
      <div className="mx-auto mt-10 grid max-w-md grid-cols-3 gap-3 text-center">
        <Facet glyph={reading.planet.glyph} label="Planet" value={reading.planet.name} />
        <Facet glyph={reading.tarot.glyph} label="Tarot" value={reading.tarot.name} />
        <Facet
          glyph="✶"
          label="Sephira"
          value={reading.sephira.english}
          color={reading.sephira.color}
        />
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <ShareButton
          intention={reading.intention}
          planet={reading.planet.name}
          tarot={reading.tarot.name}
          sephira={reading.sephira.name}
        />
        <Link
          to="/invoke"
          search={{ q: reading.intention }}
          className="rounded-sm border border-gold/20 px-4 py-2 text-xs tracking-widest uppercase text-parchment/70 hover:border-gold/40 hover:text-gold"
        >
          See the full reading
        </Link>
      </div>

      {/* Acquisition loop — invite the viewer to cast their own */}
      <div className="mt-20 border-t border-gold/15 pt-10">
        <p className="text-parchment/60 text-sm">
          Every intention yields its own seal, computed from the seven planets, the tarot, and the
          Keys of Solomon.
        </p>
        <Link
          to="/"
          className="mt-6 inline-block rounded-sm border border-gold/40 bg-gold/10 px-8 py-2.5 text-xs tracking-[0.3em] uppercase text-gold hover:bg-gold/20"
        >
          Speak your own intention
        </Link>
      </div>
    </section>
  );
}

function Facet({
  glyph,
  label,
  value,
  color,
}: {
  glyph: string;
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <div className="rounded-sm border border-gold/20 bg-black/30 px-3 py-4">
      <div className="text-2xl text-gold" style={color ? { color } : undefined}>
        {glyph}
      </div>
      <div className="mt-1.5 text-[10px] tracking-[0.3em] uppercase text-parchment/50">{label}</div>
      <div className="mt-0.5 font-display text-sm text-parchment">{value}</div>
    </div>
  );
}
