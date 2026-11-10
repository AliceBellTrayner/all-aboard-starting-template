import type { HomeCardId, Persona, ProfileData, ShortcutId } from "@/types";
import { PERSONA_IDS } from "./personas";

/**
 * Fictional personal details for the demo. Phone numbers use Ofcom's
 * drama range (07700 900xxx) so they can never reach a real person.
 */
const SEEDED_DETAILS: Record<string, Partial<ProfileData>> = {
  [PERSONA_IDS.jamesWilson]: {
    personal: {
      legalFirstName: "James",
      legalLastName: "Wilson",
      mobile: "07700 900123",
      personalEmail: "james.wilson@example.com",
      addressLine1: "Flat 4, 27 Example Wharf",
      addressLine2: "",
      city: "Leeds",
      postcode: "LS1 0AA",
    },
    emergencyContacts: [{ id: "ec-1", name: "Laura Wilson", relationship: "Partner", phone: "07700 900456" }],
  },
};

export const HOME_CARDS: { id: HomeCardId; label: string; detail: string }[] = [
  { id: "recruiter", label: "Note from your recruiter", detail: "Encouragement before day one" },
  { id: "manager", label: "Note from your manager", detail: "A welcome message from your line manager" },
  { id: "office", label: "Your office", detail: "Address, map and directions" },
];

export const SHORTCUTS: { id: ShortcutId; label: string; detail: string }[] = [
  { id: "journey", label: "My journey", detail: "See what's next on your path" },
  { id: "tasks", label: "My tasks", detail: "Everything waiting for you" },
  { id: "app-store", label: "App store", detail: "Add the apps you need" },
  { id: "buddy", label: "My buddies", detail: "Chat with Mark and Emma" },
  { id: "ask-hr", label: "Ask HR", detail: "Pay, benefits and policies" },
  { id: "notifications", label: "Notifications", detail: "Your latest updates" },
];

export const MAX_SHORTCUTS = 4;

/** Default profile for a persona, before they change anything. */
export function defaultProfileFor(persona: Persona): ProfileData {
  const [first, ...rest] = persona.fullName.split(" ");
  const seeded = SEEDED_DETAILS[persona.id] ?? {};
  return {
    preferredName: persona.firstName,
    // Never assume someone's pronouns: start unset and let them choose.
    pronouns: "unset",
    customPronouns: "",
    showPronouns: true,
    personal: {
      legalFirstName: first,
      legalLastName: rest.join(" "),
      mobile: "",
      personalEmail: "",
      addressLine1: "",
      addressLine2: "",
      city: persona.role === "new-starter" ? persona.location : "",
      postcode: "",
      ...seeded.personal,
    },
    emergencyContacts: seeded.emergencyContacts ?? [],
    home: {
      cards: { recruiter: true, manager: true, office: true },
      shortcuts: ["journey", "tasks", "buddy", "ask-hr"],
    },
    notifications: {
      frequency: "daily",
      digestTime: "08:00",
      categories: { tasks: true, messages: true, reminders: true, milestones: true },
      channels: { push: true, email: true, sms: false },
      pauseWeekends: true,
    },
  };
}
