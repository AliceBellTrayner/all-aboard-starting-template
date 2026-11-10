"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { getPersonaById, organisation } from "@/data/mock";
import { useUserRole } from "@/context/user-role";
import { useJourneyProgress } from "@/context/journey-progress";
import { isOwnTask } from "@/lib/task-ownership";
import type { MilestoneStatus } from "@/types";
import { Landscape } from "./landscape";
import { JourneyPath } from "./journey-path";
import { MilestoneNode } from "./milestone-node";
import { MilestoneSheet } from "./milestone-sheet";
import {
  CANVAS_H,
  CANVAS_W,
  LABEL_SIDE,
  nodePosition,
  trailFractionForMilestone,
  WAYPOINTS,
} from "./path-geometry";

function RingProgress({ value, size = 64, stroke = 7 }: { value: number; size?: number; stroke?: number }) {
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90" aria-hidden="true">
      <defs>
        <linearGradient id="ring" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffd86b" />
          <stop offset="1" stopColor="#e59a14" />
        </linearGradient>
      </defs>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e6ecf7" strokeWidth={stroke} />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="url(#ring)"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: circumference * (1 - value) }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
      />
    </svg>
  );
}

export function JourneyScreen() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const { role, persona } = useUserRole();
  // Progress is shared with the Tasks tab, so ticks survive switching tabs.
  const { journey, milestones, completed, statuses, toggleTask } = useJourneyProgress();
  const starter = getPersonaById(journey.starterId);
  const TOTAL_TASKS = milestones.reduce((sum, m) => sum + m.tasks.length, 0);
  const [sheetIndex, setSheetIndex] = useState(0);
  const [sheetOpen, setSheetOpen] = useState(false);

  const doneTotal = useMemo(
    () => milestones.reduce((n, m) => n + m.tasks.filter((t) => completed.has(t.id)).length, 0),
    [milestones, completed],
  );

  const statusFor = (i: number): MilestoneStatus => statuses[i].status;

  // The furthest unlocked milestone is where this role is working. The
  // "You are here" marker sits on its current milestone.
  const frontier = statuses.reduce((last, s, i) => (s.status === "locked" ? last : i), -1);
  const markerIndex = statuses.reduce((last, s, i) => (s.status === "current" ? i : last), -1);
  const allComplete = statuses.every((s) => s.status === "completed");

  const trailProgress = allComplete ? 1 : trailFractionForMilestone(Math.max(frontier, 0));

  const percent = Math.round((doneTotal / TOTAL_TASKS) * 100);

  // Open tasks the viewer can action (excludes HR/IT admin tasks).
  const openForViewer = milestones.reduce(
    (n, m) => n + m.tasks.filter((t) => !completed.has(t.id) && isOwnTask(t, role)).length,
    0,
  );

  // Start the view centred on the current milestone.
  useEffect(() => {
    const scroller = scrollRef.current;
    const content = contentRef.current;
    if (!scroller || !content) return;
    const idx = Math.max(0, markerIndex >= 0 ? markerIndex : frontier);
    const y = (nodePosition(idx).y / CANVAS_H) * content.offsetHeight;
    scroller.scrollTo({ top: Math.max(0, y - scroller.clientHeight * 0.6), behavior: "auto" });
    // Only on mount: later progress changes should not yank the scroll position.
  }, []);

  const sheetMilestone = milestones[sheetIndex];
  const sheetStatus = statusFor(sheetIndex);
  const sheetPreviousTitle = sheetIndex > 0 ? milestones[sheetIndex - 1].title : undefined;

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#2c9a64]">
      <div ref={scrollRef} className="no-scrollbar absolute inset-0 overflow-y-auto overscroll-contain">
        <div ref={contentRef} className="relative w-full overflow-hidden" style={{ aspectRatio: `${CANVAS_W} / ${CANVAS_H}` }}>
          <Landscape />
          <JourneyPath progress={trailProgress} />

          {/* Start marker */}
          <div
            className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{ top: `${((WAYPOINTS[0].y - 20) / CANVAS_H) * 100}%` }}
          >
            <span className="rounded-full bg-white/90 px-3 py-1 text-[11px] font-black tracking-[0.18em] text-[#1d6b47] shadow-md">
              START
            </span>
          </div>

          {/* Finish marker */}
          <div
            className="absolute left-1/2 -translate-x-1/2 -translate-y-full"
            style={{ top: `${((WAYPOINTS[WAYPOINTS.length - 1].y - 52) / CANVAS_H) * 100}%` }}
          >
            <span className="whitespace-nowrap rounded-full bg-white/90 px-3 py-1 text-[11px] font-black tracking-wide text-[#1d4f7a] shadow-md">
              Confirmed in role
            </span>
          </div>

          {/* Milestone nodes */}
          {milestones.map((m, i) => {
            const status = statusFor(i);
            return (
              <MilestoneNode
                key={m.id}
                milestone={m}
                index={i}
                status={status}
                showMarker={i === markerIndex}
                position={nodePosition(i)}
                side={LABEL_SIDE[i]}
                doneCount={m.tasks.filter((t) => completed.has(t.id)).length}
                onOpen={() => {
                  setSheetIndex(i);
                  setSheetOpen(true);
                }}
              />
            );
          })}

          {/* Header card, floating over the sky */}
          <header className="absolute inset-x-4 top-[72px] z-20">
            <motion.div
              initial={{ y: -16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="flex items-center gap-4 rounded-[1.75rem] bg-white/80 p-4 shadow-[0_18px_40px_-18px_rgba(23,32,58,0.45)] ring-1 ring-white/70 backdrop-blur-xl"
            >
              <div className="relative flex h-16 w-16 shrink-0 items-center justify-center">
                <RingProgress value={doneTotal / TOTAL_TASKS} />
                <span className="absolute text-sm font-black tabular-nums text-ink">{percent}%</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-muted-ink">{organisation.name}</p>
                <p className="truncate text-lg font-black leading-tight text-ink">
                  {role === "new-starter" ? `Hi ${starter?.firstName ?? ""}, keep riding` : `${starter?.firstName ?? ""}'s journey`}
                </p>
                <p className="truncate text-xs font-semibold text-muted-ink">
                  {role === "new-starter"
                    ? `${doneTotal} of ${TOTAL_TASKS} tasks done · ${starter?.role === "new-starter" ? starter.location : ""}`
                    : openForViewer === 0
                      ? `Nothing needs you right now · ${doneTotal}/${TOTAL_TASKS} done`
                      : `${openForViewer} open ${openForViewer === 1 ? "task" : "tasks"} for you · ${doneTotal}/${TOTAL_TASKS} done`}
                </p>
              </div>
            </motion.div>
          </header>
        </div>

        <div className="h-36 bg-[#2c9a64]" aria-hidden="true" />
      </div>

      <MilestoneSheet
        milestone={sheetMilestone}
        status={sheetStatus}
        open={sheetOpen}
        completed={completed}
        previousTitle={sheetPreviousTitle}
        viewer={persona}
        onToggle={toggleTask}
        onClose={() => setSheetOpen(false)}
      />
    </div>
  );
}
