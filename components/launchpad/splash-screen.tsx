"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type SplashScreenProps = {
  onStart: () => void;
};

/** Lucky horseshoe mark, used as the LaunchPad logo. */
function HorseshoeMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="shoe" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff3b8" />
          <stop offset="45%" stopColor="#ffc83d" />
          <stop offset="100%" stopColor="#c98612" />
        </linearGradient>
      </defs>
      <path
        d="M 24 16 V 52 A 26 26 0 0 0 76 52 V 16"
        fill="none"
        stroke="#0f2a4a"
        strokeOpacity="0.25"
        strokeWidth="18"
        strokeLinecap="round"
        transform="translate(0 4)"
      />
      <path d="M 24 16 V 52 A 26 26 0 0 0 76 52 V 16" fill="none" stroke="url(#shoe)" strokeWidth="16" strokeLinecap="round" />
      <path d="M 24 16 V 52 A 26 26 0 0 0 76 52 V 16" fill="none" stroke="#fff" strokeOpacity="0.55" strokeWidth="3" strokeLinecap="round" transform="translate(-3 0)" />
      {[
        [24, 34],
        [24, 46],
        [76, 34],
        [76, 46],
      ].map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="2.2" fill="#7a4d05" fillOpacity="0.55" />
      ))}
    </svg>
  );
}

function Cloud({ className, delay = 0, duration = 18 }: { className: string; delay?: number; duration?: number }) {
  return (
    <motion.svg
      viewBox="0 0 220 90"
      className={`absolute ${className}`}
      initial={{ x: -30, opacity: 0 }}
      animate={{ x: [-30, 30, -30], opacity: 0.95 }}
      transition={{
        x: { duration, repeat: Infinity, ease: "easeInOut", delay },
        opacity: { duration: 1.2, delay },
      }}
      aria-hidden="true"
    >
      <path
        d="M30 80 C8 80 6 50 28 46 C30 22 62 14 78 30 C90 8 130 8 140 34 C160 26 184 38 180 58 C214 56 216 80 192 80 Z"
        fill="#ffffff"
        fillOpacity="0.85"
      />
    </motion.svg>
  );
}

export function SplashScreen({ onStart }: SplashScreenProps) {
  return (
    <div className="relative flex h-dvh w-full flex-col overflow-hidden bg-gradient-to-b from-[#6fd0ff] via-[#a7e6ff] to-[#e9fbff] text-white">
      {/* Sun glow */}
      <motion.div
        className="absolute -top-24 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,#fff9d6_0%,rgba(255,249,214,0.6)_30%,rgba(255,249,214,0)_70%)]"
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: [1, 1.06, 1], opacity: 1 }}
        transition={{ opacity: { duration: 1.2 }, scale: { duration: 6, repeat: Infinity, ease: "easeInOut" } }}
        aria-hidden="true"
      />

      <Cloud className="top-[14%] left-[-8%] w-44" duration={16} />
      <Cloud className="top-[26%] right-[-10%] w-56" delay={2} duration={22} />
      <Cloud className="top-[8%] right-[10%] w-28 opacity-80" delay={1} duration={14} />

      {/* Brand */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-8 text-center">
        <motion.div
          initial={{ y: 40, opacity: 0, rotate: -12 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 180, damping: 14, delay: 0.15 }}
          className="relative"
        >
          <motion.div
            className="absolute inset-0 -m-6 rounded-full bg-white/40 blur-2xl"
            animate={{ opacity: [0.5, 0.9, 0.5] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            aria-hidden="true"
          />
          <motion.div
            animate={{ rotate: [0, -6, 6, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1.4 }}
            className="relative flex h-36 w-36 items-center justify-center rounded-[2.5rem] bg-white/25 shadow-[0_30px_60px_-20px_rgba(15,42,74,0.5)] ring-1 ring-white/60 backdrop-blur-sm"
          >
            <HorseshoeMark className="h-24 w-24 drop-shadow-[0_6px_10px_rgba(120,70,0,0.35)]" />
          </motion.div>
        </motion.div>

        <motion.h1
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.45, duration: 0.6, ease: "easeOut" }}
          className="mt-8 text-5xl font-black tracking-tight text-[#0f2a4a] drop-shadow-[0_2px_0_rgba(255,255,255,0.4)]"
        >
          Launch<span className="text-[#2f2bff]">Pad</span>
        </motion.h1>

        <motion.p
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-3 max-w-[22rem] text-lg font-semibold leading-snug text-[#20466e]"
        >
          Your first 90 days, one stride at a time.
        </motion.p>
      </div>

      {/* Hills */}
      <svg viewBox="0 0 400 220" preserveAspectRatio="none" className="absolute bottom-0 left-0 h-[34%] w-full" aria-hidden="true">
        <path d="M0 120 C90 60 160 70 220 100 C290 134 340 70 400 90 L400 220 L0 220 Z" fill="#7fd99a" />
        <path d="M0 150 C80 110 150 124 230 150 C300 172 350 130 400 140 L400 220 L0 220 Z" fill="#4fbf7f" />
        <path d="M0 184 C110 160 190 176 260 186 C320 194 360 176 400 180 L400 220 L0 220 Z" fill="#2f9e6a" />
      </svg>

      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.6, ease: "easeOut" }}
        className="relative z-10 flex flex-col gap-3 px-6 pb-[max(2.5rem,env(safe-area-inset-bottom))]"
      >
        <Button onClick={onStart} className="h-16 w-full text-lg" variant="default">
          Saddle up
          <ArrowRight className="h-5 w-5" />
        </Button>
        <p className="text-center text-xs font-semibold text-[#0f2a4a]/70">Demo build · mock data only</p>
      </motion.div>
    </div>
  );
}
