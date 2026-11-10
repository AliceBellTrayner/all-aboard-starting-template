"use client";

import { useState } from "react";
import { HeartHandshake, Plus, Trash2 } from "lucide-react";
import type { EmergencyContact, ProfileData } from "@/types";
import { PrimaryButton, ToolShell } from "@/components/tools/tool-shell";
import { TextField } from "./form-bits";
import { phoneError } from "./personal-details";

const MAX_CONTACTS = 2;

export function EmergencyContacts({
  profile,
  onSave,
  onBack,
}: {
  profile: ProfileData;
  onSave: (patch: Partial<ProfileData>) => void;
  onBack: () => void;
}) {
  const [contacts, setContacts] = useState<EmergencyContact[]>(
    profile.emergencyContacts.length ? profile.emergencyContacts : [{ id: `ec-${Date.now()}`, name: "", relationship: "", phone: "" }],
  );
  const [submitted, setSubmitted] = useState(false);

  const update = (id: string, field: keyof EmergencyContact, value: string) =>
    setContacts((cs) => cs.map((c) => (c.id === id ? { ...c, [field]: value } : c)));

  // Fully empty rows are ignored; partly filled rows must be completed.
  const isBlank = (c: EmergencyContact) => !c.name.trim() && !c.relationship.trim() && !c.phone.trim();
  const errorsFor = (c: EmergencyContact) =>
    isBlank(c)
      ? {}
      : {
          name: c.name.trim() ? undefined : "Enter a name.",
          phone: phoneError(c.phone, true),
        };
  const hasErrors = contacts.some((c) => Object.values(errorsFor(c)).some(Boolean));

  return (
    <ToolShell
      title="Emergency contacts"
      subtitle="Who should we contact if something happens to you at work? Add up to two people."
      onBack={onBack}
      backLabel="Profile"
      action={
        <PrimaryButton
          onClick={() => {
            setSubmitted(true);
            if (!hasErrors) onSave({ emergencyContacts: contacts.filter((c) => !isBlank(c)).map((c) => ({ ...c, name: c.name.trim(), relationship: c.relationship.trim(), phone: c.phone.trim() })) });
          }}
        >
          Save contacts
        </PrimaryButton>
      }
    >
      <div className="flex flex-col gap-3">
        {contacts.map((c, i) => {
          const errors = submitted ? errorsFor(c) : {};
          return (
            <section key={c.id} aria-label={`Emergency contact ${i + 1}`} className="rounded-3xl bg-white p-4 ring-1 ring-ink/5">
              <div className="mb-3 flex items-center justify-between">
                <p className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.14em] text-muted-ink">
                  <HeartHandshake className="h-4 w-4" strokeWidth={2.6} />
                  {i === 0 ? "Main contact" : "Second contact"}
                </p>
                <button
                  type="button"
                  onClick={() => setContacts((cs) => cs.filter((x) => x.id !== c.id))}
                  aria-label={`Remove ${c.name || `contact ${i + 1}`}`}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-muted-ink outline-none hover:bg-coral/10 hover:text-[#c2392d] focus-visible:ring-4 focus-visible:ring-primary/30"
                >
                  <Trash2 className="h-4 w-4" strokeWidth={2.4} />
                </button>
              </div>
              <div className="flex flex-col gap-2.5">
                <TextField label="Full name" autoComplete="off" value={c.name} onChange={(e) => update(c.id, "name", e.target.value)} error={errors.name} />
                <TextField
                  label="Relationship"
                  value={c.relationship}
                  onChange={(e) => update(c.id, "relationship", e.target.value)}
                  placeholder="e.g. Partner, Parent, Friend"
                />
                <TextField
                  label="Phone number"
                  type="tel"
                  inputMode="tel"
                  autoComplete="off"
                  value={c.phone}
                  onChange={(e) => update(c.id, "phone", e.target.value)}
                  error={errors.phone}
                />
              </div>
            </section>
          );
        })}

        {contacts.length < MAX_CONTACTS && (
          <button
            type="button"
            onClick={() => setContacts((cs) => [...cs, { id: `ec-${Date.now()}`, name: "", relationship: "", phone: "" }])}
            className="flex items-center justify-center gap-2 rounded-3xl border-2 border-dashed border-ink/15 px-4 py-4 text-sm font-black text-primary outline-none hover:bg-white focus-visible:ring-4 focus-visible:ring-primary/30"
          >
            <Plus className="h-4 w-4" strokeWidth={3} />
            {contacts.length === 0 ? "Add a contact" : "Add another contact"}
          </button>
        )}
      </div>
      <p className="mt-3 px-1 text-[11px] font-semibold text-muted-ink">
        Only used in an emergency. Let your contacts know you&apos;ve added them.
      </p>
    </ToolShell>
  );
}
