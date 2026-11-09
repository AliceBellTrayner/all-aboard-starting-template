/* ---------- Line manager ---------- */

export type ReadinessStatus = "complete" | "outstanding";

export interface ReadinessItem {
  id: string;
  label: string;
  status: ReadinessStatus;
  /** Optional short note, e.g. "Due 12 Nov". */
  note?: string;
}

export interface ManagerDashboard {
  managerId: string;
  starterId: string;
  startDate: string; // ISO date
  readinessItems: ReadinessItem[];
}

/* ---------- Team buddy / job family buddy ---------- */

export interface CoffeeMeeting {
  id: string;
  withPersonaId: string;
  when: string; // ISO timestamp
  location: string;
  topic: string;
}

export interface StarterProfileSummary {
  personaId: string;
  firstName: string;
  fullName: string;
  jobTitle: string;
  team: string;
  location: string;
  startDate: string; // ISO date
  interests: string[];
}

export interface SuggestedActivity {
  id: string;
  title: string;
  detail: string;
  /** Rough time the activity takes, e.g. "15 min". */
  duration: string;
}

export interface BuddyDashboard {
  buddyId: string;
  upcomingCoffee: CoffeeMeeting | null;
  conversationSuggestions: string[];
  starterProfile: StarterProfileSummary;
  suggestedActivities: SuggestedActivity[];
}
