import type { NotificationKind } from "./notification";

export type PronounOption = "unset" | "she/her" | "he/him" | "they/them" | "custom" | "prefer-not";

export interface PersonalDetails {
  legalFirstName: string;
  legalLastName: string;
  mobile: string;
  personalEmail: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  postcode: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
}

/** Cards on the home screen that can be shown or hidden. */
export type HomeCardId = "recruiter" | "manager" | "office";

/** Quick links that can be pinned to the home screen. */
export type ShortcutId = "journey" | "tasks" | "app-store" | "buddy" | "ask-hr" | "notifications";

export type ReminderFrequency = "instant" | "daily" | "weekly" | "off";

/** Notification categories a colleague can switch on or off. */
export type NotificationCategory = "tasks" | "messages" | "reminders" | "milestones";

export interface ProfileData {
  preferredName: string;
  pronouns: PronounOption;
  customPronouns: string;
  showPronouns: boolean;
  personal: PersonalDetails;
  emergencyContacts: EmergencyContact[];
  home: {
    cards: Record<HomeCardId, boolean>;
    shortcuts: ShortcutId[];
  };
  notifications: {
    frequency: ReminderFrequency;
    digestTime: string; // "HH:MM"
    categories: Record<NotificationCategory, boolean>;
    channels: { push: boolean; email: boolean; sms: boolean };
    pauseWeekends: boolean;
  };
}

/** Which notification kinds belong to each category. */
export const NOTIFICATION_CATEGORY_KINDS: Record<NotificationCategory, NotificationKind[]> = {
  tasks: ["task", "approval"],
  messages: ["message"],
  reminders: ["reminder"],
  milestones: ["milestone"],
};
