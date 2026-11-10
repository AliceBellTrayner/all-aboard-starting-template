"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Armchair,
  ChartColumn,
  ChartPie,
  Check,
  CirclePlay,
  Gift,
  Globe,
  GraduationCap,
  HeartPulse,
  LayoutGrid,
  PiggyBank,
  Plane,
  Plus,
  Smile,
  TrendingUp,
  Users,
  UtensilsCrossed,
  X,
  type LucideIcon,
} from "lucide-react";
import { getStoreApps, isAppRecommendedFor } from "@/data/mock";
import type { AppCategory, StoreApp } from "@/types";
import { cn } from "@/lib/utils";
import { ToolShell } from "./tool-shell";

/** Presentation only: icon and tile colour per app. These are stand-ins, not brand logos. */
const APP_LOOK: Record<string, { icon: LucideIcon; bg: string }> = {
  "microsoft-365": { icon: LayoutGrid, bg: "from-[#f25022] via-[#7fba00] to-[#00a4ef]" },
  workday: { icon: Users, bg: "from-[#ffb81c] to-[#0875e1]" },
  engage: { icon: Armchair, bg: "from-[#6fd6c1] to-[#1f9c8a]" },
  edge: { icon: Globe, bg: "from-[#3ccbf4] to-[#0c59a4]" },
  "power-bi": { icon: ChartColumn, bg: "from-[#f2c811] to-[#c99a06]" },
  tableau: { icon: ChartPie, bg: "from-[#5b8ff9] to-[#1f3c88]" },
  "amex-gbt": { icon: Plane, bg: "from-[#4d9be6] to-[#006fcf]" },
  pluralsight: { icon: CirclePlay, bg: "from-[#ff8a3d] to-[#e8115a]" },
  skillsoft: { icon: GraduationCap, bg: "from-[#6a7cff] to-[#3730a3]" },
  headspace: { icon: Smile, bg: "from-[#ffb05c] to-[#f47d31]" },
  onehub: { icon: Gift, bg: "from-[#a6e05a] to-[#3f8f2e]" },
  eq: { icon: TrendingUp, bg: "from-[#ff5a4f] to-[#c4120c]" },
  "scottish-widows": { icon: PiggyBank, bg: "from-[#ff6b6b] to-[#b3122e]" },
  bupa: { icon: HeartPulse, bg: "from-[#4aa3ff] to-[#0050b4]" },
  kitchen2go: { icon: UtensilsCrossed, bg: "from-[#ffcf5c] to-[#e08e0b]" },
};

const CATEGORY_LABEL: Record<AppCategory, string> = {
  essentials: "Essentials",
  work: "Work tools",
  learning: "Learning",
  wellbeing: "Wellbeing and benefits",
};
const CATEGORY_ORDER: AppCategory[] = ["essentials", "work", "learning", "wellbeing"];

function AppIcon({ app, size = "md" }: { app: StoreApp; size?: "md" | "lg" }) {
  const look = APP_LOOK[app.id] ?? { icon: LayoutGrid, bg: "from-[#9aa6c4] to-[#5b6785]" };
  const Icon = look.icon;
  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex items-center justify-center bg-gradient-to-br text-white shadow-[inset_0_-3px_0_rgba(0,0,0,0.12)]",
        look.bg,
        size === "lg" ? "h-16 w-16 rounded-[1.25rem]" : "h-12 w-12 rounded-2xl",
      )}
    >
      <Icon className={size === "lg" ? "h-8 w-8" : "h-6 w-6"} strokeWidth={2.4} />
    </span>
  );
}

