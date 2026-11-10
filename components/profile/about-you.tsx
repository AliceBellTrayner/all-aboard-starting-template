"use client";

import { useState } from "react";
import type { PronounOption, ProfileData } from "@/types";
import { ChoiceCard, GroupLabel, PrimaryButton, ToolShell } from "@/components/tools/tool-shell";
import { SwitchRow, TextField } from "./form-bits";

const PRONOUN_OPTIONS: { id: PronounOption; label: string }[] = [
  { id: "she/her", label: "she/her" },
  { id: "he/him", label: "he/him" },
  { id: "they/them", label: "they/them" },
  { id: "custom", label: "Use my own" },
  { id: "prefer-not", label: "Prefer not to say" },
];

export function AboutYou({
  profile,
  legalFirstName,
  onSave,
  onBack,
}: {
  profile: ProfileData;
  legalFirstName: string;
  onSave: (patch: Partial<ProfileData>) => void;
  onBack: () => void;
}) {
  const [preferredName, setPreferredName] = useState(profile.preferredName);
  const [pronouns, setPronouns] = useState<PronounOption>(profile.pronouns);
  const [customPronouns, setCustomPronouns] = useState(profile.customPronouns);
  const [showPronouns, setShowPronouns] = useState(profile.showPronouns);

  const customMissing = pronouns === "custom" && !customPronouns.trim();
  const shareable = pronouns !== "unset" && pronouns !== "prefer-not";

  return (
    <ToolShell
      title="Name and pronouns"
      subtitle="How you'd like to be addressed across the app and by your team."
      onBack={onBack}
      backLabel="Profile"
      action={
        <PrimaryButton
          disabled={customMissing}
          onClick={() =>
            onSave({
              preferredName: preferredName.trim() || legalFirstName,
              pronouns,
              customPronouns: customPronouns.trim(),
              showPronouns,
            })
          }
        >
          Save
        </PrimaryButton>
      }
    >
      <TextField
        label="Preferred name"
        value={preferredName}
        onChange={(e) => setPreferredName(e.target.value)}
        placeholder={legalFirstName}
        hint={`We'll greet you by this name. Your legal name (${legalFirstName}) stays on payroll and contracts.`}
        autoComplete="nickname"
        maxLength={40}
      />

      <GroupLabel>Pronouns</GroupLabel>
      <div role="radiogroup" aria-label="Pronouns" className="flex flex-col gap-2">
        {PRONOUN_OPTIONS.map((o) => (
          <ChoiceCard key={o.id} selected={pronouns === o.id} onSelect={() => setPronouns(o.id)} title={o.label} />
        ))}
      </div>
      {pronouns === "custom" && (
        <TextField
          className="mt-3"
          label="Your pronouns"
          value={customPronouns}
          onChange={(e) => setCustomPronouns(e.target.value)}
          placeholder="e.g. ze/zir"
          error={customMissing ? "Enter your pronouns, or pick another option." : undefined}
          maxLength={30}
        />
      )}

      {shareable && (
        <div className="mt-4">
          <SwitchRow
            label="Show my pronouns to colleagues"
            detail="Shown next to your name for your manager and buddies."
            checked={showPronouns}
            onChange={setShowPronouns}
          />
        </div>
      )}
    </ToolShell>
  );
}
