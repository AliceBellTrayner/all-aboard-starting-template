"use client";

import { useEffect, useMemo, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { getBuddyDashboardsForStarter, getPersonaById, type Persona } from "@/data/mock";
import { PersonaAvatar } from "@/components/role-switcher";

const CONFETTI_COLORS = ["#ffc83d", "#ffe27a", "#58c48a", "#2f9e6a", "#ff8fa3", "#ff6f61", "#9ee3ff", "#6f66ff", "#ffffff"];

/** Small deterministic PRNG so the confetti layout is stable across renders. */
function seeded(seed: number) {
  let t = seed;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

interface Piece {
  id: number;
  color: string;
  shape: "strip" | "dot";
  size: number;
  /** Burst pieces fly out from the centre; rain pieces fall from the top. */
  kind: "burst" | "rain";
  x: number[];
  y: number[];
  rotate: number;
  delay: number;
  duration: number;
  left: string;
  top: string;
}

function makeConfetti(): Piece[] {
  const rand = seeded(15112026);
  const pieces: Piece[] = [];
  for (let i = 0; i < 70; i++) {
    const angle = rand() * Math.PI * 2;
    const power = 120 + rand() * 170;
    const dx = Math.cos(angle) * power;
    const up = Math.min(-60, Math.sin(angle) * power - 120);
    pieces.push({
      id: i,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      shape: rand() > 0.35 ? "strip" : "dot",
      size: 6 + rand() * 6,
      kind: "burst",
      x: [0, dx * 0.7, dx],
      y: [0, up, up + 420 + rand() * 200],
      rotate: (rand() > 0.5 ? 1 : -1) * (360 + rand() * 540),
      delay: rand() * 0.15,
      duration: 2.2 + rand() * 0.9,
      left: "50%",
      top: "40%",
    });
  }
  for (let i = 0; i < 120; i++) {
    const sway = (rand() - 0.5) * 80;
    pieces.push({
      id: 100 + i,
      color: CONFETTI_COLORS[(i * 3) % CONFETTI_COLORS.length],
      shape: rand() > 0.3 ? "strip" : "dot",
      size: 6 + rand() * 6,
      kind: "rain",
      x: [0, sway, -sway * 0.6, sway * 0.4],
      y: [-30, 280, 560, 920],
      rotate: (rand() > 0.5 ? 1 : -1) * (540 + rand() * 540),
      // Spread over ~3s so it keeps raining while the card is read.
      delay: 0.15 + rand() * 3,
      duration: 3.2 + rand() * 1.6,
      left: `${rand() * 100}%`,
      top: "0%",
    });
  }
  return pieces;
}

function Confetti() {
  const pieces = useMemo(makeConfetti, []);
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          className="absolute block"
          style={{
            left: p.left,
            top: p.top,
            width: p.shape === "strip" ? p.size * 0.55 : p.size,
            height: p.shape === "strip" ? p.size * 1.4 : p.size,
            borderRadius: p.shape === "strip" ? 2 : 999,
            backgroundColor: p.color,
            boxShadow: p.color === "#ffffff" ? "0 0 0 1px rgba(23,32,58,0.08)" : undefined,
          }}
          initial={{ x: 0, y: p.y[0], opacity: 0, rotate: 0 }}
          animate={{ x: p.x, y: p.y, opacity: [0, 1, 1, 0], rotate: p.rotate }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: p.kind === "burst" ? [0.15, 0.6, 0.4, 1] : "linear",
            // Fade in fast, stay visible, fade out only at the very end.
            opacity: { duration: p.duration, delay: p.delay, times: [0, 0.06, 0.88, 1] },
          }}
        />
      ))}
    </div>
  );
}

/** Gold horseshoe badge: a lucky horseshoe, in keeping with the HorsePower horse theme. */
function HorseshoeBadge() {
  return (
    <span className="gold-fill relative flex h-20 w-20 items-center justify-center rounded-full shadow-[0_14px_30px_-10px_rgba(216,146,26,0.8)] ring-4 ring-white">
      <svg viewBox="0 0 56 56" className="h-11 w-11" aria-hidden="true">
        {/* Classic horseshoe: wide at the toe, tips curving back in at the heels. */}
        <path d="M19 9 C 7 17, 8 41, 28 45 C 48 41, 49 17, 37 9" fill="none" stroke="#7a4f00" strokeWidth="9" strokeLinecap="butt" />
        <path d="M19 9 C 7 17, 8 41, 28 45 C 48 41, 49 17, 37 9" fill="none" stroke="#fff3b8" strokeWidth="4" strokeLinecap="butt" />
        <rect x="14" y="5" width="9" height="5" rx="1.5" fill="#7a4f00" />
        <rect x="33" y="5" width="9" height="5" rx="1.5" fill="#7a4f00" />
        {[
          [13.5, 22],
          [14.5, 32],
          [42.5, 22],
          [41.5, 32],
        ].map(([cx, cy]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="1.5" fill="#7a4f00" />
        ))}
      </svg>
    </span>
  );
}

