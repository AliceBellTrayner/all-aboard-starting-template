"use client";

import type { ReactNode } from "react";
import { UserRoleProvider } from "@/context/user-role";
import { JourneyProgressProvider } from "@/context/journey-progress";

/** App-wide client providers. Add new context providers here. */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <UserRoleProvider>
      <JourneyProgressProvider>{children}</JourneyProgressProvider>
    </UserRoleProvider>
  );
}
