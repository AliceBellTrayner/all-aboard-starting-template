"use client";

import { useState } from "react";
import { Info, Laptop, Smartphone, Sparkles } from "lucide-react";
import { getTechRecommendation } from "@/data/mock";
import type { TechChoice } from "@/types";
import { ChoiceCard, GroupLabel, PrimaryButton, ToolShell } from "./tool-shell";

export type TechSelection = Partial<Record<TechChoice["id"], string>>;

const CHOICE_ICON = { laptop: Laptop, phone: Smartphone } as const;

export function ChooseTech({
  jobTitle,
  saved,
  onSave,
  onBack,
}: {
  jobTitle: string;
  saved: TechSelection;
  onSave: (selection: TechSelection) => void;
  onBack: () => void;
}) {
  const rec = getTechRecommendation(jobTitle);
  // Start from what was saved, falling back to the recommendation.
  const [draft, setDraft] = useState<TechSelection>(() =>
    Object.fromEntries(rec.choices.map((c) => [c.id, saved[c.id] ?? c.recommendedId])),
  );
  const caveat = rec.laptopCaveat && draft.laptop === rec.laptopCaveat.optionId ? rec.laptopCaveat.note : null;

  return (
    <ToolShell
      title="Choose your tech"
      subtitle={`We've pre-selected what works best for ${rec.jobFamily}. Change anything you like.`}
      onBack={onBack}
      action={<PrimaryButton onClick={() => onSave(draft)}>Confirm my tech</PrimaryButton>}
    >
      {rec.choices.map((choice) => {
        const Icon = CHOICE_ICON[choice.id];
        return (
          <section key={choice.id} role="radiogroup" aria-label={choice.title} className="mb-2">
            <GroupLabel>{choice.title}</GroupLabel>
            <p className="mb-2.5 flex items-start gap-1.5 px-1 text-xs font-bold text-[#7a4f00]">
              <Sparkles className="mt-px h-3.5 w-3.5 shrink-0" strokeWidth={2.6} />
              {choice.reason}
            </p>
            <div className="flex flex-col gap-2">
              {choice.options.map((option) => (
                <ChoiceCard
                  key={option.id}
                  selected={draft[choice.id] === option.id}
                  onSelect={() => setDraft((d) => ({ ...d, [choice.id]: option.id }))}
                  icon={<Icon className="h-5 w-5" strokeWidth={2.4} />}
                  title={option.label}
                  detail={option.detail}
                  badge={option.id === choice.recommendedId ? "Recommended" : undefined}
                />
              ))}
            </div>
            {choice.id === "laptop" && caveat && (
              <p role="note" className="mt-2.5 flex items-start gap-2 rounded-2xl bg-coral/10 px-3.5 py-3 text-xs font-bold text-[#a3342a]">
                <Info className="mt-px h-4 w-4 shrink-0" strokeWidth={2.6} />
                {caveat}
              </p>
            )}
          </section>
        );
      })}
    </ToolShell>
  );
}
