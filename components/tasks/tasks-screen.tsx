"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUserRole } from "@/context/user-role";
import { useJourneyProgress } from "@/context/journey-progress";
import { canActOnTask, getTaskOwnerLabel, isOwnTask } from "@/lib/task-ownership";
import type { OnboardingTask } from "@/types";

/** Outstanding tasks only, grouped by milestone, with how-to steps for each. */
export function TasksScreen() {
  const { persona } = useUserRole();
  const { milestones, completed, statuses, toggleTask } = useJourneyProgress();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const sections = milestones
    .map((milestone, index) => ({
      milestone,
      index,
      status: statuses[index].status,
      tasks: milestone.tasks.filter((t) => !completed.has(t.id)),
    }))
    .filter((section) => section.tasks.length > 0);

  const outstanding = sections.reduce((n, s) => n + s.tasks.length, 0);
  const forViewer = sections.reduce((n, s) => n + s.tasks.filter((t) => isOwnTask(t, persona.role)).length, 0);

  return (
    <div className="no-scrollbar h-full overflow-y-auto overscroll-contain bg-gradient-to-b from-[#e6f8ff] to-[#f4f8ff] px-4 pb-32 pt-[84px]">
      <header className="px-1">
        <h1 className="text-3xl font-black tracking-tight text-ink">Tasks</h1>
        <p className="mt-1 text-sm font-semibold text-muted-ink">
          {outstanding === 0
            ? "Nothing outstanding"
            : `${outstanding} outstanding · ${forViewer === 0 ? "none for you" : `${forViewer} for you`}`}
        </p>
      </header>

      {outstanding === 0 && (
        <div className="mt-6 rounded-[1.75rem] gold-fill px-5 py-6 text-center">
          <p className="text-lg font-black text-[#4d2c00]">Every task is done</p>
          <p className="mt-1 text-sm font-bold text-[#5a3400]">The whole journey is complete. Nicely ridden.</p>
        </div>
      )}

      {sections.map(({ milestone, index, status, tasks }) => {
        const locked = status === "locked";
        const previousTitle = index > 0 ? milestones[index - 1].title : undefined;
        return (
          <section key={milestone.id} aria-labelledby={`tasks-${milestone.id}`} className="mt-6">
            <div className="flex items-end justify-between gap-3 px-1">
              <div className="min-w-0">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-muted-ink">{milestone.timeframe}</p>
                <h2 id={`tasks-${milestone.id}`} className="text-xl font-black tracking-tight text-ink">
                  {milestone.title}
                </h2>
              </div>
              <span
                className={cn(
                  "mb-0.5 inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-extrabold",
                  locked ? "bg-ink/5 text-muted-ink" : "bg-primary/10 text-primary",
                )}
              >
                {locked && <Lock className="h-3 w-3" strokeWidth={3} />}
                {locked ? "Locked" : `${tasks.length} to do`}
              </span>
            </div>

            {locked && (
              <p className="mt-1 px-1 text-xs font-semibold text-muted-ink">
                Unlocks when you finish your tasks in {previousTitle ?? "the previous milestone"}.
              </p>
            )}

            <ul className="mt-3 flex flex-col gap-2.5">
              <AnimatePresence initial={false}>
                {tasks.map((task) => (
                  <motion.li
                    key={task.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.2 }}
                  >
                    <TaskCard
                      task={task}
                      ownerLabel={getTaskOwnerLabel(task, persona)}
                      own={isOwnTask(task, persona.role)}
                      locked={locked}
                      canComplete={!locked && canActOnTask(task, persona.role)}
                      expanded={expandedId === task.id}
                      onExpand={() => setExpandedId((id) => (id === task.id ? null : task.id))}
                      onComplete={() => toggleTask(task.id)}
                    />
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          </section>
        );
      })}
    </div>
  );
}

type TaskCardProps = {
  task: OnboardingTask;
  ownerLabel: string;
  /** True when the task belongs to the persona being viewed as. */
  own: boolean;
  locked: boolean;
  canComplete: boolean;
  expanded: boolean;
  onExpand: () => void;
  onComplete: () => void;
};

function TaskCard({ task, ownerLabel, own, locked, canComplete, expanded, onExpand, onComplete }: TaskCardProps) {
  const panelId = `task-steps-${task.id}`;
  return (
    <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-ink/5">
      <button
        type="button"
        onClick={onExpand}
        aria-expanded={expanded}
        aria-controls={panelId}
        className="flex w-full items-start gap-3 p-4 text-left outline-none hover:bg-[#f2f7ff] focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-primary/30"
      >
        <span className="min-w-0 flex-1">
          <span className={cn("block text-[15px] font-bold leading-snug", locked ? "text-muted-ink" : "text-ink")}>{task.title}</span>
          <span className="mt-0.5 block text-xs font-semibold text-muted-ink">{task.detail}</span>
          <span
            className={cn(
              "mt-1.5 inline-flex rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide",
              own ? "bg-primary/10 text-primary" : "bg-ink/5 text-muted-ink",
            )}
          >
            {ownerLabel}
          </span>
        </span>
        <ChevronDown
          className={cn("mt-0.5 h-5 w-5 shrink-0 text-muted-ink transition-transform", expanded && "rotate-180")}
          strokeWidth={2.8}
          aria-hidden="true"
        />
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            id={panelId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="border-t border-ink/5 px-4 pb-4 pt-3">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-muted-ink">How to complete</p>
              <ol className="mt-2 flex flex-col gap-2">
                {task.steps.map((step, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-black tabular-nums text-primary">
                      {i + 1}
                    </span>
                    <span className="pt-0.5 text-sm font-semibold leading-snug text-ink">{step}</span>
                  </li>
                ))}
              </ol>

              {canComplete ? (
                <button
                  type="button"
                  onClick={onComplete}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-extrabold text-white outline-none active:scale-[0.99] focus-visible:ring-4 focus-visible:ring-primary/35"
                >
                  <Check className="h-4 w-4" strokeWidth={3.5} />
                  Mark as done
                </button>
              ) : (
                <p className="mt-4 rounded-xl bg-ink/5 px-3 py-2 text-xs font-semibold text-muted-ink">
                  {locked ? "You can tick this off once the milestone unlocks." : `This is ${ownerLabel}, so it is theirs to tick off.`}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
