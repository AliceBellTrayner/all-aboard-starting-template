import { Bell, ListChecks, Route, Sparkles, Store, Users, type LucideIcon } from "lucide-react";
import type { ShortcutId } from "@/types";

/** Presentation for home screen shortcuts. */
export const SHORTCUT_ICON: Record<ShortcutId, LucideIcon> = {
  journey: Route,
  tasks: ListChecks,
  "app-store": Store,
  buddy: Users,
  "ask-hr": Sparkles,
  notifications: Bell,
};
