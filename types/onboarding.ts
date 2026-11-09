/** Who is expected to action a task. Useful for filtering in other team's views. */
export type TaskOwner = "starter" | "manager" | "buddy" | "hr" | "it";

export interface OnboardingTask {
  id: string;
  milestoneId: string;
  title: string;
  detail: string;
  owner: TaskOwner;
}

/** A stage of the journey, e.g. "Day One". Rendered as a node on the path. */
export interface Milestone {
  id: string;
  title: string;
  /** Horse-riding progression label shown under the title. */
  theme: string;
  timeframe: string;
  tasks: OnboardingTask[];
}

/** The state of one starter's journey: milestones plus which tasks are ticked. */
export interface OnboardingJourney {
  starterId: string;
  milestones: Milestone[];
  completedTaskIds: string[];
}

export type MilestoneStatus = "completed" | "current" | "locked";

export interface MilestoneProgress {
  milestoneId: string;
  status: MilestoneStatus;
  doneCount: number;
  totalCount: number;
}
