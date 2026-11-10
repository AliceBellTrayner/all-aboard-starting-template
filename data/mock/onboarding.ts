import type { Milestone, OnboardingJourney } from "@/types";
import { PERSONA_IDS } from "./personas";

/**
 * Onboarding stages and tasks for James Wilson.
 * Task ids must be unique across all milestones.
 * `steps` are written for whoever owns the task and are shown on the Tasks tab.
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
        title: "Welcome to HorseShoe",
        detail: "Take a two-minute tour of your journey and what happens next.",
        steps: [
          "Open the Journey tab and scroll the trail from Start to Confirmed in role.",
          "Tap each milestone to see what is coming up and who does what.",
          "Mark this task as done once you know where to find your tasks.",
        ],
        owner: "starter",
      },
      {
        id: "oa-profile",
        milestoneId: "offer-accepted",
        title: "Complete profile",
        detail: "Add your photo, preferred name and emergency contact.",
        steps: [
          "Open the Profile tab.",
          "Upload a clear head-and-shoulders photo for your building pass.",
          "Enter the name you would like colleagues to use.",
          "Add one emergency contact with a phone number, then save.",
        ],
        owner: "starter",
      },
      {
        id: "oa-buddies",
        milestoneId: "offer-accepted",
        title: "Meet your onboarding buddies",
        detail: "Sarah has introduced you to Mark and Emma. Say hello.",
        steps: [
          "Open the intro chat Sarah set up with the starter.",
          "Say hello, and share what you do and one thing about yourself.",
          "Offer a couple of times for a first chat.",
        ],
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
        steps: [
          "Check HR has sent the starter the secure link for proof of identity and right to work.",
          "Nudge the starter if their documents are not uploaded within a few days.",
          "Ask HR for an update if the checks take longer than five working days.",
          "Mark this task as done once HR confirms every check has cleared.",
        ],
        owner: "manager",
        department: "hr",
      },
      {
        id: "pb-laptop",
        milestoneId: "preboarding",
        title: "Choose laptop",
        detail: "Pick from the approved list. Delivered to your home address.",
        steps: [
          "Open the equipment catalogue from your welcome email.",
          "Pick one laptop from the approved list for your role.",
          "Check the delivery address is your home address and submit the order.",
          "Order at least two weeks before your start date so it arrives in time.",
        ],
        owner: "starter",
      },
      {
        id: "pb-accessories",
        milestoneId: "preboarding",
        title: "Select accessories",
        detail: "Monitor, keyboard and headset for your Leeds desk.",
        steps: [
          "Open the equipment catalogue and go to Accessories.",
          "Choose a monitor, keyboard and headset.",
          "Flag any workplace adjustments you need in the notes box.",
          "Submit the order. It will be waiting at your Leeds desk on Day One.",
        ],
        owner: "starter",
      },
      {
        id: "pb-team",
        milestoneId: "preboarding",
        title: "Meet your team",
        detail: "A 20-minute intro call with Customer Analytics.",
        steps: [
          "Pick a slot in the two weeks before the start date when most of the team is free.",
          "Send a 20-minute Teams invite to the starter and the Customer Analytics team.",
          "On the call, ask everyone to share their role and one thing they are working on.",
          "Mark this task as done after the call.",
        ],
        owner: "manager",
      },
      {
        id: "pb-coffee",
        milestoneId: "preboarding",
        title: "Schedule coffee chat",
        detail: "Book 30 minutes with Mark before Day One.",
        steps: [
          "Message Mark from the Buddy tab with two or three times that suit you.",
          "Agree a 30-minute slot before Day One, by video or in person.",
          "Jot down a few questions about the team and the first week.",
          "Mark this task as done once the chat is in both calendars.",
        ],
        owner: "starter",
      },
      {
        id: "pb-call",
        milestoneId: "preboarding",
        title: "Give your new starter a call",
        detail: "A 15-minute welcome call before their start date. Check how they are feeling and answer questions.",
        steps: [
          "Call the starter in the week before their start date.",
          "Ask how they are feeling and whether anything is unclear.",
          "Confirm the Day One plan: arrival time, where to go and who will meet them.",
          "Follow up on any questions you could not answer on the call.",
        ],
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
        steps: [
          "The day before, check with IT that the laptop and building pass will be at Leeds reception by 09:00.",
          "Remind the starter to bring photo ID to collect them.",
          "Mark this task as done once the starter has signed for both.",
        ],
        owner: "manager",
        department: "it",
      },
      {
        id: "d1-manager",
        milestoneId: "day-one",
        title: "Meet manager",
        detail: "Sarah Thompson, 10:00 in Meeting Room 3B.",
        steps: [
          "Book Meeting Room 3B for 10:00 and send the invite to the starter.",
          "Walk through the first-week plan and what good looks like.",
          "Agree when your regular 1:1 will be.",
          "Mark this task as done after the meeting.",
        ],
        owner: "manager",
      },
      {
        id: "d1-intro",
        milestoneId: "day-one",
        title: "Team introduction",
        detail: "Stand-up and team welcome at 11:00.",
        steps: [
          "Add the starter to the 11:00 stand-up invite.",
          "Introduce them to the team and ask each person to say what they do.",
          "Point out who to go to for data access, tooling and day-to-day questions.",
        ],
        owner: "manager",
      },
      {
        id: "d1-tour",
        milestoneId: "day-one",
        title: "Office tour",
        detail: "Led by Mark. Covers facilities, fire exits and the kitchen.",
        steps: [
          "Meet the starter at their desk after the team introduction.",
          "Show them the fire exits and the assembly point first.",
          "Walk round the kitchen, toilets, meeting rooms and quiet spaces.",
          "Finish at their desk and check they can get in and out with their pass.",
        ],
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
        steps: [
          "Raise the access request with IT for email, Teams, VPN and the analytics toolkit.",
          "Ask IT to add the starter to the team workspace.",
          "Check with the starter that they can sign in to each one, and pass any failures to IT.",
          "Mark this task as done once everything works.",
        ],
        owner: "manager",
        department: "it",
      },
      {
        id: "fw-training",
        milestoneId: "first-week",
        title: "Complete mandatory training",
        detail: "Data protection, financial crime and Consumer Duty modules.",
        steps: [
          "Open the learning portal and go to My Required Learning.",
          "Complete the Data Protection, Financial Crime and Consumer Duty modules.",
          "Pass the short quiz at the end of each one. You can retake them.",
          "Allow about three hours in total, and finish by the end of your first week.",
        ],
        owner: "starter",
      },
      {
        id: "fw-stakeholders",
        milestoneId: "first-week",
        title: "Meet key stakeholders",
        detail: "Three 30-minute intros with the Credit Risk and Marketing leads.",
        steps: [
          "Email the Credit Risk and Marketing leads to introduce the starter.",
          "Book three 30-minute intros in the starter's first week.",
          "Give the starter a line on each person and what to ask them.",
          "Mark this task as done once all three are in the calendar.",
        ],
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
        steps: [
          "Before your first 1:1, note three things you want to achieve in 90 days.",
          "Talk them through with Sarah and agree how each will be measured.",
          "Record the three agreed objectives in the performance system.",
        ],
        owner: "starter",
      },
      {
        id: "t30-learning",
        milestoneId: "first-30-days",
        title: "Complete onboarding learning",
        detail: "Product knowledge path for current accounts and lending.",
        steps: [
          "Open the learning portal and start the Product Knowledge path.",
          "Work through the current accounts modules, then the lending modules.",
          "Note any questions to take to your job family buddy.",
          "Finish the path by the end of week four.",
        ],
        owner: "starter",
      },
      {
        id: "t30-payslip",
        milestoneId: "first-30-days",
        title: "View first payslip",
        detail: "Check your pay and pension in the self-service portal.",
        steps: [
          "On payday, ask the starter to open their first payslip in the self-service portal.",
          "Check they are happy with their pay, tax code and pension contributions.",
          "Pass any queries to HR and follow them up.",
          "Mark this task as done once the starter has viewed it and any queries are resolved.",
        ],
        owner: "manager",
        department: "hr",
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
        steps: [
          "Book a 45-minute review with the starter around day 60.",
          "Go through each objective: what is on track and what is not.",
          "Adjust any objective that no longer fits and agree the support needed.",
          "Update the objectives in the performance system.",
        ],
        owner: "manager",
      },
      {
        id: "n90-feedback",
        milestoneId: "30-90-days",
        title: "Collect feedback",
        detail: "Ask Mark and two stakeholders how you are settling in.",
        steps: [
          "Choose two stakeholders you have worked with, as well as Mark.",
          "Ask each for one thing that is going well and one thing to do differently.",
          "Write up the themes in a few lines.",
          "Bring them to your 90-day check-in.",
        ],
        owner: "starter",
      },
      {
        id: "n90-checkin",
        milestoneId: "30-90-days",
        title: "Complete 90-day check-in",
        detail: "Formal review with your manager at day 90.",
        steps: [
          "Book a one-hour check-in with the starter for day 90.",
          "Review their objectives, their feedback and how they have settled in.",
          "Confirm the probation outcome and agree goals for the next quarter.",
          "Record the outcome in the performance system.",
        ],
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
