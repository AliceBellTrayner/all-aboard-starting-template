import type { ChatMessage } from "@/types";
import { PERSONA_IDS } from "./personas";

const { jamesWilson, markGreen, emmaDavies, sarahThompson } = PERSONA_IDS;

/** Seed messages for the in-app buddy chat. */
export const chatMessages: ChatMessage[] = [
  // Mark (team buddy) and James
  {
    id: "c-mark-james-1",
    senderId: markGreen,
    recipientId: jamesWilson,
    body: "Hi James! I'm Mark, your team buddy. Really looking forward to our coffee on Thursday.",
    sentAt: "2026-11-05T09:12:00.000Z",
  },
  {
    id: "c-mark-james-2",
    senderId: jamesWilson,
    recipientId: markGreen,
    body: "Thanks Mark! See you then. Where is the Level 4 kitchen?",
    sentAt: "2026-11-05T10:03:00.000Z",
  },
  {
    id: "c-mark-james-3",
    senderId: markGreen,
    recipientId: jamesWilson,
    body: "Lifts to 4, then turn left. I'll meet you at reception if that's easier.",
    sentAt: "2026-11-05T10:15:00.000Z",
  },

  // Emma (job family buddy) and James
  {
    id: "c-emma-james-1",
    senderId: emmaDavies,
    recipientId: jamesWilson,
    body: "Hey James, Emma here, your job family buddy. I started as a Data Analyst in March, so ask me anything about tools or the team.",
    sentAt: "2026-11-07T14:20:00.000Z",
  },

  // Sarah (line manager) and Mark
  {
    id: "c-sarah-mark-1",
    senderId: sarahThompson,
    recipientId: markGreen,
    body: "Thanks for buddying James. Have you managed to book a coffee chat?",
    sentAt: "2026-11-04T11:40:00.000Z",
  },
  {
    id: "c-sarah-mark-2",
    senderId: markGreen,
    recipientId: sarahThompson,
    body: "Yes, Thursday 12 Nov at 10:30 in the Level 4 kitchen.",
    sentAt: "2026-11-04T12:05:00.000Z",
  },
];
