/** Context passed to knowledge entries so answers can be personalised. */
export interface HrAnswerContext {
  firstName: string;
  /** ISO date, only for new starters. */
  startDate?: string;
}

/** One topic in the Ask HR knowledge base. */
export interface HrKnowledgeEntry {
  id: string;
  topic: string;
  /** Lower-case words or phrases that suggest this topic. */
  keywords: string[];
  answer: string | ((ctx: HrAnswerContext) => string);
  /** Where the answer comes from, shown as a citation. */
  source: string;
  /** Optional follow-up questions to suggest after this answer. */
  followUps?: string[];
}

export interface HrAnswer {
  text: string;
  source?: string;
  followUps: string[];
  /** True when nothing matched and the user should contact a person. */
  escalate: boolean;
}
