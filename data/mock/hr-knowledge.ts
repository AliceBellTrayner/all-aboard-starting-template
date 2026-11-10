import type { HrKnowledgeEntry } from "@/types";

/**
 * Placeholder HR knowledge for the Ask HR AI buddy demo.
 * This is NOT approved policy. Replace with content from the HR policy owners
 * before showing it to real colleagues. Answers point to the system of record
 * (Workday, OneHub and so on) instead of quoting personal figures.
 */

const TZ = "Europe/London";
const longDate = new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long", timeZone: TZ });

/**
 * Payday for a month: the 20th, or the Friday before it when the 20th falls
 * on a weekend. `monthIndex` is zero-based and may run past 11 into next year.
 */
function paydayFor(year: number, monthIndex: number): Date {
  const payday = new Date(Date.UTC(year, monthIndex, 20, 12));
  const weekday = payday.getUTCDay();
  if (weekday === 6) payday.setUTCDate(19);
  if (weekday === 0) payday.setUTCDate(18);
  return payday;
}

/** The first payday on or after `isoDate`. */
function firstPaydayFrom(isoDate: string): Date {
  const start = new Date(`${isoDate}T12:00:00Z`);
  const sameMonth = paydayFor(start.getUTCFullYear(), start.getUTCMonth());
  return sameMonth >= start ? sameMonth : paydayFor(start.getUTCFullYear(), start.getUTCMonth() + 1);
}

