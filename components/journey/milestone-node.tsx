"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useAnimationControls } from "framer-motion";
import { Check, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Milestone, MilestoneStatus } from "@/types";
import { CANVAS_H, CANVAS_W, type Point } from "./path-geometry";

type MilestoneNodeProps = {
  milestone: Milestone;
  index: number;
  status: MilestoneStatus;
  /** Only the furthest unlocked milestone shows the "You are here" marker. */
  showMarker: boolean;
  position: Point;
  side: "left" | "right";
  doneCount: number;
  onOpen: () => void;
};

const SPARK_ANGLES = [0, 40, 80, 120, 160, 200, 240, 280, 320];

/** Radiating gold sparkles, replayed each time `burst` changes. */
function Sparkles({ burst }: { burst: number }) {
  if (burst === 0) return null;
  return (
    <div key={burst} className="pointer-events-none absolute left-1/2 top-1/2 h-0 w-0" aria-hidden="true">
      {SPARK_ANGLES.map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        const distance = 58 + (i % 3) * 14;
        return (
          <motion.span
            key={deg}
            className="absolute -ml-[5px] -mt-[5px] block h-2.5 w-2.5 rounded-full bg-gold-400 shadow-[0_0_10px_#ffd86b]"
            initial={{ x: 0, y: 0, opacity: 1, scale: 0.4 }}
            animate={{
              x: Math.cos(rad) * distance,
              y: Math.sin(rad) * distance,
              opacity: 0,
              scale: i % 2 ? 1.1 : 0.7,
            }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: (i % 3) * 0.03 }}
          />
        );
      })}
    </div>
  );
}

