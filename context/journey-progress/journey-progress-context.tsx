"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { DEMO_STARTER_ID, getOnboardingJourney } from "@/data/mock";
import { useUserRole } from "@/context/user-role";
import { canActOnTask } from "@/lib/task-ownership";
import { getViewerMilestoneStatuses } from "@/lib/onboarding-selectors";
import type { Milestone, MilestoneProgress, OnboardingJourney } from "@/types";

// The journey shown is always the demo starter's. Other roles view it as a reviewer.
function requireJourney(): OnboardingJourney {
  const found = getOnboardingJourney(DEMO_STARTER_ID);
  if (!found) throw new Error(`No onboarding journey for starter "${DEMO_STARTER_ID}"`);
  return found;
}
const journey: OnboardingJourney = requireJourney();

export interface JourneyProgressContextValue {
  journey: OnboardingJourney;
  milestones: Milestone[];
  /** Ids of ticked tasks. Kept in memory only, so a page reload resets them. */
  completed: ReadonlySet<string>;
  /** Status of each milestone for the current role, in milestone order. */
  statuses: MilestoneProgress[];
  /** Ticks or unticks a task. Ignored unless the current role can action it in an unlocked milestone. */
  toggleTask: (taskId: string) => void;
}

const JourneyProgressContext = createContext<JourneyProgressContextValue | null>(null);

/** Shares task progress between the Journey and Tasks tabs. Must sit inside `UserRoleProvider`. */
export function JourneyProgressProvider({ children }: { children: ReactNode }) {
  const { role } = useUserRole();
  const [completed, setCompleted] = useState<ReadonlySet<string>>(() => new Set(journey.completedTaskIds));

  // Each role unlocks the next milestone once it has finished its own tasks
  // in the milestones before it. Gold completion is shared by everyone.
  const statuses = useMemo(() => getViewerMilestoneStatuses(journey.milestones, completed, role), [completed, role]);

  const toggleTask = useCallback(
    (taskId: string) => {
      const index = journey.milestones.findIndex((m) => m.tasks.some((t) => t.id === taskId));
      const task = journey.milestones[index]?.tasks.find((t) => t.id === taskId);
      // Only unlocked milestones for this role can be ticked off.
      if (!task || statuses[index]?.status !== "current" || !canActOnTask(task, role)) return;
      setCompleted((prev) => {
        const next = new Set(prev);
        if (next.has(taskId)) next.delete(taskId);
        else next.add(taskId);
        return next;
      });
    },
    [statuses, role],
  );

  const value = useMemo<JourneyProgressContextValue>(
    () => ({ journey, milestones: journey.milestones, completed, statuses, toggleTask }),
    [completed, statuses, toggleTask],
  );

  return <JourneyProgressContext.Provider value={value}>{children}</JourneyProgressContext.Provider>;
}

/** Shared journey progress. Must be used inside `JourneyProgressProvider`. */
export function useJourneyProgress(): JourneyProgressContextValue {
  const ctx = useContext(JourneyProgressContext);
  if (!ctx) throw new Error("useJourneyProgress must be used inside <JourneyProgressProvider>");
  return ctx;
}