export const hrKnowledge: HrKnowledgeEntry[] = [
  {
    id: "first-pay",
    topic: "Pay",
    keywords: ["pay", "paid", "salary", "payday", "pay day", "first pay", "payslip", "wage", "when do i get paid"],
    answer: (ctx) => {
      const base =
        "Colleagues are paid monthly, on the 20th of each month. If the 20th falls on a weekend, payday is the Friday before. Your payslip appears in Workday a few days before.";
      if (!ctx.startDate) return base;
      return `${base} As you start on ${longDate.format(new Date(`${ctx.startDate}T12:00:00Z`))}, your first payday should be ${longDate.format(firstPaydayFrom(ctx.startDate))}.`;
    },
    source: "Pay and payroll guide",
    followUps: ["How do I read my payslip?", "How do I change my bank details?"],
  },
  {
    id: "payslip",
    topic: "Pay",
    keywords: ["read my payslip", "payslip breakdown", "deductions", "tax code", "national insurance", "ni"],
    answer:
      "Open Workday, go to Pay, then Payslips. Each payslip shows your gross pay, then deductions such as income tax, National Insurance and pension, and your take-home pay. If your tax code looks wrong, contact HMRC; payroll uses the code HMRC gives us.",
    source: "Pay and payroll guide",
    followUps: ["When is my first pay?"],
  },
  {
    id: "bank-details",
    topic: "Pay",
    keywords: ["bank details", "bank account", "change bank", "sort code"],
    answer:
      "Update your bank details in Workday under Personal Information, then Payment Elections. Changes made before payroll cut-off (usually mid-month) apply to that month's pay.",
    source: "Pay and payroll guide",
  },
  {
    id: "pension",
    topic: "Pension",
    keywords: ["pension", "retirement", "scottish widows", "contribution", "contributions", "auto enrol", "auto-enrol"],
    answer:
      "You're automatically enrolled in the workplace pension, run by Scottish Widows. The bank contributes, and you can increase your own contribution at any time. Use the Scottish Widows app (in the Tools app store) to see your pot and change contributions.",
    source: "Pensions overview",
    followUps: ["What benefits can I choose?"],
  },
  {
    id: "holiday",
    topic: "Time off",
    keywords: ["holiday", "annual leave", "leave allowance", "days off", "vacation", "book leave", "buy holiday"],
    answer:
      "Your holiday allowance is shown in Workday under Time Off. Book leave there and your manager approves it. You may also be able to buy extra days through flexible benefits in OneHub during the benefits window.",
    source: "Time off policy",
    followUps: ["What benefits can I choose?", "What happens if I'm off sick?"],
  },
  {
    id: "sickness",
    topic: "Time off",
    keywords: ["sick", "sickness", "ill", "unwell", "absence", "doctor"],
    answer:
      "If you're unwell, tell your line manager as early as you can on the first day, then record the absence in Workday. For longer absences you'll need a fit note. Support is also available through the Employee Assistance Programme.",
    source: "Sickness absence policy",
    followUps: ["What wellbeing support is there?"],
  },
  {
    id: "benefits",
    topic: "Benefits",
    keywords: ["benefit", "benefits", "flexible benefits", "flex", "onehub", "perks", "discount", "discounts"],
    answer:
      "Flexible benefits are managed in OneHub. You can choose options such as buying extra holiday, cycle to work, health cover for family and retail discounts. New starters can make choices within 30 days of joining; after that, changes happen in the annual window.",
    source: "Benefits handbook",
    followUps: ["Do I get private medical cover?", "How do share schemes work?"],
  },
  {
    id: "medical",
    topic: "Benefits",
    keywords: ["medical", "health insurance", "bupa", "private health", "dental", "gp"],
    answer:
      "Private medical cover is provided through Bupa. Check your eligibility and add family members in OneHub, then use the Bupa app to find treatment and make claims.",
    source: "Benefits handbook",
  },
  {
    id: "shares",
    topic: "Rewards",
    keywords: ["share", "shares", "sharesave", "eq", "investment", "invest", "stock"],
    answer:
      "Colleague share schemes are run through EQ. When a scheme opens you'll get an invitation, and you can join through the EQ app. Schemes are optional and the value of shares can go down as well as up.",
    source: "Reward and recognition guide",
  },
  {
    id: "bonus",
    topic: "Rewards",
    keywords: ["bonus", "reward", "rewards", "pay rise", "increase", "performance", "recognition"],
    answer:
      "Reward is linked to your role, performance and the bank's results. You'll set goals with your manager in Workday in your first 90 days, and these feed into year-end conversations. Ask your manager how this works in your team.",
    source: "Reward and recognition guide",
    followUps: ["How do I set my goals?"],
  },
  {
    id: "goals",
    topic: "Performance",
    keywords: ["goal", "goals", "objectives", "probation", "review", "check-in", "90 day", "90-day"],
    answer:
      "You'll agree goals with your manager in Workday during your first few weeks, with check-ins at 30, 60 and 90 days. Your Journey tab shows these milestones so nothing sneaks up on you.",
    source: "Performance and probation guide",
  },
  {
    id: "wellbeing",
    topic: "Wellbeing",
    keywords: ["wellbeing", "mental health", "stress", "eap", "counselling", "headspace", "support"],
    answer:
      "The Employee Assistance Programme offers free, confidential support 24/7, including counselling. Headspace is also free for colleagues for meditation, sleep and focus. Both are in the Tools app store.",
    source: "Wellbeing hub",
  },
  {
    id: "hybrid",
    topic: "Ways of working",
    keywords: ["hybrid", "work from home", "wfh", "office days", "remote", "flexible working"],
    answer:
      "Most teams work hybrid, with a balance of office and home days agreed with your manager. Book a desk in Engage before coming in. You can request a formal flexible working pattern in Workday.",
    source: "Hybrid working policy",
  },
  {
    id: "expenses",
    topic: "Expenses",
    keywords: ["expense", "expenses", "travel", "claim", "train", "hotel", "amex"],
    answer:
      "Book work travel through Amex GBT so it's within policy, and claim other business expenses in Workday with a photo of your receipt. Your manager approves claims before they're paid with your salary.",
    source: "Travel and expenses policy",
  },
  {
    id: "parental",
    topic: "Family",
    keywords: ["maternity", "paternity", "parental", "adoption", "shared parental", "baby", "family leave"],
    answer:
      "Family leave policies cover maternity, paternity, adoption and shared parental leave. Eligibility and pay depend on your circumstances, so check the Family Leave policy in Workday and speak to HR to plan ahead.",
    source: "Family leave policy",
  },
];

/** Starter questions shown before anything has been asked. */
export const hrSuggestedQuestions = [
  "When is my first pay?",
  "How does my pension work?",
  "What benefits can I choose?",
  "How do I book holiday?",
];
