// Server-only: render the deterministic sigil for an intention to a standalone SVG
// document string, used by the /og/sigil.svg endpoint in server.ts so a shared link
// carries a real image of its seal. Imported lazily (server side) to keep react-dom/
// server out of the client bundle.
import { renderToStaticMarkup } from "react-dom/server";
import { composeReading } from "./compose";
import { SigilSVG } from "./SigilSVG";

// Matches the app's near-black parchment background so the exported seal is opaque.
const BACKGROUND = "#14110b";

export function renderSigilDocument(intention: string, size = 1200): string {
  const reading = composeReading(intention);
  const body = renderToStaticMarkup(
    <SigilSVG reading={reading} size={size} animate={false} backgroundColor={BACKGROUND} />,
  );
  return `<?xml version="1.0" encoding="UTF-8"?>\n${body}`;
}
