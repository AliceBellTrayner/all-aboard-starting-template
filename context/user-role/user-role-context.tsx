"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { getDefaultPersonaForRole, getRoleDefinition, PERSONA_ROLES, type Persona, type PersonaRole, type RoleDefinition } from "@/data/mock";

export const USER_ROLE_STORAGE_KEY = "launchpad.userRole.v1";
export const DEFAULT_ROLE: PersonaRole = "new-starter";

export interface UserRoleContextValue {
  role: PersonaRole;
  roleDefinition: RoleDefinition;
  /** The persona currently being viewed as. */
  persona: Persona;
  setRole: (role: PersonaRole) => void;
  /** False until the stored role has been read on the client. */
  hydrated: boolean;
}

const UserRoleContext = createContext<UserRoleContextValue | null>(null);

function isPersonaRole(value: unknown): value is PersonaRole {
  return typeof value === "string" && (PERSONA_ROLES as string[]).includes(value);
}

export function UserRoleProvider({ children }: { children: ReactNode }) {
  // Always start from the default so server and client markup match. The
  // stored choice is applied right after mount.
  const [role, setRoleState] = useState<PersonaRole>(DEFAULT_ROLE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(USER_ROLE_STORAGE_KEY);
      if (isPersonaRole(stored)) setRoleState(stored);
    } catch {
      // Storage can be unavailable (private mode, blocked cookies). Fall back to default.
    }
    setHydrated(true);
  }, []);

  const setRole = useCallback((next: PersonaRole) => {
    setRoleState(next);
    try {
      window.localStorage.setItem(USER_ROLE_STORAGE_KEY, next);
    } catch {
      // Ignore write failures; the in-memory role still changes.
    }
  }, []);

  const value = useMemo<UserRoleContextValue>(
    () => ({
      role,
      roleDefinition: getRoleDefinition(role),
      persona: getDefaultPersonaForRole(role),
      setRole,
      hydrated,
    }),
    [role, setRole, hydrated],
  );

  return <UserRoleContext.Provider value={value}>{children}</UserRoleContext.Provider>;
}

/** Current role, persona and setter. Must be used inside `UserRoleProvider`. */
export function useUserRole(): UserRoleContextValue {
  const ctx = useContext(UserRoleContext);
  if (!ctx) throw new Error("useUserRole must be used inside <UserRoleProvider>");
  return ctx;
}
