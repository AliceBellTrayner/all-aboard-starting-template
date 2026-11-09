import type { NotificationItem } from "@/types";
import { PERSONA_IDS } from "./personas";

export const notifications: NotificationItem[] = [
  // James Wilson (new starter)
  {
    id: "n-james-1",
    recipientId: PERSONA_IDS.jamesWilson,
    kind: "approval",
    title: "Your laptop request has been approved",
    body: "IT has approved your laptop. Expect delivery to your home address by 13 November.",
    createdAt: "2026-11-09T08:12:00.000Z",
    read: false,
  },
  {
    id: "n-james-2",
    recipientId: PERSONA_IDS.jamesWilson,
    kind: "task",
    title: "Vetting completed successfully",
    body: "Your pre-employment checks are complete. There is nothing more you need to do.",
    createdAt: "2026-11-07T15:40:00.000Z",
    read: false,
  },
  {
    id: "n-james-3",
    recipientId: PERSONA_IDS.jamesWilson,
    kind: "message",
    title: "Emma Davies sent you a message",
    body: "Hi James, happy to chat about dashboard tooling whenever suits you.",
    createdAt: "2026-11-06T11:05:00.000Z",
    read: true,
  },
  {
    id: "n-james-4",
    recipientId: PERSONA_IDS.jamesWilson,
    kind: "reminder",
    title: "Book your desk for Day One",
    body: "Choose a desk in Leeds for 15 November. Desk booking closes Friday at 17:00.",
    createdAt: "2026-11-05T09:00:00.000Z",
    read: true,
  },
  {
    id: "n-james-5",
    recipientId: PERSONA_IDS.jamesWilson,
    kind: "reminder",
    title: "Your first payslip will be available soon",
    body: "Your first payslip is due on 28 December. You will get a notification when it is ready to view.",
    createdAt: "2026-11-02T10:20:00.000Z",
    read: true,
  },

  // Sarah Thompson (line manager)
  {
    id: "n-sarah-1",
    recipientId: PERSONA_IDS.sarahThompson,
    kind: "reminder",
    title: "90-day goals not yet published",
    body: "James Wilson's 90-day goals are still in draft. Publish them before Day One to keep the timeline on track.",
    createdAt: "2026-11-09T07:30:00.000Z",
    read: false,
  },
  {
    id: "n-sarah-2",
    recipientId: PERSONA_IDS.sarahThompson,
    kind: "task",
    title: "Desk booking pending for James Wilson",
    body: "The Leeds facilities team is waiting for a desk booking for 15 November.",
    createdAt: "2026-11-08T16:15:00.000Z",
    read: false,
  },
  {
    id: "n-sarah-3",
    recipientId: PERSONA_IDS.sarahThompson,
    kind: "milestone",
    title: "Mark Green is assigned as team buddy",
    body: "Mark has accepted the team buddy role for James. They have a coffee chat booked for 12 November.",
    createdAt: "2026-11-04T12:00:00.000Z",
    read: true,
  },

  // Mark Green (team buddy)
  {
    id: "n-mark-1",
    recipientId: PERSONA_IDS.markGreen,
    kind: "task",
    title: "Coffee chat with James on 12 November",
    body: "Thirty minutes at 10:30 in the Leeds kitchen. Conversation starters are in your buddy dashboard.",
    createdAt: "2026-11-08T09:45:00.000Z",
    read: false,
  },
  {
    id: "n-mark-2",
    recipientId: PERSONA_IDS.markGreen,
    kind: "reminder",
    title: "Plan the office tour for Day One",
    body: "James starts on 15 November. The office tour is on your suggested activities list.",
    createdAt: "2026-11-03T08:30:00.000Z",
    read: true,
  },

  // Emma Davies (job family buddy)
  {
    id: "n-emma-1",
    recipientId: PERSONA_IDS.emmaDavies,
    kind: "message",
    title: "James Wilson sent you a message",
    body: "James would love to hear about how you built your dashboards. Coffee next week?",
    createdAt: "2026-11-09T10:00:00.000Z",
    read: false,
  },
];
