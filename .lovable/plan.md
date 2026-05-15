## The Invocation Engine — Plan

A dark, grimoire-styled web app where a user types an intention and receives a **uniquely computed sigil** (rendered as live SVG) plus a **full esoteric reading** drawn from real historical correspondences.

---

### Aesthetic

Dark occult grimoire: deep parchment-on-black, gold-leaf accents, hairline rules, an etched-engraving feel. Display serif (e.g. Cormorant / IM Fell) paired with a refined sans for body. Subtle grain, candle-flicker glow on the active sigil, slow drifting starfield behind. Every page feels like a leaf from a living manuscript.

---

### How a sigil is computed (the heart of it)

The intention string is run through a deterministic correspondence pipeline so every sigil is *earned* from the system, not random:

1. **Numerology** — reduce the phrase (Pythagorean) to a root number 1–9 plus master numbers 11/22/33. This drives geometry count.
2. **Planetary attribution** — root number → planet (Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn) using classical Chaldean order. Picks the **planetary kamea** (magic square) the sigil is traced on.
3. **Letter→number trace on the kamea** — the actual Agrippa method from *Three Books of Occult Philosophy*: each letter of the intention becomes a node on the planetary square; lines connect them with the traditional head/foot/turn marks.
4. **Tarot** — root number maps to a Major Arcana card; its glyph is layered into the seal border.
5. **Tree of Life** — phrase length mod 10 → Sephira; another mapping → connecting Path. The sigil is framed in that sephira's color (King/Queen scale).
6. **Chakra** — vowel ratio → chakra; provides the secondary accent hue and a bija-mantra glyph.
7. **Solomonic seal ring** — the outer ring borrows real glyph fragments from the Lesser Key (Goetia seals) and the Greater Key planetary pentacles, selected by planet.

All rendered as crisp animated SVG (paths drawn on with `stroke-dasharray`, soft gold filter glow, slow rotation on the outer ring).

---

### What the user receives per invocation

- The **sigil** (animated SVG, downloadable as SVG + PNG)
- **Planetary attribution** + current planetary day/hour
- **Tarot card** drawn (with traditional meaning)
- **Chakra** + bija mantra
- **Tree of Life** sephira & path
- **Numerology** breakdown shown step-by-step
- **AI-written invocation** — a short incantation in grimoire voice, woven from all of the above

---

### Pages (TanStack Start routes, each its own file for SSR/SEO)

```
/                    The altar — intention input, hero sigil animation
/invoke              Result page — sigil + full reading
/grimoire            Local archive of past invocations (localStorage)
/correspondences     Reference: planets, kameas, tarot, sephiroth, chakras
/about               The system explained
```

---

### Technical details

- **Stack**: TanStack Start (current template), React 19, Tailwind v4, Motion for animation, deployed to **Vercel** (template currently targets Cloudflare Workers — I'll switch the Vite/Nitro preset to Vercel and adjust `wrangler.jsonc` accordingly).
- **Sigil engine**: pure TypeScript module in `src/lib/sigil/` — `numerology.ts`, `planetary.ts`, `kamea.ts`, `tarot.ts`, `tree-of-life.ts`, `chakra.ts`, `solomonic-seals.ts`, `compose.tsx` (returns SVG). Fully deterministic — same intention always produces the same sigil.
- **Correspondence data**: real historical tables hand-encoded as JSON (planetary kameas from Agrippa, 22 Major Arcana, 10 sephiroth with King/Queen scale colors, 7 chakras with bija, Goetic/planetary seal SVG fragments redrawn from public-domain scans).
- **AI reading**: a server function calls Lovable AI Gateway (`google/gemini-3-flash-preview`) with the computed correspondences as structured input and returns the incantation + interpretation.
  - **Note on AI**: the gateway requires `LOVABLE_API_KEY`, which is provisioned by enabling **Lovable Cloud**. You said "local only" for persistence — Cloud would be enabled *only* for the AI key, not for any database/auth. The grimoire stays in `localStorage`. If you'd rather skip Cloud entirely, the alternative is a fully offline template-based incantation generator (less magical prose, but zero backend). I'll default to the Cloud-for-AI path unless you say otherwise.
- **Persistence**: `localStorage` keyed by intention hash; downloadable as SVG/PNG via canvas serialization.
- **No database, no auth, no edge functions beyond the single AI proxy.**

---

### Build order

1. Switch deploy target to Vercel; confirm preview builds.
2. Build correspondence data files + sigil engine (pure TS, unit-testable).
3. Design system tokens (grimoire palette, serif pairing, gold-glow filters).
4. `/` altar page with hero animation.
5. `/invoke` result page with full reading layout + download.
6. AI server function for incantation text.
7. `/grimoire`, `/correspondences`, `/about`.
8. Polish: page transitions, sigil draw-on animation, ambient audio toggle (optional).
