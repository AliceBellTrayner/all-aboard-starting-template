/* ---------- App store ---------- */

export type AppCategory = "essentials" | "work" | "learning" | "wellbeing";

export interface StoreApp {
  id: string;
  name: string;
  /** Short purpose shown under the name, e.g. "Desk booking". */
  tagline: string;
  description: string;
  category: AppCategory;
  /** Job titles this app is recommended for. "everyone" means all starters. */
  recommendedFor: string[] | "everyone";
}

/* ---------- Tech and peripherals ---------- */

export interface TechOption {
  id: string;
  label: string;
  detail: string;
}

export interface TechChoice {
  id: "laptop" | "phone";
  title: string;
  options: TechOption[];
  /** Option id recommended for this starter, with the reason shown to them. */
  recommendedId: string;
  reason: string;
}

export interface TechRecommendation {
  /** Used in copy such as "Recommended for Data Analysts". */
  jobFamily: string;
  choices: TechChoice[];
  /** Shown when a non-recommended laptop is picked. */
  laptopCaveat?: { optionId: string; note: string };
}

export type PeripheralGroup = "standard" | "assistive";

export interface Peripheral {
  id: string;
  label: string;
  detail: string;
  group: PeripheralGroup;
  recommended?: boolean;
}

/* ---------- Delivery ---------- */

export type DeliveryMethod = "office" | "home";
