import type { OnboardingTask, Persona, PersonaRole, TaskDepartment, TaskOwner } from "@/types";
import { getDefaultPersonaForRole } from "@/data/mock";

/**
 * Which persona roles can action tasks with each owner.
 * HR and IT tasks are owned by the manager, who chases them and ticks them off.
 */
export const OWNER_ROLES: Record<TaskOwner, PersonaRole[]> = {
  starter: ["new-starter"],
  manager: ["line-manager"],
  buddy: ["team-buddy", "job-family-buddy"],
};

export const DEPARTMENT_LABEL: Record<TaskDepartment, string> = {
  hr: "HR",
  it: "IT",
};

/** True when the task belongs to `role`, so that role is the one to tick it off. */
export function canActOnTask(task: OnboardingTask, role: PersonaRole): boolean {
  return OWNER_ROLES[task.owner].includes(role);
}

/**
 * Label saying who should complete the task, as seen by `viewer`.
 * The viewer's own tasks read "Your task"; anyone else's name the person,
 * e.g. "James's task" (both buddies for a buddy task).
 */
export function getTaskOwnerLabel(task: OnboardingTask, viewer: Persona): string {
  if (canActOnTask(task, viewer.role)) return "Your task";
  const names = OWNER_ROLES[task.owner].map((role) => getDefaultPersonaForRole(role).firstName);
  return `${names.join(" or ")}'s task`;
}

/** Extra tag for HR and IT tasks, e.g. "HR task". Undefined for everything else. */
export function getTaskDepartmentLabel(task: OnboardingTask): string | undefined {
  return task.department ? `${DEPARTMENT_LABEL[task.department]} task` : undefined;
}
