"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SplashScreen } from "@/components/launchpad/splash-screen";
import { BottomNav, type TabId } from "@/components/launchpad/bottom-nav";
import { JourneyScreen } from "@/components/journey/journey-screen";
import { RoleSwitcher } from "@/components/role-switcher";

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const [tab, setTab] = useState<TabId>("journey");

  return (
    <main className="flex min-h-dvh w-full items-stretch justify-center bg-[#0e1a33] sm:items-center sm:py-8">
      <div className="relative h-dvh w-full max-w-[440px] overflow-hidden bg-[#8fd9fb] sm:h-[860px] sm:rounded-[2.5rem] sm:shadow-[0_40px_120px_-30px_rgba(0,0,0,0.7)] sm:ring-8 sm:ring-[#1b2a4a]">
        <AnimatePresence mode="wait">
          {showSplash ? (
            <motion.div
              key="splash"
              className="absolute inset-0"
              exit={{ opacity: 0, scale: 1.04 }}
              transition={{ duration: 0.45, ease: "easeInOut" }}
            >
              <SplashScreen onStart={() => setShowSplash(false)} />
            </motion.div>
          ) : (
            <motion.div
              key="app"
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {tab === "journey" ? (
                <JourneyScreen />
              ) : (
                <ComingSoon />
              )}
              <div className="absolute inset-x-0 top-0 z-40 px-4 pt-[max(0.75rem,env(safe-area-inset-top))]">
                <RoleSwitcher />
              </div>
              <BottomNav active={tab} onChange={setTab} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

/** Placeholder for tabs outside this prototype's scope. */
function ComingSoon() {
  return (
    <div className="flex h-full flex-col items-center justify-center bg-gradient-to-b from-[#e6f8ff] to-[#f4f8ff] px-8 pb-28 text-center">
      <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-muted-ink">Coming soon</p>
      <p className="mt-2 text-xl font-black text-ink">This stable is still being built</p>
      <p className="mt-2 text-sm font-semibold text-muted-ink">Head back to the Journey to keep riding.</p>
    </div>
  );
}
