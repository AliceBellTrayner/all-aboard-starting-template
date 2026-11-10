import type { Milestone, OnboardingJourney } from "@/types";
import { PERSONA_IDS } from "./personas";

/**
 * Onboarding stages and tasks for James Wilson.
 * Task ids must be unique across all milestones.
 */
export const milestones: Milestone[] = [
  {
    id: "offer-accepted",
    title: "Offer Accepted",
    theme: "Saddle up",
    timeframe: "Before you start",
    tasks: [
      {
        id: "oa-welcome",
        milestoneId: "offer-accepted",
        title: "Welcome to LaunchPad",
        detail: "Take a two-minute tour of your journey and what happens next.",
        owner: "starter",
      },
      {
        id: "oa-profile",
        milestoneId: "offer-accepted",
        title: "Complete profile",
        detail: "Add your photo, preferred name and emergency contact.",
        owner: "starter",
      },
      {
        id: "oa-buddies",
        milestoneId: "offer-accepted",
        title: "Meet your onboarding buddies",
        detail: "Sarah has introduced you to Mark and Emma. Say hello.",
        owner: "buddy",
      },
    ],
  },
  {
    id: "preboarding",
    title: "Preboarding",
    theme: "Tack room",
    timeframe: "Weeks -4 to -1",
    tasks: [
      {
        id: "pb-vetting",
        milestoneId: "preboarding",
        title: "Complete vetting",
        detail: "Right-to-work and credit checks. Usually takes three to five working days.",
        owner: "hr",
      },
      {
        id: "pb-laptop",
        milestoneId: "preboarding",
        title: "Choose laptop",
        detail: "Pick from the approved list. Delivered to your home address.",
        owner: "starter",
      },
      {
        id: "pb-accessories",
        milestoneId: "preboarding",
        title: "Select accessories",
        detail: "Monitor, keyboard and headset for your Leeds desk.",
        owner: "starter",
      },
      {
        id: "pb-team",
        milestoneId: "preboarding",
        title: "Meet your team",
        detail: "A 20-minute intro call with Customer Analytics.",
        owner: "manager",
      },
      {
        id: "pb-coffee",
        milestoneId: "preboarding",
        title: "Schedule coffee chat",
        detail: "Book 30 minutes with Mark before Day One.",
        owner: "starter",
      },
      {
        id: "pb-call",
        milestoneId: "preboarding",
        title: "Give your new starter a call",
        detail: "A 15-minute welcome call before their start date. Check how they are feeling and answer questions.",
        owner: "manager",
      },
    ],
  },
  {
    id: "day-one",
    title: "Day One",
    theme: "First canter",
    timeframe: "Day 1",
    tasks: [
      {
        id: "d1-equipment",
        milestoneId: "day-one",
        title: "Collect equipment",
        detail: "Laptop and building pass from Leeds reception, 09:00.",
        owner: "it",
      },
      {
        id: "d1-manager",
        milestoneId: "day-one",
        title: "Meet manager",
        detail: "Sarah Thompson, 10:00 in Meeting Room 3B.",
        owner: "manager",
      },
      {
        id: "d1-intro",
        milestoneId: "day-one",
        title: "Team introduction",
        detail: "Stand-up and team welcome at 11:00.",
        owner: "manager",
      },
      {
        id: "d1-tour",
        milestoneId: "day-one",
        title: "Office tour",
        detail: "Led by Mark. Covers facilities, fire exits and the kitchen.",
        owner: "buddy",
      },
    ],
  },
  {
    id: "first-week",
    title: "First Week",
    theme: "Find your stride",
    timeframe: "Days 2 to 5",
    tasks: [
      {
        id: "fw-setup",
        milestoneId: "first-week",
        title: "System setup",
        detail: "Email, Teams, VPN and the analytics toolkit.",
        owner: "it",
      },
      {
        id: "fw-training",
        milestoneId: "first-week",
        title: "Complete mandatory training",
        detail: "Data protection, financial crime and Consumer Duty modules.",
        owner: "starter",
      },
      {
        id: "fw-stakeholders",
        milestoneId: "first-week",
        title: "Meet key stakeholders",
        detail: "Three 30-minute intros with the Credit Risk and Marketing leads.",
        owner: "manager",
      },
    ],
  },
  {
    id: "first-30-days",
    title: "First 30 Days",
    theme: "Trot on",
    timeframe: "Weeks 2 to 4",
    tasks: [
      {
        id: "t30-goals",
        milestoneId: "first-30-days",
        title: "Set goals",
        detail: "Draft three objectives with Sarah in your first 1:1.",
        owner: "starter",
      },
      {
        id: "t30-learning",
        milestoneId: "first-30-days",
        title: "Complete onboarding learning",
        detail: "Product knowledge path for current accounts and lending.",
        owner: "starter",
      },
      {
        id: "t30-payslip",
        milestoneId: "first-30-days",
        title: "View first payslip",
        detail: "Check your pay and pension in the self-service portal.",
        owner: "hr",
      },
    ],
  },
  {
    id: "30-90-days",
    title: "30–90 Days",
    theme: "Gallop",
    timeframe: "Months 2 to 3",
    tasks: [
      {
        id: "n90-goals",
        milestoneId: "30-90-days",
        title: "Review goals",
        detail: "Check progress against your objectives with Sarah.",
        owner: "manager",
      },
      {
        id: "n90-feedback",
        milestoneId: "30-90-days",
        title: "Collect feedback",
        detail: "Ask Mark and two stakeholders how you are settling in.",
        owner: "starter",
      },
      {
        id: "n90-checkin",
        milestoneId: "30-90-days",
        title: "Complete 90-day check-in",
        detail: "Formal review with your manager at day 90.",
        owner: "manager",
      },
    ],
  },
];

/**
 * Starts with no tasks ticked, so the demo can be walked from Offer Accepted
 * to the end. Ticks are kept in memory only, so a page reload resets them.
 */
export const jamesOnboardingJourney: OnboardingJourney = {
  starterId: PERSONA_IDS.jamesWilson,
  milestones,
  completedTaskIds: [],
};
