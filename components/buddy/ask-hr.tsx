"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, BookOpen, Check, SendHorizontal, Sparkles, UserRound, X } from "lucide-react";
import { getHrSuggestedQuestions, type Persona } from "@/data/mock";
import { askHr } from "@/lib/ask-hr";
import { cn } from "@/lib/utils";

interface HrMessage {
  id: string;
  from: "user" | "ai";
  text: string;
  source?: string;
  followUps?: string[];
  escalate?: boolean;
}

function AiAvatar({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const dims = size === "lg" ? "h-14 w-14" : size === "md" ? "h-10 w-10" : "h-7 w-7";
  const icon = size === "lg" ? "h-7 w-7" : size === "md" ? "h-5 w-5" : "h-3.5 w-3.5";
  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#9b8cff] via-[#5b4dff] to-[#2f2bff] text-white shadow-inner",
        dims,
      )}
    >
      <Sparkles className={icon} strokeWidth={2.4} />
    </span>
  );
}

function SuggestionChips({ items, onPick, disabled }: { items: string[]; onPick: (q: string) => void; disabled?: boolean }) {
  if (items.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((q) => (
        <button
          key={q}
          type="button"
          disabled={disabled}
          onClick={() => onPick(q)}
          className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-primary ring-1 ring-primary/25 outline-none transition-colors hover:bg-primary/5 disabled:opacity-50 focus-visible:ring-4 focus-visible:ring-primary/30"
        >
          {q}
        </button>
      ))}
    </div>
  );
}

/** Card at the bottom of the Buddy tab that opens the Ask HR AI buddy. */
export function AskHrCard({ onAsk }: { onAsk: (question?: string) => void }) {
  const suggestions = getHrSuggestedQuestions().slice(0, 3);
  return (
    <section
      aria-labelledby="ask-hr-title"
      className="overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-[#1d2550] via-[#252f6b] to-[#3b2fd9] p-4 text-white shadow-[0_22px_44px_-24px_rgba(47,43,255,0.9)]"
    >
      <div className="flex items-center gap-3">
        <AiAvatar size="lg" />
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-white/70">AI buddy</p>
          <h3 id="ask-hr-title" className="text-xl font-black leading-tight">
            Ask HR
          </h3>
          <p className="text-xs font-semibold text-white/80">Pay, benefits, rewards and policies. Any time, even weekends.</p>
        </div>
      </div>
      <div className="mt-3.5 flex flex-wrap gap-1.5">
        {suggestions.map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => onAsk(q)}
            className="rounded-full bg-white/12 px-3 py-1.5 text-xs font-bold text-white ring-1 ring-white/25 outline-none transition-colors hover:bg-white/20 focus-visible:ring-4 focus-visible:ring-white/40"
          >
            {q}
          </button>
        ))}
      </div>
      <motion.button
        type="button"
        whileTap={{ scale: 0.97 }}
        onClick={() => onAsk()}
        className="mt-3.5 flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-black text-[#2f2bff] outline-none focus-visible:ring-4 focus-visible:ring-white/50"
      >
        Ask a question
        <ArrowRight className="h-4 w-4" strokeWidth={3} />
      </motion.button>
    </section>
  );
}

type AskHrSheetProps = {
  open: boolean;
  onClose: () => void;
  viewer: Persona;
  /** Asked automatically when the sheet opens. The nonce lets the same question be re-asked. */
  pending: { question: string; nonce: number } | null;
};

