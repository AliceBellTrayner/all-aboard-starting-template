import type { Persona, PersonaRole, RoleDefinition } from "@/types";

/** Stable ids. Other mock files reference people by these ids, never by name. */
export const PERSONA_IDS = {
  jamesWilson: "james-wilson",
  sarahThompson: "sarah-thompson",
  markGreen: "mark-green",
  emmaDavies: "emma-davies",
} as const;

export const personas: Persona[] = [
  {
    id: PERSONA_IDS.jamesWilson,
    role: "new-starter",
    fullName: "James Wilson",
    firstName: "James",
    jobTitle: "Data Analyst",
    initials: "JW",
    location: "Leeds",
    startDate: "2026-11-15",
    team: "Customer Analytics",
    managerId: PERSONA_IDS.sarahThompson,
    interests: ["Running", "Football", "Coffee"],
  },
  {
    id: PERSONA_IDS.sarahThompson,
    role: "line-manager",
    fullName: "Sarah Thompson",
    firstName: "Sarah",
    jobTitle: "Customer Analytics Manager",
    initials: "ST",
    team: "Customer Analytics",
    directReportCount: 8,
    newStarterCount: 1,
    interests: ["Open water swimming", "Podcasts"],
  },
  {
    id: PERSONA_IDS.markGreen,
    role: "team-buddy",
    fullName: "Mark Green",
    firstName: "Mark",
    jobTitle: "Senior Data Analyst",
    initials: "MG",
    team: "Customer Analytics",
    interests: ["Cycling", "Gaming", "Travel"],
  },
  {
    id: PERSONA_IDS.emmaDavies,
    role: "job-family-buddy",
    fullName: "Emma Davies",
    firstName: "Emma",
    jobTitle: "Data Analyst",
    initials: "ED",
    joinedOn: "2026-03-09",
    interests: ["Fitness", "Data Visualisation", "Coffee"],
  },
];

export const roleDefinitions: RoleDefinition[] = [
  {
    role: "new-starter",
    label: "New Starter",
    shortLabel: "Starter",
    description: "Follow your onboarding journey from offer to day 90.",
  },
  {
    role: "line-manager",
    label: "Line Manager",
    shortLabel: "Manager",
    description: "Track readiness and support your new starter.",
  },
  {
    role: "team-buddy",
    label: "Team Buddy",
    shortLabel: "Team buddy",
    description: "Help your starter settle into the team.",
  },
  {
    role: "job-family-buddy",
    label: "Job Family Buddy",
    shortLabel: "Job buddy",
    description: "Share role know-how with your starter.",
  },
];

export const organisation = {
  name: "Lloyds Banking Group",
} as const;

/** The starter whose journey the demo follows. */
export const DEMO_STARTER_ID = PERSONA_IDS.jamesWilson;

/** Which persona the demo opens with for each role. */
export const DEFAULT_PERSONA_BY_ROLE: Record<PersonaRole, string> = {
  "new-starter": PERSONA_IDS.jamesWilson,
  "line-manager": PERSONA_IDS.sarahThompson,
  "team-buddy": PERSONA_IDS.markGreen,
  "job-family-buddy": PERSONA_IDS.emmaDavies,
};
