export type NotificationKind = "approval" | "task" | "message" | "reminder" | "milestone";

export interface NotificationItem {
  id: string;
  /** Persona id of the person who receives this notification. */
  recipientId: string;
  kind: NotificationKind;
  title: string;
  body: string;
  /** ISO timestamp. */
  createdAt: string;
  read: boolean;
}
