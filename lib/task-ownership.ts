import type { OnboardingTask, Persona, PersonaRole, TaskOwner } from "@/types";
import { getDefaultPersonaForRole } from "@/data/mock";

/**
 * Which persona roles can action tasks with each owner.
 * HR and IT tasks are administrative: they have no persona owner, so any role
 * can confirm them in the demo (standing in for HR/IT marking them done).
 */
export const OWNER_ROLES: Record<TaskOwner, PersonaRole[]> = {
  starter: ["new-starter"],
  manager: ["line-manager"],
  buddy: ["team-buddy", "job-family-buddy"],
  hr: [],
  it: [],
};

export const OWNER_LABEL: Record<TaskOwner, string> = {
  starter: "Starter",
  manager: "Manager",
  buddy: "Buddy",
  hr: "HR",
  it: "IT",
};

export function isAdminTask(task: OnboardingTask): boolean {
  return task.owner === "hr" || task.owner === "it";
}

/** True when `role` is allowed to tick this task off. */
export function canActOnTask(task: OnboardingTask, role: PersonaRole): boolean {
  return isAdminTask(task) || OWNER_ROLES[task.owner].includes(role);
}

/** True when the task belongs to `role` itself, rather than to HR, IT or someone else. */
export function isOwnTask(task: OnboardingTask, role: PersonaRole): boolean {
  return OWNER_ROLES[task.owner].includes(role);
}

/**
 * Label saying who should complete the task, as seen by `viewer`.
 * The viewer's own tasks read "Your task"; anyone else's name the person,
 * e.g. "James's task" (both buddies for a buddy task). HR and IT tasks have
 * no named person, so they stay "HR task" / "IT task".
 */
export function getTaskOwnerLabel(task: OnboardingTask, viewer: Persona): string {
  if (isAdminTask(task)) return `${OWNER_LABEL[task.owner]} task`;
  if (isOwnTask(task, viewer.role)) return "Your task";
  const names = OWNER_ROLES[task.owner].map((role) => getDefaultPersonaForRole(role).firstName);
  return `${names.join(" or ")}'s task`;
}