/** Bottom sheet chat with the Ask HR AI buddy. */
export function AskHrSheet({ open, onClose, viewer, pending }: AskHrSheetProps) {
  const intro: HrMessage = {
    id: "intro",
    from: "ai",
    text: `Hi ${viewer.firstName}! I'm your AI onboarding buddy. Ask me anything about pay, pensions, holiday, benefits, rewards or HR policies.`,
  };
  const [messages, setMessages] = useState<HrMessage[]>([intro]);
  const [draft, setDraft] = useState("");
  const [thinking, setThinking] = useState(false);
  const [escalated, setEscalated] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const handledNonce = useRef<number | null>(null);

  async function ask(question: string) {
    const q = question.trim();
    if (!q || thinking) return;
    setMessages((m) => [...m, { id: `u-${Date.now()}`, from: "user", text: q }]);
    setDraft("");
    setThinking(true);
    try {
      const answer = await askHr(q, {
        firstName: viewer.firstName,
        startDate: viewer.role === "new-starter" ? viewer.startDate : undefined,
      });
      setMessages((m) => [
        ...m,
        {
          id: `a-${Date.now()}`,
          from: "ai",
          text: answer.text,
          source: answer.source,
          followUps: answer.followUps,
          escalate: answer.escalate,
        },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        { id: `a-${Date.now()}`, from: "ai", text: "Sorry, something went wrong. Please try again.", escalate: true },
      ]);
    } finally {
      setThinking(false);
    }
  }

  // Ask a question passed in from the card.
  useEffect(() => {
    if (!open || !pending || handledNonce.current === pending.nonce) return;
    handledNonce.current = pending.nonce;
    void ask(pending.question);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once per nonce
  }, [open, pending]);

  // Keep the newest message in view.
  useEffect(() => {
    if (!open) return;
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [open, messages.length, thinking]);

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
    void ask(draft);
  }

  const lastAi = [...messages].reverse().find((m) => m.from === "ai");
  const hasAsked = messages.some((m) => m.from === "user");

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="absolute inset-0 z-50 flex flex-col justify-end" initial={false}>
          <motion.button
            type="button"
            aria-label="Close Ask HR"
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
            aria-label="Ask HR, AI buddy"
            className="relative flex h-[90%] flex-col overflow-hidden rounded-t-[2.25rem] bg-[#f7fbff] shadow-[0_-30px_60px_-20px_rgba(11,22,48,0.5)]"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 36 }}
          >
            {/* Header */}
            <div className="bg-gradient-to-br from-[#1d2550] via-[#252f6b] to-[#3b2fd9] px-5 pb-4 pt-3 text-white">
              <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-white/40" />
              <div className="flex items-center gap-3">
                <AiAvatar />
                <div className="min-w-0 flex-1">
                  <p className="text-[15px] font-black">Ask HR</p>
                  <p className="flex items-center gap-1.5 text-xs font-semibold text-white/75">
                    <span className="h-2 w-2 rounded-full bg-[#58c48a]" aria-hidden="true" />
                    AI buddy · available 24/7
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15 text-white outline-none focus-visible:ring-4 focus-visible:ring-white/40"
                >
                  <X className="h-5 w-5" strokeWidth={2.6} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div ref={listRef} className="no-scrollbar flex-1 overflow-y-auto px-4 py-4" aria-live="polite">
              <ol className="flex flex-col gap-3">
                {messages.map((m) => {
                  const isUser = m.from === "user";
                  const isLastAi = m === lastAi;
                  return (
                    <motion.li
                      key={m.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className={cn("flex gap-2", isUser ? "justify-end" : "justify-start")}
                    >
                      {!isUser && (
                        <span className="mt-1">
                          <AiAvatar size="sm" />
                        </span>
                      )}
                      <div className={cn("flex max-w-[82%] flex-col gap-2", isUser ? "items-end" : "items-start")}>
                        <p
                          className={cn(
                            "rounded-3xl px-4 py-2.5 text-sm font-semibold leading-snug",
                            isUser
                              ? "rounded-br-md bg-primary text-white"
                              : "rounded-bl-md bg-white text-ink shadow-sm ring-1 ring-ink/5",
                          )}
                        >
                          {m.text}
                        </p>
                        {m.source && (
                          <span className="flex items-center gap-1 rounded-full bg-ink/5 px-2.5 py-1 text-[10px] font-extrabold text-muted-ink">
                            <BookOpen className="h-3 w-3" strokeWidth={2.6} />
                            Source: {m.source}
                          </span>
                        )}
                        {m.escalate && isLastAi && (
                          <button
                            type="button"
                            onClick={() => setEscalated(true)}
                            disabled={escalated}
                            className={cn(
                              "flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-black outline-none focus-visible:ring-4 focus-visible:ring-primary/30",
                              escalated ? "bg-meadow-400/15 text-meadow-600" : "bg-ink text-white",
                            )}
                          >
                            {escalated ? <Check className="h-4 w-4" strokeWidth={3} /> : <UserRound className="h-4 w-4" strokeWidth={2.6} />}
                            {escalated ? "HR will reply within 1 working day" : "Talk to a person in HR"}
                          </button>
                        )}
                        {isLastAi && !thinking && (
                          <SuggestionChips
                            items={hasAsked ? (m.followUps ?? []) : getHrSuggestedQuestions()}
                            onPick={(q) => void ask(q)}
                            disabled={thinking}
                          />
                        )}
                      </div>
                    </motion.li>
                  );
                })}

                {thinking && (
                  <li className="flex items-center gap-2" aria-label="Ask HR is typing">
                    <AiAvatar size="sm" />
                    <span className="flex gap-1 rounded-3xl rounded-bl-md bg-white px-4 py-3.5 shadow-sm ring-1 ring-ink/5">
                      {[0, 1, 2].map((i) => (
                        <motion.span
                          key={i}
                          className="h-2 w-2 rounded-full bg-muted-ink"
                          animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
                          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
                        />
                      ))}
                    </span>
                  </li>
                )}
              </ol>
            </div>

            {/* Composer */}
            <div className="border-t border-ink/5 bg-white px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3">
              <form onSubmit={submit} className="flex items-center gap-2">
                <label htmlFor="ask-hr-input" className="sr-only">
                  Ask HR a question
                </label>
                <input
                  id="ask-hr-input"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Ask about pay, benefits, policies…"
                  autoComplete="off"
                  className="min-w-0 flex-1 rounded-full bg-[#f0f4fc] px-4 py-3 text-sm font-semibold text-ink outline-none placeholder:text-muted-ink focus-visible:ring-4 focus-visible:ring-primary/25"
                />
                <motion.button
                  type="submit"
                  whileTap={{ scale: 0.9 }}
                  disabled={!draft.trim() || thinking}
                  aria-label="Send question"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-white outline-none transition-opacity disabled:opacity-40 focus-visible:ring-4 focus-visible:ring-primary/35"
                >
                  <SendHorizontal className="h-5 w-5" strokeWidth={2.6} />
                </motion.button>
              </form>
              <p className="mt-2 text-center text-[10px] font-semibold text-muted-ink">
                AI answers can be wrong. For anything personal, check Workday or talk to HR.
              </p>
            </div>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
