import type { OnboardingTask, PersonaRole, TaskOwner } from "@/types";

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
