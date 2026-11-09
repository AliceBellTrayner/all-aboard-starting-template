"use client";

import type { ReactNode } from "react";
import { UserRoleProvider } from "@/context/user-role";

/** App-wide client providers. Add new context providers here. */
export function Providers({ children }: { children: ReactNode }) {
  return <UserRoleProvider>{children}</UserRoleProvider>;
}
