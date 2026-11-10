"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, SendHorizontal, X } from "lucide-react";
import { getRoleDefinition, type Persona } from "@/data/mock";
import type { ChatMessage } from "@/types";
import { PersonaAvatar } from "@/components/role-switcher";
import { cn } from "@/lib/utils";

const TZ = "Europe/London";
const timeFormat = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: TZ });
const dayFormat = new Intl.DateTimeFormat("en-GB", { weekday: "short", day: "numeric", month: "short", timeZone: TZ });

/** Messages exchanged between two people, oldest first. */
export function threadBetween(messages: ChatMessage[], a: string, b: string): ChatMessage[] {
  return messages.filter(
    (m) => (m.senderId === a && m.recipientId === b) || (m.senderId === b && m.recipientId === a),
  );
}

/** Speech-bubble button shown top right of each Buddy view. */
export function ChatBubbleButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.9 }}
      aria-label={label}
      title={label}
      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl rounded-br-md bg-primary text-white shadow-[0_12px_24px_-10px_rgba(47,43,255,0.8)] outline-none focus-visible:ring-4 focus-visible:ring-primary/35"
    >
      <MessageCircle className="h-6 w-6" strokeWidth={2.4} />
    </motion.button>
  );
}

type BuddyChatSheetProps = {
  open: boolean;
  onClose: () => void;
  viewer: Persona;
  contacts: Persona[];
  messages: ChatMessage[];
  onSend: (recipientId: string, body: string) => void;
};

/** Bottom sheet with an in-app chat thread. Contact chips appear when there is more than one person. */
export function BuddyChatSheet({ open, onClose, viewer, contacts, messages, onSend }: BuddyChatSheetProps) {
  const [activeId, setActiveId] = useState<string | undefined>(contacts[0]?.id);
  const [draft, setDraft] = useState("");
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Reset to the first contact whenever the set of people changes (e.g. role switch).
  const contactKey = contacts.map((c) => c.id).join(",");
  useEffect(() => {
    setActiveId(contacts[0]?.id);
    setDraft("");
  }, [contactKey]); // eslint-disable-line react-hooks/exhaustive-deps -- contactKey captures contacts

  const active = contacts.find((c) => c.id === activeId) ?? contacts[0];
  const thread = active ? threadBetween(messages, viewer.id, active.id) : [];

  // Keep the newest message in view.
  useEffect(() => {
    if (!open) return;
    const list = listRef.current;
    if (list) list.scrollTo({ top: list.scrollHeight, behavior: "smooth" });
  }, [open, thread.length, active?.id]);

  // Escape closes the sheet.
  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  function submit(event: FormEvent) {
    event.preventDefault();
    const body = draft.trim();
    if (!body || !active) return;
    onSend(active.id, body);
    setDraft("");
    inputRef.current?.focus();
  }

  return (
    <AnimatePresence>
      {open && active && (
        <motion.div className="absolute inset-0 z-50 flex flex-col justify-end" initial={false}>
          <motion.button
            type="button"
            aria-label="Close chat"
            tabIndex={-1}
            onClick={onClose}
            className="absolute inset-0 bg-[#0b1630]/45 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />

          <motion.section
            role="dialog"
            aria-modal="true"
            aria-label={`Chat with ${active.fullName}`}
            className="relative flex h-[88%] flex-col overflow-hidden rounded-t-[2.25rem] bg-[#f7fbff] shadow-[0_-30px_60px_-20px_rgba(11,22,48,0.5)]"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 36 }}
          >
            {/* Header */}
            <div className="border-b border-ink/5 bg-white px-5 pb-3 pt-3">
              <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-ink/15" />
              <div className="flex items-center gap-3">
                <PersonaAvatar initials={active.initials} role={active.role} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[15px] font-black text-ink">{active.fullName}</p>
                  <p className="truncate text-xs font-semibold text-muted-ink">{getRoleDefinition(active.role).label}</p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink/5 text-ink outline-none focus-visible:ring-4 focus-visible:ring-primary/30"
                >
                  <X className="h-5 w-5" strokeWidth={2.6} />
                </button>
              </div>

              {contacts.length > 1 && (
                <div role="tablist" aria-label="Choose who to chat with" className="mt-3 flex gap-2">
                  {contacts.map((c) => {
                    const selected = c.id === active.id;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        role="tab"
                        aria-selected={selected}
                        onClick={() => setActiveId(c.id)}
                        className={cn(
                          "flex items-center gap-1.5 rounded-full py-1 pl-1 pr-3 text-xs font-black outline-none transition-colors focus-visible:ring-4 focus-visible:ring-primary/30",
                          selected ? "bg-primary text-white" : "bg-ink/5 text-ink hover:bg-ink/10",
                        )}
                      >
                        <PersonaAvatar initials={c.initials} role={c.role} size="sm" />
                        {c.firstName}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Messages */}
            <div ref={listRef} className="no-scrollbar flex-1 overflow-y-auto px-4 py-4" aria-live="polite">
              {thread.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <PersonaAvatar initials={active.initials} role={active.role} size="lg" />
                  <p className="mt-3 text-base font-black text-ink">Say hello to {active.firstName}</p>
                  <p className="mt-1 max-w-[16rem] text-xs font-semibold text-muted-ink">
                    Messages stay here in LaunchPad, so there&apos;s nothing extra to install.
                  </p>
                </div>
              ) : (
                <ol className="flex flex-col gap-2">
                  {thread.map((m, i) => {
                    const mine = m.senderId === viewer.id;
                    const day = dayFormat.format(new Date(m.sentAt));
                    const showDay = i === 0 || dayFormat.format(new Date(thread[i - 1].sentAt)) !== day;
                    return (
                      <li key={m.id} className="flex flex-col">
                        {showDay && (
                          <span className="my-2 self-center rounded-full bg-ink/5 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-[0.12em] text-muted-ink">
                            {day}
                          </span>
                        )}
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.18 }}
                          className={cn("flex max-w-[80%] flex-col", mine ? "items-end self-end" : "items-start self-start")}
                        >
                          <p
                            className={cn(
                              "rounded-3xl px-4 py-2.5 text-sm font-semibold leading-snug",
                              mine
                                ? "rounded-br-md bg-primary text-white"
                                : "rounded-bl-md bg-white text-ink shadow-sm ring-1 ring-ink/5",
                            )}
                          >
                            {m.body}
                          </p>
                          <span className="mt-0.5 px-2 text-[10px] font-bold text-muted-ink">
                            {timeFormat.format(new Date(m.sentAt))}
                          </span>
                        </motion.div>
                      </li>
                    );
                  })}
                </ol>
              )}
            </div>

            {/* Composer */}
            <form
              onSubmit={submit}
              className="flex items-center gap-2 border-t border-ink/5 bg-white px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3"
            >
              <label htmlFor="buddy-chat-input" className="sr-only">
                Message {active.firstName}
              </label>
              <input
                id="buddy-chat-input"
                ref={inputRef}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder={`Message ${active.firstName}…`}
                autoComplete="off"
                className="min-w-0 flex-1 rounded-full bg-[#f0f4fc] px-4 py-3 text-sm font-semibold text-ink outline-none placeholder:text-muted-ink focus-visible:ring-4 focus-visible:ring-primary/25"
              />
              <motion.button
                type="submit"
                whileTap={{ scale: 0.9 }}
                disabled={!draft.trim()}
                aria-label="Send message"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-white outline-none transition-opacity disabled:opacity-40 focus-visible:ring-4 focus-visible:ring-primary/35"
              >
                <SendHorizontal className="h-5 w-5" strokeWidth={2.6} />
              </motion.button>
            </form>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
