"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, X } from "lucide-react";
import { PERSONA_ROLES, getDefaultPersonaForRole, getRoleDefinition } from "@/data/mock";
import { useUserRole } from "@/context/user-role";
import type { PersonaRole } from "@/types";
import { cn } from "@/lib/utils";

/** Visual tone per role. Presentation only; role content lives in data/mock. */
const ROLE_TONE: Record<PersonaRole, { avatar: string; ring: string }> = {
  "new-starter": { avatar: "from-[#6f66ff] to-[#2420e6]", ring: "border-primary" },
  "line-manager": { avatar: "from-[#3a4a6b] to-[#17203a]", ring: "border-ink" },
  "team-buddy": { avatar: "from-[#7fe0a6] to-[#2f9e6a]", ring: "border-meadow-600" },
  "job-family-buddy": { avatar: "from-[#ffb3a8] to-[#ff6f61]", ring: "border-coral" },
};

export function Avatar({ initials, role, size = "md" }: { initials: string; role: PersonaRole; size?: "sm" | "md" | "lg" }) {
  const dims = size === "lg" ? "h-14 w-14 text-lg" : size === "md" ? "h-10 w-10 text-sm" : "h-8 w-8 text-xs";
  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-gradient-to-b font-black tracking-tight text-white shadow-inner",
        ROLE_TONE[role].avatar,
        dims,
      )}
    >
      {initials}
    </span>
  );
}

/**
 * Role switcher for demos. Shows the current role prominently and opens a sheet
 * to switch persona instantly. Keys 1-4 switch roles while the page has focus.
 */
export function RoleSwitcher() {
  const { role, persona, setRole, hydrated } = useUserRole();
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const firstOptionRef = useRef<HTMLButtonElement>(null);

  // Demo shortcut: 1-4 switch role. Ignored with modifiers or while the sheet is open.
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey || open) return;
      const index = Number(event.key) - 1;
      if (Number.isInteger(index) && index >= 0 && index < PERSONA_ROLES.length) {
        setRole(PERSONA_ROLES[index]);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setRole]);

  // Escape closes the sheet; focus moves in on open and returns on close.
  useEffect(() => {
    if (!open) return;
    firstOptionRef.current?.focus();
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      triggerRef.current?.focus();
    };
  }, [open]);

  const roleDefinition = getRoleDefinition(role);

  function choose(next: PersonaRole) {
    setRole(next);
    setOpen(false);
  }

  return (
    <>
      <motion.button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={`Viewing as ${roleDefinition.label}, ${persona.fullName}. Switch role`}
        initial={{ y: -12, opacity: 0 }}
        animate={{ y: 0, opacity: hydrated ? 1 : 0 }}
        transition={{ duration: 0.4 }}
        whileTap={{ scale: 0.97 }}
        className="flex w-full items-center gap-3 rounded-full bg-white/85 py-1.5 pl-1.5 pr-3 text-left shadow-[0_14px_30px_-16px_rgba(23,32,58,0.5)] ring-1 ring-white/70 backdrop-blur-xl outline-none focus-visible:ring-4 focus-visible:ring-primary/35"
      >
        <Avatar initials={persona.initials} role={role} size="sm" />
        <span className="min-w-0 flex-1">
          <span className="block text-[10px] font-extrabold uppercase tracking-[0.16em] text-muted-ink">Viewing as</span>
          <span className="flex items-baseline gap-1.5 truncate">
            <span className="text-sm font-black text-ink">{roleDefinition.label}</span>
            <span className="truncate text-xs font-semibold text-muted-ink">· {persona.fullName}</span>
          </span>
        </span>
        <span className="flex h-7 items-center gap-1 rounded-full bg-ink/5 px-2.5 text-[11px] font-extrabold text-ink">
          Switch
          <ChevronDown className="h-3.5 w-3.5" strokeWidth={3} />
        </span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div className="fixed inset-0 z-50 flex flex-col items-center justify-end" role="presentation">
            <motion.button
              type="button"
              aria-label="Close role switcher"
              tabIndex={-1}
              onClick={() => setOpen(false)}
              className="absolute inset-0 bg-[#0b1630]/45 backdrop-blur-[2px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />

            <motion.section
              role="dialog"
              aria-modal="true"
              aria-labelledby="role-switcher-title"
              className="relative w-full max-w-[440px] rounded-t-[2.25rem] bg-[#f7fbff] px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-30px_60px_-20px_rgba(11,22,48,0.5)]"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 36 }}
            >
              <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-ink/15" />
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-muted-ink">Demo mode</p>
                  <h2 id="role-switcher-title" className="text-2xl font-black tracking-tight text-ink">
                    Switch role
                  </h2>
                  <p className="mt-1 text-xs font-semibold text-muted-ink">Press 1 to 4 on a keyboard to jump between roles.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink/5 text-ink"
                >
                  <X className="h-5 w-5" strokeWidth={2.6} />
                </button>
              </div>

              <ul role="list" className="mt-5 flex flex-col gap-2.5">
                {PERSONA_ROLES.map((r, index) => {
                  const definition = getRoleDefinition(r);
                  const person = getDefaultPersonaForRole(r);
                  const selected = r === role;
                  return (
                    <li key={r}>
                      <button
                        ref={index === 0 ? firstOptionRef : undefined}
                        type="button"
                        onClick={() => choose(r)}
                        aria-pressed={selected}
                        className={cn(
                          "flex w-full items-center gap-3.5 rounded-2xl border-2 bg-white p-3.5 text-left transition-colors outline-none focus-visible:ring-4 focus-visible:ring-primary/30",
                          selected ? ROLE_TONE[r].ring : "border-transparent hover:bg-[#f2f7ff]",
                        )}
                      >
                        <Avatar initials={person.initials} role={r} />
                        <span className="min-w-0 flex-1">
                          <span className="flex items-center gap-2">
                            <span className="text-[15px] font-black text-ink">{definition.label}</span>
                            <kbd className="rounded-md bg-ink/5 px-1.5 text-[10px] font-extrabold text-muted-ink">{index + 1}</kbd>
                          </span>
                          <span className="block truncate text-xs font-semibold text-muted-ink">
                            {person.fullName} · {person.jobTitle}
                          </span>
                        </span>
                        {selected && (
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                            <Check className="h-4 w-4" strokeWidth={3.5} />
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
