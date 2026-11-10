"use client";

import { useState } from "react";
import {
  Accessibility,
  ArrowUpRight,
  Ear,
  Headphones,
  Keyboard,
  Laptop,
  Mic,
  Monitor,
  Mouse,
  MousePointer2,
  PlugZap,
  ScanSearch,
  type LucideIcon,
} from "lucide-react";
import { getPeripherals } from "@/data/mock";
import { ChoiceCard, GroupLabel, PrimaryButton, ToolShell } from "./tool-shell";

const ICON: Record<string, LucideIcon> = {
  headset: Headphones,
  monitor: Monitor,
  "keyboard-mouse": Mouse,
  dock: PlugZap,
  stand: Laptop,
  "ergo-keyboard": Keyboard,
  "vertical-mouse": MousePointer2,
  magnifier: ScanSearch,
  "speech-to-text": Mic,
  "screen-reader": Ear,
};

/** Set NEXT_PUBLIC_IT_SUPPORT_URL in .env to point the IT@LBG link at the real portal. */
const IT_SUPPORT_URL = process.env.NEXT_PUBLIC_IT_SUPPORT_URL || "#";

export function ChoosePeripherals({
  saved,
  onSave,
  onBack,
}: {
  saved: string[] | null;
  onSave: (ids: string[]) => void;
  onBack: () => void;
}) {
  const items = getPeripherals();
  const [draft, setDraft] = useState<string[]>(() => saved ?? items.filter((p) => p.recommended).map((p) => p.id));

  function toggle(id: string) {
    setDraft((d) => (d.includes(id) ? d.filter((x) => x !== id) : [...d, id]));
  }

  const render = (group: "standard" | "assistive") =>
    items
      .filter((p) => p.group === group)
      .map((p) => {
        const Icon = ICON[p.id] ?? Headphones;
        return (
          <ChoiceCard
            key={p.id}
            multi
            selected={draft.includes(p.id)}
            onSelect={() => toggle(p.id)}
            icon={<Icon className="h-5 w-5" strokeWidth={2.4} />}
            title={p.label}
            detail={p.detail}
            badge={p.recommended ? "Recommended" : undefined}
          />
        );
      });

  return (
    <ToolShell
      title="Choose your peripherals"
      subtitle="Pick what you need for a comfortable set-up, at home or in the office."
      onBack={onBack}
      action={
        <PrimaryButton onClick={() => onSave(draft)}>
          {draft.length === 0 ? "I don't need any" : `Request ${draft.length} ${draft.length === 1 ? "item" : "items"}`}
        </PrimaryButton>
      }
    >
      <GroupLabel>Everyday kit</GroupLabel>
      <div className="flex flex-col gap-2">{render("standard")}</div>

      <GroupLabel>Assistive tech</GroupLabel>
      <div className="flex flex-col gap-2">{render("assistive")}</div>

      <a
        href={IT_SUPPORT_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 flex items-center gap-3 rounded-3xl bg-ink p-4 text-white outline-none focus-visible:ring-4 focus-visible:ring-primary/40"
      >
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/15">
          <Accessibility className="h-5 w-5" strokeWidth={2.4} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[15px] font-black">Need something else?</span>
          <span className="block text-xs font-semibold text-white/75">
            Workplace adjustments and specialist kit through IT@LBG
          </span>
        </span>
        <ArrowUpRight className="h-5 w-5 shrink-0" strokeWidth={2.6} />
      </a>
    </ToolShell>
  );
}