export function MilestoneNode({ milestone, index, status, showMarker, position, side, doneCount, onOpen }: MilestoneNodeProps) {
  const total = milestone.tasks.length;
  const [burst, setBurst] = useState(0);
  const shakeControls = useAnimationControls();
  const prevStatus = useRef<MilestoneStatus | null>(null);

  // Celebrate the moment a milestone flips to completed.
  useEffect(() => {
    if (prevStatus.current && prevStatus.current !== "completed" && status === "completed") {
      setBurst((b) => b + 1);
    }
    prevStatus.current = status;
  }, [status]);

  const isCompleted = status === "completed";
  const isCurrent = status === "current";
  const isLocked = status === "locked";

  function handleTap() {
    if (isCompleted) setBurst((b) => b + 1);
    if (isLocked) {
      void shakeControls.start({ x: [0, -9, 9, -6, 6, -3, 3, 0], transition: { duration: 0.5 } });
    }
    onOpen();
  }

  const left = `${(position.x / CANVAS_W) * 100}%`;
  const top = `${(position.y / CANVAS_H) * 100}%`;

  return (
    <div className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left, top }}>
      {/* "You are here" marker */}
      {isCurrent && showMarker && (
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.9 }}
          animate={{ opacity: 1, y: [0, -6, 0], scale: 1 }}
          transition={{
            opacity: { duration: 0.4 },
            scale: { duration: 0.4 },
            y: { duration: 2.2, repeat: Infinity, ease: "easeInOut" },
          }}
          className="pointer-events-none absolute bottom-full left-1/2 mb-3 -translate-x-1/2 whitespace-nowrap"
        >
          <div className="flex items-center gap-1.5 rounded-full bg-ink px-3 py-1.5 text-xs font-extrabold tracking-wide text-white shadow-lg">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-meadow-400" />
            You are here
          </div>
          <div className="mx-auto h-2 w-3 bg-ink [clip-path:polygon(0_0,100%_0,50%_100%)]" />
        </motion.div>
      )}

      <motion.button
        type="button"
        onClick={handleTap}
        aria-label={`${milestone.title}, ${status === "completed" ? "completed" : status === "current" ? "in progress" : "locked"}, ${doneCount} of ${total} tasks done`}
        className="relative flex h-[76px] w-[76px] items-center justify-center rounded-full outline-none focus-visible:ring-4 focus-visible:ring-primary/40"
        animate={shakeControls}
        whileTap={{ scale: 0.86 }}
        whileHover={{ scale: 1.05 }}
      >
        {/* Pulsing halo for the current milestone */}
        {isCurrent && (
          <>
            <motion.span
              className="absolute inset-0 rounded-full bg-primary/30"
              animate={{ scale: [1, 1.7], opacity: [0.6, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
            />
            <motion.span
              className="absolute inset-0 rounded-full bg-primary/25"
              animate={{ scale: [1, 1.45], opacity: [0.7, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut", delay: 0.6 }}
            />
          </>
        )}

        {/* Gold completion ring and disc */}
        <motion.span
          className={cn(
            "absolute inset-0 rounded-full p-[5px]",
            isCompleted && "gold-ring shadow-[0_0_0_4px_rgba(255,255,255,0.7),0_14px_26px_-6px_rgba(184,116,16,0.7)]",
            isCurrent && "bg-gradient-to-b from-[#7b74ff] to-[#2f2bff] shadow-[0_0_0_4px_rgba(255,255,255,0.85),0_14px_26px_-6px_rgba(47,43,255,0.6)]",
            isLocked && "bg-[#d5dcea] shadow-[0_0_0_4px_rgba(255,255,255,0.7),0_10px_18px_-8px_rgba(23,32,58,0.35)]",
          )}
          initial={false}
          animate={isCompleted ? { scale: [1, 1.18, 1] } : { scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <span
            className={cn(
              "flex h-full w-full items-center justify-center rounded-full",
              isCompleted && "gold-fill",
              isCurrent && "bg-gradient-to-b from-[#6f66ff] to-[#2420e6]",
              isLocked && "bg-gradient-to-b from-[#e8edf7] to-[#c3cde0]",
            )}
          >
            {isCompleted && <Check className="h-9 w-9 text-[#7a4a00] drop-shadow-[0_1px_0_rgba(255,255,255,0.6)]" strokeWidth={3.5} />}
            {isCurrent && (
              <span className="text-lg font-black tabular-nums text-white">
                {doneCount}
                <span className="text-xs font-bold text-white/70">/{total}</span>
              </span>
            )}
            {isLocked && <Lock className="h-7 w-7 text-[#7d8aa8]" strokeWidth={2.6} />}
          </span>
        </motion.span>

        {/* Sheen sweep across completed nodes */}
        {isCompleted && (
          <motion.span
            className="pointer-events-none absolute inset-0 overflow-hidden rounded-full"
            aria-hidden="true"
          >
            <motion.span
              className="absolute -inset-y-2 w-6 rotate-12 bg-white/70 blur-[2px]"
              initial={{ x: -60 }}
              animate={{ x: [-60, 110] }}
              transition={{ duration: 1.1, delay: 0.3, ease: "easeInOut" }}
            />
          </motion.span>
        )}

        <AnimatePresence>{burst > 0 && <Sparkles key="sparks" burst={burst} />}</AnimatePresence>
      </motion.button>

      {/* Label card */}
      <div
        className={cn(
          "pointer-events-none absolute top-1/2 w-[150px] -translate-y-1/2",
          side === "left" ? "right-[calc(100%+6px)] text-right" : "left-[calc(100%+6px)] text-left",
        )}
      >
        <div
          className={cn(
            "rounded-2xl px-3 py-2 shadow-[0_14px_30px_-14px_rgba(23,32,58,0.45)] ring-1 ring-ink/5 backdrop-blur-md",
            isLocked ? "bg-white/70" : "bg-white/95",
          )}
        >
          <p className={cn("text-[10px] font-extrabold uppercase tracking-[0.14em]", isCompleted ? "text-[#b77a0c]" : isCurrent ? "text-primary" : "text-muted-ink")}>
            {milestone.timeframe}
          </p>
          <p className={cn("mt-0.5 text-[15px] font-black leading-tight", isLocked ? "text-muted-ink" : "text-ink")}>{milestone.title}</p>
          <p className={cn("text-xs font-semibold", isLocked ? "text-muted-ink/80" : "text-muted-ink")}>{milestone.theme}</p>
          <div className="mt-1.5">
            {isCompleted && (
              <span className="inline-flex items-center gap-1 rounded-full gold-fill px-2 py-0.5 text-[11px] font-extrabold text-[#6b3e00]">
                <Check className="h-3 w-3" strokeWidth={3.5} />
                {doneCount}/{total} done
              </span>
            )}
            {isCurrent && (
              <span className="inline-flex rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-extrabold text-primary">
                {doneCount}/{total} tasks
              </span>
            )}
            {isLocked && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-muted-ink">
                <Lock className="h-3 w-3" strokeWidth={3} />
                Locked
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
