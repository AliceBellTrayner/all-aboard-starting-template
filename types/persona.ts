/** The four onboarding personas supported by LaunchPad. */
export type PersonaRole = "new-starter" | "line-manager" | "team-buddy" | "job-family-buddy";

export const PERSONA_ROLES: PersonaRole[] = ["new-starter", "line-manager", "team-buddy", "job-family-buddy"];

/** Display metadata for a role. Used by the role switcher and headers. */
export interface RoleDefinition {
  role: PersonaRole;
  label: string;
  shortLabel: string;
  description: string;
}

/** Fields every persona shares. */
export interface PersonaBase {
  id: string;
  role: PersonaRole;
  fullName: string;
  firstName: string;
  jobTitle: string;
  /** Initials used in avatars when no photo is available. */
  initials: string;
  interests: string[];
}

export interface NewStarterPersona extends PersonaBase {
  role: "new-starter";
  location: string;
  startDate: string; // ISO date, e.g. "2026-11-15"
  team: string;
  managerId: string;
}

export interface LineManagerPersona extends PersonaBase {
  role: "line-manager";
  team: string;
  directReportCount: number;
  newStarterCount: number;
}

export interface TeamBuddyPersona extends PersonaBase {
  role: "team-buddy";
  team: string;
}

export interface JobFamilyBuddyPersona extends PersonaBase {
  role: "job-family-buddy";
  /** ISO date the buddy joined the organisation. */
  joinedOn: string;
}

export type Persona = NewStarterPersona | LineManagerPersona | TeamBuddyPersona | JobFamilyBuddyPersona;
