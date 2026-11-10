/** A message in a one-to-one, in-app chat between two personas. */
export interface ChatMessage {
  id: string;
  senderId: string;
  recipientId: string;
  body: string;
  sentAt: string; // ISO timestamp
}
