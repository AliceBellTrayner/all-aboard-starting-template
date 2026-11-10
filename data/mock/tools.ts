import type { Peripheral, StoreApp, TechRecommendation } from "@/types";

/** Apps a new starter can add from the in-app store. */
export const storeApps: StoreApp[] = [
  // Essentials: everyone needs these from day one
  {
    id: "microsoft-365",
    name: "Microsoft 365",
    tagline: "Outlook, Teams, Office",
    description: "Email, calendar, Teams calls and the Office apps you'll use every day.",
    category: "essentials",
    recommendedFor: "everyone",
  },
  {
    id: "workday",
    name: "Workday",
    tagline: "HR and people tools",
    description: "See payslips, book holiday, update personal details and set your goals.",
    category: "essentials",
    recommendedFor: "everyone",
  },
  {
    id: "engage",
    name: "Engage",
    tagline: "Desk booking",
    description: "Book a desk near your team before you come into the office.",
    category: "essentials",
    recommendedFor: "everyone",
  },
  {
    id: "edge",
    name: "Microsoft Edge",
    tagline: "Web browser",
    description: "The supported browser for internal sites and tools.",
    category: "essentials",
    recommendedFor: "everyone",
  },

  // Work tools: tailored by job family
  {
    id: "power-bi",
    name: "Power BI",
    tagline: "Dashboards and reports",
    description: "Build and share interactive dashboards. Used across Customer Analytics.",
    category: "work",
    recommendedFor: ["Data Analyst", "Senior Data Analyst"],
  },
  {
    id: "tableau",
    name: "Tableau",
    tagline: "Data visualisation",
    description: "Explore data visually and publish workbooks for your stakeholders.",
    category: "work",
    recommendedFor: ["Data Analyst", "Senior Data Analyst"],
  },
  {
    id: "amex-gbt",
    name: "Amex GBT",
    tagline: "Business travel",
    description: "Book trains, hotels and flights for work trips within policy.",
    category: "work",
    recommendedFor: [],
  },

  // Learning
  {
    id: "pluralsight",
    name: "Pluralsight",
    tagline: "Learning platform",
    description: "Technical courses and skill assessments for engineering and data roles.",
    category: "learning",
    recommendedFor: ["Software Engineer", "Data Analyst"],
  },
  {
    id: "skillsoft",
    name: "Skillsoft",
    tagline: "Learning and skills",
    description: "Mandatory training plus thousands of courses on leadership and skills.",
    category: "learning",
    recommendedFor: "everyone",
  },

  // Wellbeing and benefits
  {
    id: "headspace",
    name: "Headspace",
    tagline: "Wellbeing support",
    description: "Guided meditation, sleep and focus exercises, free for colleagues.",
    category: "wellbeing",
    recommendedFor: [],
  },
  {
    id: "onehub",
    name: "OneHub",
    tagline: "Benefits",
    description: "Choose and manage your flexible benefits in one place.",
    category: "wellbeing",
    recommendedFor: [],
  },
  {
    id: "eq",
    name: "EQ",
    tagline: "Shares and investments",
    description: "View and manage colleague share schemes.",
    category: "wellbeing",
    recommendedFor: [],
  },
  {
    id: "scottish-widows",
    name: "Scottish Widows",
    tagline: "Pensions",
    description: "Track your workplace pension and change your contributions.",
    category: "wellbeing",
    recommendedFor: [],
  },
  {
    id: "bupa",
    name: "Bupa",
    tagline: "Health insurance",
    description: "Access private medical cover and book appointments.",
    category: "wellbeing",
    recommendedFor: [],
  },
  {
    id: "kitchen2go",
    name: "Kitchen2Go",
    tagline: "Food on site",
    description: "Order breakfast and lunch from the office kitchen and skip the queue.",
    category: "wellbeing",
    recommendedFor: [],
  },
];

const DEFAULT_TECH: TechRecommendation = {
  jobFamily: "your role",
  choices: [
    {
      id: "laptop",
      title: "Laptop",
      options: [
        { id: "windows", label: "Windows laptop", detail: "14-inch · Windows 11 · 16 GB RAM" },
        { id: "mac", label: "MacBook", detail: "14-inch · macOS · 16 GB RAM" },
      ],
      recommendedId: "windows",
      reason: "Works with every internal tool out of the box.",
    },
    {
      id: "phone",
      title: "Work phone",
      options: [
        { id: "byod", label: "BYOD (Bring Your Own Device)", detail: "Use Outlook and Teams on your own phone" },
        { id: "android", label: "Android", detail: "Android" },
        { id: "ios", label: "iPhone", detail: "iOS" },
      ],
      recommendedId: "byod",
      reason: "Most colleagues use their own phone for secure email and Teams, with no second device to carry.",
    },
  ],
};

/** Tech recommendations keyed by job title. */
const TECH_BY_JOB_TITLE: Record<string, TechRecommendation> = {
  "Data Analyst": {
    jobFamily: "Data Analysts",
    choices: [
      {
        ...DEFAULT_TECH.choices[0],
        options: [
          { id: "windows", label: "Windows laptop", detail: "14-inch · Windows 11 · 32 GB RAM" },
          { id: "mac", label: "MacBook Pro", detail: "14-inch · macOS · 32 GB RAM" },
        ],
        recommendedId: "windows",
        reason: "Power BI Desktop and Excel add-ins run natively on Windows.",
      },
      DEFAULT_TECH.choices[1],
    ],
    laptopCaveat: {
      optionId: "mac",
      note: "Power BI Desktop isn't available on macOS. You'll use it through a Windows virtual desktop.",
    },
  },
};

export function techFor(jobTitle: string): TechRecommendation {
  return TECH_BY_JOB_TITLE[jobTitle] ?? DEFAULT_TECH;
}

export const peripherals: Peripheral[] = [
  { id: "headset", label: "Headset", detail: "Teams-certified, noise cancelling", group: "standard", recommended: true },
  { id: "monitor", label: "Monitor", detail: "27-inch with USB-C", group: "standard", recommended: true },
  { id: "keyboard-mouse", label: "Keyboard and mouse", detail: "Wireless set", group: "standard" },
  { id: "dock", label: "Docking station", detail: "One cable for home desk set-up", group: "standard" },
  { id: "stand", label: "Laptop stand", detail: "Raises screen to eye level", group: "standard" },

  { id: "ergo-keyboard", label: "Ergonomic keyboard", detail: "Split layout to reduce strain", group: "assistive" },
  { id: "vertical-mouse", label: "Vertical mouse", detail: "Neutral wrist position", group: "assistive" },
  { id: "magnifier", label: "Screen magnifier", detail: "Software to enlarge content", group: "assistive" },
  { id: "speech-to-text", label: "Speech-to-text", detail: "Dictate instead of typing", group: "assistive" },
  { id: "screen-reader", label: "Screen reader", detail: "Reads content aloud", group: "assistive" },
];
