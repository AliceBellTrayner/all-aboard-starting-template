"use client";

import { useMemo } from "react";
import { defaultProfileFor } from "@/data/mock";
import { useUserRole } from "@/context/user-role";
import { usePersistentState } from "@/lib/use-persistent-state";
import type { ProfileData } from "@/types";

/** The current viewer's profile and preferences, saved in this browser. */
export function useProfile() {
  const { persona } = useUserRole();
  const initial = useMemo(() => defaultProfileFor(persona), [persona]);
  const [profile, setProfile, loaded] = usePersistentState<ProfileData>(`launchpad.profile.${persona.id}.v1`, initial);
  return { profile, setProfile, loaded, persona };
}

/** Pronouns as shown to others, or null when not shared. */
export function pronounText(profile: ProfileData): string | null {
  if (profile.pronouns === "custom") return profile.customPronouns.trim() || null;
  if (profile.pronouns === "unset" || profile.pronouns === "prefer-not") return null;
  return profile.pronouns;
}

/** The name to greet someone by: their preferred name, falling back to a default. */
export function displayName(profile: ProfileData, fallback: string): string {
  return profile.preferredName.trim() || fallback;
}
