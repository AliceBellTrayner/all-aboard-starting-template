"use client";

import { useState } from "react";
import { Building2, MessageSquareQuote, UserRound } from "lucide-react";
import { HOME_CARDS, MAX_SHORTCUTS, SHORTCUTS } from "@/data/mock";
import type { HomeCardId, ProfileData, ShortcutId } from "@/types";
import { ChoiceCard, GroupLabel, PrimaryButton, ToolShell } from "@/components/tools/tool-shell";
import { SwitchRow } from "./form-bits";
import { SHORTCUT_ICON } from "./shortcut-icons";

const CARD_ICON: Record<HomeCardId, typeof Building2> = {
  recruiter: MessageSquareQuote,
  manager: UserRound,
  office: Building2,
};

export function HomePreferences({
  profile,
  onSave,
  onBack,
}: {
  profile: ProfileData;
  onSave: (patch: Partial<ProfileData>) => void;
  onBack: () => void;
}) {
  const [shortcuts, setShortcuts] = useState<ShortcutId[]>(profile.home.shortcuts);
  const [cards, setCards] = useState(profile.home.cards);
  const full = shortcuts.length >= MAX_SHORTCUTS;

  function toggleShortcut(id: ShortcutId) {
    setShortcuts((s) => (s.includes(id) ? s.filter((x) => x !== id) : s.length < MAX_SHORTCUTS ? [...s, id] : s));
  }

  return (
    <ToolShell
      title="Home screen"
      subtitle="Pin the shortcuts you use most and choose what appears on Home."
      onBack={onBack}
      backLabel="Profile"
      action={<PrimaryButton onClick={() => onSave({ home: { shortcuts, cards } })}>Save home screen</PrimaryButton>}
    >
      <div className="flex items-baseline justify-between">
        <GroupLabel>Shortcuts</GroupLabel>
        <span className="px-1 text-[11px] font-extrabold tabular-nums text-muted-ink">
          {shortcuts.length}/{MAX_SHORTCUTS} pinned
        </span>
      </div>
      <div className="flex flex-col gap-2">
        {SHORTCUTS.map((s) => {
          const Icon = SHORTCUT_ICON[s.id];
          const selected = shortcuts.includes(s.id);
          return (
            <div key={s.id} className={!selected && full ? "opacity-50" : undefined}>
              <ChoiceCard
                multi
                selected={selected}
                onSelect={() => toggleShortcut(s.id)}
                icon={<Icon className="h-5 w-5" strokeWidth={2.4} />}
                title={s.label}
                detail={!selected && full ? `Unpin one to add this (max ${MAX_SHORTCUTS})` : s.detail}
              />
            </div>
          );
        })}
      </div>

      <GroupLabel>Show on Home</GroupLabel>
      <div className="flex flex-col gap-2">
        {HOME_CARDS.map((c) => {
          const Icon = CARD_ICON[c.id];
          return (
            <SwitchRow
              key={c.id}
              icon={<Icon className="h-5 w-5" strokeWidth={2.4} />}
              label={c.label}
              detail={c.detail}
              checked={cards[c.id]}
              onChange={(next) => setCards((cs) => ({ ...cs, [c.id]: next }))}
            />
          );
        })}
      </div>
    </ToolShell>
  );
}
