"use client";

import { useState } from "react";
import { BellRing, CalendarCheck, CalendarDays, Flag, ListChecks, Mail, MessageCircle, MessageSquareText, MoonStar, Smartphone, Zap, BellOff } from "lucide-react";
import type { NotificationCategory, ProfileData, ReminderFrequency } from "@/types";
import { cn } from "@/lib/utils";
import { ChoiceCard, GroupLabel, PrimaryButton, ToolShell } from "@/components/tools/tool-shell";
import { SwitchRow } from "./form-bits";

const FREQUENCIES: { id: ReminderFrequency; title: string; detail: string; icon: typeof Zap }[] = [
  { id: "instant", title: "As they happen", detail: "Get each update straight away", icon: Zap },
  { id: "daily", title: "Daily digest", detail: "One round-up a day at a time you choose", icon: CalendarCheck },
  { id: "weekly", title: "Weekly digest", detail: "A summary every Monday morning", icon: CalendarDays },
  { id: "off", title: "Off", detail: "No reminders, I'll check the app myself", icon: BellOff },
];

const DIGEST_TIMES = [
  { value: "08:00", label: "8:00am" },
  { value: "12:30", label: "12:30pm" },
  { value: "17:30", label: "5:30pm" },
];

const CATEGORIES: { id: NotificationCategory; label: string; detail: string; icon: typeof Zap }[] = [
  { id: "tasks", label: "Tasks and approvals", detail: "New tasks, deadlines and sign-offs", icon: ListChecks },
  { id: "messages", label: "Messages", detail: "From your manager and buddies", icon: MessageCircle },
  { id: "reminders", label: "Reminders", detail: "Upcoming meetings and things to prepare", icon: BellRing },
  { id: "milestones", label: "Milestones", detail: "When you reach a new stage of your journey", icon: Flag },
];

export function digestTimeLabel(value: string): string {
  return DIGEST_TIMES.find((t) => t.value === value)?.label ?? value;
}

/** One-line summary of how and when someone is notified. */
export function notificationSummary(n: ProfileData["notifications"]): string {
  switch (n.frequency) {
    case "instant":
      return "As they happen";
    case "daily":
      return `Daily digest at ${digestTimeLabel(n.digestTime)}`;
    case "weekly":
      return "Weekly digest on Mondays";
    case "off":
      return "Reminders off";
  }
}

export function NotificationPreferences({
  profile,
  onSave,
  onBack,
}: {
  profile: ProfileData;
  onSave: (patch: Partial<ProfileData>) => void;
  onBack: () => void;
}) {
  const [draft, setDraft] = useState(profile.notifications);
  const off = draft.frequency === "off";
  const noChannel = !off && !draft.channels.push && !draft.channels.email && !draft.channels.sms;

  return (
    <ToolShell
      title="Notifications"
      subtitle="Choose how often we remind you and what you hear about."
      onBack={onBack}
      backLabel="Profile"
      action={
        <PrimaryButton disabled={noChannel} onClick={() => onSave({ notifications: draft })}>
          {noChannel ? "Pick at least one channel" : "Save notifications"}
        </PrimaryButton>
      }
    >
      <GroupLabel>Reminders</GroupLabel>
      <div role="radiogroup" aria-label="Reminder frequency" className="flex flex-col gap-2">
        {FREQUENCIES.map((f) => (
          <ChoiceCard
            key={f.id}
            selected={draft.frequency === f.id}
            onSelect={() => setDraft((d) => ({ ...d, frequency: f.id }))}
            icon={<f.icon className="h-5 w-5" strokeWidth={2.4} />}
            title={f.title}
            detail={f.detail}
            badge={f.id === "daily" ? "Recommended" : undefined}
          />
        ))}
      </div>
      {draft.frequency === "daily" && (
        <div className="mt-2.5 rounded-3xl bg-white p-4 ring-1 ring-ink/5">
          <p className="mb-2 text-[11px] font-extrabold uppercase tracking-[0.12em] text-muted-ink">Send my digest at</p>
          <div role="radiogroup" aria-label="Digest time" className="flex gap-1.5">
            {DIGEST_TIMES.map((t) => (
              <button
                key={t.value}
                type="button"
                role="radio"
                aria-checked={draft.digestTime === t.value}
                onClick={() => setDraft((d) => ({ ...d, digestTime: t.value }))}
                className={cn(
                  "flex-1 rounded-xl px-2 py-2.5 text-xs font-black outline-none focus-visible:ring-4 focus-visible:ring-primary/30",
                  draft.digestTime === t.value ? "bg-primary text-white" : "bg-sky-100 text-ink",
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className={off ? "pointer-events-none opacity-50" : undefined} aria-disabled={off || undefined}>
        <GroupLabel>What to include</GroupLabel>
        <div className="flex flex-col gap-2">
          {CATEGORIES.map((c) => (
            <SwitchRow
              key={c.id}
              icon={<c.icon className="h-5 w-5" strokeWidth={2.4} />}
              label={c.label}
              detail={c.detail}
              checked={draft.categories[c.id]}
              disabled={off}
              onChange={(next) => setDraft((d) => ({ ...d, categories: { ...d.categories, [c.id]: next } }))}
            />
          ))}
        </div>

        <GroupLabel>How to reach me</GroupLabel>
        <div className="flex flex-col gap-2">
          <SwitchRow
            icon={<Smartphone className="h-5 w-5" strokeWidth={2.4} />}
            label="App notifications"
            checked={draft.channels.push}
            disabled={off}
            onChange={(push) => setDraft((d) => ({ ...d, channels: { ...d.channels, push } }))}
          />
          <SwitchRow
            icon={<Mail className="h-5 w-5" strokeWidth={2.4} />}
            label="Email"
            detail="To your personal email until you have a work one"
            checked={draft.channels.email}
            disabled={off}
            onChange={(email) => setDraft((d) => ({ ...d, channels: { ...d.channels, email } }))}
          />
          <SwitchRow
            icon={<MessageSquareText className="h-5 w-5" strokeWidth={2.4} />}
            label="Text message"
            detail="Only for time-sensitive things, like your first day"
            checked={draft.channels.sms}
            disabled={off}
            onChange={(sms) => setDraft((d) => ({ ...d, channels: { ...d.channels, sms } }))}
          />
        </div>

        <GroupLabel>Quiet time</GroupLabel>
        <SwitchRow
          icon={<MoonStar className="h-5 w-5" strokeWidth={2.4} />}
          label="Pause on weekends"
          detail="Hold non-urgent updates until Monday"
          checked={draft.pauseWeekends}
          disabled={off}
          onChange={(pauseWeekends) => setDraft((d) => ({ ...d, pauseWeekends }))}
        />
      </div>
    </ToolShell>
  );
}
