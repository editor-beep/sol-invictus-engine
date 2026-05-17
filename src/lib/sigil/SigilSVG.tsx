import type { RefObject } from "react";
import type { Reading } from "./compose";

type Props = {
  reading: Reading;
  size?: number;
  animate?: boolean;
  className?: string;
  id?: string;
  svgRef?: RefObject<SVGSVGElement | null>;
};

const CX = 200;
const CY = 200;
const OUTER_R = 180;
const INNER_R = 150;
const KAMEA_SIZE = 180;

// Renders the full sigil as an SVG. 400x400 viewBox; centered at (200, 200).
export function SigilSVG({ reading, size = 420, animate = true, className, id, svgRef }: Props) {
  const { sigil } = reading;
  const cx = CX;
  const cy = CY;
  const outerR = OUTER_R;
  const innerR = INNER_R;
  const kameaSize = KAMEA_SIZE;
  const cell = kameaSize / sigil.kameaOrder;
  const kameaOriginX = cx - kameaSize / 2;
  const kameaOriginY = cy - kameaSize / 2;

  // Convert grid coords to absolute SVG points.
  const points = sigil.tracePoints.map((p) => ({
    x: kameaOriginX + p.x * cell + cell / 2,
    y: kameaOriginY + p.y * cell + cell / 2,
  }));

  const polylinePts = points.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const first = points[0];
  const last = points[points.length - 1];

  return (
    <svg
      id={id}
      ref={svgRef}
      viewBox="0 0 400 400"
      width={size}
      height={size}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={`Sigil for "${reading.intention}" — ${reading.planet.name}, ${reading.tarot.name}, ${reading.sephira.name}`}
    >
      <title>Sigil for "{reading.intention}"</title>
      <defs>
        <radialGradient id={`bg-${reading.hash}`} cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor={sigil.sephiraColor} stopOpacity="0.18" />
          <stop offset="60%" stopColor="#000" stopOpacity="0" />
        </radialGradient>
        <filter id={`glow-${reading.hash}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id={`glow-strong-${reading.hash}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Inner glow */}
      <circle cx={cx} cy={cy} r={outerR} fill={`url(#bg-${reading.hash})`} />

      <g
        className={animate ? "sigil-draw" : ""}
        stroke="oklch(0.78 0.13 80)"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter={`url(#glow-${reading.hash})`}
      >
        {/* Outer rings */}
        <g className="ring spin-slow" style={{ transformOrigin: "200px 200px" }}>
          <circle className="ring" cx={cx} cy={cy} r={outerR} strokeWidth={1} opacity={0.7} />
          <circle className="ring" cx={cx} cy={cy} r={outerR - 12} strokeWidth={0.6} opacity={0.45} />
          {/* Ring glyphs */}
          {sigil.ringGlyphs.map((g, i) => {
            const r = outerR - 6;
            const x = cx + Math.cos((g.angle * Math.PI) / 180 - Math.PI / 2) * r;
            const y = cy + Math.sin((g.angle * Math.PI) / 180 - Math.PI / 2) * r;
            return (
              <g
                key={i}
                className="ring"
                transform={`translate(${x.toFixed(2)} ${y.toFixed(2)}) rotate(${g.angle + 90}) scale(0.55)`}
              >
                <path d={g.path} strokeWidth={1.2} />
              </g>
            );
          })}
        </g>

        <circle className="ring" cx={cx} cy={cy} r={innerR} strokeWidth={0.8} opacity={0.55} />

        {/* Planetary seal at center, behind the trace */}
        <g
          className="seal"
          transform={`translate(${cx} ${cy}) scale(1.15)`}
          opacity={0.7}
          stroke="oklch(0.78 0.13 80 / 0.85)"
        >
          {sigil.sealPaths.map((d, i) => (
            <path key={i} d={d} strokeWidth={1.4} />
          ))}
        </g>

        {/* Kamea trace — the sigil itself */}
        <g
          className="trace"
          stroke={sigil.accentColor}
          strokeWidth={1.6}
          filter={`url(#glow-strong-${reading.hash})`}
        >
          {points.length > 1 && (
            <polyline points={polylinePts} fill="none" />
          )}
          {/* Head mark — small open circle at start */}
          {first && (
            <circle cx={first.x} cy={first.y} r={4} fill="none" strokeWidth={1.5} />
          )}
          {/* Foot mark — short bar at end */}
          {last && (
            <line
              x1={last.x - 5}
              y1={last.y}
              x2={last.x + 5}
              y2={last.y}
              strokeWidth={1.5}
            />
          )}
          {/* Turn dots at intermediate vertices */}
          {points.slice(1, -1).map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r={1.3} fill={sigil.accentColor} stroke="none" />
          ))}
        </g>

        {/* Tarot Hebrew glyph + planet glyph */}
        <g className="glyph" stroke="none" fill="oklch(0.78 0.13 80)">
          <text
            x={cx}
            y={cy - outerR + 26}
            textAnchor="middle"
            fontSize="18"
            fontFamily="serif"
            opacity={0.9}
          >
            {reading.planet.glyph}
          </text>
          <text
            x={cx}
            y={cy + outerR - 14}
            textAnchor="middle"
            fontSize="20"
            fontFamily="serif"
            opacity={0.9}
          >
            {reading.tarot.glyph}
          </text>
        </g>
      </g>
    </svg>
  );
}
