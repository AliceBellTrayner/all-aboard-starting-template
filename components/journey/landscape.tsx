import { motion } from "framer-motion";
import { CANVAS_H, CANVAS_W } from "./path-geometry";

/** Decorative tree: trunk plus two layered canopies. */
function Tree({ x, y, s = 1, tone = "#2b8a5c" }: { x: number; y: number; s?: number; tone?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x="-3" y="10" width="6" height="22" rx="2" fill="#7a4f2a" />
      <circle cx="0" cy="0" r="22" fill={tone} />
      <circle cx="-9" cy="6" r="14" fill={tone} />
      <circle cx="10" cy="5" r="15" fill={tone} />
      <circle cx="-4" cy="-6" r="7" fill="#ffffff" fillOpacity="0.14" />
    </g>
  );
}

/** A soft cloud built from overlapping circles. */
function CloudShape({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} fill="#ffffff">
      <circle cx="0" cy="0" r="22" />
      <circle cx="26" cy="-10" r="30" />
      <circle cx="58" cy="2" r="22" />
      <rect x="-22" y="0" width="102" height="22" rx="11" />
    </g>
  );
}

/** Wooden paddock fence running along a horizontal line. */
function Fence({ y, from, to, step = 34 }: { y: number; from: number; to: number; step?: number }) {
  const posts: number[] = [];
  for (let x = from; x <= to; x += step) posts.push(x);
  return (
    <g>
      <rect x={from} y={y - 2} width={to - from} height="5" rx="2.5" fill="#f7f1e3" />
      <rect x={from} y={y + 14} width={to - from} height="5" rx="2.5" fill="#f7f1e3" />
      {posts.map((px) => (
        <rect key={px} x={px - 3} y={y - 10} width="6" height="34" rx="2" fill="#f7f1e3" />
      ))}
    </g>
  );
}

const FLOWERS: { x: number; y: number; c: string }[] = [
  { x: 24, y: 1005, c: "#ffd166" },
  { x: 58, y: 1028, c: "#ff8fa3" },
  { x: 372, y: 1140, c: "#ffd166" },
  { x: 340, y: 1168, c: "#ffffff" },
  { x: 40, y: 1290, c: "#ff8fa3" },
  { x: 366, y: 1330, c: "#ffd166" },
  { x: 92, y: 880, c: "#ffffff" },
  { x: 312, y: 760, c: "#ff8fa3" },
];

/**
 * Full-bleed landscape: sky, sun, drifting clouds, layered hills, trees and a
 * paddock fence. Drawn on the same 400 x 1500 canvas as the journey path.
 */
export function Landscape() {
  return (
    <svg
      viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`}
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="860" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#3fb2f2" />
          <stop offset="0.5" stopColor="#8fd9fb" />
          <stop offset="1" stopColor="#d9f6ff" />
        </linearGradient>
        <radialGradient id="sunGlow">
          <stop offset="0" stopColor="#fff8c9" stopOpacity="1" />
          <stop offset="0.45" stopColor="#fff8c9" stopOpacity="0.45" />
          <stop offset="1" stopColor="#fff8c9" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="meadow" x1="0" y1="700" x2="0" y2="1500" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#9be6ae" />
          <stop offset="0.5" stopColor="#56c283" />
          <stop offset="1" stopColor="#2c9a64" />
        </linearGradient>
      </defs>

      {/* Sky */}
      <rect width={CANVAS_W} height={CANVAS_H} fill="url(#sky)" />

      {/* Sun */}
      <circle cx="318" cy="170" r="140" fill="url(#sunGlow)" />
      <circle cx="318" cy="170" r="46" fill="#fff6c2" />

      {/* Drifting clouds */}
      {[
        { x: 60, y: 210, s: 0.9, d: 14 },
        { x: 330, y: 470, s: 0.75, d: 18 },
        { x: 70, y: 600, s: 0.6, d: 16 },
        { x: 290, y: 880, s: 0.7, d: 20 },
      ].map((c) => (
        <motion.g
          key={`${c.x}-${c.y}`}
          animate={{ x: [-18, 18, -18] }}
          transition={{ duration: c.d, repeat: Infinity, ease: "easeInOut" }}
          opacity={0.92}
        >
          <CloudShape x={c.x} y={c.y} s={c.s} />
        </motion.g>
      ))}

      {/* Distant mountains */}
      <path
        d="M0 640 L58 520 L104 592 L168 452 L238 606 L300 500 L352 586 L400 530 L400 760 L0 760 Z"
        fill="#a9dcf3"
        opacity="0.95"
      />
      <path d="M168 452 L192 500 L176 494 L160 510 Z" fill="#ffffff" opacity="0.85" />
      <path d="M300 500 L318 532 L304 528 L292 540 Z" fill="#ffffff" opacity="0.85" />

      {/* Rolling hills */}
      <path d="M0 760 C100 690 200 700 260 740 C320 770 360 730 400 720 L400 1500 L0 1500 Z" fill="#8ad99c" />
      <path d="M0 900 C120 830 220 860 300 900 C340 920 370 900 400 890 L400 1500 L0 1500 Z" fill="#62c586" />

      {/* Distant trees on the ridge */}
      <Tree x={28} y={842} s={0.8} tone="#58b87c" />
      <Tree x={58} y={856} s={0.6} tone="#58b87c" />
      <Tree x={362} y={842} s={0.85} tone="#58b87c" />
      <Tree x={340} y={860} s={0.6} tone="#58b87c" />

      <path d="M0 1120 C90 1060 230 1070 400 1110 L400 1500 L0 1500 Z" fill="#41ad72" />
      <path d="M0 1260 C120 1210 260 1230 400 1260 L400 1500 L0 1500 Z" fill="url(#meadow)" />

      {/* Paddock fence */}
      <Fence y={1392} from={-10} to={410} />

      {/* Trees framing the lower meadow */}
      <Tree x={24} y={1080} s={1.05} />
      <Tree x={60} y={1098} s={0.8} />
      <Tree x={382} y={1076} s={1.1} />
      <Tree x={350} y={1096} s={0.82} />
      <Tree x={20} y={1236} s={0.9} />
      <Tree x={384} y={1236} s={0.95} />

      {/* Flowers */}
      {FLOWERS.map((f) => (
        <g key={`${f.x}-${f.y}`} fill={f.c}>
          <circle cx={f.x} cy={f.y} r="3.4" />
          <circle cx={f.x + 4} cy={f.y + 2} r="2.4" />
          <circle cx={f.x - 4} cy={f.y + 2} r="2.4" />
        </g>
      ))}
    </svg>
  );
}
