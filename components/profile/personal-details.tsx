"use client";

import { useState } from "react";
import { Lock } from "lucide-react";
import type { PersonalDetails, ProfileData } from "@/types";
import { GroupLabel, PrimaryButton, ToolShell } from "@/components/tools/tool-shell";
import { TextField } from "./form-bits";

/** UK-style phone check: at least 10 digits, allowing spaces, brackets and a leading +. */
export function phoneError(value: string, required = false): string | undefined {
  const v = value.trim();
  if (!v) return required ? "Enter a phone number." : undefined;
  if (!/^\+?[\d\s()-]+$/.test(v) || v.replace(/\D/g, "").length < 10) return "Enter a valid phone number.";
  return undefined;
}

function emailError(value: string): string | undefined {
  const v = value.trim();
  if (!v) return undefined;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? undefined : "Enter a valid email address.";
}

export function PersonalDetailsScreen({
  profile,
  onSave,
  onBack,
}: {
  profile: ProfileData;
  onSave: (patch: Partial<ProfileData>) => void;
  onBack: () => void;
}) {
  const [draft, setDraft] = useState<PersonalDetails>(profile.personal);
  const [submitted, setSubmitted] = useState(false);
  const set = (field: keyof PersonalDetails) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setDraft((d) => ({ ...d, [field]: e.target.value }));

  const errors = {
    mobile: phoneError(draft.mobile),
    personalEmail: emailError(draft.personalEmail),
  };
  const hasErrors = Object.values(errors).some(Boolean);

  return (
    <ToolShell
      title="Personal details"
      subtitle="Keep these up to date so we can reach you and send your welcome kit."
      onBack={onBack}
      backLabel="Profile"
      action={
        <PrimaryButton
          onClick={() => {
            setSubmitted(true);
            if (!hasErrors) onSave({ personal: draft });
          }}
        >
          Save details
        </PrimaryButton>
      }
    >
      <GroupLabel>Legal name</GroupLabel>
      <div className="grid grid-cols-2 gap-2.5">
        <TextField label="First name" value={draft.legalFirstName} readOnly aria-readonly />
        <TextField label="Last name" value={draft.legalLastName} readOnly aria-readonly />
      </div>
      <p className="mt-2 flex items-start gap-1.5 px-1 text-[11px] font-semibold text-muted-ink">
        <Lock className="mt-px h-3.5 w-3.5 shrink-0" strokeWidth={2.6} />
        Your legal name comes from your contract. To change it, contact HR. You can set a preferred name instead.
      </p>

      <GroupLabel>Contact</GroupLabel>
      <div className="flex flex-col gap-2.5">
        <TextField
          label="Mobile number"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          value={draft.mobile}
          onChange={set("mobile")}
          placeholder="07700 900000"
          error={submitted ? errors.mobile : undefined}
        />
        <TextField
          label="Personal email"
          type="email"
          autoComplete="email"
          value={draft.personalEmail}
          onChange={set("personalEmail")}
          placeholder="you@example.com"
          hint="Used before you have a work email."
          error={submitted ? errors.personalEmail : undefined}
        />
      </div>

      <GroupLabel>Home address</GroupLabel>
      <div className="flex flex-col gap-2.5">
        <TextField label="Address line 1" autoComplete="address-line1" value={draft.addressLine1} onChange={set("addressLine1")} />
        <TextField label="Address line 2 (optional)" autoComplete="address-line2" value={draft.addressLine2} onChange={set("addressLine2")} />
        <div className="grid grid-cols-2 gap-2.5">
          <TextField label="Town or city" autoComplete="address-level2" value={draft.city} onChange={set("city")} />
          <TextField
            label="Postcode"
            autoComplete="postal-code"
            value={draft.postcode}
            onChange={(e) => setDraft((d) => ({ ...d, postcode: e.target.value.toUpperCase() }))}
          />
        </div>
      </div>
      <p className="mt-2 px-1 text-[11px] font-semibold text-muted-ink">
        Home deliveries for your laptop and welcome kit go to this address.
      </p>
    </ToolShell>
  );
}
