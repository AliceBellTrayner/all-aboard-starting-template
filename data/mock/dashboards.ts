import type { BuddyDashboard, ManagerDashboard } from "@/types";
import { PERSONA_IDS } from "./personas";

/** Sarah's readiness view for James. Score is derived in lib/onboarding-selectors.ts. */
export const managerDashboards: ManagerDashboard[] = [
  {
    managerId: PERSONA_IDS.sarahThompson,
    starterId: PERSONA_IDS.jamesWilson,
    startDate: "2026-11-15",
    readinessItems: [
      { id: "r-buddy", label: "Team buddy assigned", status: "complete", note: "Mark Green" },
      { id: "r-device", label: "Device ordered", status: "complete", note: "Laptop approved" },
      { id: "r-welcome", label: "Welcome pack sent", status: "complete" },
      { id: "r-goals", label: "90-day goals not yet published", status: "outstanding", note: "Due 13 Nov" },
      { id: "r-desk", label: "Desk booking pending", status: "outstanding", note: "Leeds, Day One" },
    ],
  },
];

export const buddyDashboards: BuddyDashboard[] = [
  {
    buddyId: PERSONA_IDS.markGreen,
    upcomingCoffee: {
      id: "coffee-mark-james",
      withPersonaId: PERSONA_IDS.jamesWilson,
      when: "2026-11-12T10:30:00.000Z",
      location: "Leeds, Level 4 kitchen",
      topic: "Settling in and first-week priorities",
    },
    conversationSuggestions: [
      "What are you most looking forward to in your first month?",
      "Have you tried the cycle routes around the river yet?",
      "Any Football teams you follow? The Leeds fixtures are a good way in.",
      "How do you take your coffee? Let's find the best cup in the building.",
    ],
    starterProfile: {
      personaId: PERSONA_IDS.jamesWilson,
      firstName: "James",
      fullName: "James Wilson",
      jobTitle: "Data Analyst",
      team: "Customer Analytics",
      location: "Leeds",
      startDate: "2026-11-15",
      interests: ["Running", "Football", "Coffee"],
    },
    suggestedActivities: [
      {
        id: "act-tour",
        title: "Lead the office tour",
        detail: "Walk James through facilities, fire exits and the kitchen.",
        duration: "20 min",
      },
      {
        id: "act-lunch",
        title: "Team lunch invite",
        detail: "Invite James to the Friday team lunch to meet the wider group.",
        duration: "1 hour",
      },
      {
        id: "act-run",
        title: "Lunchtime run club",
        detail: "Suggest the Tuesday lunchtime run around the canal. James mentioned running.",
        duration: "30 min",
      },
    ],
  },
  {
    buddyId: PERSONA_IDS.emmaDavies,
    upcomingCoffee: null,
    conversationSuggestions: [
      "Which dashboard tool did you learn first, and what would you choose now?",
      "What does a typical week look like in the analytics team?",
      "Is there a data visualisation project you can share with James?",
    ],
    starterProfile: {
      personaId: PERSONA_IDS.jamesWilson,
      firstName: "James",
      fullName: "James Wilson",
      jobTitle: "Data Analyst",
      team: "Customer Analytics",
      location: "Leeds",
      startDate: "2026-11-15",
      interests: ["Running", "Football", "Coffee"],
    },
    suggestedActivities: [
      {
        id: "act-viz",
        title: "Share a dashboard walkthrough",
        detail: "Show James a dashboard you built and explain the design choices.",
        duration: "30 min",
      },
      {
        id: "act-coffee",
        title: "Book a coffee chat",
        detail: "James asked about dashboard tooling. Offer a coffee next week.",
        duration: "30 min",
      },
    ],
  },
];