export function AppStore({
  jobTitle,
  added,
  onToggle,
  onBack,
}: {
  jobTitle: string;
  added: string[];
  onToggle: (appId: string) => void;
  onBack: () => void;
}) {
  const apps = getStoreApps();
  const [filter, setFilter] = useState<"for-you" | "all">("for-you");
  const [openId, setOpenId] = useState<string | null>(null);

  const forYou = apps.filter((a) => isAppRecommendedFor(a, jobTitle));
  const groups =
    filter === "for-you"
      ? [{ label: `Picked for ${jobTitle}s`, apps: forYou }]
      : CATEGORY_ORDER.map((c) => ({ label: CATEGORY_LABEL[c], apps: apps.filter((a) => a.category === c) }));
  const openApp = apps.find((a) => a.id === openId);

  return (
    <>
      <ToolShell
        title="App store"
        subtitle={`${added.length} added · tap an app to learn more`}
        onBack={onBack}
      >
        <div role="tablist" aria-label="Filter apps" className="mb-4 flex gap-2">
          {(
            [
              ["for-you", `For you · ${forYou.length}`],
              ["all", `All apps · ${apps.length}`],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={filter === id}
              onClick={() => setFilter(id)}
              className={cn(
                "rounded-full px-4 py-2 text-xs font-black outline-none transition-colors focus-visible:ring-4 focus-visible:ring-primary/30",
                filter === id ? "bg-ink text-white" : "bg-white text-ink ring-1 ring-ink/10",
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {groups.map((group) => (
          <section key={group.label} className="mb-5">
            <h3 className="mb-2 px-1 text-[11px] font-extrabold uppercase tracking-[0.16em] text-muted-ink">{group.label}</h3>
            <ul role="list" className="grid grid-cols-3 gap-2.5">
              {group.apps.map((app) => {
                const isAdded = added.includes(app.id);
                return (
                  <li key={app.id}>
                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setOpenId(app.id)}
                      aria-label={`${app.name}, ${app.tagline}${isAdded ? ", added" : ""}`}
                      className="relative flex h-full w-full flex-col items-center rounded-3xl bg-white px-2 pb-3 pt-3.5 text-center ring-1 ring-ink/5 outline-none focus-visible:ring-4 focus-visible:ring-primary/30"
                    >
                      <AppIcon app={app} />
                      <span className="mt-2 line-clamp-1 text-[13px] font-black text-ink">{app.name}</span>
                      <span className="line-clamp-2 text-[11px] font-semibold leading-tight text-muted-ink">{app.tagline}</span>
                      {isAdded && (
                        <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-meadow-600 text-white">
                          <Check className="h-3 w-3" strokeWidth={4} />
                        </span>
                      )}
                    </motion.button>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </ToolShell>

      {/* App detail sheet */}
      <AnimatePresence>
        {openApp && (
          <motion.div className="absolute inset-0 z-50 flex flex-col justify-end" initial={false}>
            <motion.button
              type="button"
              aria-label="Close"
              tabIndex={-1}
              onClick={() => setOpenId(null)}
              className="absolute inset-0 bg-[#0b1630]/45 backdrop-blur-[2px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.section
              role="dialog"
              aria-modal="true"
              aria-label={openApp.name}
              className="relative rounded-t-[2.25rem] bg-[#f7fbff] px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-3"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 36 }}
            >
              <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-ink/15" />
              <div className="flex items-start gap-4">
                <AppIcon app={openApp} size="lg" />
                <div className="min-w-0 flex-1">
                  <p className="text-xl font-black leading-tight text-ink">{openApp.name}</p>
                  <p className="text-sm font-semibold text-muted-ink">{openApp.tagline}</p>
                  {isAppRecommendedFor(openApp, jobTitle) && (
                    <span className="mt-1.5 inline-block rounded-full bg-gold-200 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-[#7a4f00]">
                      {openApp.recommendedFor === "everyone" ? "Everyone needs this" : `Recommended for ${jobTitle}s`}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setOpenId(null)}
                  aria-label="Close"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink/5 text-ink"
                >
                  <X className="h-5 w-5" strokeWidth={2.6} />
                </button>
              </div>
              <p className="mt-4 text-[15px] font-semibold leading-snug text-ink">{openApp.description}</p>
              <motion.button
                type="button"
                whileTap={{ scale: 0.97 }}
                onClick={() => onToggle(openApp.id)}
                className={cn(
                  "mt-5 flex w-full items-center justify-center gap-2 rounded-full px-6 py-4 text-[15px] font-black outline-none focus-visible:ring-4 focus-visible:ring-primary/35",
                  added.includes(openApp.id) ? "bg-meadow-400/15 text-meadow-600" : "bg-primary text-white",
                )}
              >
                {added.includes(openApp.id) ? (
                  <>
                    <Check className="h-5 w-5" strokeWidth={3} /> Added to your apps
                  </>
                ) : (
                  <>
                    <Plus className="h-5 w-5" strokeWidth={3} /> Add to my apps
                  </>
                )}
              </motion.button>
              {added.includes(openApp.id) && (
                <p className="mt-2 text-center text-xs font-semibold text-muted-ink">
                  It&apos;ll be installed on your laptop for day one. Tap again to remove.
                </p>
              )}
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