function daysUntil(isoDate: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((new Date(`${isoDate}T00:00:00`).getTime() - today.getTime()) / 86_400_000);
}

function countdownLine(starter: { startDate: string; location: string; jobTitle: string }): string {
  const days = daysUntil(starter.startDate);
  const role = `as a ${starter.jobTitle} in ${starter.location}`;
  if (days > 1) return `${days} days until your first day ${role}.`;
  if (days === 1) return `Tomorrow is your first day ${role}.`;
  if (days === 0) return `Today is your first day ${role}.`;
  return `You've started ${role}. Here's everything still to come.`;
}

function listNames(names: string[]): string {
  if (names.length <= 1) return names.join("");
  return `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
}

/**
 * First-visit celebration on the Journey page: a confetti burst, a gold
 * horseshoe and a personal welcome naming the people cheering the starter on.
 */
export function JourneyCelebration({ starterId, onDone }: { starterId: string; onDone: () => void }) {
  const reduceMotion = useReducedMotion();
  const buttonRef = useRef<HTMLButtonElement>(null);

  const starter = getPersonaById(starterId);
  const supporters: Persona[] = useMemo(() => {
    if (!starter || starter.role !== "new-starter") return [];
    const manager = getPersonaById(starter.managerId);
    const buddies = getBuddyDashboardsForStarter(starter.id)
      .map((d) => getPersonaById(d.buddyId))
      .filter((p): p is Persona => Boolean(p));
    return [manager, ...buddies].filter((p): p is Persona => Boolean(p));
  }, [starter]);

  // Focus the main action and allow Escape to continue.
  useEffect(() => {
    buttonRef.current?.focus();
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onDone();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onDone]);

  if (!starter || starter.role !== "new-starter") return null;

  return (
    <motion.div
      className="absolute inset-0 z-50 flex items-center justify-center px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.3 } }}
    >
      <button
        type="button"
        tabIndex={-1}
        aria-label="Continue to your journey"
        onClick={onDone}
        className="absolute inset-0 cursor-default bg-[#0b1630]/35 backdrop-blur-[1.5px]"
      />

      {!reduceMotion && <Confetti />}

      <motion.section
        role="dialog"
        aria-modal="true"
        aria-labelledby="celebration-title"
        aria-describedby="celebration-body"
        className="relative w-full max-w-[340px] rounded-[2rem] bg-white px-6 pb-6 pt-12 text-center shadow-[0_30px_70px_-20px_rgba(11,22,48,0.6)]"
        initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.8, y: 30 }}
        animate={reduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
        exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 10 }}
        transition={{ type: "spring", stiffness: 260, damping: 22, delay: reduceMotion ? 0 : 0.15 }}
      >
        <motion.div
          className="absolute -top-10 left-1/2 -translate-x-1/2"
          initial={reduceMotion ? false : { scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 14, delay: 0.35 }}
        >
          <HorseshoeBadge />
        </motion.div>

        <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-meadow-600">Your journey begins</p>
        <h2 id="celebration-title" className="mt-1 text-[1.7rem] font-black leading-tight tracking-tight text-ink">
          Welcome aboard, {starter.firstName}!
        </h2>
        <p id="celebration-body" className="mt-2 text-sm font-semibold leading-snug text-muted-ink">
          {countdownLine(starter)}
        </p>

        {supporters.length > 0 && (
          <div className="mt-5 rounded-3xl bg-[#f0faf3] px-4 py-3.5">
            <div className="flex justify-center -space-x-2">
              {supporters.map((p, i) => (
                <motion.span
                  key={p.id}
                  className="rounded-full ring-[3px] ring-[#f0faf3]"
                  initial={reduceMotion ? false : { scale: 0, y: 8 }}
                  animate={{ scale: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 18, delay: 0.6 + i * 0.12 }}
                >
                  <PersonaAvatar initials={p.initials} role={p.role} />
                </motion.span>
              ))}
            </div>
            <p className="mt-2 text-xs font-bold text-[#1d6b47]">
              {listNames(supporters.map((p) => p.firstName))} {supporters.length === 1 ? "is" : "are"} cheering you on
            </p>
          </div>
        )}

        <motion.button
          ref={buttonRef}
          type="button"
          onClick={onDone}
          whileTap={{ scale: 0.96 }}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 text-[15px] font-black text-white shadow-[0_16px_30px_-14px_rgba(47,43,255,0.9)] outline-none focus-visible:ring-4 focus-visible:ring-primary/35"
        >
          Let&apos;s ride
          <ArrowRight className="h-4 w-4" strokeWidth={3} />
        </motion.button>
      </motion.section>
    </motion.div>
  );
}
