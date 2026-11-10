"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, Lock, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Milestone, MilestoneStatus, Persona } from "@/types";
import { canActOnTask, getTaskOwnerLabel, isOwnTask } from "@/lib/task-ownership";

type MilestoneSheetProps = {
  /** Milestone to show. Kept mounted after close so the exit animation has content. */
  milestone: Milestone;
  status: MilestoneStatus;
  open: boolean;
  completed: ReadonlySet<string>;
  previousTitle?: string;
  /** The persona currently being viewed as. */
  viewer: Persona;
  onToggle: (taskId: string) => void;
  onClose: () => void;
};

export function MilestoneSheet({
  milestone,
  status,
  open,
  completed,
  previousTitle,
  viewer,
  onToggle,
  onClose,
}: MilestoneSheetProps) {
  const doneCount = milestone.tasks.filter((t) => completed.has(t.id)).length;
  const total = milestone.tasks.length;
  const pct = total ? (doneCount / total) * 100 : 0;
  const isCompleted = status === "completed";
  const isCurrent = status === "current";
  const isLocked = status === "locked";

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="absolute inset-0 z-40 flex flex-col justify-end" initial={false}>
          <motion.button
            type="button"
            aria-label="Close details"
            onClick={onClose}
            className="absolute inset-0 bg-[#0b1630]/45 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />

          <motion.section
            role="dialog"
            aria-modal="true"
            aria-label={`${milestone.title} tasks`}
            className="relative max-h-[82%] overflow-hidden rounded-t-[2.25rem] bg-[#f7fbff] pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-[0_-30px_60px_-20px_rgba(11,22,48,0.5)]"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 36 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.4 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 120) onClose();
            }}
          >
            {/* Header band */}
            <div
              className={cn(
                "relative px-6 pb-6 pt-3",
                isCompleted ? "gold-fill" : isCurrent ? "bg-gradient-to-b from-[#6f66ff] to-[#2f2bff]" : "bg-gradient-to-b from-[#e8edf7] to-[#d5dcea]",
              )}
            >
              <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-white/60" />
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/35 text-current"
              >
                <X className="h-5 w-5" strokeWidth={2.6} />
              </button>

              <p className={cn("text-[11px] font-extrabold uppercase tracking-[0.16em]", isCompleted ? "text-[#6b3e00]/80" : isCurrent ? "text-white/75" : "text-muted-ink")}>
                {milestone.timeframe} · {milestone.theme}
              </p>
              <h2 className={cn("mt-1 text-3xl font-black tracking-tight", isCompleted ? "text-[#4d2c00]" : isCurrent ? "text-white" : "text-ink")}>
                {milestone.title}
              </h2>

              <div className="mt-4 flex items-center gap-3">
                <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-black/10">
                  <motion.div
                    className={cn("h-full rounded-full", isCompleted ? "bg-[#7a4a00]/70" : isCurrent ? "bg-white" : "bg-muted-ink/50")}
                    initial={false}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  />
                </div>
                <span className={cn("text-sm font-black tabular-nums", isCompleted ? "text-[#4d2c00]" : isCurrent ? "text-white" : "text-muted-ink")}>
                  {doneCount}/{total}
                </span>
              </div>
            </div>

            {/* Body */}
            <div className="max-h-[52vh] overflow-y-auto px-5 pt-5 no-scrollbar">
              {isLocked && (
                <div className="mb-4 flex items-start gap-3 rounded-2xl bg-white p-4 ring-1 ring-ink/5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e8edf7]">
                    <Lock className="h-5 w-5 text-muted-ink" strokeWidth={2.6} />
                  </div>
                  <p className="text-sm font-semibold leading-snug text-muted-ink">
                    Unlocks when you finish your tasks in <span className="text-ink">{previousTitle ?? "the previous milestone"}</span>. Here is what is coming up.
                  </p>
                </div>
              )}

              {isCompleted && (
                <p className="mb-4 rounded-2xl gold-fill px-4 py-3 text-sm font-extrabold text-[#5a3400]">
                  Milestone complete. Nicely done, you are through the gate.
                </p>
              )}

              <ul className="flex flex-col gap-2.5 pb-4">
                {milestone.tasks.map((task, i) => {
                  const done = completed.has(task.id);
                  const mine = canActOnTask(task, viewer.role);
                  const interactive = isCurrent && mine;
                  return (
                    <motion.li
                      key={task.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 + i * 0.04 }}
                    >
                      <button
                        type="button"
                        disabled={!interactive}
                        onClick={() => onToggle(task.id)}
                        aria-pressed={interactive ? done : undefined}
                        className={cn(
                          "flex w-full items-center gap-4 rounded-2xl bg-white p-4 text-left ring-1 ring-ink/5 transition-colors",
                          interactive && "active:scale-[0.99] hover:bg-[#f2f7ff]",
                          !interactive && "cursor-default",
                        )}
                      >
                        <motion.span
                          className={cn(
                            "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                            done && isCompleted && "gold-fill text-[#6b3e00]",
                            done && !isCompleted && "bg-meadow-400 text-white",
                            !done && isLocked && "bg-[#e8edf7] text-muted-ink",
                            !done && !isLocked && "border-2 border-primary/25 bg-white text-transparent",
                          )}
                          animate={done ? { scale: [0.7, 1.15, 1] } : { scale: 1 }}
                          transition={{ duration: 0.45 }}
                        >
                          {isLocked ? <Lock className="h-4 w-4" strokeWidth={2.8} /> : <Check className="h-5 w-5" strokeWidth={3.5} />}
                        </motion.span>
                        <span className="min-w-0 flex-1">
                          <span
                            className={cn(
                              "block text-[15px] font-bold leading-snug",
                              done && !isCompleted ? "text-muted-ink line-through decoration-2" : "text-ink",
                              isLocked && "text-muted-ink",
                            )}
                          >
                            {task.title}
                          </span>
                          <span className="mt-0.5 block text-xs font-semibold text-muted-ink">{task.detail}</span>
                          <span
                            className={cn(
                              "mt-1.5 inline-flex rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide",
                              isOwnTask(task, viewer.role) ? "bg-primary/10 text-primary" : "bg-ink/5 text-muted-ink",
                            )}
                          >
                            {getTaskOwnerLabel(task, viewer)}
                          </span>
                        </span>
                      </button>
                    </motion.li>
                  );
                })}
              </ul>

              <AnimatePresence>
                {isCurrent && doneCount < total && (
                  <motion.p
                    key="hint"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="pb-4 text-center text-xs font-semibold text-muted-ink"
                  >
                    Tap a task to tick it off. Finish them all to unlock the next milestone.
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
