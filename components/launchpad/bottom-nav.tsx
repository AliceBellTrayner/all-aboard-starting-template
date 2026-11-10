"use client";

import { motion } from "framer-motion";
import { ListChecks, Route, UserRound, Users, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type TabId = "journey" | "tasks" | "buddy" | "profile";

const TABS: { id: TabId; label: string; icon: LucideIcon }[] = [
  { id: "journey", label: "Journey", icon: Route },
  { id: "tasks", label: "Tasks", icon: ListChecks },
  { id: "buddy", label: "Buddy", icon: Users },
  { id: "profile", label: "Profile", icon: UserRound },
];

type BottomNavProps = {
  active: TabId;
  onChange: (tab: TabId) => void;
};

export function BottomNav({ active, onChange }: BottomNavProps) {
  return (
    <nav
      aria-label="Primary"
      className="absolute inset-x-0 bottom-0 z-30 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-2"
    >
      <div className="mx-auto flex max-w-sm items-stretch justify-between rounded-[2rem] bg-white/90 p-2 shadow-[0_20px_50px_-15px_rgba(23,32,58,0.45)] ring-1 ring-ink/5 backdrop-blur-xl">
        {TABS.map(({ id, label, icon: Icon }) => {
          const isActive = id === active;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onChange(id)}
              aria-current={isActive ? "page" : undefined}
              className="relative flex flex-1 flex-col items-center gap-1 rounded-3xl px-2 py-2 outline-none focus-visible:ring-4 focus-visible:ring-primary/30"
            >
              {isActive && (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-3xl bg-primary"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              )}
              <motion.span
                className="relative z-10"
                animate={{ scale: isActive ? 1.08 : 1, y: isActive ? -1 : 0 }}
                whileTap={{ scale: 0.85 }}
                transition={{ type: "spring", stiffness: 500, damping: 22 }}
              >
                <Icon className={cn("h-6 w-6 transition-colors", isActive ? "text-white" : "text-muted-ink")} strokeWidth={2.4} />
              </motion.span>
              <span
                className={cn(
                  "relative z-10 text-[11px] font-bold tracking-wide transition-colors",
                  isActive ? "text-white" : "text-muted-ink",
                )}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
