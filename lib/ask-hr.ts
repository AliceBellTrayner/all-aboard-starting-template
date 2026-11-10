import { getHrKnowledge } from "@/data/mock";
import type { HrAnswer, HrAnswerContext, HrKnowledgeEntry } from "@/types";

/**
 * Ask HR: answers onboarding questions about pay, benefits, rewards and policy.
 *
 * Demo implementation: scores the question against a placeholder knowledge
 * base. To use a real model, replace the body of `askHr` with a call to a
 * server-side endpoint (never call a model with a secret key from the browser)
 * and keep the same `HrAnswer` shape so the UI doesn't change.
 */
export async function askHr(question: string, ctx: HrAnswerContext): Promise<HrAnswer> {
  // Simulate model latency so the typing indicator is visible.
  await new Promise((resolve) => setTimeout(resolve, 700 + Math.random() * 600));
  return answerFromKnowledge(question, ctx, getHrKnowledge());
}

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Longer, more specific keyword matches score higher. */
function score(question: string, entry: HrKnowledgeEntry): number {
  const q = question.toLowerCase();
  return entry.keywords.reduce((total, keyword) => {
    const pattern = new RegExp(`\\b${escapeRegExp(keyword)}\\b`);
    return pattern.test(q) ? total + keyword.length : total;
  }, 0);
}

export function answerFromKnowledge(question: string, ctx: HrAnswerContext, knowledge: HrKnowledgeEntry[]): HrAnswer {
  let best: HrKnowledgeEntry | undefined;
  let bestScore = 0;
  for (const entry of knowledge) {
    const s = score(question, entry);
    if (s > bestScore) {
      best = entry;
      bestScore = s;
    }
  }

  if (!best) {
    return {
      text: `I'm not sure about that one, ${ctx.firstName}. I can help with pay, pensions, holiday, benefits, rewards, wellbeing and other HR policies. For anything else, or anything personal, it's best to speak to a person in HR.`,
      followUps: ["When is my first pay?", "What benefits can I choose?"],
      escalate: true,
    };
  }

  return {
    text: typeof best.answer === "function" ? best.answer(ctx) : best.answer,
    source: best.source,
    followUps: best.followUps ?? [],
    escalate: false,
  };
}
