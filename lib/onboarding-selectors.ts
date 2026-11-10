import type {
  Milestone,
  MilestoneProgress,
  MilestoneStatus,
  OnboardingJourney,
  PersonaRole,
  ReadinessItem,
} from "@/types";
import { canActOnTask } from "@/lib/task-ownership";

/** Pure helpers that derive progress from raw journey and readiness data. */

export function getTaskCounts(journey: OnboardingJourney): { done: number; total: number; percent: number } {
  const total = journey.milestones.reduce((sum, m) => sum + m.tasks.length, 0);
  const done = journey.milestones.reduce(
    (sum, m) => sum + m.tasks.filter((t) => journey.completedTaskIds.includes(t.id)).length,
    0,
  );
  return { done, total, percent: total === 0 ? 0 : Math.round((done / total) * 100) };
}

/**
 * Status of each milestone. A milestone is completed when all its tasks are
 * done, the first unfinished one is current, and the rest are locked.
 */
export function getMilestoneProgress(journey: OnboardingJourney): MilestoneProgress[] {
  const firstOpen = journey.milestones.findIndex((m) => m.tasks.some((t) => !journey.completedTaskIds.includes(t.id)));
  return journey.milestones.map((m, index) => {
    const doneCount = m.tasks.filter((t) => journey.completedTaskIds.includes(t.id)).length;
    const status: MilestoneStatus = firstOpen === -1 || index < firstOpen ? "completed" : index === firstOpen ? "current" : "locked";
    return { milestoneId: m.id, status, doneCount, totalCount: m.tasks.length };
  });
}

export function getCurrentMilestone(journey: OnboardingJourney): Milestone | undefined {
  const progress = getMilestoneProgress(journey).find((p) => p.status === "current");
  return journey.milestones.find((m) => m.id === progress?.milestoneId);
}

/** Readiness score as a whole percentage. Complete items count fully. */
export function getReadinessScore(items: ReadinessItem[]): number {
  if (items.length === 0) return 0;
  const complete = items.filter((i) => i.status === "complete").length;
  return Math.round((complete / items.length) * 100);
}

/**
 * Status of each milestone as seen by one persona role.
 *
 * - "completed": every task in the milestone is done (same for every role).
 * - "current":   unlocked for this role and not yet complete.
 * - "locked":    an earlier milestone still has tasks this role must finish.
 *
 * Each role unlocks the next milestone once it has finished its own tasks in
 * the milestones before it. HR and IT tasks belong to the manager, so they
 * only hold up the manager's view.
 */
export function getViewerMilestoneStatuses(
  milestones: Milestone[],
  completedIds: ReadonlySet<string>,
  role: PersonaRole,
): MilestoneProgress[] {
  let unlocked = true;
  return milestones.map((m) => {
    const doneCount = m.tasks.filter((t) => completedIds.has(t.id)).length;
    const complete = doneCount === m.tasks.length;
    const viewerHasOpenTasks = m.tasks.some((t) => canActOnTask(t, role) && !completedIds.has(t.id));
    const status: MilestoneStatus = complete ? "completed" : unlocked ? "current" : "locked";
    if (viewerHasOpenTasks) unlocked = false;
    return { milestoneId: m.id, status, doneCount, totalCount: m.tasks.length };
  });
}
