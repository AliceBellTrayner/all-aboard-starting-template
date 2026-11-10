// Geometry for the winding journey path. All coordinates live in a 400 x 1500
// virtual canvas; the landscape and the milestone nodes scale off the same box.

export const CANVAS_W = 400;
export const CANVAS_H = 1500;

export type Point = { x: number; y: number };

/**
 * Waypoints from the bottom of the landscape to the top.
 * Index 0 and the last index are decorative stubs; the milestone nodes sit at
 * indices 1..N (see `NODE_INDEX_OFFSET`).
 */
export const WAYPOINTS: Point[] = [
  { x: 196, y: 1450 }, // start stub
  { x: 236, y: 1300 }, // milestone 0
  { x: 122, y: 1135 }, // milestone 1
  { x: 252, y: 968 }, // milestone 2
  { x: 128, y: 806 }, // milestone 3
  { x: 262, y: 646 }, // milestone 4
  { x: 150, y: 480 }, // milestone 5
  { x: 208, y: 318 }, // finish stub
];

export const NODE_INDEX_OFFSET = 1;

/** Which side of the node the label card sits on. */
export const LABEL_SIDE: ("left" | "right")[] = ["left", "right", "left", "right", "left", "right"];

type Segment = { p0: Point; c1: Point; c2: Point; p3: Point };

/** Catmull-Rom spline through the waypoints, expressed as cubic Béziers. */
function buildSegments(points: Point[]): Segment[] {
  const segments: Segment[] = [];
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const c1 = { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 };
    const c2 = { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 };
    segments.push({ p0: p1, c1, c2, p3: p2 });
  }
  return segments;
}

const SEGMENTS = buildSegments(WAYPOINTS);

/** SVG path data for the whole journey. */
export const JOURNEY_PATH_D = (() => {
  let d = `M ${WAYPOINTS[0].x} ${WAYPOINTS[0].y}`;
  for (const s of SEGMENTS) {
    d += ` C ${s.c1.x.toFixed(1)} ${s.c1.y.toFixed(1)}, ${s.c2.x.toFixed(1)} ${s.c2.y.toFixed(1)}, ${s.p3.x} ${s.p3.y}`;
  }
  return d;
})();

/**
 * Cumulative arc length at each waypoint, normalised 0..1. Used to draw the
 * gold "completed" trail up to a given milestone with exact proportions.
 */
export const WAYPOINT_FRACTIONS: number[] = (() => {
  const cumulative: number[] = [0];
  let total = 0;
  for (const s of SEGMENTS) {
    let prev = s.p0;
    const steps = 80;
    for (let i = 1; i <= steps; i++) {
      const t = i / steps;
      const mt = 1 - t;
      const x =
        mt * mt * mt * s.p0.x + 3 * mt * mt * t * s.c1.x + 3 * mt * t * t * s.c2.x + t * t * t * s.p3.x;
      const y =
        mt * mt * mt * s.p0.y + 3 * mt * mt * t * s.c1.y + 3 * mt * t * t * s.c2.y + t * t * t * s.p3.y;
      total += Math.hypot(x - prev.x, y - prev.y);
      prev = { x, y };
    }
    cumulative.push(total);
  }
  return cumulative.map((c) => c / total);
})();

/** Fraction of the path drawn when the trail should reach milestone `index`. */
export function trailFractionForMilestone(index: number): number {
  return WAYPOINT_FRACTIONS[index + NODE_INDEX_OFFSET] ?? 1;
}

/** Canvas position of milestone `index`. */
export function nodePosition(index: number): Point {
  return WAYPOINTS[index + NODE_INDEX_OFFSET];
}
