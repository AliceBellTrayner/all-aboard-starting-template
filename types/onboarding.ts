/** Who is expected to action a task. Useful for filtering in other team's views. */
export type TaskOwner = "starter" | "manager" | "buddy";

/** Support function that does the work behind a task. The owner still chases it and ticks it off. */
export type TaskDepartment = "hr" | "it";

export interface OnboardingTask {
  id: string;
  milestoneId: string;
  title: string;
  detail: string;
  /** How to complete the task, in order. Shown on the Tasks tab. */
  steps: string[];
  owner: TaskOwner;
  /** Set on HR and IT tasks, which are shown with an extra "HR task" / "IT task" tag. */
  department?: TaskDepartment;
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
