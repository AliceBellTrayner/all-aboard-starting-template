/**
 * Public data-access layer for LaunchPad's mock data.
 *
 * Components and hooks should import from "@/data/mock" only, never from the
 * individual files. When a real API arrives, swap the bodies of these
 * functions and the rest of the app keeps working.
 */
import type {
  BuddyDashboard,
  ManagerDashboard,
  NotificationItem,
  OnboardingJourney,
  Persona,
  PersonaRole,
  RoleDefinition,
} from "@/types";
import { DEFAULT_PERSONA_BY_ROLE, DEMO_STARTER_ID, personas, roleDefinitions } from "./personas";
import { PERSONA_ROLES } from "@/types";
import { jamesOnboardingJourney } from "./onboarding";
import { notifications } from "./notifications";
import { buddyDashboards, managerDashboards } from "./dashboards";

export { PERSONA_IDS, DEMO_STARTER_ID, organisation } from "./personas";
export { PERSONA_ROLES } from "@/types";

export function getPersonas(): Persona[] {
  return personas;
}

export function getPersonaById(id: string): Persona | undefined {
  return personas.find((p) => p.id === id);
}

/** The demo persona used when a role is selected. */
export function getDefaultPersonaForRole(role: PersonaRole): Persona {
  const persona = getPersonaById(DEFAULT_PERSONA_BY_ROLE[role]);
  if (!persona) throw new Error(`No default persona configured for role "${role}"`);
  return persona;
}

export function getRoleDefinitions(): RoleDefinition[] {
  return roleDefinitions;
}

export function getRoleDefinition(role: PersonaRole): RoleDefinition {
  const definition = roleDefinitions.find((r) => r.role === role);
  if (!definition) throw new Error(`Unknown role "${role}"`);
  return definition;
}

export function getOnboardingJourney(starterId: string = DEMO_STARTER_ID): OnboardingJourney | undefined {
  return starterId === jamesOnboardingJourney.starterId ? jamesOnboardingJourney : undefined;
}

export function getNotificationsFor(recipientId: string): NotificationItem[] {
  return notifications
    .filter((n) => n.recipientId === recipientId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function getManagerDashboard(managerId: string): ManagerDashboard | undefined {
  return managerDashboards.find((d) => d.managerId === managerId);
}

export function getBuddyDashboard(buddyId: string): BuddyDashboard | undefined {
  return buddyDashboards.find((d) => d.buddyId === buddyId);
}

/** Every buddy dashboard that supports the given starter, team buddy first. */
export function getBuddyDashboardsForStarter(starterId: string): BuddyDashboard[] {
  const order = (d: BuddyDashboard) => (getPersonaById(d.buddyId)?.role === "team-buddy" ? 0 : 1);
  return buddyDashboards.filter((d) => d.starterProfile.personaId === starterId).sort((a, b) => order(a) - order(b));
}

export type {
  BuddyDashboard,
  ManagerDashboard,
  NotificationItem,
  OnboardingJourney,
  Persona,
  PersonaRole,
  RoleDefinition,
} from "@/types";
