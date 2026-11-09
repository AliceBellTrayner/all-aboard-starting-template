"use client";

import { motion } from "framer-motion";
import { CANVAS_H, CANVAS_W, JOURNEY_PATH_D, WAYPOINTS } from "./path-geometry";

type JourneyPathProps = {
  /** 0..1 portion of the path to paint gold (up to the current milestone). */
  progress: number;
};

/** The winding trail, drawn in layers: shadow, white road, dotted future, gold progress. */
export function JourneyPath({ progress }: JourneyPathProps) {
  const finish = WAYPOINTS[WAYPOINTS.length - 1];

  return (
    <svg
      viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`}
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full overflow-visible"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="trailGold" x1="0" y1="1500" x2="0" y2="300" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#ffe27a" />
          <stop offset="0.55" stopColor="#ffc23a" />
          <stop offset="1" stopColor="#e59a14" />
        </linearGradient>
      </defs>

      {/* Ground shadow under the road */}
      <path d={JOURNEY_PATH_D} fill="none" stroke="#124a3a" strokeOpacity="0.22" strokeWidth="26" strokeLinecap="round" strokeLinejoin="round" transform="translate(0 8)" />

      {/* Road: packed sand */}
      <path d={JOURNEY_PATH_D} fill="none" stroke="#f6e7c6" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" />
      <path d={JOURNEY_PATH_D} fill="none" stroke="#ffffff" strokeOpacity="0.55" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" transform="translate(-2 -3)" />

      {/* Future steps: dotted hoofprints */}
      <path d={JOURNEY_PATH_D} fill="none" stroke="#b68b52" strokeOpacity="0.55" strokeWidth="3" strokeDasharray="1 14" strokeLinecap="round" />

      {/* Completed trail: gold, animates to the current milestone */}
      <motion.path
        key="gold-glow"
        d={JOURNEY_PATH_D}
        fill="none"
        stroke="#ffc83d"
        strokeOpacity="0.35"
        strokeWidth="30"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: progress }}
        transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.path
        key="gold-trail"
        d={JOURNEY_PATH_D}
        fill="none"
        stroke="url(#trailGold)"
        strokeWidth="14"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: progress }}
        transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Finish: a ribbon gate at the top of the trail */}
      <g transform={`translate(${finish.x} ${finish.y})`}>
        <rect x="-48" y="-6" width="6" height="92" rx="3" fill="#ffffff" fillOpacity="0.9" />
        <rect x="42" y="-6" width="6" height="92" rx="3" fill="#ffffff" fillOpacity="0.9" />
        <path d="M-52 -6 Q0 -34 52 -6 L52 22 Q0 -6 -52 22 Z" fill="#ffffff" fillOpacity="0.92" />
        <path d="M-52 -6 Q0 -34 52 -6" fill="none" stroke="#ffd166" strokeWidth="4" strokeLinecap="round" />
      </g>
    </svg>
  );
}
